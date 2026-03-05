class SMMCRMIntegration:
    def __init__(self):
        # In a real environment, initialize HubSpot/Zoho client here
        self.hubspot_client = None 
        
    def create_lead_from_design(self, design_session: dict):
        """
        Auto-create lead in CRM when user generates a design
        """
        lead_data = {
            "firstname": design_session.get("user_name", "Aura AI User"),
            "phone": design_session.get("user_phone", "+91"),
            "email": design_session.get("user_email", "ai-lead@example.com"),
            "city": design_session.get("user_city", "Bangalore"),
            "source": "Aura AI",
            "design_session_id": design_session.get("id"),
            "room_type": design_session.get("room_type"),
            "estimated_budget": design_session.get("estimated_cost"),
            "vastu_score": design_session.get("vastu_score"),
            "ai_generated_design_url": design_session.get("generated_render_url")
        }
        
        if self.hubspot_client:
            try:
                # Create in HubSpot API
                self.hubspot_client.crm.contacts.basic_api.create(
                    simple_public_object_input=lead_data
                )
                print(f"Created Lead in HubSpot for {lead_data['firstname']}")
            except Exception as e:
                print(f"HubSpot API Error: {e}")
        else:
            print(f"[Mock CRM] Captured lead data: {lead_data}")
            
        # Assign to nearest SMM showroom based on city
        self.assign_to_showroom(lead_data.get("city"), design_session.get("id"))
        
    def assign_to_showroom(self, city: str, session_id: str):
        # Routing logic for different SMM branches in South India
        SMM_BRANCHES = ["Bangalore", "Mysore", "Coimbatore", "Hyderabad", "Chennai", "Kochi", "Mangalore"]
        
        assigned_branch = "Bangalore" # Default HQ
        if city in SMM_BRANCHES:
            assigned_branch = city
            
        print(f"[CRM Routing] Assigned Session ID: {session_id} to {assigned_branch} showroom team.")
