export function formatCurrencyRange(value: number): string {
  if (value < 30000) return "AED 18,000 - 35,000";
  if (value < 60000) return "AED 35,000 - 70,000";
  if (value < 120000) return "AED 70,000 - 140,000";
  return "AED 140,000 - 250,000";
}
