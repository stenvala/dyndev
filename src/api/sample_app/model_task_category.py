from .model_base import BaseDB


class TaskCategoryDB(BaseDB):
    TYPE = "TASK_CATEGORY"

    name: str

    @staticmethod
    def pk() -> str:
        return "TASK_CATEGORY"

    @staticmethod
    def sk(name: str) -> str:
        return f"TASK_CATEGORY#{name}"
