export function formatDistanceMiles(miles: number): string {
  if (miles < 0.2) {
    const feet = Math.round(miles * 5280);
    return `${feet} ft away`;
  }
  return `${miles.toFixed(1)} mi away`;
}
