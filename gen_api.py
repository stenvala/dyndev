import subprocess
from pathlib import Path
from typing import Dict, List, Set, TypedDict, Union
import requests
import json
import re

"""
The ultimate script to create angular api services from FastApi openapi definitions.
We use opeanapi-generate-cli for models, but that's not adequate for api services.
Therefore, we have custom code for api service generation.
"""

SRC = Path(__file__).absolute().parent / "src" / "ui"
URL = "http://localhost:8001/openapi.json"
GEN = Path(__file__).absolute().parent / "src" / "ui" / "src" / "gen"
GEN.mkdir(exist_ok=True)


# Removes all those models that are not used, this kidn of recursion is ok because there can't be cyclic dependencies
def recursively_solve_used(used: Set[str], models: Path) -> Set[str]:
    allowed = set([i.upper() for i in list(used)])
    return_used = [i for i in used]
    for i in models.glob("*.ts"):
        key = str(i).replace(".ts", "").upper().split("/")[-1]
        if key in allowed:
            with open(i) as f:
                content = f.readlines()
            new_allowed = []
            for l in content:
                found = re.search("from\s'\./(.*)'", l)
                if found and found.groups()[0].upper() not in return_used:
                    new_allowed.append(found.groups()[0])
            if len(new_allowed) > 0:
                return_used += list(
                    recursively_solve_used(set(new_allowed), models)
                )

    return set(return_used)


def create_models(used: Set[str]):
    models = GEN / "models"
    models.mkdir(exist_ok=True)
    subprocess.check_call(f"rm -rf {models}/*.ts", shell=True)
    models.mkdir(exist_ok=True)

    subprocess.check_call(
        f"npx openapi-generator-cli generate -i {URL} -g typescript-angular -o ./tmp",
        shell=True,
        cwd=SRC,
    )
    subprocess.check_call(f"mv ./tmp/model/* {models}", cwd=SRC, shell=True)
    subprocess.check_call(f"rm -rf ./tmp", cwd=SRC, shell=True)
    subprocess.check_call(f"mv models.ts index.ts", cwd=models, shell=True)
    used = recursively_solve_used(used, models)
    allowed = set([i.upper() for i in list(used)])
    for i in models.glob("*.ts"):
        key = str(i).replace(".ts", "").upper().split("/")[-1]
        if key not in allowed:
            subprocess.check_call(f"rm -rf {i}", shell=True)
    # Write index
    exports = []
    for i in models.glob("*.ts"):
        key = str(i).replace(".ts", "").split("/")[-1]
        exports.append(key)
    with open(models / "index.ts", "w") as f:
        f.write("\n".join([f"export * from './{i}'" for i in exports]))


class Service(TypedDict):
    name: str
    imports: List[str]
    code: str


def get_response_dto(item: dict) -> Union[str, None]:
    ref = (
        item.get("responses", {})
        .get("200", {})
        .get("content", {})
        .get("application/json", {})
        .get("schema", {})
        .get("$ref", "")
    )
    if ref == "":
        return None
    return ref.split("/")[-1]


def get_request_dto(item: dict) -> Union[str, None]:
    ref = (
        item.get("requestBody", {})
        .get("content", {})
        .get("application/json", {})
        .get("schema", {})
        .get("$ref", "")
    )
    if ref == "":
        return None
    return ref.split("/")[-1]


def get_path_parameters(item: dict) -> Dict[str, str]:
    def get_ts_type(t: str) -> str:
        return t

    return {
        i["name"]: get_ts_type(i["schema"]["type"])
        for i in item.get("parameters", [])
    }


def find_service(path: str, item: dict) -> Union[Service, None]:
    service = [i for i in path.split("/") if i != ""]
    # Service name is always in the second path. It's like /api/{service-name}/...
    if len(service) < 2:
        return None
    name = service[1]
    method = list(item.keys())[0]
    definition = list(item.values())[0]
    response_dto = get_response_dto(definition)
    request_dto = get_request_dto(definition)
    path_params = get_path_parameters(definition)
    summary = definition["summary"].split(" ")
    method_name = "".join([summary[0].lower()] + summary[1:])
    path_params_to_subs = "{" + (",".join(path_params.keys())) + "}"
    params = [f"{k}: {v}" for k, v in path_params.items()]
    http_params = ["url"]
    if request_dto is not None:
        params.append(f"dto: {request_dto}")
        http_params.append("dto")
    params_str = ",".join(params)
    http_params_str = ",".join(http_params)
    sub_path = path.replace("{", ":").replace("}", "")
    return {
        "name": name,
        "imports": [i for i in [response_dto, request_dto] if i is not None],
        "code": "\n".join(
            [
                f"{method_name}({params_str}): Observable<{response_dto}> {{",
                f'const url = subsToUrl("{sub_path}", {path_params_to_subs});',
                f"return this.http.{method}<{response_dto}>({http_params_str});",
                "}",
            ]
        ),
    }


def camel_to_kebab(string: str) -> str:
    string = re.sub("(.)([A-Z][a-z]+)", r"\1-\2", string)
    return re.sub("([a-z0-9])([A-Z])", r"\1-\2", string).lower()


def create_api() -> Set[str]:
    schema = requests.get(URL).json()
    # print(json.dumps(schema, indent=2))
    services = {}
    apis = GEN / "apis"
    apis.mkdir(exist_ok=True)
    subprocess.check_call(f"rm -rf {apis}/*.ts", shell=True)
    apis.mkdir(exist_ok=True)
    for path, item in schema["paths"].items():
        service = find_service(path, item)
        if service is None:
            continue
        if service["name"] not in services:
            services[service["name"]] = {"code": [], "imports": []}
        services[service["name"]]["code"].append(service["code"])
        services[service["name"]]["imports"] += service["imports"]
    files = []
    all_imports = []
    for service, methods in services.items():
        dto_imports = list(set(methods["imports"]))
        dto_imports.sort()
        all_imports += dto_imports
        service_code = methods["code"]
        service_code.sort()
        service_name = f"{service.capitalize()}ApiService"
        code = (
            """// This file is automatically generated. Don't edit.
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { subsToUrl } from "./../subs-to-url.func";
import {
"""
            + (",".join(dto_imports))
            + """
} from "../models/index";

@Injectable({
  providedIn: "root",
})
export class """
            + service_name
            + """ {
    constructor(private http: HttpClient) {}

    """
            + ("\n\n".join(service_code))
            + "}"
        )
        file_name = camel_to_kebab(service) + "-api.service.ts"
        with open(apis / file_name, "w") as f:
            f.write(code)
        files.append(file_name.replace(".ts", ""))
    with open(apis / "index.ts", "w") as f:
        f.write("\n".join([f"export * from './{i}';" for i in files]))
    subprocess.check_call(
        "npx prettier *.ts --write ",
        shell=True,
        universal_newlines=True,
        cwd=apis,
    )

    return set(all_imports)


if __name__ == "__main__":
    used_imports = create_api()
    create_models(used_imports)
