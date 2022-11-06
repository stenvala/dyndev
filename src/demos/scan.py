import json

from shared.dynamo.client import get_table
from decimal import Decimal
from boto3.dynamodb.conditions import Key, Attr


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


table_name = "ILMO"


table = get_table(table_name)

data = table.scan(
    Limit=6,
    FilterExpression=Attr("TYPE").ne("USER")
    & Attr("slave_given_name").contains("Keijo"),
)

print(json.dumps(data["Items"], indent=2, cls=DecimalEncoder))
