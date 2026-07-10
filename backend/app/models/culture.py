"""Culture model"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base


class Culture(Base):
    """Culture model"""

    __tablename__ = "cultures"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    description = Column(Text, nullable=True)
    
    # Charges operationnelles (en EUR/ha ou EUR/cycle)
    fertilizer_cost = Column(Float, default=0.0)  # Engrais
    bioagressor_intrants_cost = Column(Float, default=0.0)  # Intrants bioagresseurs
    other_intrants_cost = Column(Float, default=0.0)  # Autres intrants
    labor_cost = Column(Float, default=0.0)  # Main-d'oeuvre
    mechanization_cost = Column(Float, default=0.0)  # Mecanisation
    building_cost = Column(Float, default=0.0)  # Batiment
    insurance_cost = Column(Float, default=0.0)  # Assurances
    miscellaneous_cost = Column(Float, default=0.0)  # Frais divers
    fermage_cost = Column(Float, default=0.0)  # Fermage
    capital_cost = Column(Float, default=0.0)  # Capital
    
    # Default rendement and price
    default_yield = Column(Float, default=30.0)  # t/ha or t/cycle
    default_price = Column(Float, default=1.30)  # EUR/kg
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Culture {self.name}>"