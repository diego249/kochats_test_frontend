"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAuthToken } from "@/lib/auth"
import { getBot, sendChatMessage } from "@/lib/api"
import { Loader, Send, ChevronLeft } from "lucide-react"

interface Message {
  id: number
  role: "user" | "assistant" | "system"
  content: string
  metadata: any
  created_at: string
}

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const botId = Number.parseInt(params.id as string)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [bot, setBot] = useState<any>(null)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }
    loadBot()
  }, [router, botId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadBot = async () => {
    try {
      const botData = await getBot(botId)
      setBot(botData)
    } catch (error) {
      console.error("Error loading bot:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setSending(true)
    const userMessage = input
    setInput("")

    try {
      const response = await sendChatMessage(botId, userMessage, conversationId || undefined)
      setConversationId(response.conversation_id)
      setMessages(response.messages)
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/bots">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{bot?.name}</h2>
              <p className="text-xs text-muted-foreground">{bot?.description}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p>Start a conversation with {bot?.name}</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-md rounded-lg p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.metadata && msg.metadata.sql && (
                    <details className="mt-2 pt-2 border-t border-border/50">
                      <summary className="text-xs cursor-pointer opacity-70 hover:opacity-100">Debug Info</summary>
                      <pre className="mt-2 text-xs bg-background/50 p-2 rounded overflow-auto">
                        {JSON.stringify(msg.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-6 bg-card">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the bot..."
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" disabled={sending} className="gap-2">
              {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
