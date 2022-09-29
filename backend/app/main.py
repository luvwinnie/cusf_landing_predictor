from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from common.custom_exception import *
from core.config import settings
from db.database import engine
from routers import predictor

app = FastAPI(
    title=settings.project_name, openapi_url=f"{settings.api_v1_str}/openapi.json"
)


@app.exception_handler(RequestException)
async def validation_exception_handler(request: Request, exc: RequestException):
    print(exc)
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=jsonable_encoder({"status_code": exc.status_code, "msg": exc.msg}),
    )


@app.exception_handler(InvalidDatasetException)
async def validation_exception_handler(request: Request, exc: InvalidDatasetException):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=jsonable_encoder({"status_code": exc.status_code, "msg": exc.msg}),
    )


@app.exception_handler(InternalException)
async def validation_exception_handler(request: Request, exc: InternalException):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=jsonable_encoder({"status_code": exc.status_code, "msg": exc.msg}),
    )


@app.exception_handler(PredictionException)
async def validation_exception_handler(request: Request, exc: PredictionException):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=jsonable_encoder({"status_code": exc.status_code, "msg": exc.msg}),
    )


@app.exception_handler(APIException)
async def validation_exception_handler(request: Request, exc: APIException):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=jsonable_encoder({"status_code": exc.status_code, "msg": exc.msg}),
    )


@app.exception_handler(NotYetImplementedException)
async def validation_exception_handler(request: Request, exc: NotYetImplementedException):
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        content=jsonable_encoder({"status_code": exc.status_code, "msg": exc.msg}),
    )

if settings.backend_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        # allow_origins=["*"],
        allow_origins=[str(origin) for origin in settings.backend_cors_origins],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
app.include_router(predictor.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
