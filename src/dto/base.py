from typing import Any, Dict
from humps import camelize
from pydantic import BaseModel


def to_camel(string):
    return camelize(string)


class BaseDTO(BaseModel):
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True

    def dict(self, *args, **kwargs) -> Dict[str, Any]:
        _ignored = kwargs.pop("exclude_none")
        return super().dict(*args, exclude_none=True, **kwargs)
