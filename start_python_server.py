#!/usr/bin/env python3
"""
Startup script for the Python FastAPI backend
"""
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set environment variables
os.environ.setdefault('NODE_ENV', 'development')

# Import and run the FastAPI app
from server.main import app
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(
        "server.main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.environ.get("NODE_ENV") != "production" else False
    )