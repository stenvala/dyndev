from typing import Any, Dict, List
from humps import camelize
from pydantic import BaseModel

from api.sample_app.model_task import TaskStatusEnum


def to_camel(string):
    return camelize(string)


class BaseDTO(BaseModel):
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True

    def dict(self, *args, **kwargs) -> Dict[str, Any]:
        if "exclude_none" in kwargs:
            _ignored = kwargs.pop("exclude_none")
        return super().dict(*args, exclude_none=True, **kwargs)


class CreateTaskCategoryDTO(BaseDTO):
    name: str


class TaskCategoryDTO(BaseDTO):
    id: str
    name: str


class TaskCategoriesDTO(BaseDTO):
    collection: List[TaskCategoryDTO]


class CreateTaskDTO(BaseDTO):
    name: str
    notes: str
    status: TaskStatusEnum


class TaskDTO(BaseDTO):
    id: str
    name: str
    notes: str
    status: TaskStatusEnum
    category_id: str
    last_updated: int


class TasksDTO(BaseDTO):
    collection: list[TaskDTO]
