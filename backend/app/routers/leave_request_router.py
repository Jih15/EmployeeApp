import uuid
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user, get_hr_or_above
from app.models.leave_request import LeaveStatus
from backend.app.schemas.leave_schema import (
    LeaveRequestListResponse,
    LeaveRequestResponse,
    LeaveReviewRequest,
)
from backend.app.services.leave_service import LeaveRequestService

router = APIRouter(tags=["Leave Requests"])


# ── Self (Employee) ────────────────────────────────────────────────────────────

@router.post(
    "/me/leaves",
    response_model=LeaveRequestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ajukan cuti",
)
async def create_leave_request(
    leave_type_id: uuid.UUID = Form(...),
    start_date: date = Form(...),
    end_date: date = Form(...),
    reason: Optional[str] = Form(None),
    document: Optional[UploadFile] = File(None, description="Dokumen pendukung jika diperlukan"),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Multipart karena ada kemungkinan upload dokumen (surat dokter, dll).
    Validasi di service:
    - Kuota tahunan tidak terlampaui
    - Tidak overlap dengan cuti lain
    - Dokumen wajib ada jika leave_type.requires_document = True
    """
    service = LeaveRequestService(db)
    data = {
        "leave_type_id": leave_type_id,
        "start_date": start_date,
        "end_date": end_date,
        "reason": reason,
    }
    return await service.create(current_user.id, data, document)


@router.get(
    "/me/leaves",
    response_model=LeaveRequestListResponse,
    summary="Riwayat pengajuan cuti saya",
)
async def get_my_leave_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[LeaveStatus] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = LeaveRequestService(db)
    return await service.get_my_requests(current_user.id, skip, limit, status)


@router.patch(
    "/me/leaves/{leave_id}/cancel",
    response_model=LeaveRequestResponse,
    summary="Batalkan pengajuan cuti (hanya status pending)",
)
async def cancel_leave_request(
    leave_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = LeaveRequestService(db)
    return await service.cancel(leave_id, current_user)


# ── HR / Admin ─────────────────────────────────────────────────────────────────

@router.get(
    "/leaves",
    response_model=LeaveRequestListResponse,
    summary="[HR/Admin] List semua pengajuan cuti",
)
async def list_leave_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    employee_id: Optional[uuid.UUID] = Query(None),
    status: Optional[LeaveStatus] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = LeaveRequestService(db)
    return await service.get_all(skip, limit, employee_id, status, date_from, date_to)


@router.get(
    "/leaves/{leave_id}",
    response_model=LeaveRequestResponse,
    summary="[HR/Admin] Detail pengajuan cuti",
)
async def get_leave_request(
    leave_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_hr_or_above),
):
    service = LeaveRequestService(db)
    return await service.get_by_id(leave_id)


@router.patch(
    "/leaves/{leave_id}/review",
    response_model=LeaveRequestResponse,
    summary="[HR/Admin] Approve atau reject pengajuan cuti",
)
async def review_leave_request(
    leave_id: uuid.UUID,
    body: LeaveReviewRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_hr_or_above),
):
    service = LeaveRequestService(db)
    return await service.review(leave_id, current_user, body.status, body.review_notes)