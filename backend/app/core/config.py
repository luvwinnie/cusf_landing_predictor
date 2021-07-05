import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn, validator


class Settings(BaseSettings):
    
    api_v1_str: str = "/api/v1"
    secret_key: str = secrets.token_urlsafe(32)

    project_name: str
    access_token_expire_minutes: int = 60 * 24 * 8
    server_name: str
    # server_host: AnyHttpUrl
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    backend_cors_origins: List[AnyHttpUrl] = []

    @validator("backend_cors_origins", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    postgres_server: str
    postgres_port:str
    postgres_user: str
    postgres_password: str
    postgres_db: str
    sqlalchemy_database_uri: Optional[PostgresDsn] = None

    # Predictor settings
    elevation_dataset: Optional[str]
    


settings = Settings()