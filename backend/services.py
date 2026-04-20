import asyncio
from faker import Faker
from uuid import uuid4
from typing import List
from fastapi import WebSocket
from models import Subscription, Payment
from database import db_subscriptions, db_payments

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
        
        # 1. Creăm abonamentul principal
        sub_id = str(uuid4())
        new_sub = Subscription(
            id=sub_id,
            serviceName=fake.company(),
            category=fake.random_element(elements=("Entertainment", "Software", "Music", "Productivity", "Cloud Storage", "Fitness", "News", "Gaming")),
            monthlyCost=round(fake.random.uniform(5.0, 50.0), 2),
            billingCycle=fake.random_element(elements=("Monthly", "Annual")),
            nextPayment=fake.date_this_year().isoformat(),
            valueRating=fake.random_int(min=1, max=5),
            payments=[] # Lista de plăți începe goală
        )
        
        # 2. GOLD CHALLENGE: Relația 1 to many (Generăm 1-3 plăți istorice pentru acest abonament)
        num_payments = fake.random_int(min=1, max=3)
        for _ in range(num_payments):
            new_payment = Payment(
                id=str(uuid4()),
                amount=new_sub.monthlyCost,
                date=fake.date_between(start_date='-1y', end_date='today').isoformat(),
                subscription_id=sub_id
            )
            new_sub.payments.append(new_payment) # Legăm plata de abonament
            db_payments.append(new_payment)      # O salvăm și în DB-ul general de plăți

        # 3. Salvăm și dăm broadcast
        db_subscriptions.append(new_sub)
        await manager.broadcast(new_sub.model_dump_json())