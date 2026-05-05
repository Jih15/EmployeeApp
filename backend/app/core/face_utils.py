"""
Utility face recognition — wrapper tipis di atas library face_recognition.
 
Dipisah dari service agar:
1. Mudah di-mock saat unit test (patch app.core.face_utils.encode_face)
2. Isolasi dependency berat (dlib/face_recognition) dari business logic
3. Bisa swap ke library lain (DeepFace, InsightFace) tanpa ubah service
"""

import io
import json

import numpy as np

from app.config.settings import settings
from app.core.exceptions import FaceVerificationException


def encode_face(image_bytes: bytes) -> list[float]:
    """
    Deteksi dan encode wajah dari bytes gambar.
 
    Returns list[float] (128-dim encoding) yang bisa disimpan sebagai JSON.
    Raises FaceVerificationException.not_detected() jika tidak ada wajah.
 
    Model yang dipakai dikonfigurasi via FACE_RECOGNITION_MODEL:
    - "hog" : cepat, cocok untuk CPU (default)
    - "cnn" : akurat, butuh GPU / proses lebih lama
    """
    import face_recognition

    image = face_recognition.load_image_file(io.BytesIO(image_bytes))

    # Detect locations
    locations = face_recognition.face_locations(
        image, model=settings.FACE_RECOGNITION_MODEL
    )

    if not locations:
        raise FaceVerificationException.not_detected()
    
    encodings = face_recognition.face_encodings(image, locations)
    # Ambil wajah pertama (encoding[0] - asumsi foto selfie 1 wajah)
    return encodings[0].tolist()

def compare_face(known_encoding_json: str, image_bytes: bytes) -> None:
    """
    Bandingkan wajah di gambar dengan encoding tersimpan
    """

    import face_recognition

    known = np.array(json.loads(known_encoding_json))

    image = face_recognition.load_image_file(io.BytesIO(image_bytes))
    locations = face_recognition.face_locations(
        image, model=settings.FACE_RECOGNITION_MODEL
    )

    if not locations:
        raise FaceVerificationException.not_detected()
    
    unknown_encodings = face_recognition.face_encodings(image, locations)
    results = face_recognition.compare_faces(
        [known],
        unknown_encodings[0],
        tolerance=settings.FACE_RECOGNITION_TOLERANCE
    )

    if not results[0]:
        raise FaceVerificationException.mismatch()