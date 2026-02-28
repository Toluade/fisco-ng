import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Month, SelfEmployedInputs } from "@/lib/tax";
import { MONTH_LABELS, MONTHS } from "@/lib/tax";
import { CurrencyInput } from "./CurrencyInput";
import { MonthIncomeRow } from "./MonthIncomeRow";

interface SelfEmployedFormProps {
  inputs: SelfEmployedInputs;
  onChange: (updates: Partial<SelfEmployedInputs>) => void;
}

export function SelfEmployedForm({ inputs, onChange }: SelfEmployedFormProps) {
  const currentYear = new Date().getFullYear();

  function handleMonthChange(month: Month, value: number) {
    onChange({
      monthlyIncomes: {
        ...inputs.monthlyIncomes,
        [month]: value,
      },
    });
  }

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
