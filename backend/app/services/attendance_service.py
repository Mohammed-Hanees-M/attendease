from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from datetime import datetime, date, timezone
from typing import Optional
from math import ceil
from uuid import UUID
from app.models.attendance import Attendance
from app.models.user import User
from app.schemas.attendance import AttendanceHistoryResponse, CheckInResponse, TodayStatusResponse
from app.utils.attendance_calc import calculate_attendance_status


def check_in(user: User, db: Session) -> CheckInResponse:
    today = date.today()
    existing = db.query(Attendance).filter(
        Attendance.user_id == user.id,
        Attendance.attendance_date == today,
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already checked in today",
        )

    now = datetime.now(timezone.utc)
    attendance_status = calculate_attendance_status(now)

    record = Attendance(
        user_id=user.id,
        attendance_date=today,
        check_in_time=now,
        status=attendance_status,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return CheckInResponse(
        message=f"Attendance marked successfully — {attendance_status.value}",
        attendance=record,
    )


def get_today_status(user: User, db: Session) -> TodayStatusResponse:
    today = date.today()
    record = db.query(Attendance).filter(
        Attendance.user_id == user.id,
        Attendance.attendance_date == today,
    ).first()
    return TodayStatusResponse(checked_in=record is not None, attendance=record)


def get_attendance_history(
    user: User,
    db: Session,
    page: int = 1,
    month: Optional[int] = None,
    year: Optional[int] = None,
    per_page: int = 10,
) -> AttendanceHistoryResponse:
    query = db.query(Attendance).filter(Attendance.user_id == user.id)

    if month:
        query = query.filter(func.extract("month", Attendance.attendance_date) == month)
    if year:
        query = query.filter(func.extract("year", Attendance.attendance_date) == year)

    query = query.order_by(Attendance.attendance_date.desc())
    total = query.count()
    records = query.offset((page - 1) * per_page).limit(per_page).all()

    return AttendanceHistoryResponse(
        records=records,
        total=total,
        page=page,
        pages=ceil(total / per_page) if total else 1,
    )
