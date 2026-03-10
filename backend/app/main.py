from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import connect_db, disconnect_db
from app.routers import auth, farmer, investor, ml, groq_coach, market, proposals

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await disconnect_db()

app = FastAPI(
    title="CropChain API",
    description="AI-powered agricultural intelligence platform for Indian farmers",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(farmer.router)
app.include_router(investor.router)
app.include_router(ml.router)
app.include_router(groq_coach.router)
app.include_router(market.router)
app.include_router(proposals.router)

@app.get("/")
async def root():
    return {"message": "CropChain API is running", "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "cropchain-api"}
