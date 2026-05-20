"""
mongo_db.py — Async MongoDB client for the Silver/Gold Challenge features.

Uses the Motor async driver so it integrates cleanly with FastAPI's event loop.
Database : subsync
Collections: messages, audit_logs, flagged_users
"""

from datetime import datetime, timezone
import motor.motor_asyncio

MONGO_URL = "mongodb://localhost:27017"
DB_NAME   = "subsync"

# Single shared client — Motor handles the connection pool internally.
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

collection = db["messages"]
audit_logs = db["audit_logs"]
flagged_users = db["flagged_users"]


async def insert_message(sender_username: str, text: str) -> dict:
    """Persist a new chat message and return it as a plain dict."""
    doc = {
        "sender_username": sender_username,
        "text":            text,
        "timestamp":       datetime.now(timezone.utc).isoformat(),
    }
    result = await collection.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


async def get_recent_messages(limit: int = 50) -> list[dict]:
    """Return the last *limit* messages in chronological order (oldest first)."""
    cursor = collection.find().sort("timestamp", 1).limit(limit)
    messages = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        messages.append(doc)
    return messages


async def insert_audit_log(username: str, action: str, details: str) -> dict:
    """Insert a new audit log entry."""
    doc = {
        "username": username,
        "action": action,
        "details": details,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    result = await audit_logs.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


async def get_all_flagged_users() -> list[dict]:
    """Retrieve all documents from the flagged_users collection."""
    cursor = flagged_users.find().sort("timestamp", -1)
    users = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        users.append(doc)
    return users
