"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAuthToken } from "@/lib/auth"
import { listBots, listDataSources, createBot, deleteBot } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, MessageSquare, Trash2 } from "lucide-react"

export default function BotsPage() {
  const router = useRouter()
  const [bots, setBots] = useState<any[]>([])
  const [dataSources, setDataSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    data_source: "",
    openai_model: "gpt-4o-mini",
    system_prompt: "",
    temperature: 0.0,
    max_tokens: 512,
    row_limit: 200,
  })

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }
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
        openai_model: formData.openai_model,
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
        openai_model: "gpt-4o-mini",
        system_prompt: "",
        temperature: 0.0,
        max_tokens: 512,
        row_limit: 200,
      })
      await loadData()
    } catch (error: any) {
      console.error("Error creating bot:", error)
      alert(error.message)
    }
  }

  const handleDeleteBot = async (id: number) => {
    if (confirm("Are you sure you want to delete this bot?")) {
      try {
        await deleteBot(id)
        await loadData()
      } catch (error) {
        console.error("Error deleting bot:", error)
        alert("Failed to delete bot")
      }
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
              <h1 className="text-3xl font-bold text-foreground">Bots</h1>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Model</Label>
                        <Input
                          value={formData.openai_model}
                          onChange={(e) => setFormData({ ...formData, openai_model: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Temperature</Label>
                        <Input
                          type="number"
                          step={0.1}
                          value={formData.temperature}
                          onChange={(e) => setFormData({ ...formData, temperature: Number.parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Max Tokens</Label>
                        <Input
                          type="number"
                          value={formData.max_tokens}
                          onChange={(e) => setFormData({ ...formData, max_tokens: Number.parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Row Limit</Label>
                        <Input
                          type="number"
                          value={formData.row_limit}
                          onChange={(e) => setFormData({ ...formData, row_limit: Number.parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>System Prompt</Label>
                      <Textarea
                        value={formData.system_prompt}
                        onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                        placeholder="System instructions for the bot..."
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Create Bot
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bots.map((bot) => (
                <Card key={bot.id} className="bg-card/50 border-border/50 hover:border-secondary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-foreground flex-1">{bot.name}</CardTitle>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                        {bot.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{bot.description}</p>
                    <div className="flex gap-2">
                      <Link href={`/bots/${bot.id}/chat`} className="flex-1">
                        <Button size="sm" className="w-full gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Chat
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteBot(bot.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {bots.length === 0 && !loading && (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-8 text-center text-muted-foreground">
                  <p>No bots yet. Create your first bot to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
