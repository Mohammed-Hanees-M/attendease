from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from app.database.db import get_db
from app.middleware.auth_middleware import require_admin
from app.models.user import User
from app.schemas.leave import LeaveApprovalRequest, LeaveRequestOut
from app.schemas.admin import AdminDashboardStats, EmployeeListResponse, EmployeeAttendanceRecord, EmployeeCreate, EmployeeListItem
from app.services.admin_service import (
    get_employee_list,
    get_employee_attendance,
    get_all_leave_requests,
    update_leave_status,
    create_employee,
    delete_employee,
    reset_system,
)
from app.services.dashboard_service import get_admin_stats

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard", response_model=AdminDashboardStats)
def admin_dashboard(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    stats = get_admin_stats(db)
    return AdminDashboardStats(**stats)


@router.get("/employees", response_model=EmployeeListResponse)
def list_employees(
    search: Optional[str] = Query(None),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return get_employee_list(db, search)


@router.get("/employees/{employee_id}/attendance")
def employee_attendance(
    employee_id: UUID,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    records = get_employee_attendance(employee_id, db)
    return {"records": records, "total": len(records)}


@router.get("/leave/requests")
def all_leave_requests(
    status: Optional[str] = Query(None),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    requests = get_all_leave_requests(db, status)
    return {"records": requests, "total": len(requests)}


@router.put("/leave/{leave_id}")
def approve_reject_leave(
    leave_id: UUID,
    request: LeaveApprovalRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    leave = update_leave_status(leave_id, request, db)
    return {"message": f"Leave request {request.status.value}", "leave_id": leave.id}


@router.post("/employees", response_model=EmployeeListItem)
def add_employee(
    data: EmployeeCreate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = create_employee(data, db)
    return EmployeeListItem.model_validate(user)


@router.delete("/employees/{employee_id}")
def remove_employee(
    employee_id: UUID,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    delete_employee(employee_id, db)
    return {"message": "Employee deleted successfully"}


@router.post("/reset")
def reset_all_data(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    reset_system(db)
    return {"message": "System reset successfully"}
