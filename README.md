# Nestjs Starter

## Description

## Installation - npm

```bash
$ npm install
```

## Required env variables

```dotenv
# add .env file into the app root
# example env file:
# DB_URI mongodb application database connection string
DB_URI=mongodb://user:password@localhost:27017/dbname
# DB_TEST_URI mongodb testing database connection string
DB_TEST_URI=mongodb://user:password@localhost:27018/testingdbname
# JWT config options
JWT_ACCESS_SECRET_KEY=secret
JWT_REFRESH_SECRET_KEY=secret2
JWT_ACCESS_EXPIRE_IN_SECONDS=600
JWT_REFRESH_EXPIRE_IN_SECONDS=86400
# Configures the Access-Control-Allow-Origin CORS header
FRONTEND_BASE_URL=http://localhost:4200
```

## Setting up a mongodb

The easiest way to set up a mongodb is through docker. If you have docker installed, running `npm run start:dev:docker`
will start a mongodb by default. The mongodb configuration is located in `./docker/docker-compose.yml` file:

```
version: '3'
services:
    db:
        image: mongo:latest
        restart: unless-stopped
        container_name: nestjs-db
        ports:
            - "27017:27017"
        environment:
            MONGO_INITDB_ROOT_USERNAME: admin
            MONGO_INITDB_ROOT_PASSWORD: admin
            MONGO_INITDB_DATABASE: app
        volumes:
            - nestjs-db-vol:/data/db
            - nestjs-db-vol:/data/configdb
            # set up a new user and add roles
            - ./docker-entrypoint-initdb.d/:/docker-entrypoint-initdb.d/:ro
        networks:
            - nestjs-network
volumes:
    nestjs-db-vol:
networks:
    nestjs-network:

```

## Starting the app

App can be started with `npm run start:dev` or with `npm run start:dev:docker`. `npm run start:dev` won't start a docker
container with a mongodb.

## Testing

The app uses both unit and integration testing. To start unit testing run `npm run test:watch` command. The
integration test can be started with `npm run test:e2e:watch`. It will automatically set up a docker with
a mongodb testing database. It's configuration can be found in `./docker/docker-compose.yml` file. Note that
after ending the e2e test process the docker container is not automatically stopped. You have to run the
`npm run docker:down:e2e` command to do so.
