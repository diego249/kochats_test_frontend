"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  title: string
  description: string
  itemName: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  description,
  itemName,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  const { language } = useLanguage()

  const copy = {
    es: {
      undo: "Esta acción no se puede deshacer.",
      cancel: "Cancelar",
      delete: "Eliminar",
      deleting: "Eliminando...",
    },
    en: {
      undo: "This action cannot be undone.",
      cancel: "Cancel",
      delete: "Delete",
      deleting: "Deleting...",
    },
  } as const

  const t = copy[language]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm font-medium text-foreground">"{itemName}"</p>
          </div>
          <p className="text-xs text-muted-foreground">{t.undo}</p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {t.cancel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading} className="gap-2">
            {isLoading ? t.deleting : t.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
