import { randomUUID } from 'node:crypto';

/**
 * Generates the id of anything this service creates: orders and events.
 *
 * @returns A random UUID v4 string.
 */
export function generateId(): string {
  return randomUUID();
}
