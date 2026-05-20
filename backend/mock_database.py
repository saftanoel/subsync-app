from typing import List
from models import Subscription, Payment

db_subscriptions: List[Subscription] = [
    Subscription(
        id="netflix-id-1", 
        serviceName="Netflix", 
        category="Entertainment", 
        monthlyCost=15.99, 
        billingCycle="Monthly", 
        nextPayment="2024-05-15", 
        valueRating=5, 
        payments=[]
    ),
    Subscription(
        id="spotify-id-2", 
        serviceName="Spotify", 
        category="Entertainment", 
        monthlyCost=9.99, 
        billingCycle="Monthly", 
        nextPayment="2024-05-10", 
        valueRating=4, 
        payments=[]
    )
]

db_payments: List[Payment] = []