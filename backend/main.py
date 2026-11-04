from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="NOVA LANEY API",
    description="Backend del sistema de trading NOVA LANEY",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {
        "system": "NOVA LANEY",
        "message": "Backend funcionando correctamente",
        "status": "online"
    }

@app.get("/api/status")
def system_status():
    return {
        "system": "NOVA LANEY",
        "status": "online",
        "mode": "development",
        "broker": "Exness",
        "platform": "MetaTrader 5",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/api/instruments")
def get_instruments():
    return {
        "instruments": [
            {"symbol": "EURUSD", "name": "EUR/USD", "category": "Forex"},
            {"symbol": "GBPUSD", "name": "GBP/USD", "category": "Forex"},
            {"symbol": "USDJPY", "name": "USD/JPY", "category": "Forex"},
            {"symbol": "XAUUSD", "name": "XAU/USD - Oro", "category": "Metales"}
        ]
    }
