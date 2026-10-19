# consumer

The **consumer** (NestJS, no HTTP server). It reads `order.created` events from its own RabbitMQ queue and reacts to each one. It has no port, so you can run as many instances as you want. See the root [README](../README.md) for the whole flow.

## Structure

```
src/
  main.ts           bootstrap: an application context, no HTTP server
  app.module.ts     configuration and the module list
  config/           functions that build a library's options: RabbitMQ
  constants/        app-wide fixed values: the ENV keys
  core/             Nest modules that are not domain: infrastructure
    rabbit/         declares the queue, binds it, dispatches each message and acks it
  interfaces/       interfaces shared across folders
  modules/          the domain
    order/          what to do when an order is created
      order.consumer.ts   the entry point: subscribes the handlers, like a controller
      order.service.ts    the reaction itself
  utils/            pure helpers, one file per kind: date
```

`core/rabbit/` knows RabbitMQ and nothing about orders. `modules/order/` registers one handler per event type with `RabbitSubscriber.subscribe(eventType, handler)`. It never sees a channel, a message or an ack.

## Configuration

| Variable | What it is |
| --- | --- |
| `RABBIT_URL` | Where RabbitMQ is |
| `RABBIT_EXCHANGE` | The exchange the producer publishes to (`orders`) |
| `RABBIT_QUEUE` | This instance's queue. A different queue gets its own copy of every event, and a shared queue splits the events between the instances reading it |

## Run it

```bash
cp .env.example .env
npm install
npm run start:dev
```

To run another instance, override the queue:

```bash
RABBIT_QUEUE=consumer-2 npm run start:dev
```

It needs RabbitMQ at `RABBIT_URL`. Running `docker compose up -d rabbitmq` from the repository root starts it.
