// app/team/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { listOrgUsers, createOrgUser, type OrgUser } from "@/lib/api"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Users } from "lucide-react"

export default function TeamPage() {
  const router = useRouter()
  const authUser = getAuthUser()
  const [users, setUsers] = useState<OrgUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
  })

  useEffect(() => {
    // No auth → login
    if (!authUser?.token) {
      router.push("/login")
      return
    }

    // No owner → redirigir (puedes mandarlo al dashboard o bots)
    if (!authUser.isOrgOwner) {
      router.push("/bots")
      return
    }

    void loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      setError(null)
      const data = await listOrgUsers()
      setUsers(data)
    } catch (err: any) {
      console.error("Error loading org users:", err)
      setError(err.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSubmitLoading(true)
    try {
      await createOrgUser({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined,
      })
      setDialogOpen(false)
      setFormData({
        email: "",
        username: "",
        password: "",
        first_name: "",
        last_name: "",
      })
      await loadUsers()
    } catch (err: any) {
      console.error("Error creating org user:", err)
      setFormError(err.message || "Failed to create user")
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <Users className="w-7 h-7 text-secondary" />
                  Team
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage the users in your workspace
                  {authUser?.organizationName ? ` (${authUser.organizationName})` : ""}
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add user
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add user to workspace</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Temporary password</Label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>First name</Label>
                        <Input
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last name</Label>
                        <Input
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        />
                      </div>
                    </div>

                    {formError && <p className="text-sm text-destructive">{formError}</p>}

                    <Button type="submit" className="w-full" disabled={submitLoading}>
                      {submitLoading ? "Creating..." : "Create user"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-card/40 border-border/40">
              <CardHeader>
                <CardTitle>Workspace members</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading users...</p>
                ) : error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    You are the only member in this workspace. Use the button above to add more users.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between border border-border/60 rounded-lg px-4 py-3 bg-background/60"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {u.username}
                            {u.first_name || u.last_name ? (
                              <span className="text-muted-foreground text-xs ml-2">
                                ({[u.first_name, u.last_name].filter(Boolean).join(" ")})
                              </span>
                            ) : null}
                          </p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {u.is_org_owner ? (
                            <Badge variant="secondary" className="text-xs">
                              Owner
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Member
                            </Badge>
                          )}
                          <span className="text-[11px] text-muted-foreground">
                            {u.status ? u.status.toUpperCase() : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
