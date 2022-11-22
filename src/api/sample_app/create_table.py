from mypy_boto3_dynamodb import DynamoDBClient


def create_table(
    client: DynamoDBClient, table_name: str, gsi_count: int
) -> None:
    attribute_definitions = [
        {"AttributeName": "PK", "AttributeType": "S"},
        {"AttributeName": "SK", "AttributeType": "S"},
    ]
    gsis = []
    for i in range(1, gsi_count + 1):
        attribute_definitions.append(
            {"AttributeName": f"GSI{i}PK", "AttributeType": "S"}
        )
        attribute_definitions.append(
            {"AttributeName": f"GSI{i}SK", "AttributeType": "S"}
        )
        gsis.append(
            {
                "IndexName": f"GSI{i}",
                "KeySchema": [
                    {"AttributeName": f"GSI{i}PK", "KeyType": "HASH"},
                    {"AttributeName": f"GSI{i}SK", "KeyType": "RANGE"},
                ],
                "Projection": {"ProjectionType": "ALL"},
                # Locally this doesn't matter, but don't use provisioned capacity in AWS
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 100,
                    "WriteCapacityUnits": 100,
                },
            }
        )

    client.create_table(
        TableName=table_name,
        KeySchema=[
            {"AttributeName": "PK", "KeyType": "HASH"},
            {"AttributeName": "SK", "KeyType": "RANGE"},
        ],
        AttributeDefinitions=attribute_definitions,
        GlobalSecondaryIndexes=gsis,
        BillingMode="PAY_PER_REQUEST",  # Use ON_DEMAND in AWS
        Tags=[
            {"Key": "ROLE", "Value": "DB"},
        ],
    )
