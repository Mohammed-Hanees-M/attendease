from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.database.db import engine, Base
from app.routes import auth, dashboard, attendance, leave, admin

# Import all models so Alembic/SQLAlchemy sees them
from app.models import user, attendance as att_model, leave_request  # noqa

app = FastAPI(
    title="Employee Attendance & Leave Management System",
    description="Full-stack HR system for managing employee attendance and leave requests",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__},
    )


# Register routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(attendance.router)
app.include_router(leave.router)
app.include_router(admin.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Attendance Management API is running"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy", "version": "1.0.0"}
