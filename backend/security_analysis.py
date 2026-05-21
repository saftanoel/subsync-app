from datetime import datetime, timezone, timedelta
from mongo_db import get_db

async def check_malicious_behavior(username: str):
    """
    Query the audit_logs collection to see if this user has performed 
    3 or more 'DELETE_SUBSCRIPTION' actions within the last 10 seconds.
    If so, insert a document into the flagged_users collection.
    """
    db = get_db()
    audit_logs = db["audit_logs"]
    flagged_users = db["flagged_users"]
    
    ten_seconds_ago = (datetime.now(timezone.utc) - timedelta(seconds=10)).isoformat()
    
    # Count how many DELETE_SUBSCRIPTION actions the user performed in the last 10 seconds
    recent_deletions_count = await audit_logs.count_documents({
        "username": username,
        "action": "DELETE_SUBSCRIPTION",
        "timestamp": {"$gte": ten_seconds_ago}
    })
    
    if recent_deletions_count >= 3:
        # Check if they are already flagged recently to avoid spamming the flagged_users collection
        already_flagged = await flagged_users.find_one({
            "username": username,
            "reason": "Bulk deletion suspected",
            "timestamp": {"$gte": ten_seconds_ago}
        })
        
        if not already_flagged:
            await flagged_users.insert_one({
                "username": username,
                "reason": "Bulk deletion suspected",
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
