from fastapi.testclient import TestClient
from main import app, db_subscriptions

client = TestClient(app)

def test_create_subscription():
    response = client.post(
        "/subscriptions",
        json={
            "serviceName": "Disney+",
            "category": "Entertainment",
            "monthlyCost": 8.99,
            "billingCycle": "Monthly",
            "nextPayment": "2024-06-01",
            "valueRating": 4
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["serviceName"] == "Disney+"
    assert "id" in data

def test_get_all_subscriptions_with_pagination():
    # Asigurăm că avem destule elemente
    response = client.get("/subscriptions?skip=0&limit=1")
    assert response.status_code == 200
    data = response.json()
    assert len(data) <= 1 

def test_get_single_subscription():
    sub_id = db_subscriptions[0].id
    response = client.get(f"/subscriptions/{sub_id}")
    assert response.status_code == 200
    assert response.json()["id"] == sub_id

def test_get_nonexistent_subscription():
    response = client.get("/subscriptions/fake-id-123")
    assert response.status_code == 404

def test_update_subscription():
    sub_id = db_subscriptions[0].id
    response = client.put(
        f"/subscriptions/{sub_id}",
        json={"monthlyCost": 99.99} 
    )
    assert response.status_code == 200
    assert response.json()["monthlyCost"] == 99.99

def test_delete_subscription():
    create_resp = client.post("/subscriptions", json={
        "serviceName": "To Delete", "category": "Misc", "monthlyCost": 1.0, 
        "billingCycle": "Monthly", "nextPayment": "2024", "valueRating": 1
    })
    sub_id = create_resp.json()["id"]
    
    del_resp = client.delete(f"/subscriptions/{sub_id}")
    assert del_resp.status_code == 204
    
    check_resp = client.get(f"/subscriptions/{sub_id}")
    assert check_resp.status_code == 404