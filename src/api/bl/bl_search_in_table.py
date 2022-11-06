from dto.table import TableItemsDTO, TableScanRequestDTO
from shared.dynamo.client import get_table
import json

from shared.dynamo.common import sanitize_output


def bl_scan(table_name: str, dto: TableScanRequestDTO) -> TableItemsDTO:
    table = get_table(table_name)

    data = table.scan()
    print(sanitize_output(data["Items"]))
    return TableItemsDTO(items=sanitize_output(data["Items"]))
