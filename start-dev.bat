@echo off
echo ===================================================
echo   GraamSeva AI - Odisha AI Hackathon 2026
echo ===================================================
echo.

echo [1/2] Starting Backend in new window...
start "GraamSeva Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

echo [2/2] Starting Frontend in new window...
start "GraamSeva Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo  Services launching!
echo  - Frontend: http://localhost:5173
echo  - Backend API: http://localhost:8000/docs
echo ===================================================

