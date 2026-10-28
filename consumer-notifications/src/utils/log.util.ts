const WHITESPACE_PATTERN = /\s/;

/**
 * Formats values as `key=value` pairs, so each log line reads as a set of
 * fields instead of a sentence.
 *
 * @param fields - The values to log, by name. `undefined` ones are left out.
 * @returns The pairs separated by spaces, quoting any value that has spaces.
 */
export function toLogFields(fields: Record<string, unknown>): string {
  return Object.entries(fields)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${formatValue(value)}`)
    .join(' ');
}

function formatValue(value: unknown): string {
  const text = String(value);

  return WHITESPACE_PATTERN.test(text) ? JSON.stringify(text) : text;
}
