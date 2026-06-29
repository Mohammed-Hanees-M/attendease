from datetime import datetime, time, timezone
from app.models.attendance import AttendanceStatus

LATE_THRESHOLD = time(10, 15)  


def calculate_attendance_status(check_in_time: datetime) -> AttendanceStatus:
    local_time = check_in_time.astimezone().time()
    if local_time > LATE_THRESHOLD:
        return AttendanceStatus.late
    return AttendanceStatus.present
