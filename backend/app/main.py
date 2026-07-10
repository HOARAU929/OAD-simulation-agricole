"""Main application entry point"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import health, cultures, simulations
from app.core.config import settings
from app.core.database import Base, engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OAD Simulation Agricole",
    description="Outil d'Aide a la Decision pour simuler les scenarios de baisse de rendement",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(cultures.router, prefix="/api/v1", tags=["Cultures"])
app.include_router(simulations.router, prefix="/api/v1", tags=["Simulations"])


@app.get("/")
def read_root():
    """Root endpoint"""
    return JSONResponse(
        {
            "message": "OAD Simulation Agricole API",
            "version": "1.0.0",
            "docs": "/docs",
        }
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )