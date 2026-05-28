import asyncio
from mongo_db import get_all_flagged_users

async def main():
    try:
        users = await get_all_flagged_users()
        print("Flagged users count:", len(users))
        if users: print("First:", users[0])
    except Exception as e:
        print("Error:", e)

asyncio.run(main())
