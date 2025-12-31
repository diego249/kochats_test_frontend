"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

type Language = "es" | "en"

interface LanguageContextValue {
  language: Language
  setLanguage: (value: Language) => void
  toggleLanguage: () => void
  isReady: boolean
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("language") : null
    if (stored === "es" || stored === "en") {
      setLanguageState(stored)
    }
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) return
    window.localStorage.setItem("language", language)
    document.documentElement.setAttribute("lang", language)
  }, [language, isReady])

  const setLanguage = (value: Language) => {
    setLanguageState(value)
  }

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "es" ? "en" : "es"))
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      isReady,
    }),
    [language, isReady],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
