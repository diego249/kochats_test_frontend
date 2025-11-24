"use client"

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary animate-bounce" />
        <div
          className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary animate-bounce"
          style={{ animationDelay: "200ms" }}
        />
        <div
          className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary animate-bounce"
          style={{ animationDelay: "400ms" }}
        />
      </div>
      <span className="text-xs text-muted-foreground italic">typing...</span>
    </div>
  )
}
