from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import traceback
import os
from shared.env import get_required_token


def add_auth_mw(app: FastAPI):
    @app.middleware("http")
    async def auth(request: Request, call_next):
        required_token = get_required_token()
        print(request.url.path)
        if (
            required_token != ""
            and not request.url.path.startswith("/openapi.json")
            and request.url.path != "/api/does-use-token"
        ):
            sent_token = request.headers.get("authorization", "").replace(
                "Token ", ""
            )
            if sent_token != required_token:
                return JSONResponse(
                    status_code=401, content={"detail": "UNAUTHORIZED"}
                )
        return await call_next(request)
