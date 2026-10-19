# References — theory behind RabbitMQ and Kafka

This is the reading list behind the two implementations in this repo. It focuses on **theory**: the model each broker is built on, how it routes and delivers messages, and the guarantees it gives. It doesn't cover installation or operations.

Each section starts from the **origin**, the specification or paper that defined the model, and moves toward how the model is used in event-driven systems today.

| Branch | Read |
| --- | --- |
| `stable/rabbit` | [RabbitMQ](#rabbitmq) |
| `stable/kafka` | [Kafka](#kafka) |

---

## RabbitMQ

RabbitMQ is a **message broker** that implements the AMQP 0-9-1 protocol. Producers publish to **exchanges**. **Bindings** route each message to one or more **queues**. A message is removed from a queue once a consumer **acknowledges** it. The broker does the routing, and the consumer only has to process what it receives.

1. **[Origin] AMQP 0-9-1 Specification**. AMQP Working Group, 2008.
   - https://www.rabbitmq.com/resources/specs/amqp0-9-1.pdf
   - This is the protocol RabbitMQ implements. It defines the exchange / queue / binding model, the four exchange types (direct, fanout, topic, headers), and the semantics for acknowledgements (ack / nack / reject), persistence and transactions.
   - Note that AMQP 1.0 (OASIS / ISO 19464) is a different protocol, not a newer version of 0-9-1. RabbitMQ's native model is 0-9-1.

2. **AMQP 0-9-1 Model Explained**. RabbitMQ documentation.
   - https://www.rabbitmq.com/tutorials/amqp-concepts
   - A readable walkthrough of the same model as the specification: exchanges, queues, bindings, routing keys and acknowledgements. Read it alongside the spec.

3. **Next-Generation Event-Driven Architectures: Performance, Scalability, and Intelligent Orchestration Across Messaging Frameworks**. Arafat, Tasmin, Poudel, 2025.
   - https://arxiv.org/abs/2510.04404
   - Compares messaging frameworks, with substantial coverage of RabbitMQ. It covers delivery and ordering trade-offs, and event-driven patterns such as CQRS and sagas. It shows how brokers are used in event-driven systems today.

4. **A Study on Messaging Trade-offs in Data Streaming for Scientific Workflows**. George et al., 2025.
   - https://arxiv.org/abs/2509.07199
   - Analyses the design trade-offs between brokered messaging in the style of RabbitMQ and streaming, including the choices around delivery and reliability.

5. **An Empirical Study on Challenges of Event Management in Microservice Architectures**. Laigner, Almeida, Assunção, Zhou, 2024.
   - https://arxiv.org/abs/2408.00440
   - Covers publishing semantics, consistency and decoupling problems in event-driven microservices, and the delivery-guarantee questions that come up on top of any broker. It is broker-agnostic, so it gives the architecture's point of view rather than RabbitMQ's.

6. **Modeling and Analysis of RabbitMQ Using UPPAAL**. IEEE conference paper, 2020.
   - https://ieeexplore.ieee.org/abstract/document/9343066 (paywalled; abstract only)
   - A formal model of RabbitMQ built with timed automata. It verifies data reachability, sequence consistency and message acknowledgement. Of the papers listed here, it is the only one that models RabbitMQ's acknowledgement mechanism directly.

---

## Kafka

Kafka is a **distributed commit log**. Producers append records to **topics**, which are split into **partitions**. Records stay in the log after they are read, until the retention policy removes them. Each **consumer group** tracks its own position (**offset**) in every partition. Ordering is guaranteed only within a partition. Because consumers decide where to read from, the same events can be replayed.

1. **[Origin] Kafka: a Distributed Messaging System for Log Processing**. Kreps, Narkhede, Rao, 2011 (NetDB).
   - https://people.csail.mit.edu/matei/courses/2015/6.S897/readings/kafka.pdf
   - The original design paper. It covers one log per partition, topics and partitions, consumers that pull by offset, consumer groups, and the guarantees Kafka started with: at-least-once delivery and ordering within a partition.

2. **[Origin] The Log: What every software engineer should know about real-time data's unifying abstraction**. Jay Kreps, 2013.
   - https://web.archive.org/web/2022/https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying (archived copy; the original LinkedIn URL no longer resolves)
   - The idea behind Kafka: an ordered, append-only log used as the shared abstraction for replication, data integration and event-driven or stream-processing systems.

3. **Apache Kafka Documentation: Design and Message Delivery Semantics**. Apache Kafka project, current version.
   - https://kafka.apache.org/documentation/#design
   - https://kafka.apache.org/documentation/#semantics
   - The current official description of the design. It covers the log, partitions and offsets, consumer groups and rebalancing, replication and in-sync replicas (ISR), ordering, and the three delivery semantics: at-most-once, at-least-once and exactly-once.

4. **KIP-98: Exactly Once Delivery and Transactional Messaging**. Apache Kafka design proposal, 2017.
   - https://cwiki.apache.org/confluence/display/KAFKA/KIP-98+-+Exactly+Once+Delivery+and+Transactional+Messaging
   - The design specification for exactly-once delivery. Producer IDs and sequence numbers make producers idempotent. A transaction coordinator makes writes across several partitions atomic. Consumers set to read-committed only see committed transactions.

5. **Consistency and Completeness: Rethinking Distributed Stream Processing in Apache Kafka**. Wang et al., 2021 (SIGMOD, DOI 10.1145/3448016.3457556).
   - https://www.confluent.io/blog/rethinking-distributed-stream-processing-in-kafka/
   - Explains how idempotent producers and transactions give exactly-once processing on top of the log. It also covers the read-process-write model that event-driven and stream-processing applications are built on.

> The design has evolved since the original paper. In 2011 Kafka offered at-least-once delivery only. Exactly-once arrived in Kafka 0.11 (2017), so read items 3 to 5 for the guarantees Kafka gives today.

---

## Comparing both

- **Kafka versus RabbitMQ**. Dobbelaere, Sheykh Esmaili, 2017.
  - https://arxiv.org/abs/1709.00333
  - Compares RabbitMQ's model, where the broker routes and consumers acknowledge, with Kafka's, where a log is kept and consumers track their own offsets. It is the best single read before comparing the two branches.
