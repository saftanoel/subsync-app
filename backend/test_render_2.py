import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        try:
            res = await client.post("https://subsync-app.onrender.com/auth/login", data={"username": "noel999", "password": "parola"})
            print(f"Status Code: {res.status_code}")
            print(f"Response: {res.text}")
        except Exception as e:
            print(f"Error: {e}")

asyncio.run(test())
