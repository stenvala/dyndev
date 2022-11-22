from typing import Union
from .model_base import BaseDB
from .client import get_table


def put_item(table_name: str, item: Union[dict, BaseDB]) -> None:
    if not isinstance(item, dict):
        item = item.to_exclude_none_dict()
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
