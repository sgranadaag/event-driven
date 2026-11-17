/**
 * Converts the timestamp a Kafka message carries into a date.
 *
 * Kafka stores it as milliseconds since the Unix epoch, written as a string:
 * by default, the moment the producer created the message (`CreateTime`).
 *
 * @param timestamp - The milliseconds elapsed since the Unix epoch.
 * @returns The date those milliseconds describe.
 */
export function fromTimestamp(timestamp: string): Date {
  return new Date(Number(timestamp));
}
