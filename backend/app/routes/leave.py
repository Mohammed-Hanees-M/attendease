from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.leave import LeaveRequestCreate, LeaveRequestOut, LeaveHistoryResponse
from app.services.leave_service import submit_leave_request, get_leave_history

router = APIRouter(prefix="/leave", tags=["Leave"])


@router.post("/request", response_model=LeaveRequestOut)
def apply_leave(
    request: LeaveRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return submit_leave_request(current_user, request, db)


@router.get("/history", response_model=LeaveHistoryResponse)
def leave_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_leave_history(current_user, db)
