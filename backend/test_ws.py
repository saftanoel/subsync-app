import asyncio
import websockets
import httpx
import json

async def test():
    # 1. Login
    async with httpx.AsyncClient(verify=False) as client:
        res = await client.post("http://127.0.0.1:8000/auth/login", data={"username": "admin", "password": "admin"})
        token = res.json()["access_token"]
        print(f"Token: {token[:20]}...")

    # 2. Connect to WS
    ws_url = f"ws://127.0.0.1:8000/ws/chat?token={token}"
    print(f"Connecting to {ws_url}")
    try:
        async with websockets.connect(ws_url) as ws:
            print("Connected!")
            # Send msg
            await ws.send("hello from test script")
            print("Message sent, waiting for reply...")
            reply = await ws.recv()
            print(f"Reply: {reply}")
    except Exception as e:
        print(f"WS Error: {e}")

asyncio.run(test())
