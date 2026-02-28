import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { ForeignCurrency, Month, SelfEmployedInputs } from "@/lib/tax";
import { CURRENCY_SYMBOLS, DEFAULT_EXCHANGE_RATES, MONTH_LABELS, MONTHS } from "@/lib/tax";
import { parseNairaInput } from "@/lib/utils/format";
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

  return (
    <div className="space-y-4">
      {/* Income Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Income Log — {currentYear}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Enter your gross income for each month. Future months are locked.
          </p>

          {/* Currency Switcher */}
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
          </div>

          {/* Exchange Rate Input */}
          {inputs.incomeCurrency !== "NGN" && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
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
        </CardHeader>
        <CardContent className="space-y-1">
          {MONTHS.map((month, idx) => (
            <MonthIncomeRow
              key={month}
              month={MONTH_LABELS[month].slice(0, 3)}
              monthIndex={idx}
              value={inputs.monthlyIncomes[month] ?? 0}
              onChange={(v) => handleMonthChange(month, v)}
              disabled={idx > inputs.currentMonth}
              isCurrent={idx === inputs.currentMonth}
              currencySymbol={CURRENCY_SYMBOLS[inputs.incomeCurrency]}
            />
          ))}
        </CardContent>
      </Card>

      {/* Deductions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deductions & Reliefs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <CurrencyInput
            id="self-annual-rent"
            label="Annual Rent Paid (optional)"
            value={inputs.annualRent}
            onChange={(v) => onChange({ annualRent: v })}
            placeholder="e.g. 1,200,000"
            hint="Enter the full rent you paid for the year. Relief = 20% of rent, capped at ₦500,000/yr."
          />

          <Separator />

          <CurrencyInput
            id="work-expenses"
            label="Monthly Work Expenses (optional)"
            value={inputs.monthlyWorkExpenses}
            onChange={(v) => onChange({ monthlyWorkExpenses: v })}
            placeholder="e.g. 50,000"
            hint="Internet, electricity, home-office costs, etc. (NTA 2025 §20). You are responsible for determining the eligible business-use portion. Not applicable to employed workers."
          />
        </CardContent>
      </Card>
    </div>
  );
}
