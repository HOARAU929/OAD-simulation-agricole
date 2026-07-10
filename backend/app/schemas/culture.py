"""Culture schemas"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CultureBase(BaseModel):
    """Base culture schema"""

    name: str
    description: Optional[str] = None
    
    # Charges operationnelles (EUR/ha ou EUR/cycle)
    fertilizer_cost: float = 0.0
    bioagressor_intrants_cost: float = 0.0
    other_intrants_cost: float = 0.0
    labor_cost: float = 0.0
    
    # Charges de structure
    mechanization_cost: float = 0.0
    building_cost: float = 0.0
    insurance_cost: float = 0.0
    miscellaneous_cost: float = 0.0
    
    # Charges supletives
    fermage_cost: float = 0.0
    capital_cost: float = 0.0
    
    # Defaults
    default_yield: float = 30.0
    default_price: float = 1.30


class CultureCreate(CultureBase):
    """Create culture schema"""
    pass


class CultureUpdate(BaseModel):
    """Update culture schema"""

    name: Optional[str] = None
    description: Optional[str] = None
    fertilizer_cost: Optional[float] = None
    bioagressor_intrants_cost: Optional[float] = None
    other_intrants_cost: Optional[float] = None
    labor_cost: Optional[float] = None
    mechanization_cost: Optional[float] = None
    building_cost: Optional[float] = None
    insurance_cost: Optional[float] = None
    miscellaneous_cost: Optional[float] = None
    fermage_cost: Optional[float] = None
    capital_cost: Optional[float] = None
    default_yield: Optional[float] = None
    default_price: Optional[float] = None


class Culture(CultureBase):
    """Culture schema"""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True