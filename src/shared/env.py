import os


def get_required_token():
    return os.environ.get("DYNDEV_TOKEN", "token")
