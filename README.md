# event-driven — event-driven architecture with RabbitMQ and Kafka

This repo is an implementation of an **event-driven architecture**. Its purpose is to work as a template and as a guide to the concepts behind it: how services communicate through events instead of calling each other directly, and what changes when the broker carrying those events is a **message queue** (RabbitMQ) or an **event log** (Kafka).

Event-driven systems are easy to describe and easy to get wrong. "Publish an event and someone reacts to it" sounds simple, but delivery guarantees, ordering, retries, duplicated messages and failure handling behave very differently depending on the broker. That's why the same example is implemented twice, on its own branch for each broker. Comparing the two branches shows which decisions come from the architecture and which come from the technology.

## Branches

The repo is split into parallel branches. They share the same base and differ only in the broker and the logic around it.

| Branch | Broker | Model |
| --- | --- | --- |
| `main` | None wired up | The shared base. Each implementation branches off from here |
| `stable/rabbit` | RabbitMQ | Message queue: exchanges route messages to queues, and a message is removed once a consumer acknowledges it |
| `stable/kafka` | Kafka | Event log: events are appended to partitioned topics and kept, and each consumer group tracks its own offset |

**This is `stable/rabbit`.** It holds a producer and a consumer that talk only through RabbitMQ. The [RabbitMQ implementation](#rabbitmq-implementation) section below explains how.

> If you're new to event-driven architecture, start with **stable/rabbit**, where the flow of a message from producer to consumer is the most explicit. Then compare it with **stable/kafka** to see how the same flow changes once events are stored and replayable instead of consumed and gone.

---

## Technology

I decided to use **Nest** with **TypeScript** as the framework for this implementation, because Node is my main stack. Nest gives both branches the same structure (modules, dependency injection and lifecycle hooks), so the only difference between them is the broker and its client.

The goal, though, is for the concepts to be **independent of the stack**. I want anyone to be able to replicate this workflow and build their own implementation with whatever language, framework or broker they prefer. The framework and the broker client are just plumbing. The parts that matter are how events are designed, published and consumed.

---

## Literature

Event-driven architecture covers a family of patterns, and different authors define them in different ways. If you want to dive deeper, you can check:

- "Enterprise Integration Patterns" by Gregor Hohpe and Bobby Woolf (2003)
- "What do you mean by 'Event-Driven'?" by Martin Fowler (martinfowler.com/articles/201701-event-driven.html)
- "Designing Event-Driven Systems" by Ben Stopford (2018)
- "Building Event-Driven Microservices" by Adam Bellemare (2020)

> I'm not the source of truth here. Feel free to read, research, and build your own implementation if you feel the need to.

---

## RabbitMQ implementation

Two Nest projects, each one independent, with its own `package.json`, `Dockerfile` and README:

| Folder | Role | Port |
| --- | --- | --- |
| [producer/](producer/) | Creates orders over HTTP and publishes an `order.created` event for each one | 3000 |
| [consumer/](consumer/) | Reacts to `order.created`. It has no HTTP server, so you can run as many instances as you want | None |

They share no code and never call each other. The only thing they agree on is the event: its name (`order.created`, the routing key), its payload (the order), and the exchange it travels through (`orders`). Each project keeps its own copy of that contract.

### How an event travels

```
POST /orders ──► producer ──publish order.created──► exchange "orders" (topic)
                                                         │ one binding per queue
                                     ┌───────────────────┼───────────────────┐
                                     ▼                   ▼                   ▼
                              queue consumer-1    queue consumer-2    queue consumer-N
                                     │                   │                   │
                                consumer-1          consumer-2          consumer-N
                              (ack once handled)  (ack once handled)  (ack once handled)
```

- **The producer publishes to an exchange, never to a queue.** It doesn't know which consumers exist. It answers the HTTP request once RabbitMQ has **confirmed** the event (publisher confirms), not once a consumer has handled it.
- **Each consumer instance declares its own durable queue** (`RABBIT_QUEUE`) and binds it to the event types it handles. Every bound queue receives its own copy of each event, so `consumer-1` and `consumer-2` both receive every order. This is publish/subscribe.
- **Instances that share a queue compete for its events** instead: each event goes to only one of them. This is the work-queue pattern, used to scale one subscriber out. Choosing between the two only means choosing a queue name.
- **A message is acknowledged once its handler finishes.** If the handler throws, or no handler exists for the event, the message is rejected without requeueing and is dropped. A dead-letter exchange would keep those messages; it isn't part of this basic example.
- **The event's metadata travels in the AMQP message properties, not in the body.** `messageId` carries the event id, `type` the event name and `timestamp` when it happened. The body is only the payload. Every consumer logs the event id, so one request can be followed through all of them.
- **Events published while no queue is bound are lost.** A queue only receives events after it has been bound. Once declared, a queue is durable: it keeps collecting events while its consumer is stopped, and the consumer catches up when it starts again.

Both projects use [amqplib](https://github.com/amqp-node/amqplib) directly instead of Nest's microservices transport. That keeps exchanges, queues, bindings and acknowledgements visible in the code, and those are the concepts this branch is about. Nest's transport would hide them. The RabbitMQ code in each project lives in `src/core/rabbit/`, and the domain modules only call `publish` or `subscribe`.

### Running it

Everything (RabbitMQ, the producer and two consumers) runs with Docker Compose:

```bash
docker compose up -d --build
curl -X POST localhost:3000/orders -H 'Content-Type: application/json' -d '{"product":"keyboard","quantity":2}'
docker compose logs -f consumer-1 consumer-2
```

| Address | What |
| --- | --- |
| http://localhost:3000/docs | Producer's Swagger UI |
| http://localhost:15672 | RabbitMQ management UI (`guest` / `guest`), to inspect the exchange, queues and bindings |

Each service can also be started on its own: `docker compose up -d rabbitmq`, then each project with `npm run start:dev` (see its README). To start one more consumer, run another instance with a different `RABBIT_QUEUE`:

```bash
cd consumer
RABBIT_QUEUE=consumer-3 npm run start:dev
```

> Both projects run on **Node 24**, pinned in each project's `.nvmrc`. Run `nvm use` inside the project folder.

The theory behind all of this, with sources, is in [docs/references.md](docs/references.md).

---

## Usage

You're free to use, fork, or build on this implementation. If it ends up in your own project, crediting me as co-author is appreciated, but not required.
