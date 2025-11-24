"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader, Plus, Trash2 } from "lucide-react"
import { listConversations, deleteConversation } from "@/lib/api"

interface Conversation {
  id: number
  title: string
  updated_at: string
}

interface ConversationsPanelProps {
  botId: number
  currentConversationId: number | null
  onSelectConversation: (id: number) => void
  onNewConversation: () => void
}

export function ConversationsPanel({
  botId,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}: ConversationsPanelProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [botId])

  const loadConversations = async () => {
    try {
      const data = await listConversations(botId)
      setConversations(data)
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this conversation?")) return

    try {
      await deleteConversation(id)
      setConversations(conversations.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Error deleting conversation:", error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return "just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Button onClick={onNewConversation} className="w-full gap-2" size="sm">
          <Plus className="w-4 h-4" />
          New conversation
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-4">No conversations yet</div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                currentConversationId === conversation.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {conversation.title || `Untitled conversation #${conversation.id}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatTime(conversation.updated_at)}</p>
                </div>
                <button
                  onClick={(e) => handleDelete(conversation.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
