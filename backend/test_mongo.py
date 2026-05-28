import asyncio
from mongo_db import get_recent_messages

async def main():
    try:
        msgs = await get_recent_messages(1)
        print("Success:", msgs)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
