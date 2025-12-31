"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal"
import { Loader, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { listConversations, deleteConversation } from "@/lib/api"
import { useLanguage } from "@/components/language-provider"

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
  const { language } = useLanguage()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    convId: number | null
    convTitle: string
  }>({
    isOpen: false,
    convId: null,
    convTitle: "",
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const copy = {
    es: {
      title: "Conversaciones",
      newConversation: "Nueva conversación",
      expand: "Expandir panel de conversaciones",
      collapse: "Contraer panel de conversaciones",
      empty: "Aún no hay conversaciones",
      untitled: "Conversación sin título",
      conversation: "Conversación",
      deleteTitle: "Eliminar conversación",
      deleteDescription: "¿Seguro que quieres eliminar esta conversación? Esta acción no se puede deshacer.",
    },
    en: {
      title: "Conversations",
      newConversation: "New conversation",
      expand: "Expand conversations panel",
      collapse: "Collapse conversations panel",
      empty: "No conversations yet",
      untitled: "Untitled conversation",
      conversation: "Conversation",
      deleteTitle: "Delete Conversation",
      deleteDescription: "Are you sure you want to delete this conversation? This action cannot be undone.",
    },
  } as const

  const t = copy[language]

  // 👉 estado para contraer / expandir lateralmente
  const [collapsed, setCollapsed] = useState(false)

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

    if (diff < 60000) return language === "es" ? "ahora mismo" : "just now"
    if (diff < 3600000)
      return language === "es"
        ? `hace ${Math.floor(diff / 60000)}m`
        : `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000)
      return language === "es"
        ? `hace ${Math.floor(diff / 3600000)}h`
        : `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString(language === "es" ? "es-ES" : "en-US")
  }

  return (
    <>
      <div
        className={`bg-card border-r border-border flex flex-col overflow-hidden transition-[width] duration-300 ${
          collapsed ? "w-10" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="border-b border-border/50">
          {collapsed ? (
            // Versión colapsada: solo botón para expandir
            <div className="p-2 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCollapsed(false)}
              >
                <ChevronRight className="w-4 h-4" />
                <span className="sr-only">{t.expand}</span>
              </Button>
            </div>
          ) : (
            // Versión expandida: título + botón para colapsar + New conversation
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setCollapsed(true)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="sr-only">{t.collapse}</span>
                </Button>
              </div>

              <Button onClick={onNewConversation} className="w-full gap-2" size="sm">
                <Plus className="w-4 h-4" />
                {t.newConversation}
              </Button>
            </div>
          )}
        </div>

        {/* Lista de conversaciones: solo si está expandido */}
        {!collapsed && (
          <div className="flex-1 overflow-auto p-2 space-y-1.5">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center text-xs text-muted-foreground py-8 px-2">
                {t.empty}
              </div>
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
                        {conversation.title || `${t.untitled} #${conversation.id}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(conversation.updated_at)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteModal({
                          isOpen: true,
                          convId: conversation.id,
                          convTitle:
                            conversation.title || `${t.conversation} #${conversation.id}`,
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
        )}
      </div>

        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          title={t.deleteTitle}
          description={t.deleteDescription}
          itemName={deleteModal.convTitle}
          onConfirm={handleDeleteConversation}
          onCancel={() => setDeleteModal({ isOpen: false, convId: null, convTitle: "" })}
          isLoading={isDeleting}
        />
    </>
  )
}
