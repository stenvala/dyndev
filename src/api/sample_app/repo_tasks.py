from typing import List, Tuple
from boto3.dynamodb.conditions import Key
from .model_task import TaskDB, TaskStatusEnum
from shared.dynamo.client import get_table
from .model_task_category import TaskCategoryDB
from . import const


def repo_get_task_categories() -> Tuple[List[TaskCategoryDB], str]:
    table = get_table(const.TABLE_NAME)
    data = table.query(
        KeyConditionExpression=Key("PK").eq(TaskCategoryDB.pk()),
    )
    return [TaskCategoryDB(**i) for i in data["Items"]], data.get(
        "LastEvaluatedKey", ""
    )


def repo_get_tasks_of_category(category_id: str) -> Tuple[List[TaskDB], str]:
    table = get_table(const.TABLE_NAME)
    data = table.query(
        IndexName="GSI2",
        KeyConditionExpression=Key("GSI2PK").eq(TaskDB.gsi2pk(category_id)),
    )
    return [TaskDB(**i) for i in data["Items"]], data.get(
        "LastEvaluatedKey", ""
    )


def repo_get_tasks_of_status(
    status: TaskStatusEnum,
) -> Tuple[List[TaskDB], str]:
    table = get_table(const.TABLE_NAME)
    data = table.query(
        IndexName="GSI1",
        KeyConditionExpression=Key("GSI1PK").eq(TaskDB.gsi1pk(status)),
    )
    return [TaskDB(**i) for i in data["Items"]], data.get(
        "LastEvaluatedKey", ""
    )


def repo_get_task(task_id: str) -> TaskDB:
    table = get_table(const.TABLE_NAME)
    response = table.get_item(Key={"PK": TaskDB.pk(), "SK": TaskDB.sk(task_id)})
    return TaskDB(*response["Item"])
