import asyncio
from faker import Faker
from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from uuid import uuid4

# app initialization
app = FastAPI(
    title="SubSync API",
    description="Backend pentru SubSync - assignmentul MPP (Bronze + Silver Challenge)",
    version="2.0.0"
)

# allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   


fake = Faker() # gsenerator de date false

# pydantic models for validation 
class SubscriptionBase(BaseModel):
    serviceName: str = Field(..., min_length=1, description="Numele serviciului nu poate fi gol")
    category: str = Field(..., min_length=1)
    monthlyCost: float = Field(..., ge=0, description="Costul nu poate fi negativ")
    billingCycle: str = Field(..., pattern="^(Monthly|Annual)$")
    nextPayment: str
    valueRating: int = Field(..., ge=1, le=5, description="Rating între 1 și 5")

class SubscriptionCreate(SubscriptionBase):
    pass

class Subscription(SubscriptionBase):
    id: str

class SubscriptionUpdate(BaseModel):
    serviceName: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1)
    monthlyCost: Optional[float] = Field(None, ge=0)
    billingCycle: Optional[str] = Field(None, pattern="^(Monthly|Annual)$")
    nextPayment: Optional[str] = None
    valueRating: Optional[int] = Field(None, ge=1, le=5)

# in memory database
db_subscriptions: List[Subscription] = []

db_subscriptions.append(Subscription(
    id="netflix-id-1", serviceName="Netflix", category="Entertainment", 
    monthlyCost=15.99, billingCycle="Monthly", nextPayment="2024-05-15", valueRating=5
))
db_subscriptions.append(Subscription(
    id="spotify-id-1"
    , serviceName="Spotify", category="Entertainment", 
    monthlyCost=9.99, billingCycle="Monthly", nextPayment="2024-05-10", valueRating=4
))

# websocket manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        # Folosim .copy() ca să nu se strice lista dacă se deconectează cineva
        for connection in self.active_connections.copy():
            try:
                await connection.send_text(message)
            except Exception:
                #inchidem conexiunea dacă nu mai răspunde
                self.active_connections.remove(connection)

manager = ConnectionManager()

# fake data generator (background task)
is_generating = False

async def generate_fake_data():
    global is_generating
    while is_generating:
        await asyncio.sleep(3) # genereaza un element la fiecare 3 secunde
        
        new_sub = Subscription(
            id=str(uuid4()),
            serviceName=fake.company(),
            category=fake.random_element(elements=("Entertainment", "Software", "Music", "Productivity", "Cloud Storage", "Fitness", "News", "Gaming")),
            monthlyCost=round(fake.random.uniform(5.0, 50.0), 2),
            billingCycle=fake.random_element(elements=("Monthly", "Annual")),
            nextPayment=fake.date_this_year().isoformat(),
            valueRating=fake.random_int(min=1, max=5)
        )
        
        db_subscriptions.append(new_sub)
        # anunta frontend-ul ca s-a adaugat un element nou
        await manager.broadcast(new_sub.model_dump_json())

# websocket & generator endpoints
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
    global is_generating
    if is_generating:
        return {"message": "Generator is already running"}
    is_generating = True
    asyncio.create_task(generate_fake_data())
    return {"message": "Generator started successfully"}

@app.post("/stop-generator")
async def stop_generator():
    global is_generating
    if not is_generating:
        return {"message": "Generator is not running"}
    is_generating = False
    return {"message": "Generator stopped successfully"}

# crud endpoints (paginated)
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
    new_sub = Subscription(id=str(uuid4()), **sub_in.model_dump())
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