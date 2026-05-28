from database import SessionLocal
from models_db import UserDB, RoleDB
from auth import pwd_context
import uuid

db = SessionLocal()

# Check if ADMIN role exists, if not create it
admin_role = db.query(RoleDB).filter(RoleDB.name == "ADMIN").first()
if not admin_role:
    admin_role = RoleDB(id=str(uuid.uuid4()), name="ADMIN")
    db.add(admin_role)
    db.commit()
    db.refresh(admin_role)

# Create admin user
admin_user = db.query(UserDB).filter(UserDB.username == "admin").first()
if not admin_user:
    hashed_pw = pwd_context.hash("admin")
    admin_user = UserDB(
        id=str(uuid.uuid4()),
        username="admin",
        email="admin@subsync.com",
        hashed_password=hashed_pw,
        role_id=admin_role.id
    )
    db.add(admin_user)
    db.commit()
    print("Admin user created successfully!")
else:
    print("Admin user already exists!")

db.close()
