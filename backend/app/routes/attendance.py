from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database.db import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.attendance import CheckInResponse, AttendanceHistoryResponse, TodayStatusResponse
from app.services.attendance_service import check_in, get_attendance_history, get_today_status

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/checkin", response_model=CheckInResponse)
def checkin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return check_in(current_user, db)


@router.get("/today", response_model=TodayStatusResponse)
def today_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_today_status(current_user, db)


@router.get("/history", response_model=AttendanceHistoryResponse)
def attendance_history(
    page: int = Query(1, ge=1),
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_attendance_history(current_user, db, page=page, month=month, year=year)
