from dto.table import TableSchemaDTO
from shared.dynamo.common import get_all_items
from dto.table import (
    RowSchemaDTO,
    TableSchemaDTO,
)


def solve_key_definition(key: str, data: dict) -> str:
    target = f"{data[key]}"
    values = target.split("#")
    new_target = []
    data_values = set(
        [
            f"{v}".lower()
            for k, v in data.items()
            if not (
                k.upper() == k
            )  # THESE ARE CONTROL FIELDS AND NOT ALLOWED IN SCHEMA
        ]
    )
    for part in values:
        if f"{part}".lower() in data_values:
            print(f"{part} WAS FOUND")
            field_name = next(
                (
                    k
                    for k, v in data.items()
                    if f"{part}".lower() == f"{v}".lower()
                ),
                None,
            )
            if field_name is None:
                new_target.append(part)
            else:
                value = data[field_name]
                if f"{value}".isnumeric():
                    new_target.append(f":{field_name}")
                elif f"{value}" == f"{part}":
                    new_target.append(f":{field_name}")
                elif f"{value}".lower() == part:
                    new_target.append(f":LOWER({field_name})")
                elif f"{value}".upper() == part:
                    new_target.append(f":UPPER({field_name})")
                else:
                    new_target.append("!ERROR!")
        else:
            new_target.append(part)
    return "#".join(new_target)


def bl_solve_schema(table_name: str) -> TableSchemaDTO:
    all_items = get_all_items(table_name)
    types = {}
    for i in all_items:
        current_type = i.get("TYPE")
        if not current_type or current_type in types:
            continue
        pk = solve_key_definition("PK", i)
        sk = solve_key_definition("SK", i)
        row_schema = RowSchemaDTO(type=current_type, PK=pk, SK=sk, sample=i)
        for n in range(1, 5):
            if f"GSI{n}PK" in i:
                print(i)
                setattr(
                    row_schema,
                    f"GSI{n}PK",
                    solve_key_definition(f"GSI{n}PK", i),
                )
                setattr(
                    row_schema,
                    f"GSI{n}SK",
                    solve_key_definition(f"GSI{n}SK", i),
                )
        types[current_type] = row_schema
    types = list(types.values())
    types = sorted(types, key=lambda k: k.type)
    return TableSchemaDTO(types=types)
