from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import date, datetime
from app.models.attendance import AttendanceStatus


class AttendanceOut(BaseModel):
    id: UUID
    attendance_date: date
    check_in_time: datetime
    status: AttendanceStatus

    class Config:
        from_attributes = True


class AttendanceHistoryResponse(BaseModel):
    records: List[AttendanceOut]
    total: int
    page: int
    pages: int


class CheckInResponse(BaseModel):
    message: str
    attendance: AttendanceOut


class TodayStatusResponse(BaseModel):
    checked_in: bool
    attendance: Optional[AttendanceOut] = None
