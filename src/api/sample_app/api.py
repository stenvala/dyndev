from fastapi import APIRouter
from api.sample_app.bl import bl_edit_task
from api.sample_app.model_task import TaskDB, TaskStatusEnum

from api.sample_app.repo_tasks import (
    repo_get_task,
    repo_get_task_categories,
    repo_get_tasks_of_category,
    repo_get_tasks_of_status,
)
from api.table import delete_item
from shared.dynamo.common import remove_item
from .dtos import (
    CreateTaskCategoryDTO,
    CreateTaskDTO,
    TaskCategoriesDTO,
    TaskCategoryDTO,
    TaskDTO,
    TasksDTO,
)
from .mapper_tasks import (
    mapper_category_dto_to_db,
    mapper_create_task_dto_to_db,
)
from dto.status import StatusDTO
from shared.enums import StatusEnum
from . import const
from .create_table import create_table as create_table_fun
from .client import get_client
from .dynamo_common import put_item

router = APIRouter()


@router.get("/create-table", response_model=StatusDTO)
async def create_table() -> StatusDTO:
    client = get_client()
    create_table_fun(client, const.TABLE_NAME, 2)
    return StatusDTO(status=StatusEnum.OK)


@router.post("/create-category", response_model=TaskCategoryDTO)
async def create_category(dto: CreateTaskCategoryDTO) -> TaskCategoryDTO:
    db_object = mapper_category_dto_to_db(dto)
    put_item(const.TABLE_NAME, db_object)
    return TaskCategoryDTO(**db_object.to_exclude_none_dict())


@router.get("/categories", response_model=TaskCategoriesDTO)
async def get_categories() -> TaskCategoriesDTO:
    categories, continuation_key = repo_get_task_categories()
    return TaskCategoriesDTO(
        collection=[TaskCategoryDTO(**i.dict()) for i in categories]
    )


@router.post("/category/{category_id}/task", response_model=TaskDTO)
async def create_task(category_id: str, dto: CreateTaskDTO) -> TaskDTO:
    db_object = mapper_create_task_dto_to_db(dto, category_id)
    put_item(const.TABLE_NAME, db_object)
    return TaskDTO(**db_object.dict())


@router.get("/category/{category_id}/tasks", response_model=TasksDTO)
async def get_tasks_of_category(category_id: str) -> TasksDTO:
    tasks, continuation_key = repo_get_tasks_of_category(category_id)
    return TasksDTO(collection=[TaskDTO(**i.dict()) for i in tasks])


@router.get("/status/{status}/tasks", response_model=TasksDTO)
async def get_tasks_of_status(status: str) -> TasksDTO:
    tasks, continuation_key = repo_get_tasks_of_status(status)
    return TasksDTO(collection=[TaskDTO(**i.dict()) for i in tasks])


@router.delete("/task/{task_id}", response_model=StatusDTO)
async def remove_task(task_id: str) -> StatusDTO:
    remove_item(const.TABLE_NAME, TaskDB.pk(), TaskDB.sk(task_id))
    return StatusDTO(status=StatusEnum.OK)


@router.get("/task/{task_id}", response_model=TaskDTO)
async def get_task(task_id: str) -> TaskDTO:
    return TaskDTO(*repo_get_task(task_id))


@router.put("/task/{task_id}", response_model=TaskDTO)
async def edit_task(task_id: str, dto: TaskDTO) -> TaskDTO:
    dto.id = task_id
    db_object = bl_edit_task(dto)
    return TaskDTO(**db_object.dict())
