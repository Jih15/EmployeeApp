import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.user import User


class UserRepository:
   def __init__(self, db: AsyncSession):
      self.db = db
      

   #   Basic Lookups

   async def get_by_id(self, user_id: str | uuid.UUID) -> User | None:
      """Load user tanpa relasi - untuk auth check"""
      uid = uuid.UUID(str(user_id))
      result = await self.db.execute(
         select(User).where(User.id == uid)
      )

      return result.scalar_one_or_none()
    
   async def get_by_email(self, email: str) -> User | None:
      """Login lookup - tidak perlu join hanya kolom auth"""
      result = await self.db.execute(
          select(User).where(User.email == email.lower().strip())
      )
      return result.scalar_one_or_none()
    
   async def email_exists(self, email: str) -> bool:
      """Cek duplikat email sebelum register — lebih efisien dari get_by_email."""
      result = await self.db.execute(
         select(User.id).where(User.email == email.lower().strip())
      )
      return result.scalar_one_or_none() is not None

   # Eager Load Varians
   # Hanya panggil saat endpoint benar2 butuh data
   # Tidak pakai middleware/dependency

   async def get_with_profile(self, user_id: uuid.UUID) -> User | None: 
      """Endpoint profile karyawan - Join employee_profile"""
      result = await self.db.execute(
         select(User).options(selectinload(User.face_data)).where(User.id == user_id)
      )
      return result.scalar_one_or_none()
    
   async def get_with_face_data(self, user_id: uuid.UUID) -> User | None:
      """Untuk endpoint absensi - join ke employee_face_data"""
      result = await self.db.execute(
         select(User).options(selectinload(User.face_data)).where(User.id == user_id)
      )
      return result.scalar_one_or_none()
    
   #  Write operation

   async def create(self, **kwargs) -> User:
      """
      Buat user baru.
      flush() agar ID ter-generate tanpa commit — transaksi masih bisa di-rollback
      oleh caller jika ada error setelahnya (misal: gagal buat profile).
      """
      user = User(**kwargs)
      self.db.add(user)
      await self.db.flush()
      await self.db.refresh(user)
      return user
   
   async def update(self, user: User, data: dict) -> User:
      """Update field user secara partial"""
      for field, value in data.items():
         if hasattr(user, field):
            setattr(user, field, value)
      await self.db.flush()
      await self.db.refresh(user)
      return user

