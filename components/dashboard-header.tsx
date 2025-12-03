"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, ChevronDown } from "lucide-react"
import { logout } from "@/lib/api"
import { clearAuthToken, clearAuthUser, getAuthUser } from "@/lib/auth"
import { useState } from "react"

export function DashboardHeader({ username }: { username?: string }) {
  const router = useRouter()
  const authUser = getAuthUser()
  const [showProfile, setShowProfile] = useState(false)

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
      </div>

      <div className="flex items-center gap-4">
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
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 p-4 space-y-3">
              <div className="text-sm border-b border-border pb-3">
                <p className="font-medium text-foreground">{authUser?.username}</p>
                <p className="text-xs text-muted-foreground">{authUser?.email}</p>
              </div>
              <div className="text-sm space-y-1.5">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">{authUser?.organizationName}</span>
                </p>
                <p className="text-xs text-muted-foreground">{authUser?.isOrgOwner ? "Owner" : "Member"}</p>
                <p className="text-xs text-muted-foreground">
                  {authUser?.plan
                    ? `${authUser.plan.charAt(0).toUpperCase() + authUser.plan.slice(1)} plan`
                    : "Free plan"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full gap-2 bg-transparent mt-3 border-t pt-3"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
