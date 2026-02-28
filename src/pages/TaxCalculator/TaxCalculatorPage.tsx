import { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployedForm } from "@/components/IncomeForm/EmployedForm";
import { SelfEmployedForm } from "@/components/IncomeForm/SelfEmployedForm";
import { EmployedSummary, SelfEmployedSummary } from "@/components/TaxSummary/TaxSummary";
import { TaxBreakdown } from "@/components/TaxBreakdown/TaxBreakdown";
import { calculateTax } from "@/lib/tax/calculator";
import type { EmployedInputs, Month, SelfEmployedInputs } from "@/lib/tax";
import { MONTHS } from "@/lib/tax";
import { loadCurrencyPrefs, loadYtdExpenses, loadYtdIncomes, saveCurrencyPrefs, saveYtdExpenses, saveYtdIncomes } from "@/lib/utils/storage";

// ─── Defaults ────────────────────────────────────────────────────────────────

const currentMonthIndex = new Date().getMonth(); // 0-based

function defaultMonthlyIncomes(): Record<Month, number> {
  return Object.fromEntries(MONTHS.map((m) => [m, 0])) as Record<Month, number>;
}

function buildEmployedInputs(overrides?: Partial<EmployedInputs>): EmployedInputs {
  return {
    employmentType: "employed",
    monthlyGrossIncome: 0,
    annualRent: 0,
    includePension: true,
    includeNhf: true,
    includeNhis: true,
    ...overrides,
  };
}

function buildSelfEmployedInputs(
  overrides?: Partial<SelfEmployedInputs>
): SelfEmployedInputs {
  const savedIncomes = loadYtdIncomes();
  const savedExpenses = loadYtdExpenses();
  const savedPrefs = loadCurrencyPrefs();
  return {
    employmentType: "self-employed",
    monthlyIncomes: { ...defaultMonthlyIncomes(), ...savedIncomes },
    monthlyExpenses: { ...defaultMonthlyIncomes(), ...savedExpenses },
    annualRent: 0,
    currentMonth: currentMonthIndex,
    incomeCurrency: savedPrefs?.incomeCurrency ?? "NGN",
    exchangeRateToNgn: savedPrefs?.exchangeRateToNgn ?? 1,
    ...overrides,
  };
}

// ─── Page Component ───────────────────────────────────────────────────────────

type TabValue = "employed" | "self-employed";

export function TaxCalculatorPage() {
  const [tab, setTab] = useState<TabValue>("employed");

  const [employedInputs, setEmployedInputs] = useState<EmployedInputs>(
    buildEmployedInputs
  );
  const [selfEmployedInputs, setSelfEmployedInputs] = useState<SelfEmployedInputs>(
    buildSelfEmployedInputs
  );

  // Persist YTD incomes to localStorage whenever they change
  useEffect(() => {
    saveYtdIncomes(selfEmployedInputs.monthlyIncomes);
  }, [selfEmployedInputs.monthlyIncomes]);

  // Persist YTD expenses to localStorage whenever they change
  useEffect(() => {
    saveYtdExpenses(selfEmployedInputs.monthlyExpenses);
  }, [selfEmployedInputs.monthlyExpenses]);

  // Persist currency prefs to localStorage
  useEffect(() => {
    saveCurrencyPrefs({
      incomeCurrency: selfEmployedInputs.incomeCurrency,
      exchangeRateToNgn: selfEmployedInputs.exchangeRateToNgn,
    });
  }, [selfEmployedInputs.incomeCurrency, selfEmployedInputs.exchangeRateToNgn]);

  const handleEmployedChange = useCallback((updates: Partial<EmployedInputs>) => {
    setEmployedInputs((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSelfEmployedChange = useCallback(
    (updates: Partial<SelfEmployedInputs>) => {
      setSelfEmployedInputs((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  // Derived results — synchronous, no useEffect
  const employedResult = useMemo(
    () => calculateTax(employedInputs),
    [employedInputs]
  );

  const selfEmployedResult = useMemo(
    () => calculateTax(selfEmployedInputs),
    [selfEmployedInputs]
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="employed" className="flex-1 sm:flex-none">
            Employed
          </TabsTrigger>
          <TabsTrigger value="self-employed" className="flex-1 sm:flex-none">
            Self-Employed / Freelancer
          </TabsTrigger>
        </TabsList>

        {/* ── Employed Tab ── */}
        <TabsContent value="employed" className="space-y-6">
          <EmployedForm inputs={employedInputs} onChange={handleEmployedChange} />
          <EmployedSummary result={employedResult} />
          <TaxBreakdown result={employedResult} mode="employed" />
        </TabsContent>

        {/* ── Self-Employed Tab ── */}
        <TabsContent value="self-employed" className="space-y-6">
          <SelfEmployedForm
            inputs={selfEmployedInputs}
            onChange={handleSelfEmployedChange}
          />
          <SelfEmployedSummary
            result={selfEmployedResult}
            incomeCurrency={selfEmployedInputs.incomeCurrency}
            exchangeRateToNgn={selfEmployedInputs.exchangeRateToNgn}
          />
          <TaxBreakdown
            result={selfEmployedResult}
            mode="self-employed"
            incomeCurrency={selfEmployedInputs.incomeCurrency}
            exchangeRateToNgn={selfEmployedInputs.exchangeRateToNgn}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
