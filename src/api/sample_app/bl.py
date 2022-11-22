from api.sample_app.client import get_table
from api.sample_app.common import get_now
from api.sample_app.dtos import TaskDTO
from api.sample_app.model_task import TaskDB
from shared.dynamo.common import put_item
from . import const


def bl_edit_task(task: TaskDTO) -> TaskDB:
    table = get_table(const.TABLE_NAME)
    response = table.get_item(Key={"PK": TaskDB.pk(), "SK": TaskDB.sk(task.id)})
    response["Item"].update(task.dict())
    db_object = TaskDB(**response["Item"])
    db_object.last_updated = get_now()
    db_object.recompute_gsi_keys()
    put_item(const.TABLE_NAME, db_object.to_exclude_none_dict())
    return db_object
