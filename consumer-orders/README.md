# consumer-orders

The **orders consumer** (NestJS, no HTTP server). It declares the exchanges it binds to (`orders.direct`, `orders.headers` and `broadcast.fanout`), its 4 queues and their bindings, then handles every message that reaches them. It has no port, so you can run as many instances as you want: they all read the same 4 queues and compete for their messages. See the root [README](../README.md) for the whole exercise.

## Queues

| Queue | Bound to | Receives |
| --- | --- | --- |
| `orders.create` | `orders.direct` with `order.create` | Order creation requests |
| `orders.update` | `orders.direct` with `order.update` | Order update requests |
| `orders.express` | `orders.headers` with `x-match=all`, `priority: high`, `region: co` | Priority orders for the express line: both headers match |
| `orders.priority` | `orders.headers` with `x-match=any`, `priority: high`, `region: co` | Priority orders moved ahead: at least one header matches |

All four are also bound to `broadcast.fanout`, so every announcement arrives four times, once per queue.

## Structure

```
src/
  main.ts            bootstrap: an application context, no HTTP server
  app.module.ts      configuration and the module list
  config/            functions that build a library's options: RabbitMQ
  constants/         app-wide fixed values: the ENV keys
  core/              Nest modules that are not domain: infrastructure
    rabbit/
      rabbit.schema.ts      this service's topology: 3 exchanges, 4 queues and their bindings
      rabbit.subscriber.ts  declares the schema, consumes the queues, dispatches by type and acks
  interfaces/        interfaces shared across folders
  modules/           the domain, one entry point (*.consumer.ts) and one service each
    order/           order.create, order.update and order.prioritize
    announcement/    announcement, one copy per queue
  utils/             pure helpers, one file per kind: date, log
```

`core/rabbit/` knows RabbitMQ and nothing about orders. Each module's `*.consumer.ts` registers one handler per message type with `RabbitSubscriber.subscribe(type, handler)`, much like a controller. It never sees a channel or an ack. `rabbit.subscriber.ts` logs every message with the queue it came from and the exchange that routed it.

## Configuration

| Variable | What it is |
| --- | --- |
| `RABBIT_URL` | Where RabbitMQ is |

## Run it

```bash
cp .env.example .env
npm install
npm run start:dev
```

To add an instance, run the same command in another terminal. It needs RabbitMQ at `RABBIT_URL`. Running `docker compose up -d rabbitmq` from the repository root starts it.
