// components/ui/badge.tsx
import * as React from "react"
import { cn } from "@/lib/utils" // si no lo tenés, dime y lo ajustamos

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "outline"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  let variantClasses = ""

  switch (variant) {
    case "secondary":
      variantClasses = "bg-secondary/10 text-secondary border border-secondary/30"
      break
    case "outline":
      variantClasses = "border border-border text-foreground bg-transparent"
      break
    case "default":
    default:
      variantClasses = "bg-primary/10 text-primary border border-primary/20"
      break
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variantClasses,
        className,
      )}
      {...props}
    />
  )
}
