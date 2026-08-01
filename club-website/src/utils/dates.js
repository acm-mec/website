/**
 * parseLocalDate — parses a "YYYY-MM-DD" string as local midnight,
 * avoiding the 1-day shift that occurs when Date() parses bare ISO
 * date strings as UTC midnight.
 *
 * @param {string} dateStr — e.g. "2026-09-12"
 * @returns {Date}
 */
export function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * formatDate — formats a "YYYY-MM-DD" string into a localized date string.
 *
 * @param {string} dateStr — e.g. "2026-09-12"
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string} — e.g. "Sep 12, 2026"
 */
export function formatDate(dateStr, options = { year: "numeric", month: "short", day: "numeric" }) {
  return new Intl.DateTimeFormat("en-US", options).format(parseLocalDate(dateStr));
}
