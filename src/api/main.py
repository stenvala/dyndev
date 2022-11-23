from fastapi import FastAPI
from api.table import router as table_router
from api.guide import router as guide_router
from api.sample_app.api import router as sample_app_router
from shared.env import get_required_token
from api.auth_middleware import add_auth_mw

app = FastAPI(title="Dynamo DB developer's app")

add_auth_mw(app)


@app.get("/api/")
async def hello_world():
    return {"message": "Hello World!"}


@app.get("/api/does-use-token", tags=["EXCLUDE"])
async def is_token_in_use():
    return {"is": get_required_token() != ""}


app.include_router(table_router, prefix="/api/tables")
app.include_router(guide_router, prefix="/api/guide")
app.include_router(sample_app_router, prefix="/api/sample-app")
