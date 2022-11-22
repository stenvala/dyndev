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

    notes: str

    status: TaskStatusEnum
    category_id: str

    last_updated: int

    @staticmethod
    def pk() -> str:
        return f"TASK"

    @staticmethod
    def sk(id: str) -> str:
        return f"ID#{id}"

    # Use this index to query by kind
    @staticmethod
    def gsi1pk(status: str) -> str:
        return f"TASK#TASK_STATUS#{status}"

    @staticmethod
    def gsi1sk(last_updated: str) -> str:
        return f"UPDATED#{last_updated}"

    # Use this index to query by category
    @staticmethod
    def gsi2pk(category_id: str) -> str:
        return f"TASK#TASK_CATEGORY#{category_id}"

    @staticmethod
    def gsi2sk(last_updated: str) -> str:
        return f"UPDATED#{last_updated}"

    def recompute_gsi_keys(self) -> None:
        self.GSI1PK = TaskDB.gsi1pk(self.status)
        self.GSI1SK = TaskDB.gsi1sk(self.last_updated)
        self.GSI2PK = TaskDB.gsi2pk(self.category_id)
        self.GSI2SK = TaskDB.gsi2sk(self.last_updated)
