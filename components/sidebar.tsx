"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Database, Bot, ChevronRight } from "lucide-react"
import { logout } from "@/lib/api"
import { clearAuthToken } from "@/lib/auth"

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      clearAuthToken()
      router.push("/login")
    }
  }

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/datasources", label: "Data Sources", icon: Database },
    { href: "/bots", label: "Bots", icon: Bot },
  ]

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-card via-card to-card/95 border-r border-border/30 flex flex-col transition-all duration-300">
      {/* Logo Section */}
      <div className="p-6 border-b border-border/20">
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
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-between gap-3 transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-secondary/10 text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
