# producer

The **producer** (NestJS, port `3000`). It creates orders over HTTP and publishes an `order.created` event to RabbitMQ for each one. It doesn't know who consumes the event. See the root [README](../README.md) for the whole flow.

## Structure

```
src/
  main.ts           bootstrap: validation pipe, Swagger, listen
  app.module.ts     configuration and the module list
  config/           functions that build a library's options: RabbitMQ, Swagger
  constants/        app-wide fixed values: the ENV keys
  core/             Nest modules that are not domain: infrastructure
    rabbit/         opens the connection, declares the exchange, publishes with confirms
  decorators/       composed decorators: SwaggerDocs
  interfaces/       interfaces shared across folders
  modules/          the domain
    order/          creates orders and publishes order.created
  utils/            pure helpers, one file per kind: crypto, date
```

`core/rabbit/` knows RabbitMQ and nothing about orders. `modules/order/` knows orders and only calls `RabbitPublisher.publish(eventType, payload)`.

## What it does

| Endpoint | What it does |
| --- | --- |
| `POST /orders` | Creates an order and publishes `order.created`. Answers once RabbitMQ has confirmed the event |
| `GET /docs` | Swagger UI |

## Run it

```bash
cp .env.example .env
npm install
npm run start:dev
```

It needs RabbitMQ at `RABBIT_URL`. Running `docker compose up -d rabbitmq` from the repository root starts it.
