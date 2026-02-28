import type { DeductionItem, EmployedInputs, ReliefItem, SelfEmployedInputs } from "./types";
import { MONTHS } from "./types";

// ─── Rent Relief (NTA 2025 Section 30(vi)) ──────────────────────────────────
// 20% of annual rent paid, capped at ₦500,000/year
export const MAX_RENT_RELIEF = 500_000;

export function computeRentRelief(annualRent: number): ReliefItem | null {
  if (annualRent <= 0) return null;
  const annualAmount = Math.min(annualRent * 0.2, MAX_RENT_RELIEF);
  return {
    label: "Rent Relief",
    annualAmount,
    monthlyAmount: annualAmount / 12,
    source: "NTA 2025 §30(vi)",
  };
}

// ─── Work Expenses Relief (NTA 2025 Section 20) ──────────────────────────────
// Business expenses wholly & exclusively incurred in production of income
export function computeWorkExpensesRelief(
  monthlyWorkExpenses: number,
  monthsElapsed: number
): ReliefItem | null {
  if (monthlyWorkExpenses <= 0) return null;
  const annualAmount = monthlyWorkExpenses * 12;
  const ytdAmount = monthlyWorkExpenses * monthsElapsed;
  return {
    label: "Work Expenses",
    annualAmount,
    monthlyAmount: monthlyWorkExpenses,
    source: `NTA 2025 §20 (YTD: ${monthsElapsed}mo)`,
    // We store annualAmount for projection; caller decides which to use
    _ytdAmount: ytdAmount,
  } as ReliefItem & { _ytdAmount: number };
}

// ─── Employed Deductions ─────────────────────────────────────────────────────

export function computeEmployedDeductions(inputs: EmployedInputs): DeductionItem[] {
  const annualGross = inputs.monthlyGrossIncome * 12;
  const deductions: DeductionItem[] = [];

  if (inputs.includePension) {
    const annual = annualGross * 0.08;
    deductions.push({
      label: "Pension (8%)",
      annualAmount: annual,
      monthlyAmount: annual / 12,
      rate: 0.08,
    });
  }

  if (inputs.includeNhf) {
    const annual = annualGross * 0.025;
    deductions.push({
      label: "NHF (2.5%)",
      annualAmount: annual,
      monthlyAmount: annual / 12,
      rate: 0.025,
    });
  }

  if (inputs.includeNhis) {
    const annual = annualGross * 0.0175;
    deductions.push({
      label: "NHIS (1.75%)",
      annualAmount: annual,
      monthlyAmount: annual / 12,
      rate: 0.0175,
    });
  }

  return deductions;
}

// ─── Employed Reliefs ────────────────────────────────────────────────────────

export function computeEmployedReliefs(inputs: EmployedInputs): ReliefItem[] {
  const reliefs: ReliefItem[] = [];
  const rentRelief = computeRentRelief(inputs.annualRent);
  if (rentRelief) reliefs.push(rentRelief);
  return reliefs;
}

// ─── Self-Employed Reliefs ───────────────────────────────────────────────────

export function computeSelfEmployedReliefs(
  inputs: SelfEmployedInputs,
  monthsElapsed: number
): { annualReliefs: ReliefItem[]; ytdReliefs: ReliefItem[] } {
  const annualReliefs: ReliefItem[] = [];
  const ytdReliefs: ReliefItem[] = [];

  // Rent relief — full annual amount regardless of months elapsed
  const rentRelief = computeRentRelief(inputs.annualRent);
  if (rentRelief) {
    annualReliefs.push(rentRelief);
    ytdReliefs.push(rentRelief); // applied in full for YTD too
  }

  // Work expenses — summed from per-month log
  const ytdExpenses = MONTHS.slice(0, monthsElapsed).reduce(
    (sum, m) => sum + (inputs.monthlyExpenses[m] ?? 0), 0
  );
  if (ytdExpenses > 0) {
    const avgMonthly = ytdExpenses / monthsElapsed;
    const projectedAnnual = avgMonthly * 12;
    annualReliefs.push({
      label: "Work Expenses",
      annualAmount: projectedAnnual,
      monthlyAmount: avgMonthly,
      source: "NTA 2025 §20",
    });
    ytdReliefs.push({
      label: "Work Expenses (YTD)",
      annualAmount: ytdExpenses,
      monthlyAmount: avgMonthly,
      source: "NTA 2025 §20",
    });
  }

  return { annualReliefs, ytdReliefs };
}
