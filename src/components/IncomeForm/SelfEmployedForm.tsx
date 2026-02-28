import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Input } from "@/components/ui/input";
import type { ForeignCurrency, Month, SelfEmployedInputs } from "@/lib/tax";
import { CURRENCY_SYMBOLS, DEFAULT_EXCHANGE_RATES, MONTH_LABELS, MONTHS } from "@/lib/tax";
import { formatNaira, parseNairaInput } from "@/lib/utils/format";
import { useState } from "react";
import { CurrencyInput } from "./CurrencyInput";
import { MonthIncomeRow } from "./MonthIncomeRow";

const CURRENCIES: ForeignCurrency[] = ["NGN", "USD", "GBP", "EUR"];

interface SelfEmployedFormProps {
  inputs: SelfEmployedInputs;
  onChange: (updates: Partial<SelfEmployedInputs>) => void;
}

export function SelfEmployedForm({ inputs, onChange }: SelfEmployedFormProps) {
  const currentYear = new Date().getFullYear();
  const [rateRaw, setRateRaw] = useState("");
  const [rateFocused, setRateFocused] = useState(false);

  function handleMonthChange(month: Month, value: number) {
    onChange({
      monthlyIncomes: {
        ...inputs.monthlyIncomes,
        [month]: value,
      },
    });
  }

  function handleExpenseChange(month: Month, value: number) {
    onChange({
      monthlyExpenses: {
        ...inputs.monthlyExpenses,
        [month]: value,
      },
    });
  }

  function handleCurrencySwitch(cur: ForeignCurrency) {
    onChange({
      incomeCurrency: cur,
      exchangeRateToNgn: DEFAULT_EXCHANGE_RATES[cur],
    });
  }

  function handleRateFocus() {
    setRateFocused(true);
    setRateRaw(inputs.exchangeRateToNgn > 0 ? String(inputs.exchangeRateToNgn) : "");
  }

  function handleRateBlur() {
    setRateFocused(false);
    const parsed = parseNairaInput(rateRaw);
    if (parsed > 0) {
      onChange({ exchangeRateToNgn: parsed });
    }
    setRateRaw("");
  }

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (/^[\d,]*\.?\d*$/.test(v) || v === "") {
      setRateRaw(v);
    }
  }

  const rateDisplayValue = rateFocused
    ? rateRaw
    : inputs.exchangeRateToNgn > 0
    ? new Intl.NumberFormat("en-NG").format(inputs.exchangeRateToNgn)
    : "";

  // Summaries
  const ytdIncomeForeign = MONTHS.slice(0, inputs.currentMonth + 1)
    .reduce((s, m) => s + (inputs.monthlyIncomes[m] ?? 0), 0);
  const incomeSummary = ytdIncomeForeign > 0
    ? `${CURRENCY_SYMBOLS[inputs.incomeCurrency]}${new Intl.NumberFormat("en-NG").format(ytdIncomeForeign)} YTD`
    : "None logged";

  const ytdExpenses = MONTHS.slice(0, inputs.currentMonth + 1)
    .reduce((s, m) => s + (inputs.monthlyExpenses[m] ?? 0), 0);
  const expensesSummary = ytdExpenses > 0
    ? `${formatNaira(ytdExpenses)} YTD`
    : "None";

  const deductionsSummary = inputs.annualRent > 0
    ? `Rent: ${formatNaira(inputs.annualRent)}`
    : "No reliefs entered";

  const currencySwitcher = (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Currency:</span>
      <div className="flex rounded-md border border-border overflow-hidden">
        {CURRENCIES.map((cur) => (
          <button
            key={cur}
            type="button"
            onClick={() => handleCurrencySwitch(cur)}
            className={
              "px-3 py-1 text-xs font-medium transition-colors " +
              (inputs.incomeCurrency === cur
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground")
            }
          >
            {cur}
          </button>
        ))}
      </div>
      {inputs.incomeCurrency !== "NGN" && (
        <div className="flex flex-wrap items-center gap-2 mt-2 w-full">
          <span className="text-xs text-muted-foreground">
            1 {inputs.incomeCurrency} =
          </span>
          <div className="relative w-36">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              ₦
            </span>
            <Input
              type="text"
              inputMode="decimal"
              value={rateDisplayValue}
              onChange={handleRateChange}
              onFocus={handleRateFocus}
              onBlur={handleRateBlur}
              placeholder="0"
              className="h-7 pl-6 text-xs"
            />
          </div>
          <span className="text-xs text-muted-foreground">NGN</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Income Log */}
      <CollapsibleCard
        title={`Income Log — ${currentYear}`}
        subtitle={
          <p className="text-xs text-muted-foreground">
            Enter your gross income for each month. Future months are locked.
          </p>
        }
        headerExtra={currencySwitcher}
        summary={incomeSummary}
        defaultOpen={true}
      >
        <div className="space-y-1">
          {MONTHS.slice(0, inputs.currentMonth + 1).map((month, idx) => (
            <MonthIncomeRow
              key={month}
              month={MONTH_LABELS[month].slice(0, 3)}
              monthIndex={idx}
              value={inputs.monthlyIncomes[month] ?? 0}
              onChange={(v) => handleMonthChange(month, v)}
              isCurrent={idx === inputs.currentMonth}
              currencySymbol={CURRENCY_SYMBOLS[inputs.incomeCurrency]}
            />
          ))}
        </div>
      </CollapsibleCard>

      {/* Expenses Log */}
      <CollapsibleCard
        title={`Expenses Log — ${currentYear}`}
        subtitle={
          <p className="text-xs text-muted-foreground">
            Log deductible business expenses per month (internet, electricity, home-office, etc.). NTA 2025 §20. Always in NGN.
          </p>
        }
        summary={expensesSummary}
        defaultOpen={false}
      >
        <div className="space-y-1">
          {MONTHS.slice(0, inputs.currentMonth + 1).map((month, idx) => (
            <MonthIncomeRow
              key={month}
              month={MONTH_LABELS[month].slice(0, 3)}
              monthIndex={idx}
              value={inputs.monthlyExpenses[month] ?? 0}
              onChange={(v) => handleExpenseChange(month, v)}
              isCurrent={idx === inputs.currentMonth}
              currencySymbol="₦"
            />
          ))}
        </div>
      </CollapsibleCard>

      {/* Deductions */}
      <CollapsibleCard
        title="Deductions & Reliefs"
        summary={deductionsSummary}
        defaultOpen={false}
      >
        <div className="space-y-5">
          <CurrencyInput
            id="self-annual-rent"
            label="Annual Rent Paid (optional)"
            value={inputs.annualRent}
            onChange={(v) => onChange({ annualRent: v })}
            placeholder="e.g. 1,200,000"
            hint="Enter the full rent you paid for the year. Relief = 20% of rent, capped at ₦500,000/yr."
          />
        </div>
      </CollapsibleCard>
    </div>
  );
}
