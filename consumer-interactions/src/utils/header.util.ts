import type { KafkaJS } from '@confluentinc/kafka-javascript';

/**
 * Reads one header of a Kafka message as text.
 *
 * Kafka headers are raw bytes and a name can repeat, so the client hands
 * them over as buffers, or as an array of them when a name appears more than
 * once. The first value wins.
 *
 * @param headers - The headers of the message, if it has any.
 * @param name - The header to read.
 * @returns Its value as a string, or `undefined` when the message lacks it.
 */
export function readHeader(
  headers: KafkaJS.IHeaders | undefined,
  name: string,
): string | undefined {
  const value = headers?.[name];
  const firstValue = Array.isArray(value) ? value[0] : value;

  return firstValue?.toString();
}
