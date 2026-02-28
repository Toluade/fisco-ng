import { Calculator } from "lucide-react";

export function PageHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-4xl px-4 py-4 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              FiscoNG
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              NTA 2025 &middot; Personal Income Tax Calculator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
