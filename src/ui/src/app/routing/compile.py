import json
from typing import List, Tuple
import re
import subprocess

with open("routes.json", "r") as f:
    data = json.load(f)


def get_imports(d: dict, parent: dict = None) -> List[str]:
    imports = []
    for v in d.values():
        if "component" in v:
            if not "import" in v:
                v["import"] = parent["import"]
            import_line = (
                f"import {{ { v['component'] } }} from \"{ v['import'] }\";"
            )
            if not import_line in imports:
                imports.append(import_line)
        if "children" in v:
            new_imports = get_imports(v["children"], v)
            imports = list(set(new_imports).union(imports))
    return imports


def get_routes(d: dict, parent: dict = None) -> List[dict]:
    routes = []
    for v in d.values():
        if "path+" in v:
            v["path"] = parent["path"] + v["path+"]
        if not "data" in v:
            if parent and "data" in parent:
                v["data"] = parent["data"].copy()
            else:
                v["data"] = {}
        if "data+" in v:
            to_copy = parent["data"].copy()
            v["data+"].update(to_copy)
            v["data"] = v["data+"]
        if "component" in v:
            canActivate = ["NG:CanActivateWithTranslations"]
            if "pri/" in v["path"]:
                canActivate.append("NG:CanActivateUserLoggedIn")
            if "/group/" in v["path"]:
                canActivate.append("NG:CanActivateWithCurrentGroup")
            data = {
                "path": v["path"],
                "canActivate": [],  # canActivate,
                "canDeactivate": [],  # ["NG:DirtyStateTrackerService"],
                "data": v["data"],
                "component": f"NG:{v['component']}",
            }
            routes.append(data)
        if "children" in v:
            if v.get("extendDataToChildren", False):
                for cv in v["children"].values():
                    if not "data" in cv:
                        cv["data"] = {}
                    copy = v["data"].copy()
                    copy.update(cv["data"])
                    cv["data"] = copy
            routes.extend(get_routes(v["children"], v))
    return routes


def convert_routes_dict_to_routes_str(d: dict) -> str:
    lines = json.dumps(d, indent=2).split("\n")
    converted_lines = []
    for i in lines:
        # string starting with NG is a special case in which we remove the quotes as it is
        # some angular thing
        if "NG:" in i:
            i = re.sub(r'"NG:([a-zA-Z0-9]*)"', r"\1", i)
        converted_lines.append(i)
    return "export const ROUTES: Routes = " + "\n".join(converted_lines)


def get_routes_map(d: dict, parent: dict = None, routes: dict = {}) -> dict:
    for k, v in d.items():
        key = re.sub(r"(?<!^)(?=[A-Z])", "_", k).upper()
        routes[key] = {}
        if parent is None:
            v["path"] = "/" + v["path"]
        if "path+" in v:
            v["path"] = parent["path"] + v["path+"]
        if "component" in v:
            routes[key]["PATH"] = v["path"]
        if "children" in v:
            get_routes_map(v["children"], v, routes[key])
    return routes


def convert_routes_map_dict_to_routes_str(d: dict) -> str:
    lines = json.dumps(d, indent=2).split("\n")
    return "export const ROUTE_MAP = " + "\n".join(lines)


imports = [
    'import { Routes } from "@angular/router";',
    #'import { DirtyStateTrackerService, CanActivateWithCurrentGroup, CanActivateUserLoggedIn } from "@shared/services";',
    #'import { CanActivateWithTranslations } from "@core/services/translation.guard";',
] + get_imports(data)

imports_str = "\n".join(imports)

routes = get_routes(data)

routes_str = convert_routes_dict_to_routes_str(routes)

routes_map = get_routes_map(data)

routes_map_str = convert_routes_map_dict_to_routes_str(routes_map)

with open("routes.map.ts", "w") as f:
    f.write(routes_map_str)

with open("routes.ts", "w") as f:
    f.write(imports_str + "\n\n")
    f.write(routes_str)

subprocess.check_call("npx prettier routes.ts --write", shell=True)
subprocess.check_call("npx prettier routes.map.ts --write", shell=True)
