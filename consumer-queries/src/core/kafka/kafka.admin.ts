import { setTimeout as sleep } from 'node:timers/promises';
import type { KafkaJS } from '@confluentinc/kafka-javascript';
import type { TopicDefinition } from '@interfaces/kafka.interface';
import {
  NO_LEADER,
  REPLICATION_FACTOR,
  TOPIC_READY_ATTEMPTS,
  TOPIC_READY_INTERVAL_MS,
} from './kafka.constants';

export class KafkaAdmin {
  constructor(private readonly admin: KafkaJS.Admin) {}

  async createTopics(
    topics: TopicDefinition[],
    { waitForLeaders = false } = {},
  ): Promise<void> {
    await this.admin.connect();
    try {
      await this.admin.createTopics({ topics: topics.map(toTopicConfig) });
      if (waitForLeaders) await this.waitForLeaders(topics);
    } finally {
      await this.admin.disconnect();
    }
  }

  private async waitForLeaders(topics: TopicDefinition[]): Promise<void> {
    for (let attempt = 1; attempt <= TOPIC_READY_ATTEMPTS; attempt++) {
      if (await this.haveLeaders(topics)) return;

      await sleep(TOPIC_READY_INTERVAL_MS);
    }

    const topicNames = topics.map((topic) => topic.name).join(', ');
    throw new Error(`Topics without leaders after ${TOPIC_READY_ATTEMPTS} attempts: ${topicNames}`);
  }

  private async haveLeaders(topics: TopicDefinition[]): Promise<boolean> {
    try {
      const metadata = await this.admin.fetchTopicMetadata({
        topics: topics.map((topic) => topic.name),
      });

      return metadata.every(
        ({ partitions }) =>
          partitions.length > 0 &&
          partitions.every((partition) => partition.leader !== NO_LEADER),
      );
    } catch {
      return false;
    }
  }
}

function toTopicConfig({
  name,
  partitions,
  config,
}: TopicDefinition): KafkaJS.ITopicConfig {
  return {
    topic: name,
    numPartitions: partitions,
    replicationFactor: REPLICATION_FACTOR,
    configEntries: Object.entries(config).map(([configName, value]) => ({
      name: configName,
      value,
    })),
  };
}
