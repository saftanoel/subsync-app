import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# 1. Import dependencies from the app
from main import app
from database import Base
from auth import get_db
import models_db  # Explicitly import models to register them with Base

# 2. Setup In-Memory SQLite Database
# This guarantees our tests run in isolation and NEVER touch our real subsync.db
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override the main app's database dependency
app.dependency_overrides[get_db] = override_get_db

@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    """
    Creates tables before each test and drops them afterwards
    to ensure a clean slate for every test case.
    """
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest_asyncio.fixture
async def async_client():
    """
    Fixture to provide an AsyncClient for testing the FastAPI app.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client

# ── Test Cases ────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_successful_registration(async_client: AsyncClient):
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "supersecurepassword123"
    }
    response = await async_client.post("/auth/register", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    # Verify password is not leaked in the response JSON
    assert "password" not in data
    assert "hashed_password" not in data

@pytest.mark.asyncio
async def test_duplicate_registration(async_client: AsyncClient):
    payload = {
        "username": "dupuser",
        "email": "dup@example.com",
        "password": "testpassword123"
    }
    # First registration (should succeed)
    response1 = await async_client.post("/auth/register", json=payload)
    assert response1.status_code == 200
    
    # Second registration with exact same details (should fail)
    response2 = await async_client.post("/auth/register", json=payload)
    assert response2.status_code == 400
    assert "Username already registered" in response2.json()["detail"] or "Email already registered" in response2.json()["detail"]

@pytest.mark.asyncio
async def test_successful_login(async_client: AsyncClient):
    # Register the user first
    register_payload = {
        "username": "loginuser",
        "email": "login@example.com",
        "password": "loginpassword123"
    }
    await async_client.post("/auth/register", json=register_payload)
    
    # Attempt to login using x-www-form-urlencoded format
    login_data = {
        "username": "loginuser",
        "password": "loginpassword123"
    }
    response = await async_client.post("/auth/login", data=login_data)
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_invalid_login(async_client: AsyncClient):
    # Attempt to login with a non-existent user
    login_data = {
        "username": "nonexistent",
        "password": "wrongpassword"
    }
    response = await async_client.post("/auth/login", data=login_data)
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"
