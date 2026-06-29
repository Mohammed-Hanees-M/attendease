from app.utils.password_hash import hash_password

users = {
    "admin@company.com": "Admin@123",
    "john@company.com": "John@123",
    "jane@company.com": "Jane@123",
    "ahmed@company.com": "Ahmed@123",
}

print("\n===== GENERATED PASSWORD HASHES =====\n")

for email, password in users.items():
    print(email)
    print(hash_password(password))
    print()