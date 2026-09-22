export function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Inclusive day count between two dates.
export function countDays(start, end) {
  const ms = new Date(end) - new Date(start);
  return Math.floor(ms / 86400000) + 1;
}
