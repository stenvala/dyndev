from fastapi import FastAPI
from api.table import router as table_router
from api.guide import router as guide_router

app = FastAPI(title="Dynamo DB developer's app")


@app.get("/api/")
async def hello_world():
    return {"message": "Hello World!"}


app.include_router(table_router, prefix="/api/tables")
app.include_router(guide_router, prefix="/api/guide")
