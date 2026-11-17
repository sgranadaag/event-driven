# consumer-queries

The **database queries consumer** (NestJS, no HTTP server). It declares the `db-queries` topic if it doesn't exist yet, joins the consumer group `KAFKA_GROUP_ID` and handles every insert, select and delete the producer writes. It only logs them: no database is involved. See the root [README](../README.md) for the whole exercise.

## Topic

| Topic | Partitioned by | Receives |
| --- | --- | --- |
| `db-queries` | The key: the table | `query.insert`, `query.select`, `query.delete` |

Kafka keeps the order of the messages within a partition, not across partitions. Since the key is the table, all the queries on `users` land in the same partition and this service reads them in the order they were sent: an insert, then the select that reads it, then the delete. Queries on another table can land in another partition, with no order between the two tables.

## Structure

```
src/
  main.ts            bootstrap: an application context, no HTTP server
  app.module.ts      configuration and the module list
  config/            functions that build a library's options: Kafka
  constants/         app-wide fixed values: the ENV keys
  core/              Nest modules that are not domain: infrastructure
    kafka/
      kafka.schema.ts      the topic this service reads: db-queries, 3 partitions
      kafka.admin.ts       creates the topic if missing and waits until it is ready
      kafka.subscriber.ts  joins the group, consumes, dispatches by the type header, logs rebalances
  interfaces/        interfaces shared across folders
  modules/           the domain, one entry point (*.consumer.ts) and one service each
    query/           query.insert, query.select and query.delete
  utils/             pure helpers, one file per kind: date, header, log
```

`core/kafka/` knows Kafka and nothing about queries. Each module's `*.consumer.ts` registers one handler per message type with `KafkaSubscriber.subscribe(type, handler)`, much like a controller. It never sees an offset commit. `kafka.subscriber.ts` logs every message with its topic, partition, offset and key, and commits the offset once the handler returns: at-least-once.

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

It needs Kafka at `KAFKA_BROKERS`. Running `docker compose up -d kafka` from the repository root starts it.
