import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaSubscriber } from '@core/kafka/kafka.subscriber';
import {
  HEALTH_COST_MESSAGE,
  HEALTH_OUTAGE_MESSAGE,
  HEALTH_THRESHOLD_MESSAGE,
} from './health.constants';
import { HealthService } from './health.service';
import type {
  Cost,
  Outage,
  ThresholdBreach,
} from './interfaces/health.interface';

@Injectable()
export class HealthConsumer implements OnModuleInit {
  constructor(
    private readonly kafkaSubscriber: KafkaSubscriber,
    private readonly healthService: HealthService,
  ) {}

  onModuleInit(): void {
    this.kafkaSubscriber.subscribe<Outage>(HEALTH_OUTAGE_MESSAGE, (message) =>
      this.healthService.outage(message),
    );
    this.kafkaSubscriber.subscribe<ThresholdBreach>(
      HEALTH_THRESHOLD_MESSAGE,
      (message) => this.healthService.threshold(message),
    );
    this.kafkaSubscriber.subscribe<Cost>(HEALTH_COST_MESSAGE, (message) =>
      this.healthService.cost(message),
    );
  }
}
