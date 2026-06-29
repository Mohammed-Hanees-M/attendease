from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database.db import Base, engine
from app.routes import auth, dashboard, attendance, leave, admin

# Import models so SQLAlchemy/Alembic detects them
from app.models import user, attendance as att_model, leave_request  # noqa: F401


app = FastAPI(
    title="Employee Attendance & Leave Management System",
    description="Full-stack HR system for managing employee attendance and leave requests",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------- Global Exception Handler --------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": type(exc).__name__,
        },
    )


# -------------------- Routers --------------------
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(attendance.router)
app.include_router(leave.router)
app.include_router(admin.router)


# -------------------- Health Endpoints --------------------
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "message": "Attendance Management API is running",
    }


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "version": "1.0.0",
    }