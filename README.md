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

**This is `stable/rabbit`.** It holds a producer and a consumer that talk only through RabbitMQ, using its four exchange types. The [RabbitMQ implementation](#rabbitmq-implementation) section below explains how.

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

This branch shows how each of RabbitMQ's four exchange types routes a message: **direct**, **topic**, **fanout** and **headers**. It creates only the resources the examples need: 4 exchanges and 5 queues.

Two Nest projects, each one independent, with its own `package.json`, `Dockerfile` and README:

| Folder | Role | Port |
| --- | --- | --- |
| [producer/](producer/) | Publishes each kind of message to its exchange, over HTTP. It never publishes to a queue | 3000 |
| [consumer/](consumer/) | Declares the 5 queues and their bindings, and handles what arrives. It has no HTTP server, so you can run as many instances as you want | None |

They share no code and never call each other. They agree only on the exchanges and on the messages: each message's type, routing key or headers, and payload. Each project keeps its own copy of that contract in `src/core/rabbit/rabbit.schema.ts`.

### The topology

```
                                   ┌──► orders.create       (order.create)
orders.direct        (direct)  ────┘
                                   ┌──► notifications.email (notification.email.*)
notifications.topic  (topic)   ────┤
                                   └──► notifications.sms   (notification.sms.*, #.urgent)
                                   ┌──► orders.match-all    (x-match=all: priority=high, region=co)
orders.headers       (headers) ────┤
                                   └──► orders.match-any    (x-match=any: priority=high, region=co)
broadcast.fanout     (fanout)  ────────► all 5 queues
```

| Exchange | Routes by | Destination queues | Producer endpoint |
| --- | --- | --- | --- |
| `orders.direct` | Exact routing key | `orders.create` | `POST /orders`, `PUT /orders/:id` |
| `notifications.topic` | Routing key pattern | `notifications.email`, `notifications.sms` | `POST /notifications` |
| `broadcast.fanout` | Nothing: copies to every bound queue | All 5 queues | `POST /announcements` |
| `orders.headers` | Message headers (`all` / `any`) | `orders.match-all`, `orders.match-any` | `POST /orders/classify` |

### What each exchange shows

**Direct: order creation.** `POST /orders` publishes with the routing key `order.create`, and only `orders.create` is bound with that exact key. Both consumers read that queue, so they compete: each order is handled by only one of them. `PUT /orders/:id` publishes `order.update` to the same exchange. No queue is bound with that key, so the message reaches no queue.

**Topic: notifications.** `POST /notifications` publishes with the routing key `notification.<channel>.<event>`. `*` matches exactly one word and `#` matches zero or more:

| Routing key | Reaches |
| --- | --- |
| `notification.email.welcome` | `notifications.email` |
| `notification.sms.otp` | `notifications.sms` |
| `notification.email.urgent` | Both: `notification.email.*` and `#.urgent` |
| `notification.push.welcome` | None: no queue is bound for `push` |

**Fanout: broadcast.** `POST /announcements` publishes to `broadcast.fanout`, which ignores the routing key. It creates no queues of its own: the 5 existing queues are bound to it, so one message produces 5 copies.

**Headers: matching on attributes.** `POST /orders/classify` sends `priority` and `region` as message headers, with an empty routing key that the exchange ignores. Both queues have the same criteria, `priority: high` and `region: co`, and differ only in the match mode:

| Headers sent | `orders.match-all` (`x-match=all`) | `orders.match-any` (`x-match=any`) |
| --- | --- | --- |
| `priority: high` | No | Yes |
| `priority: high`, `region: co` | Yes | Yes |
| `priority: low`, `region: mx` | No | No |

### How to tell where a message went

- **Every producer response carries `routed`.** The producer publishes with `mandatory: true`, so RabbitMQ returns any message no queue received, and the response says `routed: false`. The cases above that reach no queue (`order.update`, `push`, the headers that don't match) show it there and in the producer's log, instead of disappearing silently.
- **Every consumer logs where each message came from.** One line per message: its type and id, the queue it was read from, the exchange that routed it and the routing key. The `messageId` in the HTTP response is the same one the consumer logs.
- **The producer answers once RabbitMQ has confirmed the message** (publisher confirms), not once a consumer has handled it. It doesn't know which consumers exist.

### How the code is split

- **The producer declares only the exchanges.** The consumer declares the exchanges too (declaring is idempotent, so start-up order doesn't matter), plus the queues and their bindings. Queues and bindings are the consumer's subscription: the producer doesn't need to know who listens.
- **Each consumer handles a message by its AMQP `type`, not by the queue.** The same announcement arrives in all 5 queues, and the same handler handles every copy.
- **A message is acknowledged once its handler finishes.** If the handler throws, or no handler exists for its type, the message is rejected without requeueing and is dropped. A dead-letter exchange would keep those messages; it isn't part of this example.
- **The metadata travels in the AMQP message properties**, not in the body: `messageId`, `type`, `timestamp` and, for the headers exchange, `headers`. The body is only the payload.
- **Messages published before a consumer has declared the queues are lost**, since no queue is bound yet. The producer reports them as `routed: false`. Once declared, the queues are durable and keep collecting messages while the consumers are stopped.

Both projects use [amqplib](https://github.com/amqp-node/amqplib) directly instead of Nest's microservices transport. That keeps exchanges, queues, bindings and acknowledgements visible in the code, and those are the concepts this branch is about. The RabbitMQ code in each project lives in `src/core/rabbit/`, and the domain modules only call `publish` or `subscribe`.

### Running it

Everything (RabbitMQ, the producer and two consumers) runs with Docker Compose. Start it, then follow the consumers' logs:

```bash
docker compose up -d --build
docker compose logs -f consumer-1 consumer-2
```

Then send each case from another terminal:

```bash
J='Content-Type: application/json'

# direct
curl -X POST localhost:3000/orders -H "$J" -d '{"product":"keyboard","quantity":2}'
curl -X PUT localhost:3000/orders/3f2a9e10-6f1d-4a2b-9c3e-5d7a1b2c4e8f -H "$J" -d '{"product":"keyboard","quantity":3}'

# topic
curl -X POST localhost:3000/notifications -H "$J" -d '{"channel":"email","event":"urgent","message":"Server down"}'
curl -X POST localhost:3000/notifications -H "$J" -d '{"channel":"push","event":"welcome","message":"Hi"}'

# fanout
curl -X POST localhost:3000/announcements -H "$J" -d '{"message":"Maintenance tonight"}'

# headers
curl -X POST localhost:3000/orders/classify -H "$J" -d '{"product":"mouse","quantity":1,"priority":"high"}'
curl -X POST localhost:3000/orders/classify -H "$J" -d '{"product":"mouse","quantity":1,"priority":"high","region":"co"}'
```

| Address | What |
| --- | --- |
| http://localhost:3000/docs | Producer's Swagger UI, with every endpoint |
| http://localhost:15672 | RabbitMQ management UI (`guest` / `guest`), to inspect the exchanges, queues and bindings |

Each service can also be started on its own: `docker compose up -d rabbitmq`, then each project with `npm run start:dev` (see its README). Every extra consumer instance joins the same 5 queues and shares their messages with the others.

> Both projects run on **Node 24**, pinned in each project's `.nvmrc`. Run `nvm use` inside the project folder.

The theory behind all of this, with sources, is in [docs/references.md](docs/references.md).

---

## Usage

You're free to use, fork, or build on this implementation. If it ends up in your own project, crediting me as co-author is appreciated, but not required.
