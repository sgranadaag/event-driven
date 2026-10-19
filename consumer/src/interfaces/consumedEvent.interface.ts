export interface ConsumedEvent<Payload = unknown> {
  id: string;
  type: string;
  occurredAt: Date;
  redelivered: boolean;
  payload: Payload;
}

export type EventHandler<Payload = unknown> = (
  event: ConsumedEvent<Payload>,
) => void | Promise<void>;
