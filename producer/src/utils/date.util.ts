const MILLISECONDS_PER_SECOND = 1000;

/**
 * Converts a date into the Unix time an AMQP `timestamp` property carries.
 *
 * AMQP 0-9-1 defines `timestamp` in whole seconds, not milliseconds, so the
 * fraction of a second is dropped. Every consumer reads it back with the
 * same convention.
 *
 * @param date - The moment to convert.
 * @returns The whole seconds elapsed since the Unix epoch.
 */
export function toUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / MILLISECONDS_PER_SECOND);
}
