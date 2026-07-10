"""Simulation schemas"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any


class SimulationInputs(BaseModel):
    """Simulation input parameters"""

    yield_variation: float  # % (ex: -30 pour 30% baisse)
    bioagressor_impact: float  # % (ex: 15 pour 15% de degats)
    price_variation: float  # % (ex: -20 pour 20% baisse)
    scenario_name: Optional[str] = None  # ex: "Secheresse + Ravageurs"
    user_notes: Optional[str] = None


class SimulationBase(BaseModel):
    """Base simulation schema"""

    culture_id: int
    name: str
    description: Optional[str] = None
    yield_variation: float
    bioagressor_impact: float
    price_variation: float
    scenario_name: Optional[str] = None
    user_notes: Optional[str] = None


class SimulationCreate(SimulationBase):
    """Create simulation schema"""
    pass


class SimulationUpdate(BaseModel):
    """Update simulation schema"""

    name: Optional[str] = None
    description: Optional[str] = None
    yield_variation: Optional[float] = None
    bioagressor_impact: Optional[float] = None
    price_variation: Optional[float] = None
    scenario_name: Optional[str] = None
    user_notes: Optional[str] = None


class SimulationResults(BaseModel):
    """Simulation results"""

    # Input parameters
    yield_value: float  # t/ha
    price_value: float  # EUR/kg
    bioagressor_impact: float  # %
    
    # Charges operationnelles
    total_operational_charges: float
    fertilizer: float
    bioagressor_intrants: float
    other_intrants: float
    labor: float
    
    # Charges de structure
    total_structure_charges: float
    mechanization: float
    building: float
    insurance: float
    miscellaneous: float
    
    # Charges supletives
    total_suppletive_charges: float
    fermage: float
    capital: float
    
    # Products and margins
    gross_products: float  # EUR
    gross_margin: float  # EUR
    net_margin: float  # EUR
    
    # Cost of production
    cost_per_100kg: float  # EUR/100kg
    cost_per_kg: float  # EUR/kg
    
    # Impact metrics
    impact_on_gross_products: float  # %
    impact_on_margin: float  # %


class Simulation(SimulationBase):
    """Simulation schema"""

    id: int
    results: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True