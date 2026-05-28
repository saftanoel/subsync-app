from database import SessionLocal
from models_db import UserDB, RoleDB

db = SessionLocal()
users = db.query(UserDB).all()
for u in users:
    role_name = u.role.name if u.role else "None"
    print(f"User: {u.username}, Email: {u.email}, Role: {role_name}")
db.close()
