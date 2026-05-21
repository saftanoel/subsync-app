"""
seed.py — Standalone data seeder for the Silver Challenge RBAC system.

Run with:
    python seed.py

Populates the database with:
  - Roles:        'admin', 'user'
  - Permissions:  'read', 'write', 'delete'
  - Users:        admin_user / admin123, normal_user / user123
"""

from uuid import uuid4
from database import SessionLocal
from models_db import RoleDB, PermissionDB, UserDB


def seed():
    with SessionLocal() as db:
        # ── 1. Permissions ──────────────────────────────────────────────────────
        all_permissions = ["read", "write", "delete"]
        perm_objects: dict[str, PermissionDB] = {}

        for pname in all_permissions:
            existing = db.query(PermissionDB).filter(PermissionDB.name == pname).first()
            if not existing:
                p = PermissionDB(id=str(uuid4()), name=pname)
                db.add(p)
                db.flush()  # get the id without a full commit
                perm_objects[pname] = p
                print(f"  [+] Permission '{pname}' created.")
            else:
                perm_objects[pname] = existing
                print(f"  [=] Permission '{pname}' already exists, skipping.")

        # ── 2. Roles ────────────────────────────────────────────────────────────
        # admin role — all permissions (read, write, delete)
        admin_role = db.query(RoleDB).filter(RoleDB.name == "admin").first()
        if not admin_role:
            admin_role = RoleDB(
                id=str(uuid4()),
                name="admin",
                permissions=[
                    perm_objects["read"],
                    perm_objects["write"],
                    perm_objects["delete"],
                ],
            )
            db.add(admin_role)
            db.flush()
            print("  [+] Role 'admin' created (permissions: read, write, delete).")
        else:
            print("  [=] Role 'admin' already exists, skipping.")

        # user role — read-only
        user_role = db.query(RoleDB).filter(RoleDB.name == "user").first()
        if not user_role:
            user_role = RoleDB(
                id=str(uuid4()),
                name="user",
                permissions=[perm_objects["read"]],
            )
            db.add(user_role)
            db.flush()
            print("  [+] Role 'user' created (permissions: read).")
        else:
            print("  [=] Role 'user' already exists, skipping.")

        # ── 3. Users ────────────────────────────────────────────────────────────
        admin_user = db.query(UserDB).filter(UserDB.username == "admin_user").first()
        if not admin_user:
            db.add(
                UserDB(
                    id=str(uuid4()),
                    username="admin_user",
                    password="admin123",  # plain-text per assignment spec
                    role_id=admin_role.id,
                )
            )
            print("  [+] User 'admin_user' created (role: admin, password: admin123).")
        else:
            print("  [=] User 'admin_user' already exists, skipping.")

        normal_user = db.query(UserDB).filter(UserDB.username == "normal_user").first()
        if not normal_user:
            db.add(
                UserDB(
                    id=str(uuid4()),
                    username="normal_user",
                    password="user123",  # plain-text per assignment spec
                    role_id=user_role.id,
                )
            )
            print("  [+] User 'normal_user' created (role: user, password: user123).")
        else:
            print("  [=] User 'normal_user' already exists, skipping.")

        db.commit()
        print("\n Seeding complete!")


if __name__ == "__main__":
    print(" Starting database seed...\n")
    seed()
