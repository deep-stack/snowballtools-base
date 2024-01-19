import { DateTime } from 'luxon';

/**
 * Converts an ISO 8601 formatted time to a human-readable relative time with respect to the current time.
 *
 * @param {string} time - The input time in ISO 8601 format.
 * @returns {string} - A human-readable relative time string.
 */
export const relativeTime = (time: string) => {
  return DateTime.fromISO(time).toRelative();
};

/**
 * Converts time in millisecond format to a human-readable relative time with respect to the current time.
 *
 * @param {string} time - The input time in millisecond.
 * @returns {string} - A human-readable relative time string.
 */
export const relativeTimeMs = (time: string) => {
  return relativeTime(new Date(Number(time)).toISOString());
};
