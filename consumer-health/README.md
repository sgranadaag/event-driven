# consumer-health

The **service health consumer** (NestJS, no HTTP server). It declares the `service-health` topic if it doesn't exist yet, joins the consumer group `KAFKA_GROUP_ID` and handles every outage, exceeded threshold and cost the producer writes. It logs each one at the level it deserves: an outage as an error, an exceeded threshold as a warning. See the root [README](../README.md) for the whole exercise.

## Topic

| Topic | Partitioned by | Receives |
| --- | --- | --- |
| `service-health` | The key: the service | `health.outage`, `health.threshold`, `health.cost` |

Since the key is the service, every event of `payments-api` lands in the same partition and is read in the order it happened. The topic keeps its events for 30 days whether or not they were read: Kafka doesn't delete a message once it's consumed. Each group only remembers how far it has read, its committed offset, so a new group starts again from the oldest event.

## Structure

```
src/
  main.ts            bootstrap: an application context, no HTTP server
  app.module.ts      configuration and the module list
  config/            functions that build a library's options: Kafka
  constants/         app-wide fixed values: the ENV keys
  core/              Nest modules that are not domain: infrastructure
    kafka/
      kafka.schema.ts      the topic this service reads: service-health, 3 partitions
      kafka.admin.ts       creates the topic if missing and waits until it is ready
      kafka.subscriber.ts  joins the group, consumes, dispatches by the type header, logs rebalances
  interfaces/        interfaces shared across folders
  modules/           the domain, one entry point (*.consumer.ts) and one service each
    health/          health.outage, health.threshold and health.cost
  utils/             pure helpers, one file per kind: date, header, log
```

`core/kafka/` knows Kafka and nothing about service health. Each module's `*.consumer.ts` registers one handler per message type with `KafkaSubscriber.subscribe(type, handler)`, much like a controller. It never sees an offset commit. `kafka.subscriber.ts` logs every message with its topic, partition, offset and key, and commits the offset once the handler returns: at-least-once.

## Configuration

| Variable | What it is |
| --- | --- |
| `KAFKA_BROKERS` | Where Kafka is: a comma-separated list of brokers |
| `KAFKA_GROUP_ID` | The consumer group it joins. A group that has never consumed starts from the oldest message the topic keeps, so a new one reads the whole history again |

## Run it

```bash
cp .env.example .env
npm install
npm run start:dev
```

To read every event again, start it with another `KAFKA_GROUP_ID`, or from the repository root: `docker compose run --rm -e KAFKA_GROUP_ID=health-replay consumer-health`. It needs Kafka at `KAFKA_BROKERS`. Running `docker compose up -d kafka` from the repository root starts it.
