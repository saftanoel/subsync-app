# data validation (database constraints)
from typing import List, Optional
from sqlalchemy import Column, String, Float, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship, Mapped, mapped_column
from database import Base

# ── Association Table (Many-to-Many: Role <-> Permission) ──────────────────────
# This is a pure join table with no extra columns, so we use SQLAlchemy's
# Table() helper instead of a full mapped class.
role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id",       String, ForeignKey("roles.id"),       primary_key=True),
    Column("permission_id", String, ForeignKey("permissions.id"), primary_key=True),
)


# ── RoleDB ─────────────────────────────────────────────────────────────────────
class RoleDB(Base):
    __tablename__ = "roles"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)   # e.g. 'admin', 'user'

    # Many-to-Many: Role has many Permissions (through role_permissions)
    permissions: Mapped[List["PermissionDB"]] = relationship(
        "PermissionDB",
        secondary=role_permissions,
        back_populates="roles"
    )

    # One-to-Many: Role has many Users
    users: Mapped[List["UserDB"]] = relationship("UserDB", back_populates="role")


# ── PermissionDB ───────────────────────────────────────────────────────────────
class PermissionDB(Base):
    __tablename__ = "permissions"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)   # e.g. 'read', 'write', 'delete'

    # Back-reference: Permission belongs to many Roles
    roles: Mapped[List["RoleDB"]] = relationship(
        "RoleDB",
        secondary=role_permissions,
        back_populates="permissions"
    )


# ── UserDB ─────────────────────────────────────────────────────────────────────
class UserDB(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    role_id: Mapped[Optional[str]] = mapped_column(String, ForeignKey("roles.id"), nullable=True)

    # Many-to-One: User belongs to one Role
    role: Mapped[Optional["RoleDB"]] = relationship("RoleDB", back_populates="users")

    # One-to-Many: User owns many Subscriptions
    subscriptions: Mapped[List["SubscriptionDB"]] = relationship(
        "SubscriptionDB",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# ── SubscriptionDB ─────────────────────────────────────────────────────────────
class SubscriptionDB(Base):
    __tablename__ = "subscriptions"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    serviceName: Mapped[str] = mapped_column(String, nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)
    monthlyCost: Mapped[float] = mapped_column(Float,  nullable=False)
    billingCycle: Mapped[str] = mapped_column(String, nullable=False)
    nextPayment: Mapped[str] = mapped_column(String, nullable=False)
    valueRating: Mapped[int] = mapped_column(Integer, nullable=False)

    # FK: Each subscription belongs to a specific user (nullable for backwards compat)
    user_id: Mapped[Optional[str]] = mapped_column(String, ForeignKey("users.id"), nullable=True)

    # Many-to-One: Subscription belongs to one User
    user: Mapped[Optional["UserDB"]] = relationship("UserDB", back_populates="subscriptions")

    # One-to-Many: Subscription has many Payments
    payments: Mapped[List["PaymentDB"]] = relationship(
        "PaymentDB",
        back_populates="subscription",
        cascade="all, delete-orphan"
    )


# ── PaymentDB ──────────────────────────────────────────────────────────────────
class PaymentDB(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    amount: Mapped[float] = mapped_column(Float,  nullable=False)
    date: Mapped[str] = mapped_column(String, nullable=False)
    subscription_id: Mapped[str] = mapped_column(String, ForeignKey("subscriptions.id"), nullable=False)

    # Many-to-One: Payment belongs to one Subscription
    subscription: Mapped["SubscriptionDB"] = relationship("SubscriptionDB", back_populates="payments")
