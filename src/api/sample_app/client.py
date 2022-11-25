import boto3
import os
from mypy_boto3_dynamodb import DynamoDBClient, DynamoDBServiceResource
from mypy_boto3_dynamodb.service_resource import Table


def get_url() -> str:
    return os.environ.get("DYNAMO_HOST", "localhost")


def get_port() -> str:
    return os.environ.get("DYNAMO_PORT", 8000)


def get_client() -> DynamoDBClient:
    return boto3.client(
        "dynamodb",
        endpoint_url=f"http://{get_url()}:{get_port()}",
        region_name="us-east-1",
        aws_access_key_id="anything",
        aws_secret_access_key="anything",
    )


def get_resource() -> DynamoDBServiceResource:
    return boto3.resource(
        "dynamodb",
        endpoint_url=f"http://{get_url()}:{get_port()}",
        region_name="us-east-1",
        aws_access_key_id="anything",
        aws_secret_access_key="anything",
    )


def get_table(table_name: str) -> Table:
    return get_resource().Table(table_name)
