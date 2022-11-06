from typing import Any, List, Optional
from dto.base import BaseDTO
from shared.enums import FilterConditionEnum


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
    filter_variable: Optional[List[Any]]
    filter_condition: Optional[FilterConditionEnum]


class TableItemsDTO(BaseDTO):
    items: List[dict]
    last_key: Optional[str]
