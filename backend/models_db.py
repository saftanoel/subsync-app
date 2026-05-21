# data validation (database constraints)
from sqlalchemy import Column, String, Float, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
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

    id   = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)   # e.g. 'admin', 'user'

    # Many-to-Many: Role has many Permissions (through role_permissions)
    permissions = relationship(
        "PermissionDB",
        secondary=role_permissions,
        back_populates="roles"
    )

    # One-to-Many: Role has many Users
    users = relationship("UserDB", back_populates="role")


# ── PermissionDB ───────────────────────────────────────────────────────────────
class PermissionDB(Base):
    __tablename__ = "permissions"

    id   = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)   # e.g. 'read', 'write', 'delete'

    # Back-reference: Permission belongs to many Roles
    roles = relationship(
        "RoleDB",
        secondary=role_permissions,
        back_populates="permissions"
    )


# ── UserDB ─────────────────────────────────────────────────────────────────────
class UserDB(Base):
    __tablename__ = "users"

    id       = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)   # plain-text per assignment spec (no tokens yet)
    role_id  = Column(String, ForeignKey("roles.id"), nullable=True)

    # Many-to-One: User belongs to one Role
    role = relationship("RoleDB", back_populates="users")

    # One-to-Many: User owns many Subscriptions
    subscriptions = relationship(
        "SubscriptionDB",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# ── SubscriptionDB ─────────────────────────────────────────────────────────────
class SubscriptionDB(Base):
    __tablename__ = "subscriptions"

    id           = Column(String, primary_key=True, index=True)
    serviceName  = Column(String, nullable=False)
    category     = Column(String, nullable=False)
    monthlyCost  = Column(Float,  nullable=False)
    billingCycle = Column(String, nullable=False)
    nextPayment  = Column(String, nullable=False)
    valueRating  = Column(Integer, nullable=False)

    # FK: Each subscription belongs to a specific user (nullable for backwards compat)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)

    # Many-to-One: Subscription belongs to one User
    user = relationship("UserDB", back_populates="subscriptions")

    # One-to-Many: Subscription has many Payments
    payments = relationship(
        "PaymentDB",
        back_populates="subscription",
        cascade="all, delete-orphan"
    )


# ── PaymentDB ──────────────────────────────────────────────────────────────────
class PaymentDB(Base):
    __tablename__ = "payments"

    id              = Column(String, primary_key=True, index=True)
    amount          = Column(Float,  nullable=False)
    date            = Column(String, nullable=False)
    subscription_id = Column(String, ForeignKey("subscriptions.id"), nullable=False)

    # Many-to-One: Payment belongs to one Subscription
    subscription = relationship("SubscriptionDB", back_populates="payments")
