# DYNDEV

A GUI client for DynamoDB developer.

# Build container

```bash
cd src
docker build -t dyndev . --progres=plain
```

# Run container

```bash
docker run --privileged --pid=host -d --name dyndev -p 17177:80 dyndev
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
