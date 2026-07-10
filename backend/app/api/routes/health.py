"""Health check routes"""

from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/health")
def health_check():
    """Health check endpoint"""
    return JSONResponse(
        {
            "status": "ok",
            "message": "OAD Simulation Agricole API is running",
        }
    )