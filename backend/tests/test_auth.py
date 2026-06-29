"""
Basic tests for the authentication API.
Run with: pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_login_invalid_credentials():
    response = client.post("/auth/login", json={
        "email": "notexist@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401


def test_login_missing_fields():
    response = client.post("/auth/login", json={"email": ""})
    assert response.status_code == 422


def test_protected_route_without_token():
    response = client.get("/dashboard/stats")
    assert response.status_code == 403


def test_attendance_without_token():
    response = client.post("/attendance/checkin")
    assert response.status_code == 403


def test_admin_route_without_token():
    response = client.get("/admin/dashboard")
    assert response.status_code == 403
