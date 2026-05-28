# server side data validation
from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect, Depends, WebSocketException, status
from fastapi.middleware.cors import CORSMiddleware
import jwt
from auth import SECRET_KEY, ALGORITHM
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
import asyncio
from datetime import datetime, timezone

from models import Subscription, SubscriptionCreate, SubscriptionUpdate, Payment
from database import SessionLocal
from models_db import SubscriptionDB, UserDB
from services import manager, generate_fake_data
import services
from strawberry.fastapi import GraphQLRouter
from schema import schema
from mongo_db import (
    insert_message,
    get_recent_messages,
    insert_audit_log,
    get_all_flagged_users,
)
from security_analysis import check_malicious_behavior
from auth import router as auth_router, get_current_user, get_admin_user

app = FastAPI(
    title="SubSync API",
    description="Backend refactorizat pentru Gold Challenge",
    version="3.0.0",
)

app.include_router(auth_router, prefix="/auth")

# Middleware pentru CORS
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# websockets and generator endpoints
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.post("/start-generator")
async def start_generator(current_user: UserDB = Depends(get_admin_user)):
    if services.is_generating:
        return {"message": "Generator is already running"}
    services.is_generating = True
    asyncio.create_task(generate_fake_data())
    return "Generator started successfully"


@app.post("/stop-generator")
async def stop_generator(current_user: UserDB = Depends(get_admin_user)):
    if not services.is_generating:
        return {"message": "Generator is not running"}
    services.is_generating = False
    return "Generator stopped successfully"





# --- CHAT WEBSOCKET MANAGER ---
class ChatConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)
        for dead in dead_connections:
            self.disconnect(dead)


chat_manager = ChatConnectionManager()


@app.websocket("/ws/chat")
async def chat_endpoint(websocket: WebSocket, token: str = Query(...)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
    except jwt.InvalidTokenError:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)

    await chat_manager.connect(websocket)
    try:
        # 1. Când se conectează un user, îi trimitem istoricul din MongoDB
        try:
            history = await get_recent_messages()
            for msg in history:
                await websocket.send_json(msg)
        except Exception as e:
            print(f"Failed to fetch history: {e}")

        # 2. Așteptăm mesaje noi de la acest user
        while True:
            try:
                # Primim textul de la client
                data = await websocket.receive_text()
                
                # Salvăm mesajul în MongoDB
                saved_msg = await insert_message(sender_username=username, text=data)

                # Trimitem mesajul salvat tuturor userilor conectați
                await chat_manager.broadcast(saved_msg)
            except WebSocketDisconnect:
                # Let the outer try-except handle the disconnection
                raise
            except Exception as e:
                print(f"WS Error: {e}")

    except WebSocketDisconnect:
        chat_manager.disconnect(websocket)


# rest api endpoints (păstrate pentru compatibilitatea cu testele unitare)
@app.get("/subscriptions", response_model=List[Subscription])
def get_all_subscriptions(
    skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100),
    current_user: UserDB = Depends(get_current_user)
):
    with SessionLocal() as db:
        if current_user.role and current_user.role.name == "ADMIN":
            subs: List[SubscriptionDB] = db.query(SubscriptionDB).offset(skip).limit(limit).all()
        else:
            subs: List[SubscriptionDB] = db.query(SubscriptionDB).filter(SubscriptionDB.user_id == current_user.id).offset(skip).limit(limit).all()
        return [Subscription.model_validate(sub) for sub in subs]


@app.get("/subscriptions/{sub_id}", response_model=Subscription)
def get_subscription(sub_id: str, current_user: UserDB = Depends(get_current_user)):
    with SessionLocal() as db:
        if current_user.role and current_user.role.name == "ADMIN":
            sub: Optional[SubscriptionDB] = db.query(SubscriptionDB).filter(SubscriptionDB.id == sub_id).first()
        else:
            sub: Optional[SubscriptionDB] = db.query(SubscriptionDB).filter(SubscriptionDB.id == sub_id, SubscriptionDB.user_id == current_user.id).first()
        if not sub:
            raise HTTPException(status_code=404, detail="Subscription not found")
        return Subscription.model_validate(sub)


@app.post("/subscriptions", response_model=Subscription, status_code=201)
def create_subscription(sub_in: SubscriptionCreate, current_user: UserDB = Depends(get_current_user)):
    with SessionLocal() as db:
        new_sub = SubscriptionDB(id=str(uuid4()), user_id=current_user.id, **sub_in.model_dump())
        db.add(new_sub)
        db.commit()
        db.refresh(new_sub)
        return Subscription.model_validate(new_sub)


@app.put("/subscriptions/{sub_id}", response_model=Subscription)
def update_subscription(sub_id: str, sub_in: SubscriptionUpdate, current_user: UserDB = Depends(get_current_user)):
    with SessionLocal() as db:
        if current_user.role and current_user.role.name == "ADMIN":
            sub: Optional[SubscriptionDB] = db.query(SubscriptionDB).filter(SubscriptionDB.id == sub_id).first()
        else:
            sub: Optional[SubscriptionDB] = db.query(SubscriptionDB).filter(SubscriptionDB.id == sub_id, SubscriptionDB.user_id == current_user.id).first()
        if not sub:
            raise HTTPException(status_code=404, detail="Subscription not found")

        update_data = sub_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(sub, key, value)

        db.commit()
        db.refresh(sub)
        return Subscription.model_validate(sub)


@app.delete("/subscriptions/{sub_id}", status_code=204)
async def delete_subscription(sub_id: str, current_user: UserDB = Depends(get_current_user)):
    # 1. Ștergem abonamentul din SQLite
    with SessionLocal() as db:
        if current_user.role and current_user.role.name == "ADMIN":
            sub = db.query(SubscriptionDB).filter(SubscriptionDB.id == sub_id).first()
        else:
            sub = db.query(SubscriptionDB).filter(SubscriptionDB.id == sub_id, SubscriptionDB.user_id == current_user.id).first()
        if not sub:
            raise HTTPException(status_code=404, detail="Subscription not found")

        db.delete(sub)
        db.commit()  # Asigurăm persistența ștergerii în baza de date

    #  Audit Logging and Anomaly Detection (Protejat)
    try:
        await insert_audit_log(
            str(current_user.username), "DELETE_SUBSCRIPTION", f"Deleted subscription {sub_id}"
        )
        await check_malicious_behavior(str(current_user.username))
    except Exception as e:
        # Dacă MongoDB pică, măcar ștergerea abonamentului s-a salvat!
        print(f"Error during MongoDB audit logging: {e}")


@app.get("/admin/flagged-users")
async def get_flagged_users(current_user: UserDB = Depends(get_admin_user)):
    """Retrieve all flagged users from MongoDB (Gold Challenge)."""
    return await get_all_flagged_users()


# graphql endpoint
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")
