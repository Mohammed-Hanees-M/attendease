from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.services.dashboard_service import get_employee_stats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def employee_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_employee_stats(current_user, db)
