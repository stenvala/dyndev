from boto3.dynamodb.conditions import Attr, Key
from dto.table import (
    TableItemDTO,
    TableItemRequestDTO,
    TableItemsDTO,
    TableQueryRequestDTO,
    TableScanRequestDTO,
)
from shared.dynamo.client import get_table
import json

from shared.dynamo.common import sanitize_output, PRIMARY_INDEX_NAME
from shared.enums import FilterConditionEnum


def bl_scan(table_name: str, dto: TableScanRequestDTO) -> TableItemsDTO:
    table = get_table(table_name)
    kwargs = {"Limit": 1000}
    if dto.last_key:
        kwargs["ExclusiveStartKey"] = json.loads(dto.last_key)
    if dto.filter_variable:
        kwargs["ExpressionAttributeNames"] = {"#field": dto.filter_variable}
        if dto.filter_condition == FilterConditionEnum.EQ:
            kwargs["ExpressionAttributeValues"] = {
                ":value": dto.filter_value[0]
            }
            kwargs["FilterExpression"] = "#field = :value"
    data = table.scan(**kwargs)
    last_key = data.get("LastEvaluatedKey")
    return TableItemsDTO(
        items=sanitize_output(data["Items"]),
        last_key=json.dumps(last_key) if last_key is not None else None,
    )


def bl_query(table_name: str, dto: TableQueryRequestDTO) -> TableItemsDTO:
    table = get_table(table_name)

    kwargs = {
        "Limit": 1000,
        "KeyConditions": {
            dto.pk: {
                "AttributeValueList": [dto.pk_value],
                "ComparisonOperator": "EQ",
            }
        },
    }
    if dto.index_name and dto.index_name != PRIMARY_INDEX_NAME:
        kwargs["IndexName"] = dto.index_name
    if dto.sk_value:
        kwargs["KeyConditions"][dto.sk] = {
            "AttributeValueList": [dto.sk_value],
            "ComparisonOperator": dto.sk_condition,
        }
    if dto.last_key:
        kwargs["ExclusiveStartKey"] = json.loads(dto.last_key)
    data = table.query(**kwargs)
    last_key = data.get("LastEvaluatedKey")
    return TableItemsDTO(
        items=sanitize_output(data["Items"]),
        last_key=json.dumps(last_key) if last_key is not None else None,
    )


def bl_get(table_name: str, dto: TableItemRequestDTO) -> TableItemDTO:
    table = get_table(table_name)
    response = table.get_item(Key={dto.pk: dto.pk_value, dto.sk: dto.sk_value})
    return TableItemDTO(item=sanitize_output(response["Item"]))
