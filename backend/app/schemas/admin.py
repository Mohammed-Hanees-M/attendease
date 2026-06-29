from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import date, datetime
from app.models.attendance import AttendanceStatus


class AdminDashboardStats(BaseModel):
    totalEmployees: int
    presentToday: int
    lateToday: int
    absentToday: int
    pendingLeaves: int


class EmployeeListItem(BaseModel):
    id: UUID
    name: str
    email: str
    phone_number: Optional[str] = None
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class EmployeeCreate(BaseModel):
    name: str
    email: str
    phone_number: str
    password: str


class EmployeeListResponse(BaseModel):
    employees: List[EmployeeListItem]
    total: int


class EmployeeAttendanceRecord(BaseModel):
    id: UUID
    attendance_date: date
    check_in_time: datetime
    status: AttendanceStatus

    class Config:
        from_attributes = True
