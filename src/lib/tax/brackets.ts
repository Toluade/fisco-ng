import type { TaxBracket } from "./types";

// NTA 2025 — Annual progressive tax brackets
export const TAX_BRACKETS: TaxBracket[] = [
  {
    label: "First ₦800,000",
    from: 0,
    to: 800_000,
    rate: 0,
  },
  {
    label: "₦800k – ₦3m",
    from: 800_000,
    to: 3_000_000,
    rate: 0.15,
  },
  {
    label: "₦3m – ₦12m",
    from: 3_000_000,
    to: 12_000_000,
    rate: 0.18,
  },
  {
    label: "₦12m – ₦25m",
    from: 12_000_000,
    to: 25_000_000,
    rate: 0.21,
  },
  {
    label: "₦25m – ₦50m",
    from: 25_000_000,
    to: 50_000_000,
    rate: 0.23,
  },
  {
    label: "Above ₦50m",
    from: 50_000_000,
    to: Infinity,
    rate: 0.25,
  },
];
