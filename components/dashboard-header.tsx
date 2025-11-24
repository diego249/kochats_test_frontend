"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from "@/lib/api"
import { clearAuthToken } from "@/lib/auth"

export function DashboardHeader({ username }: { username?: string }) {
  const router = useRouter()

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

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-foreground">{username ? `Welcome, ${username}` : "Dashboard"}</h2>
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  )
}
