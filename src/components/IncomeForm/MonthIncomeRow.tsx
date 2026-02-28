import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { parseNairaInput } from "@/lib/utils/format";
import { useRef, useState } from "react";

interface MonthIncomeRowProps {
  month: string;           // e.g. "Jan"
  monthIndex: number;      // 0-based
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;       // future months
  isCurrent: boolean;      // current calendar month
}

export function MonthIncomeRow({
  month,
  value,
  onChange,
  disabled,
  isCurrent,
}: MonthIncomeRowProps) {
  const [raw, setRaw] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = focused
    ? raw
    : value > 0
    ? new Intl.NumberFormat("en-NG").format(value)
    : "";

  function handleFocus() {
    setFocused(true);
    setRaw(value > 0 ? String(value) : "");
  }

  function handleBlur() {
    setFocused(false);
    onChange(parseNairaInput(raw));
    setRaw("");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (/^[\d,]*\.?\d*$/.test(v) || v === "") {
      setRaw(v);
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2",
        isCurrent && "bg-accent/50 ring-1 ring-ring",
        disabled && "opacity-40"
      )}
    >
      <span
        className={cn(
          "w-8 shrink-0 text-sm font-medium",
          isCurrent ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {month}
      </span>
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          ₦
        </span>
        <Input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="0"
          disabled={disabled}
          className={cn("h-8 pl-6 text-sm", disabled && "cursor-not-allowed")}
        />
      </div>
    </div>
  );
}
