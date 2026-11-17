import type { HealthEvent } from './health.interface';

export interface OutageInput {
  service: string;
  reason: string;
}

export interface ThresholdBreachInput {
  service: string;
  metric: string;
  value: number;
  threshold: number;
}

export interface CostInput {
  service: string;
  amount: number;
  currency: string;
}

export interface PublishHealthResult {
  healthEvent: HealthEvent;
  messageId: string;
  partition: number;
  offset: string;
}
