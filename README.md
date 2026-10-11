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

**This is `main`.** It holds only the empty Nest project and this explanation. The event-driven logic lives in the `stable/*` branches.

> If you're new to event-driven architecture, start with **stable/rabbit**, where the flow of a message from producer to consumer is the most explicit. Then compare it with **stable/kafka** to see how the same flow changes once events are stored and replayable instead of consumed and gone.

---

## Technology

I decided to use **Nest** with **TypeScript** as the framework for this implementation, because Node is my main stack. Nest also ships with a microservices module that has transports for both RabbitMQ and Kafka, so both branches start from the same building blocks.

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

## Getting started

> This project runs on **Node 24**. The exact version is pinned in `.nvmrc`, so run `nvm use` to switch to it.

```bash
nvm use
npm i
npm run start:dev            # http://localhost:3000
```

| Command | Purpose |
| --- | --- |
| `npm run start:dev` | Dev server in watch mode |
| `npm run build` | Production build |
| `npm run start:prod` | Serve the production build (run after `build`) |
| `npm run lint` | oxlint |
| `npm run format` | Prettier |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests |
| `npm run test:cov` | Unit tests with coverage |

Each `stable/*` branch adds its own broker setup (a `docker-compose.yml` to run it locally) and documents it in its own README.

---

## Usage

You're free to use, fork, or build on this implementation. If it ends up in your own project, crediting me as co-author is appreciated, but not required.
