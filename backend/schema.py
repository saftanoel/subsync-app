import strawberry
from typing import List, Optional
from database import db_subscriptions

# Definim cum arată datele pentru graphql
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

# Definim interogările (ce putem cere de la server)
@strawberry.type
class Query:
    # GOLD CHALLENGE: skip si limit pentru paginare si infinite scroll
    @strawberry.field
    def all_subscriptions(self, skip: int = 0, limit: int = 10) -> List[SubscriptionNode]:
        result = []
        # pagination
        paginated_subs = db_subscriptions[skip : skip + limit]
        
        for sub in paginated_subs:
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
        for sub in db_subscriptions:
            if sub.id == sub_id:
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
        return None


schema = strawberry.Schema(query=Query)