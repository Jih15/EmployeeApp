import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import redis.asyncio as aioredis
from app.config.settings import settings
from app.core.exceptions import TokenExpiredException, TokenInvalidException

# Password Hash
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Redis Client (Token Blacklist)
redis_client: Optional[aioredis.Redis] = None

async def get_redis() -> aioredis.Redis:
    global redis_client
    if redis_client is None:
        redis_client = await aioredis.from_url(
            settings.REDIS_URL, encoding="utf-8", decode_responses=True
        )
    return redis_client

# JWT
def _create_token(data: dict, expires_delta: timedelta) -> str:
    payload = data.copy()
    now = datetime.now(timezone.utc)
    payload.update({
        "iat": now,
        "exp": now + expires_delta,
        "jti": str(uuid.uuid4())
    })
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_access_token(user_id: str, role: str) -> str:
    return _create_token(
        data={"sub": user_id, "role": role, "type": "access"},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

def create_refresh_token(user_id: str) -> str:
    return _create_token(
        data={"sub": user_id, "type":"refresh"},
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )

async def decode_token(token: str) -> dict:
    """
    Decode & validasi JWT:
    1. Signature valid?
    2. Belum expired?
    3. Belum di-blacklist (logout)?
    """
    try: 
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
    except jwt.ExpiredSignatureError:
        raise TokenExpiredException()
    except JWTError:
        raise TokenInvalidException()   
    
    # Cek blacklist di redis
    redis = await get_redis()
    jti = payload.get("jti")
    if jti and await redis.exists(f"blacklist:token:{jti}"):
        raise TokenInvalidException()
    
    return payload

async def blacklist_token(jti: str, expires_in_second: int) -> None:
    """Masukkan JTI ke Redis saat logout. Token otomatis expire dari Redis."""
    redis = await get_redis()
    await redis.setex(f"blacklist:token:{jti}", expires_in_second, "1")