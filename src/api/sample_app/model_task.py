from .model_base import BaseDB
from enum import Enum


class TaskStatusEnum(str, Enum):
    IMPORTANT = "IMPORTANT"
    PENDING = "PENDING"
    WAITING_FOR_INPUT = "WAITING_FOR_INPUT"
    DONE = "DONE"


class TaskDB(BaseDB):
    TYPE = "TASK"

    name: str

    status: TaskStatusEnum
    category_id: str

    last_updated: int

    @staticmethod
    def pk() -> str:
        return f"TASK"

    @staticmethod
    def sk(id: str) -> str:
        return f"TASK_ID#{id}"

    # Use this index to query by kind
    @staticmethod
    def gsi1pk(status: str) -> str:
        return f"TASK_STATUS#{status}"

    @staticmethod
    def gsi1sk(last_updated: str) -> str:
        return f"UPDATED#{last_updated}"

    # Use this index to query by category
    @staticmethod
    def gsi2pk(category_id: str) -> str:
        return f"TASK_CATEGORY#{category_id}"

    @staticmethod
    def gsi2sk(last_updated: str) -> str:
        return f"UPDATED#{last_updated}"
