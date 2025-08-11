from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
import os

app = FastAPI(title="Kitna AI Cost Calculator API")

# Storage interface - using in-memory storage for development
class MemoryStorage:
    def __init__(self):
        self.data: Dict[str, Any] = {}
    
    def get(self, key: str) -> Optional[Any]:
        return self.data.get(key)
    
    def set(self, key: str, value: Any) -> None:
        self.data[key] = value
    
    def delete(self, key: str) -> bool:
        if key in self.data:
            del self.data[key]
            return True
        return False

# Initialize storage
storage = MemoryStorage()

# Pydantic models for request/response
class CalculationRequest(BaseModel):
    provider: str
    model: str
    input_type: str
    text_input: Optional[str] = None
    token_count: Optional[int] = None
    voice_duration: Optional[float] = None
    api_key: Optional[str] = None

class CalculationResponse(BaseModel):
    input_cost: float
    output_cost: Optional[float] = None
    total_cost: float
    estimated_tokens: Optional[int] = None

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Kitna API is running"}

@app.post("/api/calculate", response_model=CalculationResponse)
async def calculate_cost(request: CalculationRequest):
    try:
        # This would typically use the calculator logic from the frontend
        # For now, returning a basic calculation structure
        
        # Basic token estimation (simplified version)
        estimated_tokens = 0
        if request.text_input:
            # Simple estimation: ~4 characters per token
            estimated_tokens = len(request.text_input) // 4
        elif request.token_count:
            estimated_tokens = request.token_count
        
        # Basic cost calculation (this would use actual pricing data)
        input_cost = estimated_tokens * 0.00001  # Example rate
        output_cost = estimated_tokens * 0.00002 if request.input_type == "text" else None
        total_cost = input_cost + (output_cost or 0)
        
        return CalculationResponse(
            input_cost=input_cost,
            output_cost=output_cost,
            total_cost=total_cost,
            estimated_tokens=estimated_tokens
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/models")
async def get_models():
    # This would return the available models
    return {
        "text_models": [
            {"provider": "openai", "name": "gpt-4", "input_rate": 0.03, "output_rate": 0.06},
            {"provider": "openai", "name": "gpt-3.5-turbo", "input_rate": 0.001, "output_rate": 0.002},
            {"provider": "anthropic", "name": "claude-3-opus", "input_rate": 0.015, "output_rate": 0.075},
        ],
        "voice_models": [
            {"provider": "openai", "name": "whisper-1", "rate": 0.006},
            {"provider": "deepgram", "name": "nova-2", "rate": 0.0059},
        ]
    }

# Serve static files (for production)
if os.path.exists("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Serve index.html for all routes (SPA routing)
        if full_path and not full_path.startswith("api"):
            file_path = f"dist/{full_path}"
            if os.path.exists(file_path) and os.path.isfile(file_path):
                return FileResponse(file_path)
        return FileResponse("dist/index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.environ.get("NODE_ENV") != "production" else False
    )