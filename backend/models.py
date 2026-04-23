from pydantic import BaseModel, Field
from typing import List, Optional

class Payment(BaseModel):
    id: str
    amount: float
    date: str
    subscription_id: str  # Legătura către abonament

class SubscriptionBase(BaseModel):
    serviceName: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    monthlyCost: float = Field(..., ge=0)
    billingCycle: str = Field(..., pattern="^(Monthly|Annual)$")
    nextPayment: str
    valueRating: int = Field(..., ge=1, le=5)

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    serviceName: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1)
    monthlyCost: Optional[float] = Field(None, ge=0)
    billingCycle: Optional[str] = Field(None, pattern="^(Monthly|Annual)$")
    nextPayment: Optional[str] = None
    valueRating: Optional[int] = Field(None, ge=1, le=5)

class Subscription(SubscriptionBase):
    id: str
    # Gold: Relația 1-to-many (Un abonament are o listă de plăți)
    payments: List[Payment] = []