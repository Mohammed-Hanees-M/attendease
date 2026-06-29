from sqlalchemy.orm import Session
from datetime import date
from app.models.attendance import Attendance, AttendanceStatus
from app.models.leave_request import LeaveRequest, LeaveStatus
from app.models.user import User, UserRole
from calendar import monthrange


def get_employee_stats(user: User, db: Session) -> dict:
    today = date.today()
    _, total_working_days = monthrange(today.year, today.month)

    records = db.query(Attendance).filter(
        Attendance.user_id == user.id,
        Attendance.attendance_date >= date(today.year, today.month, 1),
        Attendance.attendance_date <= today,
    ).all()

    present_days = len(records)
    absent_days = today.day - present_days

    pending_leaves = db.query(LeaveRequest).filter(
        LeaveRequest.user_id == user.id,
        LeaveRequest.status == LeaveStatus.pending,
    ).count()

    approved_leaves = db.query(LeaveRequest).filter(
        LeaveRequest.user_id == user.id,
        LeaveRequest.status == LeaveStatus.approved,
    ).count()

    return {
        "workingDays": total_working_days,
        "presentDays": present_days,
        "absentDays": max(absent_days, 0),
        "pendingLeaves": pending_leaves,
        "approvedLeaves": approved_leaves,
    }


def get_admin_stats(db: Session) -> dict:
    today = date.today()

    total_employees = db.query(User).filter(User.role == UserRole.employee).count()

    today_attendance = db.query(Attendance).filter(Attendance.attendance_date == today).all()
    present_today = sum(1 for a in today_attendance if a.status == AttendanceStatus.present)
    late_today = sum(1 for a in today_attendance if a.status == AttendanceStatus.late)
    absent_today = total_employees - (present_today + late_today)

    pending_leaves = db.query(LeaveRequest).filter(
        LeaveRequest.status == LeaveStatus.pending
    ).count()

    return {
        "totalEmployees": total_employees,
        "presentToday": present_today,
        "lateToday": late_today,
        "absentToday": max(absent_today, 0),
        "pendingLeaves": pending_leaves,
    }
