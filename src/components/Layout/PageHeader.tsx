import { Calculator, Moon, Monitor, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/utils/theme";

export function PageHeader() {
  const { theme, cycleTheme } = useTheme();
  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const themeLabel =
    theme === "dark"
      ? "Dark mode"
      : theme === "light"
        ? "Light mode"
        : "Using system theme";

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
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            aria-label={themeLabel}
            className="ml-auto"
          >
            <ThemeIcon className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
