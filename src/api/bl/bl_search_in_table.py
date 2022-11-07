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

from shared.dynamo.common import sanitize_output
from shared.enums import FilterConditionEnum


def bl_scan(table_name: str, dto: TableScanRequestDTO) -> TableItemsDTO:
    table = get_table(table_name)
    kwargs = {}
    if dto.filter_variable:
        kwargs["ExpressionAttributeNames"] = {"#field": dto.filter_variable}
        if dto.filter_condition == FilterConditionEnum.EQ:
            kwargs["ExpressionAttributeValues"] = {
                ":value": dto.filter_value[0]
            }
            kwargs["FilterExpression"] = "#field = :value"
    data = table.scan(**kwargs)
    return TableItemsDTO(items=sanitize_output(data["Items"]))


def bl_query(table_name: str, dto: TableQueryRequestDTO) -> TableItemsDTO:
    table = get_table(table_name)
    kwargs = {
        "KeyConditions": {
            dto.pk: {
                "AttributeValueList": [dto.pk_value],
                "ComparisonOperator": "EQ",
            }
        }
    }
    if dto.index_name:
        kwargs["IndexName"] = dto.index_name
    if dto.sk_value:
        kwargs["KeyConditions"][dto.sk] = {
            "AttributeValueList": [dto.sk_value],
            "ComparisonOperator": dto.sk_condition,
        }
    data = table.query(**kwargs)
    return TableItemsDTO(items=sanitize_output(data["Items"]))


def bl_get(table_name: str, dto: TableItemRequestDTO) -> TableItemDTO:
    table = get_table(table_name)
    response = table.get_item(Key={dto.pk: dto.pk_value, dto.sk: dto.sk_value})
    return TableItemDTO(item=sanitize_output(response["Item"]))
