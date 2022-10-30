from typing import List
from dto.base import BaseDTO


class TableDTO(BaseDTO):
    table: str


class TablesDTO(BaseDTO):
    collection: List[TableDTO]


class AddRowDTO(BaseDTO):
    data: dict
