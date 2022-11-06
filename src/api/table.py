from fastapi import APIRouter
from api.bl.bl_search_in_table import bl_scan
from api.bl.bl_solve_schema import bl_solve_schema
from dto.table import (
    TableDTO,
    TableItemsDTO,
    TableScanRequestDTO,
    TableSchemaDTO,
    TablesDTO,
)
from shared.dynamo.client import get_client


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
