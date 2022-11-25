from typing import Any, List, Optional
from dto.base import BaseDTO
from shared.enums import FilterConditionEnum, QueryConditionEnum


class TableDTO(BaseDTO):
    table: str


class TablesDTO(BaseDTO):
    collection: List[TableDTO]


class AddRowDTO(BaseDTO):
    data: dict


class RowSchemaDTO(BaseDTO):
    type: str
    PK: str
    SK: str
    GSI1PK: Optional[str]
    GSI1SK: Optional[str]
    GSI2PK: Optional[str]
    GSI2SK: Optional[str]
    GSI3PK: Optional[str]
    GSI3SK: Optional[str]
    GSI4PK: Optional[str]
    GSI4SK: Optional[str]
    GSI5PK: Optional[str]
    GSI5SK: Optional[str]
    sample: dict


class TableSchemaDTO(BaseDTO):
    types: List[RowSchemaDTO]


class TableScanRequestDTO(BaseDTO):
    filter_variable: Optional[str]
    filter_value: Optional[List[Any]]
    filter_condition: Optional[FilterConditionEnum]
    last_key: Optional[str]


class TableQueryRequestDTO(BaseDTO):
    pk: str
    pk_value: str
    sk: Optional[str]
    sk_value: Optional[str]
    sk_condition: Optional[QueryConditionEnum]
    index_name: Optional[str]
    last_key: Optional[str]


class TableItemsDTO(BaseDTO):
    items: List[dict]
    last_key: Optional[str]


class TableItemRequestDTO(BaseDTO):
    pk: str
    pk_value: str
    sk: str
    sk_value: str


class TableItemDTO(BaseDTO):
    item: dict


class TableKeySchemaDTO(BaseDTO):
    attribute_name: str
    key_type: str


class TableIndexDTO(BaseDTO):
    index_name: str
    key_schema: List[TableKeySchemaDTO]
    index_size_bytes: int
    item_count: int


class TableIndicesDTO(BaseDTO):
    collection: List[TableIndexDTO]
