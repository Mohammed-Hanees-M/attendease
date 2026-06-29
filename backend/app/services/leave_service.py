from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.leave_request import LeaveRequest, LeaveStatus
from app.models.user import User
from app.schemas.leave import LeaveRequestCreate, LeaveHistoryResponse


def submit_leave_request(user: User, request: LeaveRequestCreate, db: Session) -> LeaveRequest:
    leave = LeaveRequest(
        user_id=user.id,
        leave_type=request.leave_type,
        start_date=request.start_date,
        end_date=request.end_date,
        reason=request.reason,
        status=LeaveStatus.pending,
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return leave


def get_leave_history(user: User, db: Session) -> LeaveHistoryResponse:
    records = (
        db.query(LeaveRequest)
        .filter(LeaveRequest.user_id == user.id)
        .order_by(LeaveRequest.created_at.desc())
        .all()
    )
    return LeaveHistoryResponse(records=records, total=len(records))
