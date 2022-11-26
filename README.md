# DYNDEV

A GUI client for DynamoDB developer.

[DockerHub](https://hub.docker.com/repository/docker/stenvala/dyndev)

NoSQL Workbench is not good and it is especially not suitable for querying tables fulfilling DynamoDB single table designs (STD). This offers help for that with some guidelines how to do STD.

# Build and push container

```bash
python  build_and_push.py
```

# Start services

```bash
python mac_start_services.py
```

# How to include this in your docker-compose.yml?

For the dyndev container you define how to connect to dynamodb container in environment variables. DYNDEV_TOKEN is optional environment variable. If you give it, then the api access requires the user to enter this successfully.

Below is an eaxmple docker compose file.

```yml
version: "3.9"
services:
  dynamo:
    image: amazon/dynamodb-local
    container_name: dynamo
    hostname: dynamo
    restart: always
    volumes:
      - ./docker/dynamodb:/dynamodb-data
    ports:
      - 8000:8000
    command: "-jar DynamoDBLocal.jar -sharedDb -dbPath /dynamodb-data"
  dyndev:
    image: stenvala/dyndev:v1
    container_name: dyndev-from-hub
    environment:
      DYNAMO_HOST: dynamo
      DYNAMO_PORT: 8000
      DYNDEV_TOKEN: token
    ports:
      - "17177:80"
```
