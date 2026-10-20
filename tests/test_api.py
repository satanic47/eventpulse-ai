"""
Integration Tests for EventPulse AI FastAPI Backend
"""

import pytest
from starlette.testclient import TestClient
from app import app

client = TestClient(app)

def test_health_check_endpoint():
    """Verify health endpoint returns 200 OK and valid metadata."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "[Challenge 5]" in data["challenge"]
    assert "version" in data

def test_calculate_event_plan_success():
    """Verify event plan calculation with valid inputs."""
    payload = {
        "title": "Hackathon Awards Gala",
        "event_type": "hackathon",
        "guests": 150,
        "budget": 12000.0,
        "duration_hours": 5,
        "vibe": "cyberpunk"
    }
    response = client.post("/api/plan/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["guests"] == 150
    assert data["total_budget"] == 12000.0
    assert data["cost_per_guest"] == 80.0
    
    # Check budget breakdown
    breakdown = data["budget_breakdown"]
    assert breakdown["venue_30pct"] == 3600.0
    assert breakdown["catering_35pct"] == 4200.0
    assert breakdown["contingency_5pct"] == 600.0
    
    # Check staffing
    assert data["staffing_recommendations"]["bartenders"] >= 2

def test_copilot_chat_contingency_queries():
    """Verify AI copilot responses for rain, budget cuts, and drinks."""
    queries = [
        ("What if it rains during the cocktail hour?", "Rain Contingency"),
        ("How to cut budget by 15%?", "Budget Trimming"),
        ("How many drinks per person?", "Beverage Rule"),
        ("What music vibe do you recommend?", "Sound Arc")
    ]
    for q, expected_phrase in queries:
        resp = client.post("/api/copilot/chat", json={"query": q})
        assert resp.status_code == 200
        assert expected_phrase in resp.json()["reply"]

def test_root_serves_html():
    """Verify root / serves HTML dashboard."""
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert "EventPulse AI" in response.text
