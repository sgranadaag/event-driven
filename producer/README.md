# producer

The **producer** (NestJS, port `3000`). It publishes each kind of message to its RabbitMQ exchange: direct, topic, fanout or headers. It never publishes to a queue and doesn't know who consumes. See the root [README](../README.md) for the whole exercise.

## Structure

```
src/
  main.ts            bootstrap: validation pipe, Swagger, listen
  app.module.ts      configuration and the module list
  config/            functions that build a library's options: RabbitMQ, Swagger
  constants/         app-wide fixed values: the ENV keys
  core/              Nest modules that are not domain: infrastructure
    rabbit/
      rabbit.schema.ts      the 4 exchanges, the only RabbitMQ resources the producer declares
      rabbit.publisher.ts   publishes with confirms and mandatory, and reports whether a queue got it
  decorators/        composed decorators: SwaggerDocs
  interfaces/        interfaces shared across folders
  modules/           the domain
    order/           direct (create, update) and headers (priority)
    notification/    topic
    announcement/    fanout
  utils/             pure helpers, one file per kind: crypto, date, log
```

`core/rabbit/` knows RabbitMQ and nothing about orders. Each domain module chooses the exchange, the routing key or headers and the payload, and calls `RabbitPublisher.publish(...)`.

## What it does

| Endpoint | Exchange | What it publishes |
| --- | --- | --- |
| `POST /orders` | `orders.direct` | `order.create`. Reaches `orders.create` |
| `PUT /orders/:id` | `orders.direct` | `order.update`. Reaches `orders.update` |
| `PUT /orders/:id/priority` | `orders.headers` | `order.prioritize`, with `priority` and `region` as headers. Reaches `orders.express`, `orders.priority`, both or none |
| `POST /notifications` | `notifications.topic` | Routing key `notification.<channel>.<event>` |
| `POST /announcements` | `broadcast.fanout` | One message, copied to every queue |
| `GET /docs` | | Swagger UI |

Every response carries the `messageId` and `routed`: whether the exchange delivered the message to at least one queue.

## Run it

```bash
cp .env.example .env
npm install
npm run start:dev
```

It needs RabbitMQ at `RABBIT_URL`. Running `docker compose up -d rabbitmq` from the repository root starts it. Start a consumer before publishing: until one has declared the queues, every message comes back `routed: false`.
