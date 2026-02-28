import type { TaxCalculationResult } from "@/lib/tax";
import { formatNaira, formatPercent } from "@/lib/utils/format";
import { SummaryCard } from "./SummaryCard";

// ─── Employed Summary ─────────────────────────────────────────────────────────

interface EmployedSummaryProps {
  result: TaxCalculationResult;
}

export function EmployedSummary({ result }: EmployedSummaryProps) {
  const {
    monthlyTax = 0,
    monthlyNetIncome = 0,
    annualTax,
    effectiveRate,
    monthlyGrossIncome = 0,
  } = result;

  if (monthlyGrossIncome === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <SummaryCard
        label="Monthly Tax (PAYE)"
        value={formatNaira(monthlyTax)}
        highlight
      />
      <SummaryCard
        label="Effective Rate"
        value={formatPercent(effectiveRate)}
        subValue="on gross income"
      />
      <SummaryCard
        label="Annual Tax"
        value={formatNaira(annualTax)}
        subValue="per year"
      />
      <SummaryCard
        label="Monthly Net"
        value={formatNaira(monthlyNetIncome)}
        subValue="take-home pay"
      />
    </div>
  );
}

// ─── Self-Employed Summary ────────────────────────────────────────────────────

interface SelfEmployedSummaryProps {
  result: TaxCalculationResult;
}

export function SelfEmployedSummary({ result }: SelfEmployedSummaryProps) {
  const {
    ytdTaxOwed = 0,
    projectedAnnualTax = 0,
    effectiveRate,
    ytdNetIncome = 0,
    ytdGrossIncome = 0,
    monthsElapsed = 0,
  } = result;

  if (ytdGrossIncome === 0) return null;

  const remainingMonths = 12 - monthsElapsed;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <SummaryCard
        label="YTD Tax Owed"
        value={formatNaira(ytdTaxOwed)}
        subValue={`${monthsElapsed} month${monthsElapsed !== 1 ? "s" : ""}`}
        highlight
      />
      <SummaryCard
        label="Projected Annual Tax"
        value={formatNaira(projectedAnnualTax)}
        subValue="based on YTD average"
      />
      <SummaryCard
        label="Effective Rate"
        value={formatPercent(effectiveRate)}
        subValue="on YTD gross"
      />
      <SummaryCard
        label="YTD Net Income"
        value={formatNaira(ytdNetIncome)}
        subValue={
          remainingMonths > 0
            ? `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""} remaining`
            : "Year complete"
        }
      />
    </div>
  );
}
