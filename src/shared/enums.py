from enum import Enum


class StatusEnum(str, Enum):
    OK = "OK"
    FAILED = "FAILED"


class FilterConditionEnum(str, Enum):
    BEGINS_WITH = "BEGINS_WITH"
    BETWEEN = "BETWEEN"
    CONTAINS = "CONTAINS"
    EQ = ("EQ",)
    EXISTS = "EXISTS"
    GT = "GT"
    GTE = "GTE"
    IS_IN = "IS_IN"
    LT = "LT"
    LTE = "LTE"
    NE = "NE"
    NOT_EXISTS = "NOT_EXISTS"
