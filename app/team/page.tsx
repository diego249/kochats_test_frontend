// app/team/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import {
  listOrgUsers,
  createOrgUser,
  updateOrgUser,
  deleteOrgUser,
  type OrgUser,
} from "@/lib/api"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal"
import { Plus, Users, Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function TeamPage() {
  const router = useRouter()
  const authUser = getAuthUser()
  const { language } = useLanguage()

  const [users, setUsers] = useState<OrgUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Crear usuario
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
  })

  // Toggle estado
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null)

  // Reset password
  const [resetModal, setResetModal] = useState<{ isOpen: boolean; userId: number | null; username: string }>({
    isOpen: false,
    userId: null,
    username: "",
  })
  const [resetPassword, setResetPassword] = useState("")
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState("")
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  // Delete user
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: number | null; username: string }>({
    isOpen: false,
    userId: null,
    username: "",
  })
  const [deleteLoading, setDeleteLoading] = useState(false)

  const copy = {
    es: {
      title: "Equipo",
      subtitle: "Gestiona los usuarios de tu espacio de trabajo",
      addUser: "Agregar usuario",
      addUserDialog: "Agregar usuario al workspace",
      email: "Correo electrónico",
      username: "Usuario",
      tempPassword: "Contraseña temporal",
      firstName: "Nombre",
      lastName: "Apellido",
      creating: "Creando...",
      createUser: "Crear usuario",
      membersTitle: "Miembros del workspace",
      loading: "Cargando usuarios...",
      empty: "Eres el único miembro en este workspace. Usa el botón superior para agregar más usuarios.",
      owner: "Owner",
      member: "Member",
      updating: "Actualizando...",
      deactivate: "Desactivar",
      activate: "Activar",
      resetPassword: "Restablecer contraseña",
      delete: "Eliminar",
      resetTitle: "Restablecer contraseña",
      resetCopy: "Define una nueva contraseña para",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar contraseña",
      saving: "Guardando...",
      savePassword: "Guardar contraseña",
      hidePassword: "Ocultar contraseña",
      showPassword: "Mostrar contraseña",
      removeTitle: "Eliminar usuario",
      removeDescription:
        "¿Seguro que quieres eliminar a este usuario del workspace? Ya no podrá iniciar sesión.",
      addUserCopy: "Agregar usuario",
    },
    en: {
      title: "Team",
      subtitle: "Manage the users in your workspace",
      addUser: "Add user",
      addUserDialog: "Add user to workspace",
      email: "Email",
      username: "Username",
      tempPassword: "Temporary password",
      firstName: "First name",
      lastName: "Last name",
      creating: "Creating...",
      createUser: "Create user",
      membersTitle: "Workspace members",
      loading: "Loading users...",
      empty: "You are the only member in this workspace. Use the button above to add more users.",
      owner: "Owner",
      member: "Member",
      updating: "Updating...",
      deactivate: "Deactivate",
      activate: "Activate",
      resetPassword: "Reset password",
      delete: "Delete",
      resetTitle: "Reset password",
      resetCopy: "Set a new password for",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      saving: "Saving...",
      savePassword: "Save password",
      hidePassword: "Hide password",
      showPassword: "Show password",
      removeTitle: "Remove user",
      removeDescription:
        "Are you sure you want to remove this user from the workspace? They won't be able to sign in anymore.",
      addUserCopy: "Add user",
    },
  } as const

  const t = copy[language]

  useEffect(() => {
    if (!authUser?.token) {
      router.push("/login")
      return
    }

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

  async function handleToggleStatus(user: OrgUser) {
    if (user.is_org_owner) return

    const current = (user.status || "").toLowerCase()
    const newStatus = current === "active" ? "inactive" : "active"

    setStatusUpdatingId(user.id)
    try {
      await updateOrgUser(user.id, { status: newStatus })
      await loadUsers()
    } catch (err: any) {
      console.error("Error updating user status:", err)
      setError(err.message || "Failed to update user status")
    } finally {
      setStatusUpdatingId(null)
    }
  }

  function openResetModal(user: OrgUser) {
    if (user.is_org_owner) return
    setResetModal({ isOpen: true, userId: user.id, username: user.username })
    setResetPassword("")
    setResetPasswordConfirm("")
    setResetError(null)
    setShowResetPassword(false)
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!resetModal.userId) return

    if (!resetPassword || resetPassword.length < 8) {
      setResetError("Password must be at least 8 characters.")
      return
    }

    if (resetPassword !== resetPasswordConfirm) {
      setResetError("Passwords do not match.")
      return
    }

    setResetLoading(true)
    setResetError(null)
    try {
      await updateOrgUser(resetModal.userId, { password: resetPassword })
      setResetModal({ isOpen: false, userId: null, username: "" })
      setResetPassword("")
      setResetPasswordConfirm("")
    } catch (err: any) {
      console.error("Error resetting password:", err)
      setResetError(err.message || "Failed to reset password")
    } finally {
      setResetLoading(false)
    }
  }

  async function handleDeleteUser() {
    if (!deleteModal.userId) return
    setDeleteLoading(true)
    try {
      await deleteOrgUser(deleteModal.userId)
      setDeleteModal({ isOpen: false, userId: null, username: "" })
      await loadUsers()
    } catch (err: any) {
      console.error("Error deleting user:", err)
      setError(err.message || "Failed to delete user")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <Users className="w-7 h-7 text-secondary" />
                  {t.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.subtitle}
                  {authUser?.organizationName ? ` (${authUser.organizationName})` : ""}
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t.addUser}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t.addUserDialog}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t.email}</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.username}</Label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.tempPassword}</Label>
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
                        <Label>{t.firstName}</Label>
                        <Input
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.lastName}</Label>
                        <Input
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        />
                      </div>
                    </div>

                    {formError && <p className="text-sm text-destructive">{formError}</p>}

                    <Button type="submit" className="w-full" disabled={submitLoading}>
                      {submitLoading ? t.creating : t.createUser}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Members list */}
            <Card className="bg-card/40 border-border/40">
              <CardHeader>
                <CardTitle>{t.membersTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">{t.loading}</p>
                ) : error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t.empty}</p>
                ) : (
                  <div className="space-y-2">
                    {users.map((u, idx) => {
                      const isActive = (u.status || "").toLowerCase() === "active"
                      const isOwner = u.is_org_owner

                      return (
                        <div
                          key={u.id}
                          className="flex items-center justify-between border border-border/60 rounded-lg px-4 py-3 bg-background/60"
                          style={{
                            animation: `slideIn 0.3s ease-out ${idx * 50}ms forwards`,
                            opacity: 0,
                          }}
                        >
                          <style>{`
                            @keyframes slideIn {
                              from { opacity: 0; transform: translateX(-8px); }
                              to { opacity: 1; transform: translateX(0); }
                            }
                          `}</style>

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

                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              {isOwner ? (
                                <Badge variant="secondary" className="text-xs">
                                  {t.owner}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  {t.member}
                                </Badge>
                              )}
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded-full ${
                                  isActive
                                    ? "bg-green-500/10 text-green-600"
                                    : "bg-muted/60 text-muted-foreground"
                                }`}
                              >
                                {u.status ? u.status.toUpperCase() : ""}
                              </span>
                            </div>

                            {!isOwner && (
                              <div className="flex items-center gap-2 mt-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleStatus(u)}
                                  disabled={statusUpdatingId === u.id}
                                  className="text-xs"
                                >
                                  {statusUpdatingId === u.id
                                    ? t.updating
                                    : isActive
                                      ? t.deactivate
                                      : t.activate}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => openResetModal(u)}
                                >
                                  {t.resetPassword}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs text-destructive border-destructive/50 hover:bg-destructive/10"
                                  onClick={() =>
                                    setDeleteModal({
                                      isOpen: true,
                                      userId: u.id,
                                      username: u.username,
                                    })
                                  }
                                >
                                  {t.delete}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reset password dialog */}
      <Dialog open={resetModal.isOpen} onOpenChange={(open) => setResetModal((prev) => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t.resetTitle}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t.resetCopy} <span className="font-medium">{resetModal.username}</span>.
            </p>
            <div className="space-y-2">
              <Label>{t.newPassword}</Label>
              <div className="relative">
                <Input
                  type={showResetPassword ? "text" : "password"}
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  minLength={8}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword((prev) => !prev)}
                  className="absolute right-2 top-2.5 inline-flex items-center justify-center rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  aria-label={showResetPassword ? t.hidePassword : t.showPassword}
                >
                  {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.confirmPassword}</Label>
              <Input
                type={showResetPassword ? "text" : "password"}
                value={resetPasswordConfirm}
                onChange={(e) => setResetPasswordConfirm(e.target.value)}
                minLength={8}
                required
                className="pr-10"
              />
            </div>
            {resetError && <p className="text-sm text-destructive">{resetError}</p>}
            <Button type="submit" className="w-full" disabled={resetLoading}>
              {resetLoading ? t.saving : t.savePassword}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete user confirm modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title={t.removeTitle}
        description={t.removeDescription}
        itemName={deleteModal.username}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteModal({ isOpen: false, userId: null, username: "" })}
        isLoading={deleteLoading}
      />
    </div>
  )
}
