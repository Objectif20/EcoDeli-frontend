"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ProfileAPI } from "@/api/profile.api"

interface DeleteConversationDialogProps {
  userId: string
}

export const DeleteConversationDialog = ({ userId }: DeleteConversationDialogProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await ProfileAPI.deleteChat(userId)
      window.location.reload()
    } catch (error) {
      console.error("Erreur lors de la suppression de la conversation :", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
        >
          {t("client.pages.office.chat.deleteConversation")}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("client.pages.office.chat.deleteConversation")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("client.pages.office.chat.deleteConversationConfirmation")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{t("client.pages.office.chat.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? t("client.pages.office.chat.deleting") : t("client.pages.office.chat.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
