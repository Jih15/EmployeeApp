from backend.app.routers import (
    payroll_router,
)
from backend.app.routers import attendances_router, auth_router, employee_router, face_data_router, leave_request_router, leave_type_router, office_location_router

__all__ = [
    "auth_router",
    "employee_router",
    "office_location_router",
    "face_data_router",
    "attendances_router",
    "leave_type_router",
    "leave_request_router",
    "payroll_router",
]