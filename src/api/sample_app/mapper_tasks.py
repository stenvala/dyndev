from .model_task import TaskDB
from .dtos import CreateTaskCategoryDTO, CreateTaskDTO
from .model_task_category import TaskCategoryDB
from .common import get_id, get_now


def mapper_category_dto_to_db(dto: CreateTaskCategoryDTO) -> TaskCategoryDB:
    id = get_id()
    return TaskCategoryDB(
        **dto.dict(),
        PK=TaskCategoryDB.pk(),
        SK=TaskCategoryDB.sk(id),
        id=id,
    )


def mapper_create_task_dto_to_db(
    dto: CreateTaskDTO, category_id: str
) -> TaskDB:
    now = get_now()
    id = get_id()
    return TaskDB(
        **dto.dict(),
        category_id=category_id,
        id=id,
        last_updated=now,
        PK=TaskDB.pk(),
        SK=TaskDB.sk(id),
        GSI1PK=TaskDB.gsi1pk(dto.status),
        GSI1SK=TaskDB.gsi1sk(now),
        GSI2PK=TaskDB.gsi2pk(category_id),
        GSI2SK=TaskDB.gsi2sk(now),
    )
