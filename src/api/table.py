from typing import List
from fastapi import APIRouter, Request
from dto.table import AddRowDTO, TableDTO, TablesDTO
import boto3
import os

from shared.enums import StatusEnum


router = APIRouter()


@router.get("/list", response_model=TablesDTO)
async def get_tables() -> TablesDTO:
    url = os.environ.get("DYNAMO_HOST", "localhost")
    port = os.environ.get("DYNAMO_PORT", 8000)
    print(url)
    print(port)

    # For a Boto3 client.
    ddb = boto3.client(
        "dynamodb",
        endpoint_url=f"http://{url}:{port}",
        region_name="us-east-1",
        aws_access_key_id="anything",
        aws_secret_access_key="anything",
    )
    response = ddb.list_tables()

    return TablesDTO(
        collection=[TableDTO(table=i) for i in response["TableNames"]]
    )


@router.delete("/table/{table}", response_model=StatusEnum)
async def remove_table(table: str) -> StatusEnum:
    url = os.environ.get("DYNAMO_HOST", "localhost")
    port = os.environ.get("DYNAMO_PORT", 8000)
    print(url)
    print(port)

    # For a Boto3 client.
    ddb = boto3.client(
        "dynamodb",
        endpoint_url=f"http://{url}:{port}",
        region_name="us-east-1",
        aws_access_key_id="anything",
        aws_secret_access_key="anything",
    )
    response = ddb.list_tables()

    return TablesDTO(
        collection=[TableDTO(table=i) for i in response["TableNames"]]
    )

@router.post("/table/{table}/add-row", response_model=StatusEnum)
async def add_row(table: str, body: AddRowDTO) -> StatusEnum:
    url = os.environ.get("DYNAMO_HOST", "localhost")
    port = os.environ.get("DYNAMO_PORT", 8000)
    print(url)
    print(port)

    # For a Boto3 client.
    ddb = boto3.client(
        "dynamodb",
        endpoint_url=f"http://{url}:{port}",
        region_name="us-east-1",
        aws_access_key_id="anything",
        aws_secret_access_key="anything",
    )
    response = ddb.list_tables()

    return TablesDTO(
        collection=[TableDTO(table=i) for i in response["TableNames"]]
    )
