# Backend — FastAPI

## Setup

```bash
# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and secret key

# 4. Run database migrations
alembic upgrade head

# 5. Seed initial data
python seed.py

# 6. Start the server
uvicorn app.main:app --reload --port 8000
```

## API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Default credentials (after seeding)
| Role     | Email                | Password      |
|----------|----------------------|---------------|
| Admin    | admin@company.com    | Admin@123     |
| Employee | john@company.com     | Employee@123  |

## Folder structure
```
app/
├── main.py           # FastAPI app + CORS + routers
├── config.py         # Environment settings
├── database/db.py    # SQLAlchemy engine & session
├── models/           # SQLAlchemy ORM models
├── schemas/          # Pydantic request/response schemas
├── routes/           # API route handlers
├── services/         # Business logic
├── middleware/       # JWT auth middleware & dependencies
└── utils/            # JWT handler, bcrypt, attendance calc
```
