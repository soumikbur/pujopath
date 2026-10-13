export function formatTimeMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} mins`;
  return m === 0 ? `${h} hrs` : `${h}h ${m}m`;
}
