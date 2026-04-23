import pytest
from fastapi.testclient import TestClient
from main import app
from database import db_subscriptions

# Inițializăm clientul de testare
client = TestClient(app)

@pytest.fixture(autouse=True)
def run_before_and_after_tests():
    """Curăță baza de date (memoria RAM) înainte de fiecare test pentru a rula 'pe curat'."""
    db_subscriptions.clear()
    yield

def test_get_subscriptions_empty():
    """Test: Cererea unei liste goale de abonamente."""
    response = client.get("/subscriptions")
    assert response.status_code == 200
    assert response.json() == []

def test_create_subscription_valid():
    """Test: Crearea unui abonament cu date perfect valide."""
    payload = {
        "serviceName": "Netflix",
        "category": "Entertainment",
        "monthlyCost": 15.99,
        "billingCycle": "Monthly",
        "nextPayment": "2024-05-01",
        "valueRating": 5,
        "payments": [] 
    }
    response = client.post("/subscriptions", json=payload)
    
    assert response.status_code == 201, f"Testul a eșuat la validare cu mesajul: {response.json()}"
    
    data = response.json()
    assert data["serviceName"] == "Netflix"
    assert "id" in data

def test_create_subscription_invalid_cost():
    """Test: Crearea unui abonament cu cost negativ (trebuie să fie respins)."""
    payload = {
        "serviceName": "Broken",
        "category": "Test",
        "monthlyCost": -10.0, 
        "billingCycle": "Monthly", 
        "nextPayment": "2024-05-01",
        "valueRating": 1,
        "payments": []
    }
    response = client.post("/subscriptions", json=payload)
    
    assert response.status_code == 422

def test_delete_subscription():
    """Test: Crearea unui abonament și ștergerea lui imediată."""
    payload = {
        "serviceName": "To Delete",
        "category": "Test",
        "monthlyCost": 10.0,
        "billingCycle": "Monthly", 
        "nextPayment": "2024-05-01",
        "valueRating": 3,
        "payments": []
    }
    sub_res = client.post("/subscriptions", json=payload)
    
    # AM MODIFICAT AICI: Așteptăm 201 Created la crearea de dinainte de ștergere
    assert sub_res.status_code == 201, f"Testul a eșuat la creare în cadrul testului de delete: {sub_res.json()}"
    
    sub_id = sub_res.json()["id"]
    
  # Executăm ștergerea (aici așteptăm 204 No Content)
    delete_res = client.delete(f"/subscriptions/{sub_id}")
    assert delete_res.status_code == 204 # <--- Aici e magia!
    
    # Verificăm că baza de date e din nou goală
    get_res = client.get("/subscriptions")
    assert len(get_res.json()) == 0