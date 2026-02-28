import { useState } from "react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"
import { ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CollapsibleCardProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  headerExtra?: React.ReactNode
  summary?: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleCard({
  title,
  subtitle,
  headerExtra,
  summary,
  defaultOpen = true,
  children,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader>
          <CollapsiblePrimitive.Trigger asChild>
            <div className="flex cursor-pointer select-none items-center justify-between gap-2">
              <CardTitle className="text-base">{title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {!open && summary}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200",
                    open && "rotate-180"
                  )}
                />
              </div>
            </div>
          </CollapsiblePrimitive.Trigger>
          {open && subtitle}
          {open && headerExtra}
        </CardHeader>
        <CollapsiblePrimitive.Content>
          <CardContent>{children}</CardContent>
        </CollapsiblePrimitive.Content>
      </Card>
    </CollapsiblePrimitive.Root>
  )
}
