from fastapi import APIRouter
from api.bl.bl_search_in_table import bl_get, bl_query, bl_scan
from api.bl.bl_solve_schema import bl_solve_schema
from dto.guide import FileDTO
from dto.status import StatusDTO
from dto.table import (
    TableDTO,
    TableItemDTO,
    TableItemRequestDTO,
    TableItemsDTO,
    TableQueryRequestDTO,
    TableScanRequestDTO,
    TableSchemaDTO,
    TablesDTO,
)
from shared.dynamo.client import get_client
from shared.dynamo.common import put_item, remove_item
from shared.enums import StatusEnum
from pathlib import Path

router = APIRouter()


@router.get("/get-file-content/{file}", response_model=FileDTO)
async def get_file_content(file: str) -> FileDTO:
    location = Path(__file__).absolute().parent / "sample_app" / f"{file}.py"
    with open(location) as f:
        content = f.read()
    return FileDTO(content=content)
