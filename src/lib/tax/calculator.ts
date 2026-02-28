import { TAX_BRACKETS } from "./brackets";
import {
  computeEmployedDeductions,
  computeEmployedReliefs,
  computeSelfEmployedReliefs,
} from "./reliefs";
import type {
  BandResult,
  EmployedInputs,
  Month,
  SelfEmployedInputs,
  TaxCalculationResult,
  TaxInputs,
} from "./types";
import { MONTHS } from "./types";

// ─── Core bracket engine ──────────────────────────────────────────────────────

export function applyBrackets(annualTaxableIncome: number): {
  bandBreakdown: BandResult[];
  annualTax: number;
} {
  if (annualTaxableIncome <= 0) {
    return {
      bandBreakdown: TAX_BRACKETS.map((b) => ({
        label: b.label,
        rate: b.rate,
        taxableInBand: 0,
        taxInBand: 0,
      })),
      annualTax: 0,
    };
  }

  let remaining = annualTaxableIncome;
  let annualTax = 0;
  const bandBreakdown: BandResult[] = [];

  for (const bracket of TAX_BRACKETS) {
    const bandWidth =
      bracket.to === Infinity ? remaining : Math.min(bracket.to - bracket.from, remaining);
    const taxableInBand = Math.max(0, Math.min(bandWidth, remaining));
    const taxInBand = taxableInBand * bracket.rate;

    bandBreakdown.push({
      label: bracket.label,
      rate: bracket.rate,
      taxableInBand,
      taxInBand,
    });

    annualTax += taxInBand;
    remaining -= taxableInBand;
    if (remaining <= 0) break;
  }

  // Fill remaining brackets with 0 if we ran out of income early
  while (bandBreakdown.length < TAX_BRACKETS.length) {
    const bracket = TAX_BRACKETS[bandBreakdown.length];
    bandBreakdown.push({
      label: bracket.label,
      rate: bracket.rate,
      taxableInBand: 0,
      taxInBand: 0,
    });
  }

  return { bandBreakdown, annualTax };
}

// ─── Employed calculation ────────────────────────────────────────────────────

function calculateEmployed(inputs: EmployedInputs): TaxCalculationResult {
  const annualGrossIncome = inputs.monthlyGrossIncome * 12;

  // Pre-tax deductions
  const annualDeductions = computeEmployedDeductions(inputs);
  const totalAnnualDeductions = annualDeductions.reduce((s, d) => s + d.annualAmount, 0);

  // Reliefs
  const annualReliefs = computeEmployedReliefs(inputs);
  const totalAnnualReliefs = annualReliefs.reduce((s, r) => s + r.annualAmount, 0);

  // Taxable income
  const annualTaxableIncome = Math.max(
    0,
    annualGrossIncome - totalAnnualDeductions - totalAnnualReliefs
  );

  // Apply brackets
  const { bandBreakdown, annualTax } = applyBrackets(annualTaxableIncome);

  const monthlyTax = annualTax / 12;
  const monthlyNetIncome = inputs.monthlyGrossIncome - monthlyTax;

  const effectiveRate =
    annualGrossIncome > 0 ? annualTax / annualGrossIncome : 0;

  return {
    annualGrossIncome,
    annualDeductions,
    totalAnnualDeductions,
    annualReliefs,
    totalAnnualReliefs,
    annualTaxableIncome,
    annualTax,
    bandBreakdown,
    monthlyGrossIncome: inputs.monthlyGrossIncome,
    monthlyTax,
    monthlyNetIncome,
    effectiveRate,
  };
}

// ─── Self-employed (YTD) calculation ─────────────────────────────────────────

function calculateSelfEmployed(inputs: SelfEmployedInputs): TaxCalculationResult {
  const currentMonthIndex = inputs.currentMonth; // 0 = Jan, 11 = Dec
  const monthsElapsed = currentMonthIndex + 1;

  // Sum YTD income (months up to and including currentMonth)
  const elapsedMonths = MONTHS.slice(0, monthsElapsed) as Month[];
  const rate = inputs.incomeCurrency === "NGN" ? 1 : inputs.exchangeRateToNgn;
  const ytdGrossIncome = elapsedMonths.reduce(
    (sum, m) => sum + (inputs.monthlyIncomes[m] ?? 0) * rate,
    0
  );

  // Reliefs
  const { annualReliefs, ytdReliefs } = computeSelfEmployedReliefs(inputs, monthsElapsed);
  const totalYtdReliefs = ytdReliefs.reduce((s, r) => s + r.annualAmount, 0);

  // YTD taxable income
  const ytdTaxableIncome = Math.max(0, ytdGrossIncome - totalYtdReliefs);

  // YTD tax
  const { bandBreakdown, annualTax: ytdTaxOwed } = applyBrackets(ytdTaxableIncome);

  // Projected annual: extrapolate from YTD average
  const avgMonthlyIncome = monthsElapsed > 0 ? ytdGrossIncome / monthsElapsed : 0;
  const projectedAnnualIncome = avgMonthlyIncome * 12;

  // For projection, use annual reliefs
  const totalAnnualReliefs = annualReliefs.reduce((s, r) => s + r.annualAmount, 0);
  const projectedAnnualTaxableIncome = Math.max(
    0,
    projectedAnnualIncome - totalAnnualReliefs
  );
  const { annualTax: projectedAnnualTax } = applyBrackets(projectedAnnualTaxableIncome);

  const ytdNetIncome = ytdGrossIncome - ytdTaxOwed;

  const effectiveRate = ytdGrossIncome > 0 ? ytdTaxOwed / ytdGrossIncome : 0;

  return {
    annualGrossIncome: projectedAnnualIncome,
    annualDeductions: [],
    totalAnnualDeductions: 0,
    annualReliefs,
    totalAnnualReliefs,
    annualTaxableIncome: projectedAnnualTaxableIncome,
    annualTax: projectedAnnualTax,
    bandBreakdown,
    ytdGrossIncome,
    ytdTaxableIncome,
    ytdTaxOwed,
    ytdNetIncome,
    projectedAnnualTax,
    projectedAnnualIncome,
    monthsElapsed,
    effectiveRate,
  };
}

// ─── Public entry point ───────────────────────────────────────────────────────

export function calculateTax(inputs: TaxInputs): TaxCalculationResult {
  if (inputs.employmentType === "employed") {
    return calculateEmployed(inputs);
  }
  return calculateSelfEmployed(inputs);
}
