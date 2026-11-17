# producer

The **producer** (NestJS, port `3000`). It writes each kind of event to its Kafka topic: `interactions`, `db-queries` or `service-health`. It decides the partition of an interaction itself, and lets Kafka hash the key for the other two. It doesn't know who consumes. See the root [README](../README.md) for the whole exercise.

## Structure

```
src/
  main.ts            bootstrap: validation pipe, Swagger, listen
  app.module.ts      configuration and the module list
  config/            functions that build a library's options: Kafka, Swagger
  constants/         app-wide fixed values: the ENV keys
  core/              Nest modules that are not domain: infrastructure
    kafka/
      kafka.schema.ts      the 3 topics: partitions and retention
      kafka.admin.ts       creates the missing topics and waits until they are ready
      kafka.publisher.ts   idempotent producer, acks=all; reports partition and offset
  decorators/        composed decorators: SwaggerDocs
  interfaces/        interfaces shared across folders
  modules/           the domain, one per topic
    interaction/     views, clicks and scrolls: one partition each
    query/           insert, select and delete: partitioned by table
    health/          outages, exceeded thresholds and costs: partitioned by service
  utils/             pure helpers, one file per kind: crypto, log
```

`core/kafka/` knows Kafka and nothing about interactions or queries. Each domain module chooses the topic, the key, the partition when it wants a fixed one, and the payload, and calls `KafkaPublisher.publish(...)`. Every message carries a `type` header (`interaction.click`, `query.delete`...), which the consumers dispatch on, and a `message-id` header.

## What it does

| Endpoint | Topic | Key | Partition |
| --- | --- | --- | --- |
| `POST /interactions/views` | `interactions` | user | `0`, always |
| `POST /interactions/clicks` | `interactions` | user | `1`, always |
| `POST /interactions/scrolls` | `interactions` | user | `2`, always |
| `POST /queries/insert` | `db-queries` | table | hash of the key |
| `POST /queries/select` | `db-queries` | table | hash of the key |
| `POST /queries/delete` | `db-queries` | table | hash of the key |
| `POST /health/outages` | `service-health` | service | hash of the key |
| `POST /health/thresholds` | `service-health` | service | hash of the key |
| `POST /health/costs` | `service-health` | service | hash of the key |
| `GET /docs` | | | Swagger UI |

Every response carries the `messageId`, the `partition` the event was written to and its `offset` in that partition.

## Run it

```bash
cp .env.example .env
npm install
npm run start:dev
```

It needs Kafka at `KAFKA_BROKERS`. Running `docker compose up -d kafka` from the repository root starts it. The producer creates its topics on startup, so it can publish before any consumer runs: Kafka keeps the events, and a consumer that starts later reads them.
