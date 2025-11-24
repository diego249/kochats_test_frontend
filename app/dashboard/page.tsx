"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getAuthToken } from "@/lib/auth"
import { listDataSources, listBots, listConversations } from "@/lib/api"
import Link from "next/link"
import { ArrowRight, Database, Bot, MessageSquare, TrendingUp, Clock } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [dataSources, setDataSources] = useState<any[]>([])
  const [bots, setBots] = useState<any[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }

    const loadData = async () => {
      try {
        const [datasourcesRes, botsRes, conversationsRes] = await Promise.all([
          listDataSources(),
          listBots(),
          listConversations(),
        ])
        setDataSources(datasourcesRes)
        setBots(botsRes)
        setConversations(conversationsRes)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const avgConversationsPerBot = bots.length > 0 ? Math.round(conversations.length / bots.length) : 0
  const activeDataSources = dataSources.filter((ds) => ds.is_active).length
  const totalMessages = conversations.reduce((sum, conv) => sum + (conv.message_count || 0), 0)

  const StatCard = ({ icon: Icon, title, value, trend, description }: any) => (
    <Card className="bg-gradient-to-br from-card/80 to-card/40 border-border/40 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {description && <p className="text-xs text-muted-foreground/60 mt-1">{description}</p>}
          </div>
          <div className="p-2 rounded-lg bg-secondary/10">
            <Icon className="w-4 h-4 text-secondary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <div className="text-3xl font-bold text-foreground">
            {loading ? <Skeleton className="h-8 w-16" /> : value}
          </div>
          {trend && (
            <span className="text-xs text-green-500 flex items-center gap-1 pb-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your AI bots and data sources</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Bot}
                title="Active Bots"
                value={bots.length}
                description={`${avgConversationsPerBot} conversations per bot`}
              />
              <StatCard
                icon={Database}
                title="Data Sources"
                value={dataSources.length}
                description={`${activeDataSources} active`}
                trend={`${Math.round((activeDataSources / (dataSources.length || 1)) * 100)}%`}
              />
              <StatCard
                icon={MessageSquare}
                title="Total Messages"
                value={totalMessages}
                description={`${conversations.length} conversations`}
              />
              <StatCard
                icon={Clock}
                title="Conversations"
                value={conversations.length}
                description="Total interactions"
              />
            </div>

            {/* Recent Bots */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Recent Bots</h2>
                  <p className="text-sm text-muted-foreground mt-1">Your latest AI assistants</p>
                </div>
                <Link href="/bots">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 transition-all duration-200 hover:border-secondary/50 bg-transparent"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <>
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                  </>
                ) : bots.length > 0 ? (
                  bots.slice(0, 3).map((bot, idx) => (
                    <Card
                      key={bot.id}
                      className="bg-gradient-to-br from-card/60 to-card/30 border-border/40 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 cursor-pointer group"
                      style={{
                        animation: `fadeIn 0.5s ease-out ${idx * 100}ms forwards`,
                        opacity: 0,
                      }}
                    >
                      <style>{`
                        @keyframes fadeIn {
                          from { opacity: 0; transform: translateY(8px); }
                          to { opacity: 1; transform: translateY(0); }
                        }
                      `}</style>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base text-foreground group-hover:text-secondary transition-colors duration-200">
                              {bot.name}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                              {conversations.filter((c) => c.bot_id === bot.id).length} conversations
                            </p>
                          </div>
                          <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-all duration-200">
                            <Bot className="w-4 h-4 text-secondary" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {bot.description || "No description"}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-card/50 border border-border/50 md:col-span-2 lg:col-span-3">
                    <CardContent className="pt-6 text-center">
                      <Bot className="w-12 h-12 text-muted-foreground/20 mx-auto mb-2" />
                      <p className="text-muted-foreground mb-4">No bots yet. Create your first bot to get started.</p>
                      <Link href="/bots">
                        <Button size="sm" className="gap-2">
                          <Bot className="w-4 h-4" />
                          Create Bot
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
