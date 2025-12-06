"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAuthToken, getAuthUser } from "@/lib/auth"
import { listBots, listDataSources, createBot, deleteBot } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, MessageSquare, Trash2, Zap, ChevronDown } from "lucide-react"

export default function BotsPage() {
  const router = useRouter()
  const [bots, setBots] = useState<any[]>([])
  const [dataSources, setDataSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; botId: number | null; botName: string }>({
    isOpen: false,
    botId: null,
    botName: "",
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    data_source: "",
    system_prompt: "",
    temperature: 0.0,
    max_tokens: 512,
    row_limit: 200,
  })
  const [authUser, setAuthUserState] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }
    const user = getAuthUser()
    setAuthUserState(user)
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const [botsRes, dsRes] = await Promise.all([listBots(), listDataSources()])
      setBots(botsRes)
      setDataSources(dsRes)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createBot({
        name: formData.name,
        description: formData.description,
        data_source: Number.parseInt(formData.data_source),
        // openai_model: eliminado
        system_prompt: formData.system_prompt,
        temperature: formData.temperature,
        max_tokens: formData.max_tokens,
        row_limit: formData.row_limit,
      })
      setDialogOpen(false)
      setFormData({
        name: "",
        description: "",
        data_source: "",
        system_prompt: "",
        temperature: 0.0,
        max_tokens: 512,
        row_limit: 200,
      })
      setShowAdvanced(false)
      await loadData()
    } catch (error: any) {
      console.error("Error creating bot:", error)
      alert(error.message)
    }
  }

  const handleDeleteBot = async () => {
    if (!deleteModal.botId) return
    setIsDeleting(true)
    try {
      await deleteBot(deleteModal.botId)
      setBots(bots.filter((bot) => bot.id !== deleteModal.botId))
      setDeleteModal({ isOpen: false, botId: null, botName: "" })
    } catch (error) {
      console.error("Error deleting bot:", error)
      alert("Failed to delete bot")
    } finally {
      setIsDeleting(false)
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
                <h1 className="text-3xl font-bold text-foreground">
                  {authUser?.isOrgOwner ? "All Bots in Workspace" : "My Bots"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {authUser?.isOrgOwner
                    ? "Manage all intelligent bots in your organization"
                    : "Your personal intelligent bots"}
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    New Bot
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Bot</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateBot} className="space-y-4">
                    <div>
                      <Label>Bot Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Reservations Bot"
                        required
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="What does this bot do?"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Data Source</Label>
                      <Select
                        value={formData.data_source}
                        onValueChange={(value) => setFormData({ ...formData, data_source: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a data source" />
                        </SelectTrigger>
                        <SelectContent>
                          {dataSources.map((ds) => (
                            <SelectItem key={ds.id} value={ds.id.toString()}>
                              {ds.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Advanced settings */}
                    <div className="mt-4 border-t border-border/40 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAdvanced((prev) => !prev)}
                        className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        <span>Advanced settings</span>
                        <ChevronDown
                          className={
                            "w-4 h-4 transition-transform duration-200 " +
                            (showAdvanced ? "rotate-180" : "")
                          }
                        />
                      </button>

                      {showAdvanced && (
                        <div className="mt-4 space-y-4 rounded-lg bg-card/40 border border-border/40 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Temperature</Label>
                              <Input
                                type="number"
                                step={0.1}
                                value={formData.temperature}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    temperature: Number.isNaN(Number.parseFloat(e.target.value))
                                      ? 0
                                      : Number.parseFloat(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Max Tokens</Label>
                              <Input
                                type="number"
                                value={formData.max_tokens}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    max_tokens: Number.isNaN(Number.parseInt(e.target.value))
                                      ? 0
                                      : Number.parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Row Limit</Label>
                              <Input
                                type="number"
                                value={formData.row_limit}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    row_limit: Number.isNaN(Number.parseInt(e.target.value))
                                      ? 0
                                      : Number.parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <Label>System Prompt</Label>
                            <Textarea
                              value={formData.system_prompt}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  system_prompt: e.target.value,
                                })
                              }
                              placeholder="System instructions for the bot..."
                              rows={4}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full">
                      Create Bot
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bots.map((bot, idx) => (
                <Card
                  key={bot.id}
                  className="bg-card/40 border-border/40 hover:border-secondary/50 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-secondary/10"
                  style={{
                    animation: `slideIn 0.3s ease-out ${idx * 50}ms forwards`,
                    opacity: 0,
                  }}
                >
                  <style>{`
                    @keyframes slideIn {
                      from { opacity: 0; transform: translateY(8px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground flex items-center gap-2">
                          <Zap className="w-5 h-5 text-secondary" />
                          {bot.name}
                        </CardTitle>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 bg-secondary/10 text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {bot.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{bot.description}</p>
                    <div className="flex gap-2">
                      <Link href={`/bots/${bot.id}/chat`} className="flex-1">
                        <Button
                          size="sm"
                          className="w-full gap-2 transition-all duration-200 hover:shadow-md hover:shadow-primary/20"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Chat
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteModal({ isOpen: true, botId: bot.id, botName: bot.name })}
                        className="transition-all duration-200 hover:border-destructive/50 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {bots.length === 0 && !loading && (
              <Card className="bg-card/40 border-border/40">
                <CardContent className="pt-12 pb-12 text-center">
                  <Zap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No bots yet. Create your first bot to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Bot"
        description="Are you sure you want to delete this bot? All associated conversations will be lost."
        itemName={deleteModal.botName}
        onConfirm={handleDeleteBot}
        onCancel={() => setDeleteModal({ isOpen: false, botId: null, botName: "" })}
        isLoading={isDeleting}
      />
    </div>
  )
}
