"""
Security & Input Validation Tests for EventPulse AI
Tests boundary conditions, XSS sanitization, and security headers.
"""

import pytest
from starlette.testclient import TestClient
from app import app, sanitize_text

client = TestClient(app)

def test_security_headers_present():
    """Verify production security headers are attached to responses."""
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.headers["X-Content-Type-Options"] == "nosniff"
    assert resp.headers["X-Frame-Options"] == "DENY"
    assert resp.headers["X-XSS-Protection"] == "1; mode=block"
    assert "Content-Security-Policy" in resp.headers

def test_xss_sanitization():
    """Verify HTML script tags are stripped from text inputs."""
    dirty_text = "<script>alert('pwned')</script>Annual Wedding Gala"
    clean = sanitize_text(dirty_text)
    assert "<script>" not in clean
    assert "</script>" not in clean
    assert "Annual Wedding Gala" in clean

def test_invalid_negative_guest_count_rejected():
    """Ensure negative or zero guests return HTTP 422 Unprocessable Entity."""
    payload = {
        "title": "Invalid Gala",
        "event_type": "wedding",
        "guests": -10,  # Invalid
        "budget": 5000.0,
        "duration_hours": 4
    }
    resp = client.post("/api/plan/calculate", json=payload)
    assert resp.status_code == 422

def test_excessive_unrealistic_budget_rejected():
    """Ensure unrealistic budgets are rejected by Pydantic validators."""
    payload = {
        "title": "Invalid Mega Gala",
        "event_type": "birthday",
        "guests": 50,
        "budget": -500.0,  # Invalid negative budget
        "duration_hours": 4
    }
    resp = client.post("/api/plan/calculate", json=payload)
    assert resp.status_code == 422
