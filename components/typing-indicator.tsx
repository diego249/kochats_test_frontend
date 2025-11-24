"use client"

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 p-4">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-xs text-muted-foreground">Bot is typing...</span>
    </div>
  )
}
