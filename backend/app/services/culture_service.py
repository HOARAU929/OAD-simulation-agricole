"""Culture service"""

from sqlalchemy.orm import Session
from app.models.culture import Culture
from app.schemas.culture import CultureCreate, CultureUpdate


class CultureService:
    """Service for culture operations"""

    @staticmethod
    def create_culture(db: Session, culture: CultureCreate) -> Culture:
        """Create a new culture"""
        db_culture = Culture(**culture.model_dump())
        db.add(db_culture)
        db.commit()
        db.refresh(db_culture)
        return db_culture

    @staticmethod
    def get_culture(db: Session, culture_id: int) -> Culture:
        """Get culture by ID"""
        return db.query(Culture).filter(Culture.id == culture_id).first()

    @staticmethod
    def get_culture_by_name(db: Session, name: str) -> Culture:
        """Get culture by name"""
        return db.query(Culture).filter(Culture.name == name).first()

    @staticmethod
    def get_all_cultures(db: Session) -> list[Culture]:
        """Get all cultures"""
        return db.query(Culture).all()

    @staticmethod
    def update_culture(db: Session, culture_id: int, culture_update: CultureUpdate) -> Culture:
        """Update culture"""
        db_culture = db.query(Culture).filter(Culture.id == culture_id).first()
        if db_culture:
            update_data = culture_update.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_culture, key, value)
            db.commit()
            db.refresh(db_culture)
        return db_culture

    @staticmethod
    def delete_culture(db: Session, culture_id: int) -> bool:
        """Delete culture"""
        db_culture = db.query(Culture).filter(Culture.id == culture_id).first()
        if db_culture:
            db.delete(db_culture)
            db.commit()
            return True
        return False