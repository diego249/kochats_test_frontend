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
import { ArrowRight, Database, Bot, MessageSquare } from "lucide-react"

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

  const StatCard = ({ icon: Icon, title, value }: any) => (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="w-4 h-4 text-secondary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{loading ? <Skeleton className="h-8 w-12" /> : value}</div>
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
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={Database} title="Data Sources" value={dataSources.length} />
              <StatCard icon={Bot} title="Bots" value={bots.length} />
              <StatCard icon={MessageSquare} title="Conversations" value={conversations.length} />
            </div>

            {/* Recent Bots */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recent Bots</h2>
                <Link href="/bots">
                  <Button variant="ghost" size="sm" className="gap-2">
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <>
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                  </>
                ) : bots.length > 0 ? (
                  bots.slice(0, 3).map((bot) => (
                    <Card
                      key={bot.id}
                      className="bg-card/50 border-border/50 hover:border-secondary/50 transition-colors cursor-pointer"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-foreground">{bot.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{bot.description}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-card/50 border border-border/50 md:col-span-2 lg:col-span-3">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      <p>No bots yet. Create your first bot to get started.</p>
                      <Link href="/bots">
                        <Button className="mt-4" size="sm">
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
