class VastuEngine:
    """
    Implements traditional Vastu Shastra principles for Indian homes
    """
    
    DIRECTION_RULES = {
        "north": {"element": "water", "good_for": ["entrance", "living_room"], "bad_for": ["kitchen", "toilet"]},
        "south": {"element": "fire", "good_for": ["kitchen"], "bad_for": ["bedroom", "entrance"]},
        "east": {"element": "air", "good_for": ["entrance", "prayer_room", "living_room"], "bad_for": ["toilet"]},
        "west": {"element": "earth", "good_for": ["dining", "study"], "bad_for": ["bedroom"]},
        "northeast": {"element": "water", "good_for": ["prayer", "study"], "bad_for": ["kitchen", "toilet"]},
        "southwest": {"element": "earth", "good_for": ["master_bedroom"], "bad_for": ["entrance"]},
        "southeast": {"element": "fire", "good_for": ["kitchen"], "bad_for": ["bedroom"]},
        "northwest": {"element": "air", "good_for": ["guest_room", "toilet"], "bad_for": ["master_bedroom"]}
    }
    
    def calculate_room_center(self, spatial_data: dict) -> list:
        # Complex calculation would use wall anchors
        return [7.5, 6.0] 
        
    def get_cardinal_direction(self, center: list) -> str:
        # Based on external orientation API
        return "southwest" 
        
    def get_furniture_orientation(self, spatial_data: dict, furniture_type: str) -> str:
        for f in spatial_data.get("detected_furniture", []):
            if f["type"] == furniture_type:
                return f.get("orientation", "north")
        return "north"

    def analyze_layout(self, spatial_data: dict, room_type: str) -> dict:
        score = 100
        violations = []
        suggestions = []
        
        # Check room placement by direction
        room_center = self.calculate_room_center(spatial_data)
        direction = self.get_cardinal_direction(room_center)
        
        # Master bedroom should be in southwest
        if room_type == "master_bedroom" and direction != "southwest":
            score -= 20
            violations.append("Master bedroom not in South-West (stability corner)")
            suggestions.append("Consider South-West corner for master bedroom")
        
        # Kitchen should be in southeast
        if room_type == "kitchen" and direction != "southeast":
            score -= 15
            violations.append("Kitchen not in South-East (Agni corner)")
        
        # Bed direction (head should be south or east)
        if any(f["type"] == "bed" for f in spatial_data.get("detected_furniture", [])):
            bed_orientation = self.get_furniture_orientation(spatial_data, "bed")
            if bed_orientation not in ["south", "east"]:
                score -= 10
                violations.append("Bed head not facing South or East")
                suggestions.append("Rotate bed to face South for better sleep quality")
        
        # Sofa direction (should face east or north)
        if any(f["type"] == "sofa" for f in spatial_data.get("detected_furniture", [])):
            sofa_orientation = self.get_furniture_orientation(spatial_data, "sofa")
            if sofa_orientation in ["south", "west"]:
                score -= 10
                violations.append("Sofa facing South (should face East/North for prosperity)")
                suggestions.append("Flip sofa to face East")
        
        return {
            "score": max(0, score),
            "compliance_level": "excellent" if score >= 80 else "good" if score >= 60 else "needs_improvement",
            "violations": violations,
            "suggestions": suggestions,
            "primary_direction": direction
        }
