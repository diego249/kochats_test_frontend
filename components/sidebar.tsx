"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LogOut,
  LayoutDashboard,
  Database,
  Bot,
  ChevronRight,
  HelpCircle,
  Users,
  ChevronLeft,
  CreditCard,
} from "lucide-react"
import { logout } from "@/lib/api"
import { clearAuthToken, clearAuthUser, getAuthUser } from "@/lib/auth"
import { useLanguage } from "@/components/language-provider"

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { language } = useLanguage()

  // Evitamos leer authUser directamente en render para no romper SSR/hydration
  const [authUser, setAuthUser] = useState<any | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  const copy = {
    es: {
      dashboard: "Dashboard",
      datasources: "Fuentes de datos",
      bots: "Bots",
      team: "Equipo",
      billing: "Planes y facturación",
      help: "Seguridad y protección de datos",
      expand: "Expandir menú lateral",
      collapse: "Contraer menú lateral",
      logout: "Cerrar sesión",
      helpTitle: "Ayuda",
    },
    en: {
      dashboard: "Dashboard",
      datasources: "Data Sources",
      bots: "Bots",
      team: "Team",
      billing: "Billing",
      help: "Security & Data Protection",
      expand: "Expand sidebar",
      collapse: "Collapse sidebar",
      logout: "Logout",
      helpTitle: "Help",
    },
  } as const

  const t = copy[language]

  useEffect(() => {
    const user = getAuthUser()
    setAuthUser(user)
  }, [])

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

  const baseMenuItems = [
    { href: "/dashboard", label: t.dashboard, icon: LayoutDashboard },
    { href: "/datasources", label: t.datasources, icon: Database },
    { href: "/bots", label: t.bots, icon: Bot },
  ]

  const menuItems =
    authUser?.isOrgOwner
      ? [
          ...baseMenuItems,
          { href: "/team", label: t.team, icon: Users },
          { href: "/billing", label: t.billing, icon: CreditCard },
        ]
      : baseMenuItems

  const helpItems = [{ href: "/help/security", label: t.help, icon: HelpCircle }]

  return (
    <div
      className={`h-screen bg-gradient-to-b from-card via-card to-card/95 border-r border-border/30 flex flex-col transition-all duration-300 overflow-hidden ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/20">
        {collapsed ? (
          // Versión colapsada: icono + botón de expandir bien visibles
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setCollapsed(false)}
              >
                <ChevronRight className="w-4 h-4" />
                <span className="sr-only">{t.expand}</span>
              </Button>
            </div>
          ) : (
          // Versión expandida: logo, título y botón para colapsar
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Kochats
                </h1>
                <p className="text-xs text-muted-foreground">AI Bot Platform</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 shrink-0"
              onClick={() => setCollapsed(true)}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">{t.collapse}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={`${collapsed ? "p-2" : "p-4"} flex-1 space-y-2`}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full gap-3 transition-all duration-200 ${
                  collapsed ? "justify-center px-2" : "justify-between"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-secondary/10 text-foreground"
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && isActive && <ChevronRight className="w-4 h-4" />}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-border/20 space-y-2">
        {!collapsed && (
          <div className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-2">
            {t.helpTitle}
          </div>
        )}
        {helpItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full gap-3 transition-all duration-200 text-xs ${
                  collapsed ? "justify-center px-2" : "justify-between"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-secondary/10 text-foreground"
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && isActive && <ChevronRight className="w-4 h-4" />}
              </Button>
            </Link>
          )
        })}
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-border/20">
        <Button
          variant="outline"
          className={`w-full gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 bg-transparent ${
            collapsed ? "justify-center" : "justify-start"
          }`}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>{t.logout}</span>}
        </Button>
      </div>
    </div>
  )
}
