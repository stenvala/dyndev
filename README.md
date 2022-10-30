# DYNDEV

A GUI client for DynamoDB developer.

# API Docs

```bash
http://localhost:8001/docs
```

# Build container

```bash
cd src
docker build -t dyndev . --progres=plain
```

# Run container

```bash
docker run --privileged --pid=host -d --name dyndev -p 17177:80 dyndev
```

# Run whole thing in container

```bash
docker compose down && docker compose build --force-rm --no-cache && docker compose up &
```

# Hello-world

```bash
# Local
http://localhost:8001/
# Container
http://localhost:17177/
# Go to container
docker exec -it dyndev bash
```
