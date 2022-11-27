from fastapi import FastAPI
from api.table import router as table_router
from api.guide import router as guide_router
from api.sample_app.api import router as sample_app_router
from shared.env import get_required_token
from api.auth_middleware import add_auth_mw
import os
from Crypto.Cipher import AES
import base64

app = FastAPI(title="Dynamo DB developer's app")

add_auth_mw(app)

KEY = "VerySecretKeyIHopeNobodyFinds123"


@app.get("/api/")
async def hello_world():
    return {"message": "Hello World!"}


@app.get("/api/does-use-token", tags=["EXCLUDE"])
async def is_token_in_use():
    license = os.environ.get(
        "DYNDEV_LICENSE",
        "",
    )
    obj = AES.new(KEY, AES.MODE_CBC, "This is an IV456")
    license_str = (
        obj.decrypt(bytes(base64.b64decode(license))).decode("utf-8").strip()
        if license != ""
        else "This software is unlicensed! You may still have permission to use it for free."
    )
    return {"is": get_required_token() != "", "licenseText": license_str}


app.include_router(table_router, prefix="/api/tables")
app.include_router(guide_router, prefix="/api/guide")
app.include_router(sample_app_router, prefix="/api/sample-app")
