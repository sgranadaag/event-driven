# consumer-notifications

The **notifications consumer** (NestJS, no HTTP server). Each instance processes **one** notification channel, chosen with `NOTIFICATION_CHANNEL`. It declares the exchanges it binds to (`notifications.topic` and `broadcast.fanout`), that channel's queue and its bindings, and handles every message that reaches it. See the root [README](../README.md) for the whole exercise.

## Channels

| `NOTIFICATION_CHANNEL` | Queue | Bound to `notifications.topic` with |
| --- | --- | --- |
| `email` | `notifications.email` | `notification.email.*` |
| `sms` | `notifications.sms` | `notification.sms.*` and `#.urgent` |

Both queues are also bound to `broadcast.fanout`, so each channel gets its own copy of every announcement. An urgent email (`notification.email.urgent`) reaches both channels: the email queue through its pattern, and the SMS queue through `#.urgent`.

Any other value stops the application at startup with an error listing the supported channels. Instances with the same channel read the same queue and compete for its messages.

## Structure

```
src/
  main.ts            bootstrap: an application context, no HTTP server
  app.module.ts      configuration and the module list
  config/            functions that build a library's options: RabbitMQ and the channel
  constants/         app-wide fixed values: the ENV keys
  core/              Nest modules that are not domain: infrastructure
    rabbit/
      rabbit.schema.ts      this service's topology: 2 exchanges and one queue per channel
      rabbit.subscriber.ts  declares the channel's queue, consumes it, dispatches by type and acks
  interfaces/        interfaces shared across folders
  modules/           the domain, one entry point (*.consumer.ts) and one service each
    notification/    notification
    announcement/    announcement
  utils/             pure helpers, one file per kind: date, log
```

`core/rabbit/` knows RabbitMQ and nothing about notifications. Each module's `*.consumer.ts` registers one handler per message type with `RabbitSubscriber.subscribe(type, handler)`, much like a controller. It never sees a channel or an ack.

## Configuration

| Variable | What it is |
| --- | --- |
| `RABBIT_URL` | Where RabbitMQ is |
| `NOTIFICATION_CHANNEL` | Which channel this instance processes: `email` or `sms` |

## Run it

```bash
cp .env.example .env
npm install
npm run start:dev
```

The `.env.example` processes email. To run the SMS channel at the same time, start a second instance in another terminal with `NOTIFICATION_CHANNEL=sms`. It needs RabbitMQ at `RABBIT_URL`. Running `docker compose up -d rabbitmq` from the repository root starts it.
