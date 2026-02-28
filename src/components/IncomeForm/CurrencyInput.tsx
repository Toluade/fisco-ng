import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { parseNairaInput } from "@/lib/utils/format";

interface CurrencyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  placeholder = "0",
  hint,
  disabled = false,
  className,
}: CurrencyInputProps) {
  const [rawInput, setRawInput] = useState<string>("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // While focused: show raw input; while blurred: show formatted value
  const displayValue = focused
    ? rawInput
    : value > 0
    ? new Intl.NumberFormat("en-NG").format(value)
    : "";

  function handleFocus() {
    setFocused(true);
    // Initialise raw input with current numeric value (no commas)
    setRawInput(value > 0 ? String(value) : "");
  }

  function handleBlur() {
    setFocused(false);
    const parsed = parseNairaInput(rawInput);
    onChange(parsed);
    setRawInput("");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Allow digits, decimal point, commas (stripped on parse)
    if (/^[\d,]*\.?\d*$/.test(raw) || raw === "") {
      setRawInput(raw);
    }
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          ₦
        </span>
        <Input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pl-7", disabled && "cursor-not-allowed opacity-50")}
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
