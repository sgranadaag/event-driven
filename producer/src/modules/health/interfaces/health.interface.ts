export interface HealthEvent {
  id: string;
  service: string;
}

export interface Outage extends HealthEvent {
  reason: string;
}

export interface ThresholdBreach extends HealthEvent {
  metric: string;
  value: number;
  threshold: number;
}

export interface Cost extends HealthEvent {
  amount: number;
  currency: string;
}
