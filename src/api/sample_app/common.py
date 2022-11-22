import uuid
import time


def get_id() -> str:
    return str(uuid.uuid4())


def get_now() -> int:
    return round(time.time() * 1000)
