from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from core.config import settings
# SQLALCHAMY_DATABASE_URL = 'sqlite:///./blog.db'
# HOST
# print(settings.sqlalchemy_database_uri)
host = settings.sqlalchemy_database_uri if settings.sqlalchemy_database_uri is None else "db"
SQLALCHAMY_DATABASE_URL = '{}://{}:{}@{}:{}/{}'.format(
	"postgresql", 
	settings.postgres_user, 
	settings.postgres_password, 
	settings.postgres_server, 
	settings.postgres_port, 
	settings.postgres_db
	)


engine = create_engine(SQLALCHAMY_DATABASE_URL, connect_args={
                       "check_same_thread": False})

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False,)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()