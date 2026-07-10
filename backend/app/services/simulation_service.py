"""Simulation service"""

from sqlalchemy.orm import Session
from app.models.simulation import Simulation
from app.models.culture import Culture
from app.schemas.simulation import SimulationCreate, SimulationInputs, SimulationUpdate
from app.engine.simulator import SimulationEngine


class SimulationService:
    """Service for simulation operations"""

    @staticmethod
    def run_simulation(
        db: Session, culture_id: int, inputs: SimulationInputs
    ) -> dict:
        """Run a simulation for a culture"""
        culture = db.query(Culture).filter(Culture.id == culture_id).first()
        if not culture:
            raise ValueError(f"Culture with ID {culture_id} not found")
        
        engine = SimulationEngine(
            fertilizer_cost=culture.fertilizer_cost,
            bioagressor_intrants_cost=culture.bioagressor_intrants_cost,
            other_intrants_cost=culture.other_intrants_cost,
            labor_cost=culture.labor_cost,
            mechanization_cost=culture.mechanization_cost,
            building_cost=culture.building_cost,
            insurance_cost=culture.insurance_cost,
            miscellaneous_cost=culture.miscellaneous_cost,
            fermage_cost=culture.fermage_cost,
            capital_cost=culture.capital_cost,
            default_yield=culture.default_yield,
            default_price=culture.default_price,
        )
        
        results = engine.calculate(inputs)
        return results.model_dump()

    @staticmethod
    def create_simulation(
        db: Session, simulation: SimulationCreate
    ) -> Simulation:
        """Create and save a simulation"""
        inputs = SimulationInputs(
            yield_variation=simulation.yield_variation,
            bioagressor_impact=simulation.bioagressor_impact,
            price_variation=simulation.price_variation,
            scenario_name=simulation.scenario_name,
            user_notes=simulation.user_notes,
        )
        
        results = SimulationService.run_simulation(db, simulation.culture_id, inputs)
        
        db_simulation = Simulation(
            culture_id=simulation.culture_id,
            name=simulation.name,
            description=simulation.description,
            yield_variation=simulation.yield_variation,
            bioagressor_impact=simulation.bioagressor_impact,
            price_variation=simulation.price_variation,
            scenario_name=simulation.scenario_name,
            user_notes=simulation.user_notes,
            results=results,
        )
        
        db.add(db_simulation)
        db.commit()
        db.refresh(db_simulation)
        
        return db_simulation

    @staticmethod
    def get_simulation(db: Session, simulation_id: int) -> Simulation:
        """Get simulation by ID"""
        return db.query(Simulation).filter(Simulation.id == simulation_id).first()

    @staticmethod
    def get_all_simulations(db: Session, culture_id: int = None) -> list[Simulation]:
        """Get all simulations, optionally filtered by culture"""
        query = db.query(Simulation)
        if culture_id:
            query = query.filter(Simulation.culture_id == culture_id)
        return query.all()

    @staticmethod
    def update_simulation(
        db: Session, simulation_id: int, simulation_update: SimulationUpdate
    ) -> Simulation:
        """Update simulation"""
        db_simulation = db.query(Simulation).filter(Simulation.id == simulation_id).first()
        if db_simulation:
            update_data = simulation_update.model_dump(exclude_unset=True)
            
            if any(
                key in update_data
                for key in ["yield_variation", "bioagressor_impact", "price_variation"]
            ):
                inputs = SimulationInputs(
                    yield_variation=update_data.get(
                        "yield_variation", db_simulation.yield_variation
                    ),
                    bioagressor_impact=update_data.get(
                        "bioagressor_impact", db_simulation.bioagressor_impact
                    ),
                    price_variation=update_data.get(
                        "price_variation", db_simulation.price_variation
                    ),
                    scenario_name=update_data.get(
                        "scenario_name", db_simulation.scenario_name
                    ),
                    user_notes=update_data.get("user_notes", db_simulation.user_notes),
                )
                results = SimulationService.run_simulation(
                    db, db_simulation.culture_id, inputs
                )
                db_simulation.results = results
            
            for key, value in update_data.items():
                if key not in ["yield_variation", "bioagressor_impact", "price_variation"]:
                    setattr(db_simulation, key, value)
            
            db.commit()
            db.refresh(db_simulation)
        
        return db_simulation

    @staticmethod
    def delete_simulation(db: Session, simulation_id: int) -> bool:
        """Delete simulation"""
        db_simulation = db.query(Simulation).filter(Simulation.id == simulation_id).first()
        if db_simulation:
            db.delete(db_simulation)
            db.commit()
            return True
        return False