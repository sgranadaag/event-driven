# consumer

The **consumer** (NestJS, no HTTP server). It declares the 4 exchanges, the 5 queues and their bindings, then handles every message that reaches them. It has no port, so you can run as many instances as you want: they all read the same queues and share their messages. See the root [README](../README.md) for the whole exercise.

## Structure

```
src/
  main.ts            bootstrap: an application context, no HTTP server
  app.module.ts      configuration and the module list
  config/            functions that build a library's options: RabbitMQ
  constants/         app-wide fixed values: the ENV keys
  core/              Nest modules that are not domain: infrastructure
    rabbit/
      rabbit.schema.ts      the topology: 4 exchanges, 5 queues and every binding
      rabbit.subscriber.ts  declares the schema, consumes every queue, dispatches by type and acks
  interfaces/        interfaces shared across folders
  modules/           the domain, one entry point (*.consumer.ts) and one service each
    order/           order.create and order.classified
    notification/    notification
    announcement/    announcement, one copy per queue
  utils/             pure helpers, one file per kind: date
```

`core/rabbit/` knows RabbitMQ and nothing about orders. Each module's `*.consumer.ts` registers one handler per message type with `RabbitSubscriber.subscribe(type, handler)`, much like a controller. It never sees a channel or an ack. `rabbit.subscriber.ts` logs every message with the queue it came from and the exchange that routed it.

## Configuration

| Variable | What it is |
| --- | --- |
| `RABBIT_URL` | Where RabbitMQ is |

The queues are fixed in `rabbit.schema.ts`, not configured: every instance declares the same ones and competes for their messages.

## Run it

```bash
cp .env.example .env
npm install
npm run start:dev
```

To add an instance, run the same command in another terminal. It needs RabbitMQ at `RABBIT_URL`. Running `docker compose up -d rabbitmq` from the repository root starts it.
