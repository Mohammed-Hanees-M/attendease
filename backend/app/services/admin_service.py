from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional
from uuid import UUID
from app.models.user import User, UserRole
from app.models.attendance import Attendance
from app.models.leave_request import LeaveRequest, LeaveStatus
from app.schemas.leave import LeaveApprovalRequest, LeaveRequestWithUser
from app.schemas.admin import EmployeeListResponse, EmployeeListItem, EmployeeCreate
from app.utils.password_hash import hash_password


def get_employee_list(db: Session, search: Optional[str] = None) -> EmployeeListResponse:
    query = db.query(User).filter(User.role == UserRole.employee)
    if search:
        query = query.filter(User.name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%"))
    employees = query.order_by(User.created_at.desc()).all()
    return EmployeeListResponse(
        employees=[EmployeeListItem.model_validate(e) for e in employees],
        total=len(employees),
    )


def get_employee_attendance(employee_id: UUID, db: Session) -> list:
    user = db.query(User).filter(User.id == employee_id, User.role == UserRole.employee).first()
    if not user:
        raise HTTPException(status_code=404, detail="Employee not found")
    records = (
        db.query(Attendance)
        .filter(Attendance.user_id == employee_id)
        .order_by(Attendance.attendance_date.desc())
        .all()
    )
    return records


def get_all_leave_requests(db: Session, status_filter: Optional[str] = None) -> list:
    query = db.query(LeaveRequest)
    if status_filter:
        try:
            s = LeaveStatus(status_filter)
            query = query.filter(LeaveRequest.status == s)
        except ValueError:
            pass
    requests = query.order_by(LeaveRequest.created_at.desc()).all()

    result = []
    for req in requests:
        user = db.query(User).filter(User.id == req.user_id).first()
        result.append({
            "id": req.id,
            "user_name": user.name if user else "Unknown",
            "user_email": user.email if user else "",
            "leave_type": req.leave_type,
            "start_date": req.start_date,
            "end_date": req.end_date,
            "reason": req.reason,
            "status": req.status,
            "admin_comment": req.admin_comment,
            "created_at": req.created_at,
        })
    return result


def update_leave_status(leave_id: UUID, request: LeaveApprovalRequest, db: Session) -> LeaveRequest:
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    if leave.status != LeaveStatus.pending:
        raise HTTPException(status_code=400, detail="Only pending requests can be updated")

    leave.status = request.status
    if request.admin_comment:
        leave.admin_comment = request.admin_comment
    db.commit()
    db.refresh(leave)
    return leave


def create_employee(data: EmployeeCreate, db: Session) -> User:
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(data.password)
    user = User(
        name=data.name,
        email=data.email,
        phone_number=data.phone_number,
        password_hash=hashed_password,
        role=UserRole.employee
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete_employee(employee_id: UUID, db: Session) -> None:
    user = db.query(User).filter(User.id == employee_id, User.role == UserRole.employee).first()
    if not user:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(user)
    db.commit()


def reset_system(db: Session) -> None:
    # Delete all attendance records
    db.query(Attendance).delete()
    # Delete all leave requests
    db.query(LeaveRequest).delete()
    # Delete all employees (preserve admins)
    db.query(User).filter(User.role != UserRole.admin).delete()
    
    db.commit()
