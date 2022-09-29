import os
import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import (AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn,
                      validator)


class Settings(BaseSettings):

    api_v1_str: str = "/api/v1"
    secret_key: str = secrets.token_urlsafe(32)

    project_name: str = os.getenv("PROJECT_NAME")
    access_token_expire_minutes: int = 60 * 24 * 8
    server_name: str = os.getenv("cusf_predictor")
    # server_host: AnyHttpUrl
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    backend_cors_origins: List[AnyHttpUrl] = ["*"]

    @validator("backend_cors_origins", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    db_server: str = os.getenv("DB_SERVER", "db")
    db_port: str = os.getenv("DB_PORT", "3306")
    db_user: str = os.getenv("DB_USER", "cusf_predictor")
    db_password: str = os.getenv("DB_PASSWORD", "cusf_predictor")
    db_name: str = os.getenv("DB_BANE", "cusf_predictor_app")
    # sqlalchemy_database_uri: Optional[PostgresDsn] = None

    # Predictor settings
    elevation_dataset: Optional[str]


settings = Settings()
