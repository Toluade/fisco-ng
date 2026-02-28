// ─── Currency formatting ──────────────────────────────────────────────────────

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const nairaFormatterDecimal = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNaira(value: number, decimals = false): string {
  if (decimals) return nairaFormatterDecimal.format(value);
  return nairaFormatter.format(value);
}

export function formatPercent(rate: number, decimals = 1): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}

// ─── Input parsing ────────────────────────────────────────────────────────────

/**
 * Parses a user-typed naira value, stripping commas, ₦ signs, and spaces.
 * Returns 0 for any non-numeric / empty input.
 */
export function parseNairaInput(raw: string): number {
  const cleaned = raw.replace(/[₦,\s]/g, "").trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

/**
 * Formats a number for display in a currency input field (no symbol, with commas).
 */
export function formatInputValue(value: number): string {
  if (value === 0) return "";
  return new Intl.NumberFormat("en-NG").format(value);
}
