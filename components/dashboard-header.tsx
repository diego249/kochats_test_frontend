"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, ChevronDown, BadgeAlert, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/api"
import { clearAuthToken, clearAuthUser, getAuthUser } from "@/lib/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/components/language-provider"

export function DashboardHeader({ username }: { username?: string }) {
  const router = useRouter()
  const authUser = getAuthUser()
  const [showProfile, setShowProfile] = useState(false)
  const { language } = useLanguage()

  const copy = {
    es: {
      owner: "Propietario",
      member: "Miembro",
      freePlan: "Plan gratuito",
      logout: "Cerrar sesión",
      verifyCta: "Verificar email",
      verifyHint: "Necesitas verificar el email para usar todas las funciones.",
      settings: "Configuración de usuario",
    },
    en: {
      owner: "Owner",
      member: "Member",
      freePlan: "Free plan",
      logout: "Logout",
      verifyCta: "Verify email",
      verifyHint: "Verify your email to unlock all actions.",
      settings: "User settings",
    },
  } as const

  const t = copy[language]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      clearAuthToken()
      clearAuthUser()
      router.push("/login")
    }
  }

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-foreground">
          {authUser?.organizationName ? `Kochats – ${authUser.organizationName}` : "Kochats"}
        </h2>
        {authUser && !authUser.emailVerified && (
          <Link
            href="/verify-email"
            className="mt-1 inline-flex items-center gap-2 text-xs text-amber-600 hover:text-amber-500 transition-colors"
          >
            <BadgeAlert className="w-4 h-4" />
            <span>
              {t.verifyCta} · {t.verifyHint}
            </span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowProfile(!showProfile)}
            className="gap-2 bg-transparent"
          >
            {username || authUser?.username}
            <ChevronDown className="w-4 h-4" />
          </Button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card shadow-xl shadow-black/10 dark:shadow-black/40 z-50 overflow-hidden">
              <div className="flex items-start justify-between p-4 bg-muted/70">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">{authUser?.username}</p>
                  <p className="text-xs text-muted-foreground">{authUser?.email}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {authUser?.organizationName || ""}
                  </p>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-secondary/30"
                  onClick={() => setShowProfile(false)}
                >
                  <Link href="/account" aria-label={t.settings}>
                    <Settings className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="px-4 py-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center rounded-full bg-secondary/20 px-2 py-1 text-[11px] text-foreground">
                    {authUser?.isOrgOwner ? t.owner : t.member}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="capitalize">
                    {authUser?.plan ? `${authUser.plan}` : t.freePlan}
                  </span>
                </div>
              </div>

              <div className="border-t border-border/80">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full gap-2 justify-start px-4 py-3 rounded-none hover:bg-secondary/10"
                >
                  <LogOut className="w-4 h-4" />
                  {t.logout}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
