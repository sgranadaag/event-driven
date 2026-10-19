const MILLISECONDS_PER_SECOND = 1000;

/**
 * Converts the Unix time an AMQP `timestamp` property carries into a date.
 *
 * AMQP 0-9-1 defines `timestamp` in whole seconds, not milliseconds, which is
 * how the producer writes it.
 *
 * @param seconds - Whole seconds elapsed since the Unix epoch.
 * @returns The date those seconds describe.
 */
export function fromUnixSeconds(seconds: number): Date {
  return new Date(seconds * MILLISECONDS_PER_SECOND);
}
