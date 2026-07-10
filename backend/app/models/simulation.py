"""Simulation model"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from app.core.database import Base


class Simulation(Base):
    """Simulation model"""

    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    culture_id = Column(Integer, ForeignKey("cultures.id"))
    name = Column(String(255), index=True)
    description = Column(Text, nullable=True)
    
    # Input parameters
    yield_variation = Column(Float, default=0.0)  # % de variation du rendement
    bioagressor_impact = Column(Float, default=0.0)  # % d'impact des bioagresseurs
    price_variation = Column(Float, default=0.0)  # % de variation du prix
    
    # Calculated results
    results = Column(JSON)  # Tous les resultats en JSON
    
    # Metadata
    scenario_name = Column(String(255), nullable=True)  # ex: "Secheresse 30%"
    user_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Simulation {self.name}>"