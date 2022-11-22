from typing import Union, List, Any


def pascal_to_camel(key: str) -> str:
    return key[0].lower() + key[1:]


def pascal_to_camel_obj(
    obj: Union[dict, List[dict], Any]
) -> Union[dict, List[dict], Any]:
    if isinstance(obj, list):
        return [pascal_to_camel_obj(i) for i in obj]
    elif not isinstance(obj, dict):
        return obj
    return {pascal_to_camel(k): pascal_to_camel_obj(v) for k, v in obj.items()}
