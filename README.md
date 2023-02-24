# Notifications API

  *The Notification Manager API for creating and scheduling new notifications*

This an component of [Notifications Manager](https://github.com/davicedraz/notifications-manager) project that centralizes receiving requests for sending notifications in the **Inbound Layer**, for N services that want to send to N different channels. When ready to be sent, the notification is queued to be sent through providers.

See the main project page for details and other components.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Using Docker

Create a Docker network called notifications-net by running the command:
```bash
docker network create notifications-net
```
Start the API containers by running the following commands
```bash
docker-compose up
```

## API Documentation (Swagger) 

![Swagger](docs/img/swagger.png)

Hit `/docs`
```bash
http://localhost:3000/docs
```


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
