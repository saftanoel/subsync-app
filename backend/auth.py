from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jwt.exceptions import InvalidTokenError
import jwt
import uuid
import random
import os
import requests
import typing

from database import SessionLocal
from models_db import UserDB, RoleDB
from schemas import UserCreate, UserResponse, Token, ForgotPasswordRequest, ResetPasswordRequest, VerifyOTPRequest, VerifySecurityRequest

SECRET_KEY = "your-secret-key-for-jwt-replace-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def send_otp_email(to_email: str, otp_code: str):
    resend_api_key = os.environ.get("RESEND_API_KEY")
    
    if not resend_api_key:
        print("Warning: RESEND_API_KEY not set. Skipping real email send.")
        return

    payload = {
        "from": "onboarding@resend.dev",
        "to": to_email,
        "subject": "SubSync 3FA - Your Login Code",
        "html": f"<p>Your security code is: <strong>{otp_code}</strong>. Please enter this in the application.</p>"
    }
    headers = {
        "Authorization": f"Bearer {resend_api_key}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(
            "https://api.resend.com/emails",
            json=payload,
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
    except Exception as e:
        print(f"Resend API failed: {e}")
        # The parent try-except block in /login will catch this if we re-raise it,
        # but to match the previous graceful degradation, we can just print and pass
        # so the mock email is used. Wait, the user asked to fallback to printing.
        # It's already printed before calling this function in auth.py!
        pass

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter(tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: typing.Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username or not isinstance(username, str):
            raise credentials_exception
    except jwt.InvalidTokenError:
        raise credentials_exception
    user = db.query(UserDB).filter(UserDB.username == username).first()
    if user is None:
        raise credentials_exception
    return user

def get_admin_user(current_user: UserDB = Depends(get_current_user)):
    if not current_user.role or current_user.role.name != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have enough permissions to access this resource"
        )
    return current_user

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists by username or email
    if db.query(UserDB).filter(UserDB.username == user_in.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    if db.query(UserDB).filter(UserDB.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Handle role - default to "USER"
    role = db.query(RoleDB).filter(RoleDB.name == "USER").first()
    if not role:
        # Create role if it doesn't exist
        role = RoleDB(id=str(uuid.uuid4()), name="USER")
        db.add(role)
        db.commit()
        db.refresh(role)

    hashed_password = get_password_hash(user_in.password)
    hashed_security_answer = get_password_hash(user_in.security_answer)
    
    new_user: UserDB = UserDB(
        id=str(uuid.uuid4()),
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_password,
        security_question=user_in.security_question,
        security_answer=hashed_security_answer,
        role_id=role.id
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return UserResponse(
        id=str(new_user.id),
        username=str(new_user.username),
        email=str(new_user.email),
        role=str(role.name)
    )

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3FA Step 1 completed. Generate OTP and save it
    otp = str(random.randint(100000, 999999))
    user.email_otp = otp
    db.commit()
    
    print(f"\n[MOCK EMAIL] OTP for {user.username} is: {otp}\n")
    
    try:
        send_otp_email(str(user.email), otp)
    except Exception as e:
        print(f"Failed to send OTP email (check firewall or credentials): {e}")
        # We don't raise a 500 error here. We want to allow the user to still test
        # the 3FA flow by reading the OTP from the console output above.
    
    temp_token = create_access_token(
        data={"sub": str(user.username), "step": 1}, expires_delta=timedelta(minutes=15)
    )
    
    return {
        "status": "needs_email_verification",
        "temp_token": temp_token
    }

@router.post("/verify-email")
def verify_email(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(req.temp_token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        step = payload.get("step")
        if not username or step != 1:
            raise HTTPException(status_code=400, detail="Invalid token step")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(UserDB).filter(UserDB.username == username).first()
    if not user or user.email_otp != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    user.email_otp = None
    user.is_email_verified = True
    db.commit()
    
    next_token = create_access_token(
        data={"sub": str(user.username), "step": 2}, expires_delta=timedelta(minutes=15)
    )
    
    return {
        "status": "needs_security_question",
        "question": user.security_question,
        "temp_token": next_token
    }

@router.post("/verify-security", response_model=Token)
def verify_security(req: VerifySecurityRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(req.temp_token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        step = payload.get("step")
        if not username or step != 2:
            raise HTTPException(status_code=400, detail="Invalid token step")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(UserDB).filter(UserDB.username == username).first()
    if not user or not verify_password(req.answer, user.security_answer):
        raise HTTPException(status_code=400, detail="Incorrect security answer")

    # 3FA Complete, return actual token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    role_name = str(user.role.name) if user.role else "USER"
    access_token = create_access_token(
        data={"sub": str(user.username), "role": role_name}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == req.email).first()
    if user:
        reset_token = create_access_token(
            data={"sub": str(user.username), "type": "password_reset"}, 
            expires_delta=timedelta(minutes=15)
        )
        print(f"MOCK EMAIL: To reset your password, use this token: {reset_token}")
        
    return {"message": "If an account with that email exists, a password reset link has been sent."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(req.token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        token_type = payload.get("type")
        if not username or not isinstance(username, str) or token_type != "password_reset":
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user = db.query(UserDB).filter(UserDB.username == username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user.hashed_password = get_password_hash(req.new_password)
    db.commit()
    
    return {"message": "Password has been successfully reset"}
