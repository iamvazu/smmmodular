class RenderGenerator:
    def __init__(self):
        self.ready = False
        try:
            import torch
            from diffusers import StableDiffusionXLControlNetPipeline, ControlNetModel
            
            print("Loading ControlNet Models. This may take a moment on first run...")
            self.controlnet = ControlNetModel.from_pretrained(
                "diffusers/controlnet-canny-sdxl-1.0",
                torch_dtype=torch.float16
            )
            
            self.pipe = StableDiffusionXLControlNetPipeline.from_pretrained(
                "stabilityai/stable-diffusion-xl-base-1.0",
                controlnet=self.controlnet,
                torch_dtype=torch.float16
            )
            
            # In a real environment, load SMM LoRA:
            # self.pipe.load_lora_weights("smm-furniture-lora.safetensors")
            self.ready = True
            print("SDXL Pipeline Ready for Generation.")
        except Exception as e:
            print(f"Warning: Stable Diffusion pipeline disabled. Running in stub mode. Details: {e}")

    async def generate(
        self, 
        control_image,
        style: str,
        time_of_day: str,
        room_type: str,
        furniture_items: list
    ):
        from PIL import Image, ImageDraw
        
        style_prompts = {
            "modern": "modern minimalist interior design, clean lines, neutral colors",
            "contemporary_indian": "contemporary Indian interior, warm wood tones, ethnic accents",
            "scandinavian": "Scandinavian design, light wood, hygge, cozy",
            "industrial": "industrial loft style, exposed brick, metal accents"
        }
        
        lighting = {
            "morning": "soft morning sunlight streaming through windows, warm golden hour",
            "afternoon": "bright natural daylight, clear shadows",
            "evening": "warm ambient lighting, cozy evening atmosphere, lamps glowing"
        }
        
        furniture_desc = ", ".join([f"SMM {item.get('name', 'Custom Item')} in {item.get('finish', 'Wood')}" for item in furniture_items])
        
        prompt = f"""
        Professional interior photography of a {room_type}, 
        {style_prompts.get(style, style_prompts['modern'])}, {lighting.get(time_of_day, lighting['morning'])}.
        Featuring: {furniture_desc}.
        Photorealistic, 4K, architectural digest quality, 
        sharp focus, professional color grading.
        """
        
        negative_prompt = "blurry, low quality, distorted furniture, unrealistic proportions, cartoon, illustration"
        
        if self.ready:
            print(f"Generating image with prompt: {prompt}")
            image = self.pipe(
                prompt=prompt,
                negative_prompt=negative_prompt,
                image=control_image,
                num_inference_steps=30, # adjusted for speed
                guidance_scale=7.5,
                controlnet_conditioning_scale=0.8
            ).images[0]
            return image
        else:
            print("Notice: Returning generated placeholder render because diffusers wasn't loaded.")
            # Create a mock image
            img = Image.new('RGB', (1024, 768), color = (212, 175, 55)) # Gold color
            d = ImageDraw.Draw(img)
            d.text((50,300), "Aura AI: AI Generated Placeholder", fill=(255,255,255))
            d.text((50,350), f"Room: {room_type}", fill=(255,255,255))
            d.text((50,400), f"Style: {style}", fill=(255,255,255))
            return img
