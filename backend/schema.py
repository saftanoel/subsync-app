import strawberry
from typing import List, Optional
import uuid
from database import db_subscriptions

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
        result = []
        # pagination
        paginated_subs = db_subscriptions[skip : skip + limit]
        
        for sub in paginated_subs:
            # Folosim getattr ca plasă de siguranță dacă sub.payments e None sau nu există
            payments_list = getattr(sub, 'payments', []) or []
            
            payment_nodes = [
                PaymentNode(id=str(p.id), amount=p.amount, date=p.date, subscription_id=p.subscription_id)
                for p in payments_list
            ]
            
            sub_node = SubscriptionNode(
                id=str(sub.id),
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
        for sub in db_subscriptions:
            if str(sub.id) == sub_id:
                payments_list = getattr(sub, 'payments', []) or []
                
                payment_nodes = [
                    PaymentNode(id=str(p.id), amount=p.amount, date=p.date, subscription_id=p.subscription_id)
                    for p in payments_list
                ]
                return SubscriptionNode(
                    id=str(sub.id),
                    serviceName=sub.serviceName,
                    category=sub.category,
                    monthlyCost=sub.monthlyCost,
                    billingCycle=sub.billingCycle,
                    nextPayment=sub.nextPayment,
                    valueRating=sub.valueRating,
                    payments=payment_nodes
                )
        return None


# mutations pt payments

@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_payment(self, subscription_id: str, amount: float, date: str) -> PaymentNode:
        from models import Payment 
        
        for sub in db_subscriptions:
            if str(sub.id) == subscription_id:
                new_id = str(uuid.uuid4())
                
                # Creăm plata fix cu modelul Pydantic (cel corect)
                new_payment = Payment(
                    id=new_id,
                    amount=amount,
                    date=date,
                    subscription_id=subscription_id

                )
                
                if getattr(sub, "payments", None) is None:
                    sub.payments = []
                    
                sub.payments.insert(0, new_payment)
                
                return PaymentNode(id=new_id, amount=amount, date=date, subscription_id=subscription_id)
                
        raise Exception("Abonamentul nu a fost găsit în baza de date!")

    @strawberry.mutation
    def delete_payment(self, subscription_id: str, payment_id: str) -> bool:
        for sub in db_subscriptions:
            if str(sub.id) == subscription_id:
                if getattr(sub, "payments", None) is not None:
                    original_len = len(sub.payments)
                    sub.payments = [p for p in sub.payments if str(p.id) != payment_id]
                    return len(sub.payments) < original_len
        return False


# dam export la ambele query si mutation intr-un singur schema
schema = strawberry.Schema(query=Query, mutation=Mutation)