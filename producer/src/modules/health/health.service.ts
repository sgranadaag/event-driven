import { Injectable } from '@nestjs/common';
import { KafkaPublisher } from '@core/kafka/kafka.publisher';
import { KAFKA_SCHEMA } from '@core/kafka/kafka.schema';
import { generateId } from '@utils/crypto.util';
import {
  HEALTH_COST_MESSAGE,
  HEALTH_OUTAGE_MESSAGE,
  HEALTH_THRESHOLD_MESSAGE,
} from './health.constants';
import type {
  Cost,
  HealthEvent,
  Outage,
  ThresholdBreach,
} from './interfaces/health.interface';
import type {
  CostInput,
  OutageInput,
  PublishHealthResult,
  ThresholdBreachInput,
} from './interfaces/publishHealth.interface';

@Injectable()
export class HealthService {
  constructor(private readonly kafkaPublisher: KafkaPublisher) {}

  reportOutage({ service, reason }: OutageInput): Promise<PublishHealthResult> {
    const outage: Outage = { id: generateId(), service, reason };

    return this.publish(HEALTH_OUTAGE_MESSAGE, outage);
  }

  reportThreshold({
    service,
    metric,
    value,
    threshold,
  }: ThresholdBreachInput): Promise<PublishHealthResult> {
    const breach: ThresholdBreach = {
      id: generateId(),
      service,
      metric,
      value,
      threshold,
    };

    return this.publish(HEALTH_THRESHOLD_MESSAGE, breach);
  }

  reportCost({ service, amount, currency }: CostInput): Promise<PublishHealthResult> {
    const cost: Cost = { id: generateId(), service, amount, currency };

    return this.publish(HEALTH_COST_MESSAGE, cost);
  }

  private async publish(
    type: string,
    healthEvent: HealthEvent,
  ): Promise<PublishHealthResult> {
    const result = await this.kafkaPublisher.publish({
      topic: KAFKA_SCHEMA.topics.health.name,
      type,
      key: healthEvent.service,
      payload: healthEvent,
    });

    return { healthEvent, ...result };
  }
}
