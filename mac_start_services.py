from applescript import tell
import os

# set what command you want to run here
dir = os.getcwd()

terminal_style = (
    '\nset current settings of tabs of windows to settings set "Grass"'
)
terminal_style = ""

pos = "\nset bounds of first window to {0, 1, 600, 700}"
# dynamo = r'cd ~/dev-tools/dynamodb_local_latest; java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb'
tell.app(
    "Terminal", f"do script cd {dir}; docker compose up {terminal_style} {pos}"
)

print("Starting backend")

pos = "\nset bounds of first window to {0, 1, 600, 700}"
backend = (
    r"cd \"%s\";source venv/bin/activate;cd src; uvicorn handler_api:app --reload --port 8215"
    % dir
)
tell.app("Terminal", 'do script "' + backend + '"' + terminal_style + pos)

print("Starting frontend")
pos = "\nset bounds of first window to {0, 1, 600, 700}"
webclient = r"cd \"%s/src/ui\"; nvm use 16.13.2; npx ng serve --port 4215" % dir
tell.app("Terminal", 'do script "' + webclient + '"' + terminal_style + pos)
