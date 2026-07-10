"""Simulation routes"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.simulation import (
    SimulationCreate,
    Simulation,
    SimulationInputs,
    SimulationResults,
    SimulationUpdate,
)
from app.services.simulation_service import SimulationService

router = APIRouter(prefix="/simulations")


@router.post("/run/{culture_id}", response_model=SimulationResults)
def run_simulation(
    culture_id: int, inputs: SimulationInputs, db: Session = Depends(get_db)
):
    """
    Run a simulation for a culture without saving it
    
    This is useful for quick what-if analysis
    """
    try:
        return SimulationService.run_simulation(db, culture_id, inputs)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/", response_model=Simulation)
def create_simulation(simulation: SimulationCreate, db: Session = Depends(get_db)):
    """Create and save a simulation"""
    try:
        return SimulationService.create_simulation(db, simulation)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/", response_model=list[Simulation])
def get_simulations(culture_id: int = None, db: Session = Depends(get_db)):
    """Get all simulations, optionally filtered by culture"""
    return SimulationService.get_all_simulations(db, culture_id)


@router.get("/{simulation_id}", response_model=Simulation)
def get_simulation(simulation_id: int, db: Session = Depends(get_db)):
    """Get simulation by ID"""
    simulation = SimulationService.get_simulation(db, simulation_id)
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return simulation


@router.put("/{simulation_id}", response_model=Simulation)
def update_simulation(
    simulation_id: int, simulation_update: SimulationUpdate, db: Session = Depends(get_db)
):
    """Update simulation"""
    simulation = SimulationService.update_simulation(db, simulation_id, simulation_update)
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return simulation


@router.delete("/{simulation_id}")
def delete_simulation(simulation_id: int, db: Session = Depends(get_db)):
    """Delete simulation"""
    if not SimulationService.delete_simulation(db, simulation_id):
        raise HTTPException(status_code=404, detail="Simulation not found")
    return {"message": "Simulation deleted successfully"}