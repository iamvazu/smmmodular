import os
import requests

class PerfexCRMIntegration:
    def __init__(self):
        # In a real environment, pull from os.environ
        self.api_key = os.getenv("PERFEX_API_KEY", "")
        self.api_url = os.getenv("PERFEX_API_URL", "https://your-perfex-crm-domain.com/api/leads")
        
    def create_lead_from_design(self, design_session: dict):
        """
        Auto-create lead in Perfex CRM when user generates a design or views report
        """
        # Mapping to typical Perfex CRM fields
        lead_data = {
            "name": design_session.get("user_name", "Aura AI User"),
            "phonenumber": design_session.get("user_phone", ""),
            "email": design_session.get("user_email", ""),
            "city": design_session.get("user_city", "Bangalore"),
            "source": "3", # Assuming '3' is a mapped source ID in Perfex for 'Aura AI'
            "status": "1", # Assuming '1' is 'New' lead status ID in Perfex
            "description": f"Aura AI Session ({design_session.get('id')}). Room: {design_session.get('room_type')}. Budget: {design_session.get('estimated_cost')}. Vastu Score: {design_session.get('vastu_score')}."
        }
        
        headers = {
            "authtoken": self.api_key
        }
        
        if self.api_key:
            try:
                # Create in Perfex API
                response = requests.post(self.api_url, data=lead_data, headers=headers)
                print(f"Created Lead in Perfex CRM for {lead_data['name']}: {response.status_code}")
            except Exception as e:
                print(f"Perfex CRM API Error: {e}")
        else:
            print(f"[Mock Perfex CRM] Captured lead data: {lead_data}")
            
        # Assign to nearest SMM showroom based on city
        self.assign_to_showroom(lead_data.get("city"), design_session.get("id"))
        
    def assign_to_showroom(self, city: str, session_id: str):
        # Routing logic for different SMM branches in South India
        SMM_BRANCHES = ["Bangalore", "Mysore", "Coimbatore", "Hyderabad", "Chennai", "Kochi", "Mangalore"]
        
        assigned_branch = "Bangalore" # Default HQ
        if city in SMM_BRANCHES:
            assigned_branch = city
            
        print(f"[CRM Routing] Assigned Session ID: {session_id} to {assigned_branch} showroom team.")
