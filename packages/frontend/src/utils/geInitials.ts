/**
 * Get initials from a full name.
 *
 * @param {string} name - The full name string from which to get the initials.
 * @returns {string} A string of initials.
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((n) => n)
    .map((n) => n[0].toUpperCase())
    .join('');
}
