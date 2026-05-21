import strawberry
from typing import List, Optional
import uuid

from database import SessionLocal
from models_db import SubscriptionDB, PaymentDB

# definitii de tipuri noduri pt grapql

@strawberry.type
class PaymentNode:
    id: str
    amount: float
    date: str
    subscription_id: str

@strawberry.type
class SubscriptionNode:
    id: str
    serviceName: str
    category: str
    monthlyCost: float
    billingCycle: str
    nextPayment: str
    valueRating: int
    payments: List[PaymentNode]


# queries

@strawberry.type
class Query:
    # GOLD CHALLENGE: skip si limit pentru paginare si infinite scroll
    @strawberry.field
    def all_subscriptions(self, skip: int = 0, limit: int = 10) -> List[SubscriptionNode]:
        with SessionLocal() as db:
            subs = db.query(SubscriptionDB).offset(skip).limit(limit).all()
            result = []
            for sub in subs:
                payment_nodes = [
                    PaymentNode(id=p.id, amount=p.amount, date=p.date, subscription_id=p.subscription_id)
                    for p in sub.payments
                ]
                sub_node = SubscriptionNode(
                    id=sub.id,
                    serviceName=sub.serviceName,
                    category=sub.category,
                    monthlyCost=sub.monthlyCost,
                    billingCycle=sub.billingCycle,
                    nextPayment=sub.nextPayment,
                    valueRating=sub.valueRating,
                    payments=payment_nodes
                )
                result.append(sub_node)
            return result
        
    @strawberry.field
    def subscription_by_id(self, sub_id: str) -> Optional[SubscriptionNode]:
        with SessionLocal() as db:
            sub = db.query(SubscriptionDB).filter(SubscriptionDB.id == sub_id).first()
            if not sub:
                return None
            payment_nodes = [
                PaymentNode(id=p.id, amount=p.amount, date=p.date, subscription_id=p.subscription_id)
                for p in sub.payments
            ]
            return SubscriptionNode(
                id=sub.id,
                serviceName=sub.serviceName,
                category=sub.category,
                monthlyCost=sub.monthlyCost,
                billingCycle=sub.billingCycle,
                nextPayment=sub.nextPayment,
                valueRating=sub.valueRating,
                payments=payment_nodes
            )


# mutations pt payments and subscriptions

@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_subscription(
        self, serviceName: str, category: str, monthlyCost: float, billingCycle: str, nextPayment: str, valueRating: int
    ) -> SubscriptionNode:
        with SessionLocal() as db:
            new_id = str(uuid.uuid4())
            new_sub = SubscriptionDB(
                id=new_id,
                serviceName=serviceName,
                category=category,
                monthlyCost=monthlyCost,
                billingCycle=billingCycle,
                nextPayment=nextPayment,
                valueRating=valueRating
            )
            db.add(new_sub)
            db.commit()
            db.refresh(new_sub)
            
            return SubscriptionNode(
                id=new_sub.id,
                serviceName=new_sub.serviceName,
                category=new_sub.category,
                monthlyCost=new_sub.monthlyCost,
                billingCycle=new_sub.billingCycle,
                nextPayment=new_sub.nextPayment,
                valueRating=new_sub.valueRating,
                payments=[]
            )

    @strawberry.mutation
    def delete_subscription(self, sub_id: str) -> bool:
        with SessionLocal() as db:
            sub = db.query(SubscriptionDB).filter(SubscriptionDB.id == sub_id).first()
            if sub:
                db.delete(sub)
                db.commit()
                return True
            return False

    @strawberry.mutation
    def add_payment(self, subscription_id: str, amount: float, date: str) -> PaymentNode:
        with SessionLocal() as db:
            sub = db.query(SubscriptionDB).filter(SubscriptionDB.id == subscription_id).first()
            if not sub:
                raise Exception("Abonamentul nu a fost găsit în baza de date!")
            
            new_id = str(uuid.uuid4())
            new_payment = PaymentDB(
                id=new_id,
                amount=amount,
                date=date,
                subscription_id=subscription_id
            )
            db.add(new_payment)
            db.commit()
            db.refresh(new_payment)
            
            return PaymentNode(id=new_payment.id, amount=new_payment.amount, date=new_payment.date, subscription_id=new_payment.subscription_id)

    @strawberry.mutation
    def delete_payment(self, subscription_id: str, payment_id: str) -> bool:
        with SessionLocal() as db:
            payment = db.query(PaymentDB).filter(PaymentDB.id == payment_id, PaymentDB.subscription_id == subscription_id).first()
            if payment:
                db.delete(payment)
                db.commit()
                return True
            return False


# dam export la ambele query si mutation intr-un singur schema
schema = strawberry.Schema(query=Query, mutation=Mutation)