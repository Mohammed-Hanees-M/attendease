"""
Run this after migrations to seed the database with an admin and sample employees.
Usage: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database.db import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.utils.password_hash import hash_password


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).first():
        print("Database already seeded.")
        db.close()
        return

    users = [
        User(
            name="Admin User",
            email="admin@company.com",
            password_hash=hash_password("Admin@123"),
            role=UserRole.admin,
        ),
        User(
            name="John Doe",
            email="john@company.com",
            password_hash=hash_password("Employee@123"),
            role=UserRole.employee,
        ),
        User(
            name="Jane Smith",
            email="jane@company.com",
            password_hash=hash_password("Employee@123"),
            role=UserRole.employee,
        ),
        User(
            name="Ahmed Al-Rashid",
            email="ahmed@company.com",
            password_hash=hash_password("Employee@123"),
            role=UserRole.employee,
        ),
    ]

    db.add_all(users)
    db.commit()
    db.close()

    print("✅ Database seeded successfully!")
    print("\nLogin credentials:")
    print("  Admin:    admin@company.com  /  Admin@123")
    print("  Employee: john@company.com   /  Employee@123")


if __name__ == "__main__":
    seed()
