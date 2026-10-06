import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine

from .routers import (
    auth,
    admin,
    faculty,
    student,
    ai,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="College Assistant API",
    version="2.0.0"
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1):517\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(faculty.router)
app.include_router(student.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {
        "message": "College Assistant API is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }