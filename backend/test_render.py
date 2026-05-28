import asyncio
import httpx

async def main():
    async with httpx.AsyncClient(verify=False) as client:
        # Login
        res = await client.post("https://subsync-app.onrender.com/auth/login", data={"username": "admin", "password": "admin"})
        if res.status_code != 200:
            print("Login failed:", res.text)
            return
        token = res.json()["access_token"]
        print("Token acquired.")

        # Get flagged users
        res = await client.get("https://subsync-app.onrender.com/admin/flagged-users", headers={"Authorization": f"Bearer {token}"})
        print(f"Flagged users status: {res.status_code}")
        print("Flagged users text:", res.text)

asyncio.run(main())
