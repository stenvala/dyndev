from typing import List
from shared.dynamo.client import get_table
import json
from decimal import Decimal


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
