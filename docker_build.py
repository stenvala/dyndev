# docker push stenvala/dyndev:tagname
import subprocess
from pathlib import Path
from tabnanny import check

dir = Path(__file__).parent.absolute()
src = dir / "src"

subprocess.check_call("npx ng build", cwd=src / "ui", shell=True)
subprocess.check_call(
    "docker build -t stenvala/dyndev:v0 .", cwd=src, shell=True
)

subprocess.check_call("docker push stenvala/dyndev:v0", shell=True)
