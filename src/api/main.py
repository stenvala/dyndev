from fastapi import FastAPI
from api.table import router as table_route

app = FastAPI(title="Dynamo DB developer's app")


@app.get("/api/")
async def hello_world():
    return {"message": "Hello World!"}


app.include_router(table_route, prefix="/api/tables")
