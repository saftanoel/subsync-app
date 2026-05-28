import asyncio
from mongo_db import insert_message

async def main():
    try:
        doc = await insert_message("testuser", "test message")
        print("Inserted doc:", doc)
        print("Type of _id:", type(doc["_id"]))
    except Exception as e:
        print("Error:", e)

asyncio.run(main())
