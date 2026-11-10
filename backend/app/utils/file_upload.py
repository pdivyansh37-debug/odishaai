import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException, status
from app.config import settings

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "pdf", "mp3", "wav", "m4a", "ogg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


async def save_upload_file(file: UploadFile, subfolder: str = "") -> str:
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No filename provided"
        )

    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension .{ext} is not allowed",
        )

    target_dir = os.path.join(settings.UPLOAD_DIR, subfolder)
    os.makedirs(target_dir, exist_ok=True)

    filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(target_dir, filename)

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum limit of 10MB",
        )

    async with aiofiles.open(file_path, "wb") as out_file:
        await out_file.write(content)

    rel_path = f"/uploads/{subfolder}/{filename}" if subfolder else f"/uploads/{filename}"
    return rel_path.replace("\\", "/")

