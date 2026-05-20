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

import asyncio

# Map event loop to Motor client to prevent "Event loop is closed" errors in Pytest
_clients = {}

def get_db():
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
        return client[DB_NAME]
        
    if loop not in _clients:
        _clients[loop] = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    return _clients[loop][DB_NAME]


async def insert_message(sender_username: str, text: str) -> dict:
    """Persist a new chat message and return it as a plain dict."""
    db = get_db()
    collection = db["messages"]
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
    db = get_db()
    collection = db["messages"]
    cursor = collection.find().sort("timestamp", 1).limit(limit)
    messages = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        messages.append(doc)
    return messages


async def insert_audit_log(username: str, action: str, details: str) -> dict:
    """Insert a new audit log entry."""
    db = get_db()
    audit_logs = db["audit_logs"]
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
    db = get_db()
    flagged_users = db["flagged_users"]
    cursor = flagged_users.find().sort("timestamp", -1)
    users = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        users.append(doc)
    return users
