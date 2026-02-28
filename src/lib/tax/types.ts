// ─── Employment Type ────────────────────────────────────────────────────────

export type EmploymentType = "employed" | "self-employed";

// ─── Month identifiers ───────────────────────────────────────────────────────

export type Month =
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "jun"
  | "jul"
  | "aug"
  | "sep"
  | "oct"
  | "nov"
  | "dec";

export const MONTHS: Month[] = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

export const MONTH_LABELS: Record<Month, string> = {
  jan: "January", feb: "February", mar: "March", apr: "April",
  may: "May", jun: "June", jul: "July", aug: "August",
  sep: "September", oct: "October", nov: "November", dec: "December",
};

// ─── Tax Bracket ─────────────────────────────────────────────────────────────

export interface TaxBracket {
  label: string;
  from: number;   // inclusive lower bound (annual)
  to: number;     // exclusive upper bound (annual); Infinity for last band
  rate: number;   // 0–1
}

// ─── Relief Item ─────────────────────────────────────────────────────────────

export interface ReliefItem {
  label: string;
  annualAmount: number;
  monthlyAmount: number;
  source?: string; // e.g. "Section 30(vi)"
}

// ─── Deduction Item ──────────────────────────────────────────────────────────

export interface DeductionItem {
  label: string;
  annualAmount: number;
  monthlyAmount: number;
  rate?: number;
}

// ─── Band Result ─────────────────────────────────────────────────────────────

export interface BandResult {
  label: string;
  rate: number;
  taxableInBand: number;  // income portion falling in this band (annual)
  taxInBand: number;      // tax owed for this band (annual)
}

// ─── Tax Inputs ──────────────────────────────────────────────────────────────

export interface EmployedInputs {
  employmentType: "employed";
  monthlyGrossIncome: number;
  annualRent: number;         // full annual rent paid
  includePension: boolean;
  includeNhf: boolean;
  includeNhis: boolean;
}

export interface SelfEmployedInputs {
  employmentType: "self-employed";
  monthlyIncomes: Record<Month, number>;
  annualRent: number;              // full annual rent paid
  monthlyWorkExpenses: number;     // monthly work/business expenses
  currentMonth: number;            // 0-indexed (0 = Jan, 11 = Dec) — last filled month
}

export type TaxInputs = EmployedInputs | SelfEmployedInputs;

// ─── Tax Calculation Result ───────────────────────────────────────────────────

export interface TaxCalculationResult {
  // Annualised figures
  annualGrossIncome: number;
  annualDeductions: DeductionItem[];
  totalAnnualDeductions: number;
  annualReliefs: ReliefItem[];
  totalAnnualReliefs: number;
  annualTaxableIncome: number;
  annualTax: number;

  // Band-by-band breakdown
  bandBreakdown: BandResult[];

  // Monthly equivalents (employed mode)
  monthlyGrossIncome?: number;
  monthlyTax?: number;
  monthlyNetIncome?: number;

  // YTD figures (self-employed mode)
  ytdGrossIncome?: number;
  ytdTaxableIncome?: number;
  ytdTaxOwed?: number;
  ytdNetIncome?: number;
  projectedAnnualTax?: number;
  projectedAnnualIncome?: number;
  monthsElapsed?: number;

  // Effective rate
  effectiveRate: number;
}
