from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.services.movies.routes import router as movies_router
from app.services.auth.routes import router as auth_router
from app.services.reviews.routes import router as reviews_router
@asynccontextmanager
async def lifespan(app: FastAPI):
    
    await connect_to_mongo()
    yield
    await close_mongo_connection()
    
app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)
app.include_router(reviews_router, prefix="/reviews", tags=["Reviews"])
app.include_router(movies_router, prefix="/movies", tags=["Movies"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)