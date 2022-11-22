# docker push stenvala/dyndev:tagname
import subprocess
from pathlib import Path
import requests

dir = Path(__file__).parent.absolute()
src = dir / "src"

tag_list = requests.get(
    "https://registry.hub.docker.com/v2/repositories/stenvala/dyndev/tags?page_size=1000",
).json()["results"]

next_tag_num = 0
for i in tag_list:
    last_tag = int(i["name"].replace("v", ""))
    if last_tag > next_tag_num:
        next_tag_num = last_tag

print(f"Current tag is v{next_tag_num}")
next_tag_num += 1

subprocess.check_call("npx ng build", cwd=src / "ui", shell=True)
subprocess.check_call(
    f"docker buildx build --platform=linux/amd64 -t stenvala/dyndev:v{next_tag_num} .",
    cwd=src,
    shell=True,
)

subprocess.check_call(
    f"docker push stenvala/dyndev:v{next_tag_num}", shell=True
)
