import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  value: string;
  subValue?: string;
  altValue?: string;
  highlight?: boolean;
  className?: string;
}

export function SummaryCard({
  label,
  value,
  subValue,
  altValue,
  highlight = false,
  className,
}: SummaryCardProps) {
  return (
    <Card className={cn(highlight && "border-primary/30 bg-primary/5", className)}>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            "mt-1 text-xl font-bold tracking-tight sm:text-2xl",
            highlight ? "text-primary" : "text-foreground"
          )}
        >
          {value}
        </p>
        {subValue && (
          <p className="mt-0.5 text-xs text-muted-foreground">{subValue}</p>
        )}
        {altValue && (
          <p className="mt-0.5 text-xs text-muted-foreground">{altValue}</p>
        )}
      </CardContent>
    </Card>
  );
}
