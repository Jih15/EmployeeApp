import uuid 
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, computed_field


class FaceDataResponse(BaseModel):
    """
    Response untuk face data.
    encoding (raw JSON 120-float) dan tidak ekspos ke client - hanya has_encoding (bool)
    yang dikirim ke flutter
    """
    employee_id: uuid.UUID
    photo_path: Optional[str] = None

    # Field internal - diload dari ORM tapi exclude dari JSON output
    encoding: Optional[str] = Field(default=None, exclude=True)

    registered_at: Optional[datetime] = None
    registered_by: Optional[uuid.UUID] = None
    last_updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }


    @computed_field
    @property
    def has_encoding(self)-> bool:
        """Flutter pakai ini untuk tampilkan status registrasi wajah"""
        return self.encoding is not None