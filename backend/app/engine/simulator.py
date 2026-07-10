"""Simulation engine"""

from app.schemas.simulation import SimulationInputs, SimulationResults


class SimulationEngine:
    """Core simulation engine that calculates financial impacts"""

    def __init__(
        self,
        fertilizer_cost: float,
        bioagressor_intrants_cost: float,
        other_intrants_cost: float,
        labor_cost: float,
        mechanization_cost: float,
        building_cost: float,
        insurance_cost: float,
        miscellaneous_cost: float,
        fermage_cost: float,
        capital_cost: float,
        default_yield: float,
        default_price: float,
        surface: float = 1.0,
    ):
        """Initialize simulation engine with culture parameters"""
        
        self.fertilizer_cost = fertilizer_cost
        self.bioagressor_intrants_cost = bioagressor_intrants_cost
        self.other_intrants_cost = other_intrants_cost
        self.labor_cost = labor_cost
        self.mechanization_cost = mechanization_cost
        self.building_cost = building_cost
        self.insurance_cost = insurance_cost
        self.miscellaneous_cost = miscellaneous_cost
        self.fermage_cost = fermage_cost
        self.capital_cost = capital_cost
        self.default_yield = default_yield
        self.default_price = default_price
        self.surface = surface

    def calculate(self, inputs: SimulationInputs) -> SimulationResults:
        """
        Calculate simulation results based on inputs
        """
        
        # 1. Apply variations to base values
        yield_value = self.default_yield * (1 + inputs.yield_variation / 100)
        price_value = self.default_price * (1 + inputs.price_variation / 100)
        
        # 2. Calculate impact of bioagressors on yield
        bioagressor_yield_reduction = yield_value * (inputs.bioagressor_impact / 100)
        final_yield = yield_value - bioagressor_yield_reduction
        final_yield = max(0, final_yield)
        
        # 3. Convert yield to kg
        yield_kg = final_yield * 1000 * self.surface
        
        # 4. Calculate charges
        total_operational_charges = (
            self.fertilizer_cost
            + self.bioagressor_intrants_cost
            + self.other_intrants_cost
            + self.labor_cost
        ) * self.surface
        
        total_structure_charges = (
            self.mechanization_cost
            + self.building_cost
            + self.insurance_cost
            + self.miscellaneous_cost
        ) * self.surface
        
        total_suppletive_charges = (
            self.fermage_cost
            + self.capital_cost
        ) * self.surface
        
        # 5. Calculate products and margins
        gross_products = final_yield * self.surface * price_value * 1000
        gross_margin = gross_products - total_operational_charges
        net_margin = gross_products - (total_operational_charges + total_structure_charges)
        
        # 6. Calculate cost of production per 100kg
        if yield_kg > 0:
            cost_per_100kg = (total_suppletive_charges / (yield_kg / 100))
            cost_per_kg = cost_per_100kg / 100
        else:
            cost_per_100kg = 0
            cost_per_kg = 0
        
        # 7. Calculate impact metrics
        baseline_gross_products = self.default_yield * self.surface * self.default_price * 1000
        baseline_net_margin = baseline_gross_products - (
            total_operational_charges + total_structure_charges
        )
        
        if baseline_gross_products > 0:
            impact_on_gross_products = (
                (gross_products - baseline_gross_products) / baseline_gross_products
            ) * 100
        else:
            impact_on_gross_products = 0
        
        if baseline_net_margin > 0:
            impact_on_margin = (
                (net_margin - baseline_net_margin) / baseline_net_margin
            ) * 100
        else:
            impact_on_margin = 0
        
        return SimulationResults(
            yield_value=final_yield,
            price_value=price_value,
            bioagressor_impact=inputs.bioagressor_impact,
            total_operational_charges=total_operational_charges,
            fertilizer=self.fertilizer_cost * self.surface,
            bioagressor_intrants=self.bioagressor_intrants_cost * self.surface,
            other_intrants=self.other_intrants_cost * self.surface,
            labor=self.labor_cost * self.surface,
            total_structure_charges=total_structure_charges,
            mechanization=self.mechanization_cost * self.surface,
            building=self.building_cost * self.surface,
            insurance=self.insurance_cost * self.surface,
            miscellaneous=self.miscellaneous_cost * self.surface,
            total_suppletive_charges=total_suppletive_charges,
            fermage=self.fermage_cost * self.surface,
            capital=self.capital_cost * self.surface,
            gross_products=gross_products,
            gross_margin=gross_margin,
            net_margin=net_margin,
            cost_per_100kg=cost_per_100kg,
            cost_per_kg=cost_per_kg,
            impact_on_gross_products=impact_on_gross_products,
            impact_on_margin=impact_on_margin,
        )