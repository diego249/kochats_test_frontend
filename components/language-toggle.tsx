"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export function LanguageToggle() {
  const { language, toggleLanguage, isReady } = useLanguage()
  const nextLanguage = language === "es" ? "en" : "es"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${nextLanguage.toUpperCase()}`}
      onClick={toggleLanguage}
      disabled={!isReady}
      className="font-semibold text-xs"
    >
      {language.toUpperCase()}
    </Button>
  )
}
