from typing import Optional
from dto.base import BaseDTO
from shared.enums import StatusEnum


class StatusDTO(BaseDTO):
    msg: Optional[str]
    id: Optional[str]
    status: StatusEnum
