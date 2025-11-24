"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal"
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
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; convId: number | null; convTitle: string }>({
    isOpen: false,
    convId: null,
    convTitle: "",
  })
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDeleteConversation = async () => {
    if (!deleteModal.convId) return
    setIsDeleting(true)
    try {
      await deleteConversation(deleteModal.convId)
      setConversations(conversations.filter((c) => c.id !== deleteModal.convId))
      setDeleteModal({ isOpen: false, convId: null, convTitle: "" })
    } catch (error) {
      console.error("Error deleting conversation:", error)
    } finally {
      setIsDeleting(false)
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
    <>
      <div className="w-64 bg-card border-r border-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <Button onClick={onNewConversation} className="w-full gap-2" size="sm">
            <Plus className="w-4 h-4" />
            New conversation
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-auto p-2 space-y-1.5">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-8 px-2">No conversations yet</div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-3 rounded-md cursor-pointer transition-all duration-300 ease-out group ${
                  currentConversationId === conversation.id
                    ? "bg-primary/15 border border-primary/30 shadow-md shadow-primary/10"
                    : "hover:bg-muted/60 border border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate leading-tight">
                      {conversation.title || `Untitled conversation #${conversation.id}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(conversation.updated_at)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteModal({
                        isOpen: true,
                        convId: conversation.id,
                        convTitle: conversation.title || `Conversation #${conversation.id}`,
                      })
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors duration-200" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
        itemName={deleteModal.convTitle}
        onConfirm={handleDeleteConversation}
        onCancel={() => setDeleteModal({ isOpen: false, convId: null, convTitle: "" })}
        isLoading={isDeleting}
      />
    </>
  )
}
