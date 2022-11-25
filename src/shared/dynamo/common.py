import operator
from typing import List
from dto.table import TableIndexDTO, TableIndicesDTO, TableKeySchemaDTO
from shared.case_converters import pascal_to_camel_obj
from shared.dynamo.client import get_table, get_client
import json
from decimal import Decimal

PRIMARY_INDEX_NAME = "PRIMARY"

def get_all_items(table_name: str) -> List[dict]:
    table = get_table(table_name)
    response = table.scan()
    data = response.get("Items")
    while "LastEvaluatedKey" in response:
        response = table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
        data.extend(response["Items"])
    return data


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


def sanitize_output(data: List[dict]) -> List[dict]:
    return json.loads(json.dumps(data, cls=DecimalEncoder))


def put_item(table_name: str, item: dict) -> None:
    table = get_table(table_name)
    response = table.put_item(
        Item={k: v for k, v in item.items() if v is not None}
    )


def remove_item(
    table_name: str, pk: str, sk: str, pk_key: str = "PK", sk_key: str = "SK"
) -> None:
    table = get_table(table_name)
    response = table.delete_item(
        Key={
            pk_key: pk,
            sk_key: sk,
        }
    )


def remove_table(table_name: str) -> None:
    client = get_client()
    response = client.delete_table(TableName=table_name)


def get_indices(table_name: str) -> TableIndicesDTO:
    table = get_table(table_name)
    indices = table.global_secondary_indexes
    if indices is None:
        return TableIndicesDTO(collection=[])
    indices.sort(key=operator.itemgetter("IndexName"))
    indices = TableIndicesDTO(collection=pascal_to_camel_obj(indices))
    indices.collection = [
        TableIndexDTO(
            index_name=PRIMARY_INDEX_NAME,
            index_size_bytes=table.table_size_bytes,
            item_count=table.item_count,
            key_schema=[pascal_to_camel_obj(i) for i in table.key_schema],
        )
    ] + indices.collection
    return indices
