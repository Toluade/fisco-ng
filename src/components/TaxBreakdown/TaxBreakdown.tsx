import { Badge } from "@/components/ui/badge";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Separator } from "@/components/ui/separator";
import type { BandResult, DeductionItem, MonthlyTaxRow, ReliefItem, TaxCalculationResult } from "@/lib/tax";
import { MONTH_LABELS } from "@/lib/tax";
import { cn } from "@/lib/utils";
import { formatNaira, formatPercent } from "@/lib/utils/format";

interface TaxBreakdownProps {
  result: TaxCalculationResult;
  mode: "employed" | "self-employed";
}

export function TaxBreakdown({ result, mode }: TaxBreakdownProps) {
  const {
    annualGrossIncome,
    annualDeductions,
    totalAnnualDeductions,
    annualReliefs,
    totalAnnualReliefs,
    annualTaxableIncome,
    annualTax,
    bandBreakdown,
    ytdGrossIncome,
    ytdTaxableIncome,
    ytdTaxOwed,
    monthlyTax,
    monthlyGrossIncome = 0,
    monthlyTaxBreakdown,
  } = result;

  const isEmployed = mode === "employed";
  const showData = isEmployed
    ? monthlyGrossIncome > 0
    : (ytdGrossIncome ?? 0) > 0 || (monthlyTaxBreakdown?.length ?? 0) > 0;

  if (!showData) return null;

  const grossLabel = isEmployed ? "Annual Gross Income" : "YTD Gross Income";
  const grossValue = isEmployed ? annualGrossIncome : (ytdGrossIncome ?? 0);
  const taxableLabel = isEmployed ? "Annual Taxable Income" : "YTD Taxable Income";
  const taxableValue = isEmployed ? annualTaxableIncome : (ytdTaxableIncome ?? 0);
  const taxLabel = isEmployed ? "Annual Tax" : "YTD Tax Owed";
  const taxValue = isEmployed ? annualTax : (ytdTaxOwed ?? 0);

  const breakdownSummary = isEmployed ? formatNaira(annualTax) : formatNaira(ytdTaxOwed ?? 0);

  return (
    <CollapsibleCard
      title={
        <>
          Tax Breakdown{" "}
          {!isEmployed && (
            <span className="text-muted-foreground font-normal text-sm">(Year-to-Date)</span>
          )}
        </>
      }
      summary={breakdownSummary}
      defaultOpen={true}
    >
      <div className="space-y-4">
        {/* Income */}
        <BreakdownRow label={grossLabel} value={formatNaira(grossValue)} bold />

        {/* Deductions (employed only) */}
        {isEmployed && annualDeductions.length > 0 && (
          <div className="space-y-1">
            {annualDeductions.map((d) => (
              <DeductionRow key={d.label} deduction={d} />
            ))}
            {annualDeductions.length > 1 && (
              <BreakdownRow
                label="Total Deductions"
                value={`− ${formatNaira(totalAnnualDeductions)}`}
                className="text-destructive"
              />
            )}
          </div>
        )}

        {/* Reliefs */}
        {annualReliefs.length > 0 && (
          <div className="space-y-1">
            {annualReliefs.map((r) => (
              <ReliefRow key={r.label} relief={r} />
            ))}
            {annualReliefs.length > 1 && (
              <BreakdownRow
                label="Total Reliefs"
                value={`− ${formatNaira(totalAnnualReliefs)}`}
                className="text-destructive"
              />
            )}
          </div>
        )}

        <Separator />

        {/* Taxable Income */}
        <BreakdownRow label={taxableLabel} value={formatNaira(taxableValue)} bold />

        {/* Band breakdown */}
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Progressive Bands
          </p>
          {bandBreakdown.map((band) => (
            <BandRow key={band.label} band={band} />
          ))}
        </div>

        <Separator />

        {/* Total */}
        <BreakdownRow label={taxLabel} value={formatNaira(taxValue)} bold highlight />

        {/* Monthly PAYE (employed only) */}
        {isEmployed && monthlyTax !== undefined && (
          <BreakdownRow
            label="Monthly PAYE"
            value={formatNaira(monthlyTax)}
            subLabel="(Annual ÷ 12)"
            bold
          />
        )}

        {/* Monthly breakdown (self-employed only) */}
        {!isEmployed && monthlyTaxBreakdown && monthlyTaxBreakdown.length > 0 && (
          <>
            <Separator />
            <MonthlyBreakdownSection rows={monthlyTaxBreakdown} />
          </>
        )}
      </div>
    </CollapsibleCard>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BreakdownRow({
  label,
  value,
  subLabel,
  bold = false,
  highlight = false,
  className,
}: {
  label: string;
  value: string;
  subLabel?: string;
  bold?: boolean;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4", className)}>
      <span
        className={cn(
          "text-sm",
          bold ? "font-semibold" : "text-muted-foreground",
          highlight && "text-primary font-bold"
        )}
      >
        {label}
        {subLabel && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">{subLabel}</span>
        )}
      </span>
      <span
        className={cn(
          "tabular-nums text-sm",
          bold ? "font-semibold" : "",
          highlight && "text-primary font-bold text-base"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function DeductionRow({ deduction }: { deduction: DeductionItem }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-muted-foreground">− {deduction.label}</span>
        {deduction.rate && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0">
            {formatPercent(deduction.rate, 2)}
          </Badge>
        )}
      </div>
      <span className="tabular-nums text-sm text-destructive">
        − {formatNaira(deduction.annualAmount)}
      </span>
    </div>
  );
}

function ReliefRow({ relief }: { relief: ReliefItem }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-muted-foreground">− {relief.label}</span>
        {relief.source && (
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            {relief.source}
          </Badge>
        )}
      </div>
      <span className="tabular-nums text-sm text-destructive">
        − {formatNaira(relief.annualAmount)}
      </span>
    </div>
  );
}

function BandRow({ band }: { band: BandResult }) {
  const isActive = band.taxableInBand > 0;
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded px-2 py-1",
        isActive ? "bg-muted/60" : "opacity-40"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Badge
          variant={isActive ? "default" : "secondary"}
          className="text-xs px-1.5 py-0 tabular-nums shrink-0"
        >
          {formatPercent(band.rate, 0)}
        </Badge>
        <span className="text-xs text-muted-foreground truncate">{band.label}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {isActive && (
          <span className="text-xs text-muted-foreground tabular-nums hidden sm:inline">
            on {formatNaira(band.taxableInBand)}
          </span>
        )}
        <span className="tabular-nums text-sm font-medium">
          {formatNaira(band.taxInBand)}
        </span>
      </div>
    </div>
  );
}

function MonthlyBreakdownSection({ rows }: { rows: MonthlyTaxRow[] }) {
  const hasExpenses = rows.some((r) => r.expenses > 0);

  const totalIncome = rows.reduce((s, r) => s + r.grossIncomeNgn, 0);
  const totalExpenses = rows.reduce((s, r) => s + r.expenses, 0);
  const totalTax = rows.reduce((s, r) => s + r.taxOwed, 0);
  const totalNet = rows.reduce((s, r) => s + r.netIncome, 0);

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Monthly Breakdown
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground border-b">
              <th className="py-1 text-left font-medium">Month</th>
              <th className="py-1 text-right font-medium">Income (₦)</th>
              {hasExpenses && (
                <th className="py-1 text-right font-medium hidden sm:table-cell">Expenses (₦)</th>
              )}
              <th className="py-1 text-right font-medium">Tax Owing</th>
              <th className="py-1 text-right font-medium">Net Income</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.month}
                className={cn(
                  "border-b border-border/50",
                  row.taxOwed === 0 && "opacity-50"
                )}
              >
                <td className="py-1 pr-2">{MONTH_LABELS[row.month].slice(0, 3)}</td>
                <td className="py-1 text-right tabular-nums">{formatNaira(row.grossIncomeNgn)}</td>
                {hasExpenses && (
                  <td className="py-1 text-right tabular-nums hidden sm:table-cell text-destructive">
                    {row.expenses > 0 ? `− ${formatNaira(row.expenses)}` : "—"}
                  </td>
                )}
                <td className="py-1 text-right tabular-nums font-medium">{formatNaira(row.taxOwed)}</td>
                <td className="py-1 text-right tabular-nums">{formatNaira(row.netIncome)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td className="py-1.5 pr-2">Total</td>
              <td className="py-1.5 text-right tabular-nums">{formatNaira(totalIncome)}</td>
              {hasExpenses && (
                <td className="py-1.5 text-right tabular-nums hidden sm:table-cell text-destructive">
                  {totalExpenses > 0 ? `− ${formatNaira(totalExpenses)}` : "—"}
                </td>
              )}
              <td className="py-1.5 text-right tabular-nums">{formatNaira(totalTax)}</td>
              <td className="py-1.5 text-right tabular-nums">{formatNaira(totalNet)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
