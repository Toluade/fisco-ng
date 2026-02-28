import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { EmployedInputs } from "@/lib/tax";
import { CurrencyInput } from "./CurrencyInput";

interface EmployedFormProps {
  inputs: EmployedInputs;
  onChange: (updates: Partial<EmployedInputs>) => void;
}

export function EmployedForm({ inputs, onChange }: EmployedFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Income & Deductions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Monthly Gross Income */}
        <CurrencyInput
          id="monthly-gross"
          label="Monthly Gross Income"
          value={inputs.monthlyGrossIncome}
          onChange={(v) => onChange({ monthlyGrossIncome: v })}
          placeholder="e.g. 300,000"
        />

        <Separator />

        {/* Rent Relief */}
        <CurrencyInput
          id="annual-rent"
          label="Annual Rent Paid (optional)"
          value={inputs.annualRent}
          onChange={(v) => onChange({ annualRent: v })}
          placeholder="e.g. 1,200,000"
          hint="Enter the full rent you paid for the year. Relief = 20% of rent, capped at ₦500,000/yr."
        />

        <Separator />

        {/* Standard Deductions */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Standard Deductions</p>
          <DeductionToggle
            id="pension"
            label="Pension Contribution"
            description="8% of gross income (PenCom)"
            checked={inputs.includePension}
            onCheckedChange={(v) => onChange({ includePension: v })}
          />
          <DeductionToggle
            id="nhf"
            label="National Housing Fund (NHF)"
            description="2.5% of gross income"
            checked={inputs.includeNhf}
            onCheckedChange={(v) => onChange({ includeNhf: v })}
          />
          <DeductionToggle
            id="nhis"
            label="Health Insurance (NHIS)"
            description="1.75% of gross income"
            checked={inputs.includeNhis}
            onCheckedChange={(v) => onChange({ includeNhis: v })}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface DeductionToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function DeductionToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: DeductionToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
      <div className="min-w-0">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
