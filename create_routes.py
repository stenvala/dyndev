import subprocess
from pathlib import Path

cwd = Path(__file__).resolve().parent / "src" / "ui" / "src" / "app" / "routing"

cmd = ["python", "compile.py"]
subprocess.call(cmd, cwd=cwd)
