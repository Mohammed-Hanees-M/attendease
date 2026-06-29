from pydantic import BaseModel, model_validator
from typing import Optional, List
from uuid import UUID
from datetime import date, datetime
from app.models.leave_request import LeaveType, LeaveStatus


class LeaveRequestCreate(BaseModel):
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("End date cannot be before start date")
        return self


class LeaveRequestOut(BaseModel):
    id: UUID
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str
    status: LeaveStatus
    admin_comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LeaveRequestWithUser(LeaveRequestOut):
    user_name: str
    user_email: str


class LeaveApprovalRequest(BaseModel):
    status: LeaveStatus
    admin_comment: Optional[str] = None


class LeaveHistoryResponse(BaseModel):
    records: List[LeaveRequestOut]
    total: int
