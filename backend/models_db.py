from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class SubscriptionDB(Base):
    __tablename__ = "subscriptions"
    
    id = Column(String, primary_key=True, index=True)
    serviceName = Column(String, nullable=False)
    category = Column(String, nullable=False)
    monthlyCost = Column(Float, nullable=False)
    billingCycle = Column(String, nullable=False)
    nextPayment = Column(String, nullable=False)
    valueRating = Column(Integer, nullable=False)
    
    payments = relationship("PaymentDB", back_populates="subscription", cascade="all, delete-orphan")

class PaymentDB(Base):
    __tablename__ = "payments"
    
    id = Column(String, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    date = Column(String, nullable=False)
    subscription_id = Column(String, ForeignKey("subscriptions.id"), nullable=False)
    
    subscription = relationship("SubscriptionDB", back_populates="payments")
