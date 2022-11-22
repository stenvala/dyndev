from typing import Optional
from pydantic import BaseModel
import json
from decimal import Decimal


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


class BaseDB(BaseModel):

    TYPE: str
    PK: str
    SK: str
    GSI1PK: Optional[str]
    GSI1SK: Optional[str]
    GSI2PK: Optional[str]
    GSI2SK: Optional[str]
    GSI3PK: Optional[str]
    GSI3SK: Optional[str]

    id: str

    vrs: Optional[str]
    destroy_time: Optional[int]

    def to_exclude_none_dict(self) -> dict:
        return json.loads(
            json.dumps(self.dict(exclude_none=True), cls=DecimalEncoder),
            parse_float=Decimal,
        )
