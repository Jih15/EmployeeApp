import os
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.config.settings import settings
from app.core.exceptions import BadRequestException


async def save_upload_file(file: UploadFile, subdirectory: str)-> tuple[str, bytes]:
    """
    Validasi dan simpan UploadFile ke disk.
    Returns (relative_path, raw_bytes).
 
    raw_bytes dikembalikan agar caller tidak perlu baca file lagi dari disk
    (misal: langsung di-encode ke face_recognition tanpa disk I/O kedua).
    """
    if file.content_type not in settings.ALLOWED_IMAGE_TYPE:
        raise BadRequestException(
            error_code="INVALID_FILE_TYPE",
            message=f"Tipe file tidak diizinkan. Gunakan: {', '.join(settings.ALLOWED_IMAGE_TYPE)}.",
        )
    
    content = await file.read()

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise BadRequestException(
            error_code="FILE_TOO_LARGE",
            message=f"Ukuran file maksimal {settings.MAX_UPLOAD_SIZE_MB}MB."
        )
    
    # Buat path: uploads/{subdirectory}/{uuid}.{ext}
    ext = Path(file.filename).suffix.lower() if file.filename else ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    dir_path = Path(settings.UPLOAD_DIR) / subdirectory
    dir_path.mkdir(parents=True, exist_ok=True)
    file_path = dir_path/filename

    with open(file_path, "wb") as f:
        f.write(content)

    # Return path relatif agar portable (tidak bergantung absolute pada path server)
    return str(file_path), content


def delete_file(path: str) -> None:
    """
    Hapus file dari disk. Silent jika tidak ada.
    Dipanggil saat update foto atau hapus foto lama, / delete face data.
    """
    try:
        os.remove(path)
    except FileNotFoundError:
        pass
    except OSError as e:
        import logging
        logging.getLogger(__name__).warning("Failed to delete file %s: %s", path, e)