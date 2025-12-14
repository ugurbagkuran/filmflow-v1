from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "IMDb Clone"
    MONGO_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    DB_NAME: str = "imdb_clone_db"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    
    OPENAI_API_KEY: str | None = None
    OPENROUTER_API_KEY: str | None = None
    GROQ_API_KEY: str | None = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )
        
settings = Settings()
