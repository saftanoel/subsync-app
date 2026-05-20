from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from uuid import uuid4
import asyncio

from models import Subscription, SubscriptionCreate, SubscriptionUpdate, Payment
from database import SessionLocal
from models_db import SubscriptionDB, UserDB
from services import manager, generate_fake_data
import services
from strawberry.fastapi import GraphQLRouter
from schema import schema

app = FastAPI(
    title="SubSync API",
    description="Backend refactorizat pentru Gold Challenge",
    version="3.0.0"
)

# Middleware pentru CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
async def start_generator():
    if services.is_generating:
        return {"message": "Generator is already running"}
    services.is_generating = True
    asyncio.create_task(generate_fake_data())
    return "Generator started successfully"

@app.post("/stop-generator")
async def stop_generator():
    if not services.is_generating:
        return {"message": "Generator is not running"}
    services.is_generating = False
    return  "Generator stopped successfully"

# ── Auth endpoints ──────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(payload: LoginRequest):
    """Plain-text login for Silver Challenge (no tokens yet).
    Returns user id, username, and role name on success.
    """
    with SessionLocal() as db:
        user = db.query(UserDB).filter(UserDB.username == payload.username).first()
        if not user or user.password != payload.password:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        return {
            "id":       user.id,
            "username": user.username,
            "role":     user.role.name if user.role else None,
        }

# rest api endpoints (păstrate pentru compatibilitatea cu testele unitare)
@app.get("/subscriptions", response_model=List[Subscription])
def get_all_subscriptions(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100)):
    with SessionLocal() as db:
        subs = db.query(SubscriptionDB).offset(skip).limit(limit).all()
        return [
            Subscription(
                id=sub.id,
                serviceName=sub.serviceName,
                category=sub.category,
                monthlyCost=sub.monthlyCost,
                billingCycle=sub.billingCycle,
                nextPayment=sub.nextPayment,
                valueRating=sub.valueRating,
                payments=[Payment(id=p.id, amount=p.amount, date=p.date, subscription_id=p.subscription_id) for p in sub.payments]
            ) for sub in subs
        ]

@app.get("/subscriptions/{sub_id}", response_model=Subscription)
def get_subscription(sub_id: str):
    with SessionLocal() as db:
        sub = db.query(SubscriptionDB).filter(SubscriptionDB.id == sub_id).first()
        if not sub:
            raise HTTPException(status_code=404, detail="Subscription not found")
        return Subscription(
            id=sub.id,
            serviceName=sub.serviceName,
            category=sub.category,
            monthlyCost=sub.monthlyCost,
            billingCycle=sub.billingCycle,
            nextPayment=sub.nextPayment,
            valueRating=sub.valueRating,
            payments=[Payment(id=p.id, amount=p.amount, date=p.date, subscription_id=p.subscription_id) for p in sub.payments]
        )

@app.post("/subscriptions", response_model=Subscription, status_code=201)
def create_subscription(sub_in: SubscriptionCreate):
    with SessionLocal() as db:
        new_sub = SubscriptionDB(id=str(uuid4()), **sub_in.model_dump())
        db.add(new_sub)
        db.commit()
        db.refresh(new_sub)
        return Subscription(
            id=new_sub.id,
            serviceName=new_sub.serviceName,
            category=new_sub.category,
            monthlyCost=new_sub.monthlyCost,
            billingCycle=new_sub.billingCycle,
            nextPayment=new_sub.nextPayment,
            valueRating=new_sub.valueRating,
            payments=[]
        )

@app.put("/subscriptions/{sub_id}", response_model=Subscription)
def update_subscription(sub_id: str, sub_in: SubscriptionUpdate):
    with SessionLocal() as db:
        sub = db.query(SubscriptionDB).filter(SubscriptionDB.id == sub_id).first()
        if not sub:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        update_data = sub_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(sub, key, value)
            
        db.commit()
        db.refresh(sub)
        return Subscription(
            id=sub.id,
            serviceName=sub.serviceName,
            category=sub.category,
            monthlyCost=sub.monthlyCost,
            billingCycle=sub.billingCycle,
            nextPayment=sub.nextPayment,
            valueRating=sub.valueRating,
            payments=[Payment(id=p.id, amount=p.amount, date=p.date, subscription_id=p.subscription_id) for p in sub.payments]
        )

@app.delete("/subscriptions/{sub_id}", status_code=204)
def delete_subscription(sub_id: str):
    with SessionLocal() as db:
        sub = db.query(SubscriptionDB).filter(SubscriptionDB.id == sub_id).first()
        if not sub:
            raise HTTPException(status_code=404, detail="Subscription not found")
        db.delete(sub)
        db.commit()

# graphql endpoint
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")