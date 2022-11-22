from .model_base import BaseDB


class TaskCategoryDB(BaseDB):
    TYPE = "TASK_CATEGORY"

    name: str

    @staticmethod
    def pk() -> str:
        return "TASK_CATEGORY"

    @staticmethod
    def sk(id: str) -> str:
        return f"ID#{id}"
