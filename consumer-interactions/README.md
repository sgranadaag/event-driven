# consumer-interactions

The **interactions consumer** (NestJS, no HTTP server). It declares the `interactions` topic if it doesn't exist yet, joins the consumer group `KAFKA_GROUP_ID` and handles every view, click and scroll the producer writes. It has no port and no fixed container name, so you can run up to three instances that share the work: the group gives each one a share of the 3 partitions. See the root [README](../README.md) for the whole exercise.

## Topic

| Partition | Receives |
| --- | --- |
| `interactions-0` | `interaction.view` |
| `interactions-1` | `interaction.click` |
| `interactions-2` | `interaction.scroll` |

With one instance, it reads the three partitions. With three (`docker compose up -d --scale consumer-interactions=3`), the group rebalances and each instance reads one partition, so one kind of interaction. A fourth instance gets no partition and waits until another one leaves. Every rebalance is logged as `Partitions revoked` and `Partitions assigned`.

## Structure

```
src/
  main.ts            bootstrap: an application context, no HTTP server
  app.module.ts      configuration and the module list
  config/            functions that build a library's options: Kafka
  constants/         app-wide fixed values: the ENV keys
  core/              Nest modules that are not domain: infrastructure
    kafka/
      kafka.schema.ts      the topic this service reads: interactions, 3 partitions
      kafka.admin.ts       creates the topic if missing and waits until it is ready
      kafka.subscriber.ts  joins the group, consumes, dispatches by the type header, logs rebalances
  interfaces/        interfaces shared across folders
  modules/           the domain, one entry point (*.consumer.ts) and one service each
    interaction/     interaction.view, interaction.click and interaction.scroll
  utils/             pure helpers, one file per kind: date, header, log
```

`core/kafka/` knows Kafka and nothing about interactions. Each module's `*.consumer.ts` registers one handler per message type with `KafkaSubscriber.subscribe(type, handler)`, much like a controller. It never sees an offset commit. `kafka.subscriber.ts` logs every message with its topic, partition, offset and key, and commits the offset once the handler returns: at-least-once.

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

To add an instance, run the same command in another terminal. To read the history again, start it with another `KAFKA_GROUP_ID`. It needs Kafka at `KAFKA_BROKERS`. Running `docker compose up -d kafka` from the repository root starts it.
