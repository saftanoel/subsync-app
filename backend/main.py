from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import uuid4

# app initialization
app = FastAPI(
    title="SubSync API",
    description="Backend pentru SubSync - assignmentul MPP (Bronze Challenge)",
    version="1.0.0"
)

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
    id=str(uuid4()), serviceName="Netflix", category="Entertainment", 
    monthlyCost=15.99, billingCycle="Monthly", nextPayment="2024-05-15", valueRating=5
))
db_subscriptions.append(Subscription(
    id=str(uuid4()), serviceName="Spotify", category="Entertainment", 
    monthlyCost=9.99, billingCycle="Monthly", nextPayment="2024-05-10", valueRating=4
))

# ==========================================
# 4. Endpoints CRUD cu Paginare
# ==========================================

@app.get("/subscriptions", response_model=List[Subscription])
def get_all_subscriptions(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100)):
    """Returnează toate subscripțiile (cu paginare server-side)."""
    return db_subscriptions[skip : skip + limit]

@app.get("/subscriptions/{sub_id}", response_model=Subscription)
def get_subscription(sub_id: str):
    """Returnează o subscripție după ID."""
    for sub in db_subscriptions:
        if sub.id == sub_id:
            return sub
    raise HTTPException(status_code=404, detail="Subscription not found")

@app.post("/subscriptions", response_model=Subscription, status_code=201)
def create_subscription(sub_in: SubscriptionCreate):
    """Crează o subscripție nouă."""
    new_sub = Subscription(id=str(uuid4()), **sub_in.dict())
    db_subscriptions.append(new_sub)
    return new_sub

@app.put("/subscriptions/{sub_id}", response_model=Subscription)
def update_subscription(sub_id: str, sub_in: SubscriptionUpdate):
    """Actualizează o subscripție existentă."""
    for i, sub in enumerate(db_subscriptions):
        if sub.id == sub_id:
            updated_data = sub.dict()
            update_data = sub_in.dict(exclude_unset=True)
            updated_data.update(update_data)
            
            db_subscriptions[i] = Subscription(**updated_data)
            return db_subscriptions[i]
            
    raise HTTPException(status_code=404, detail="Subscription not found")

@app.delete("/subscriptions/{sub_id}", status_code=204)
def delete_subscription(sub_id: str):
    """Șterge o subscripție."""
    for i, sub in enumerate(db_subscriptions):
        if sub.id == sub_id:
            db_subscriptions.pop(i)
            return
    raise HTTPException(status_code=404, detail="Subscription not found")