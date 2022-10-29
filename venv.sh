#!/bin/bash

python3 -m venv ./venv
source venv/bin/activate
python --version
pip install uvicorn
pip install pip-tools
pip install -r src/requirements.txt

pip install applescript
