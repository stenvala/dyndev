nvm use 16.10.0
start "DYNDEV UI" /min cmd.exe /k "cd src/ui && npx ng serve --port 4215"
start "DYNDEV Api" /min cmd.exe /k "cd src && uvicorn handler_api:app --reload --port 8215"