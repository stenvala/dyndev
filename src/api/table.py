from fastapi import APIRouter
from api.bl.bl_search_in_table import bl_get, bl_query, bl_scan
from api.bl.bl_solve_schema import bl_solve_schema
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


router = APIRouter()


@router.get("/list", response_model=TablesDTO)
async def get_tables() -> TablesDTO:
    response = get_client().list_tables()
    return TablesDTO(
        collection=[TableDTO(table=i) for i in response["TableNames"]]
    )


@router.get("/table/{table}/schema", response_model=TableSchemaDTO)
async def get_table_schema(table: str) -> TableSchemaDTO:
    return bl_solve_schema(table)


@router.post("/table/{table}/scan", response_model=TableItemsDTO)
async def scan_table(table: str, dto: TableScanRequestDTO) -> TableItemsDTO:
    return bl_scan(table, dto)


@router.post("/table/{table}/query", response_model=TableItemsDTO)
async def query_table(table: str, dto: TableQueryRequestDTO) -> TableItemsDTO:
    return bl_query(table, dto)


@router.post("/table/{table}/get", response_model=TableItemDTO)
async def get_table(table: str, dto: TableItemRequestDTO) -> TableItemDTO:
    return bl_get(table, dto)


@router.post("/table/{table}/save", response_model=TableItemDTO)
async def save_item(table: str, dto: TableItemDTO) -> TableItemDTO:
    put_item(table, dto.item)
    return dto


@router.post("/table/{table}/delete-item", response_model=StatusDTO)
async def delete_item(table: str, dto: TableItemRequestDTO) -> StatusDTO:
    remove_item(table, dto.pk_value, dto.sk_value, dto.pk, dto.sk)
    return StatusDTO(status=StatusEnum.OK)
