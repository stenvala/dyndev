rm -rf venv
py -3.8 -m venv ./venv
call venv\Scripts\activate.bat

python --version
pip install uvicorn
pip install pip-tools
pip install -r src/requirements.txt
