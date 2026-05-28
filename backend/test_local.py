import httpx
import asyncio

async def test():
    async with httpx.AsyncClient(verify=False) as client:
        try:
            res = await client.post("https://127.0.0.1:8000/auth/login", data={"username": "admin", "password": "admin"})
            print(f"Status Code: {res.status_code}")
            print(f"Response: {res.text}")
        except Exception as e:
            print(f"Error: {e}")

asyncio.run(test())
