"""Culture routes"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.culture import CultureCreate, Culture, CultureUpdate
from app.services.culture_service import CultureService

router = APIRouter(prefix="/cultures")


@router.post("/", response_model=Culture)
def create_culture(culture: CultureCreate, db: Session = Depends(get_db)):
    """Create a new culture"""
    db_culture = CultureService.get_culture_by_name(db, culture.name)
    if db_culture:
        raise HTTPException(status_code=400, detail="Culture already exists")
    return CultureService.create_culture(db, culture)


@router.get("/", response_model=list[Culture])
def get_cultures(db: Session = Depends(get_db)):
    """Get all cultures"""
    return CultureService.get_all_cultures(db)


@router.get("/{culture_id}", response_model=Culture)
def get_culture(culture_id: int, db: Session = Depends(get_db)):
    """Get culture by ID"""
    culture = CultureService.get_culture(db, culture_id)
    if not culture:
        raise HTTPException(status_code=404, detail="Culture not found")
    return culture


@router.put("/{culture_id}", response_model=Culture)
def update_culture(
    culture_id: int, culture_update: CultureUpdate, db: Session = Depends(get_db)
):
    """Update culture"""
    culture = CultureService.update_culture(db, culture_id, culture_update)
    if not culture:
        raise HTTPException(status_code=404, detail="Culture not found")
    return culture


@router.delete("/{culture_id}")
def delete_culture(culture_id: int, db: Session = Depends(get_db)):
    """Delete culture"""
    if not CultureService.delete_culture(db, culture_id):
        raise HTTPException(status_code=404, detail="Culture not found")
    return {"message": "Culture deleted successfully"}