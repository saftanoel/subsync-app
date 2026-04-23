from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from uuid import uuid4
import asyncio

from models import Subscription, SubscriptionCreate, SubscriptionUpdate
from database import db_subscriptions
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

# rest api endpoints (păstrate pentru compatibilitatea cu testele unitare)
@app.get("/subscriptions", response_model=List[Subscription])
def get_all_subscriptions(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100)):
    return db_subscriptions[skip : skip + limit]

@app.get("/subscriptions/{sub_id}", response_model=Subscription)
def get_subscription(sub_id: str):
    for sub in db_subscriptions:
        if sub.id == sub_id:
            return sub
    raise HTTPException(status_code=404, detail="Subscription not found")

@app.post("/subscriptions", response_model=Subscription, status_code=201)
def create_subscription(sub_in: SubscriptionCreate):
    new_sub = Subscription(id=str(uuid4()), **sub_in.model_dump(), payments=[])
    db_subscriptions.append(new_sub)
    return new_sub

@app.put("/subscriptions/{sub_id}", response_model=Subscription)
def update_subscription(sub_id: str, sub_in: SubscriptionUpdate):
    for i, sub in enumerate(db_subscriptions):
        if sub.id == sub_id:
            updated_data = sub.model_dump()
            update_data = sub_in.model_dump(exclude_unset=True)
            updated_data.update(update_data)
            db_subscriptions[i] = Subscription(**updated_data)
            return db_subscriptions[i]
    raise HTTPException(status_code=404, detail="Subscription not found")

@app.delete("/subscriptions/{sub_id}", status_code=204)
def delete_subscription(sub_id: str):
    for i, sub in enumerate(db_subscriptions):
        if sub.id == sub_id:
            db_subscriptions.pop(i)
            return
    raise HTTPException(status_code=404, detail="Subscription not found")

# graphql endpoint
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")