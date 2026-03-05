class FactoryIntegration:
    def __init__(self):
        # Connection to internal BIESSE ERP / inventory DB
        self.factory_erp = None 
        
    def get_design_session(self, design_session_id: str):
        # Mock retrieval from Postgres DB
        return {
            "user_id": "u123",
            "user_city": "Bangalore",
            "recommended_furniture": [
                {"category": "sofa", "dimensions": {"w": 84, "h": 32, "d": 36}, "name": "Elegance"},
                {"category": "coffee_table", "dimensions": {"w": 40, "h": 18, "d": 40}, "name": "Minimalist Center"}
            ]
        }
        
    def breakdown_into_components(self, item: dict) -> list:
        # Extremely simplified BOM breakdown algorithm based on catalog items
        components = []
        name = item.get("name", "generic")
        cat = item.get("category", "")
        
        if cat == "sofa":
            components.extend([f"{name}_frame_wood", f"{name}_fabric_roll", f"{name}_premium_foam"])
        elif cat == "coffee_table":
            components.extend([f"{name}_glass_top", f"{name}_metal_legs_set", "hardware_kit_A"])
        else:
            components.extend(["standard_plywood", "laminate_sheet", "hardware_kit"])
            
        return components
        
    def generate_bom_from_design(self, design_session_id: str):
        """
        Generates Bill of Materials directly from the AI recommendations 
        for factory production using BIESSE machinery.
        """
        session = self.get_design_session(design_session_id)
        
        # Extract furniture items from AI recommendations
        furniture_items = session.get("recommended_furniture", [])
        
        bom = []
        for item in furniture_items:
            components = self.breakdown_into_components(item)
            bom.extend(components)
        
        if self.factory_erp:
            try:
                # Send to factory ERP
                self.factory_erp.create_production_order(
                    design_id=design_session_id,
                    bom=bom,
                    customer_id=session.get("user_id"),
                    delivery_city=session.get("user_city")
                )
            except Exception as e:
                print(f"Factory ERP Error: {e}")
        else:
            print(f"[Mock ERP] Generated BOM for session {design_session_id}")
            print(f"BOM Details: {bom}")
            
        return bom
