import asyncio
from faker import Faker
from uuid import uuid4
from typing import List
from fastapi import WebSocket
from models import Subscription, Payment

from database import SessionLocal
from models_db import SubscriptionDB, PaymentDB

fake = Faker()
is_generating = False

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections.copy():
            try:
                await connection.send_text(message)
            except Exception:
                self.active_connections.remove(connection)

manager = ConnectionManager()

async def generate_fake_data():
    global is_generating
    while is_generating:
        await asyncio.sleep(3) # Generează la fiecare 3 secunde
        
        sub_id = str(uuid4())
        
        with SessionLocal() as db:
            new_sub_db = SubscriptionDB(
                id=sub_id,
                serviceName=fake.company(),
                category=fake.random_element(elements=("Entertainment", "Software", "Music", "Productivity", "Cloud Storage", "Fitness", "News", "Gaming")),
                monthlyCost=round(fake.random.uniform(5.0, 50.0), 2),
                billingCycle=fake.random_element(elements=("Monthly", "Annual")),
                nextPayment=fake.date_this_year().isoformat(),
                valueRating=fake.random_int(min=1, max=5)
            )
            db.add(new_sub_db)
            
            num_payments = fake.random_int(min=1, max=3)
            payments_pydantic = []
            
            for _ in range(num_payments):
                payment_id = str(uuid4())
                amount = new_sub_db.monthlyCost
                date = fake.date_between(start_date='-1y', end_date='today').isoformat()
                
                new_payment_db = PaymentDB(
                    id=payment_id,
                    amount=amount,
                    date=date,
                    subscription_id=sub_id
                )
                db.add(new_payment_db)
                
                payments_pydantic.append(Payment(
                    id=payment_id, amount=amount, date=date, subscription_id=sub_id
                ))

            db.commit()

            new_sub_pydantic = Subscription(
                id=new_sub_db.id,
                serviceName=new_sub_db.serviceName,
                category=new_sub_db.category,
                monthlyCost=new_sub_db.monthlyCost,
                billingCycle=new_sub_db.billingCycle,
                nextPayment=new_sub_db.nextPayment,
                valueRating=new_sub_db.valueRating,
                payments=payments_pydantic
            )
            
            await manager.broadcast(new_sub_pydantic.model_dump_json())