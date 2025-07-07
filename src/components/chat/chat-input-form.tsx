"use client"

import type { FormEvent } from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChatInput } from "@/components/ui/chat/chat-input"
import { Send, Smile } from "lucide-react"
import type { AutosizeTextAreaRef } from "@/components/ui/autosize-area"
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/emoji-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "../ui/scroll-area"

interface ChatInputFormProps {
  onSendMessage: (message: string) => void
  onFileSelect: (file: File | null) => void
  t: (key: string) => string
}

export const ChatInputForm = ({ onSendMessage, t }: ChatInputFormProps) => {
  const inputRef = useRef<AutosizeTextAreaRef>(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = (e.target as HTMLFormElement).elements.namedItem("chatInput") as HTMLInputElement
    if (input.value.trim()) {
      onSendMessage(input.value)
      input.value = ""
      if (inputRef.current) {
        const event = new Event("input", { bubbles: true })
        inputRef.current.textArea?.dispatchEvent(event)
      }
    }
  }

  const handleEmojiSelect = ({ emoji }: { emoji: string }) => {
    setIsEmojiPickerOpen(false)
    
    if (inputRef.current) {
      const textarea = inputRef.current.textArea
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const currentValue = textarea.value

        const newValue = currentValue.substring(0, start) + emoji + currentValue.substring(end)
        textarea.value = newValue

        const newCursorPosition = start + emoji.length
        textarea.setSelectionRange(newCursorPosition, newCursorPosition)

        const event = new Event("input", { bubbles: true })
        textarea.dispatchEvent(event)

        textarea.focus()
      }
    }
  }

  return (
    <form className="flex relative gap-2 p-4 border-t border-border" onSubmit={handleSubmit}>
      <ChatInput
        ref={inputRef}
        name="chatInput"
        className="min-h-12 bg-background shadow-none pr-20"
        placeholder={t("client.pages.office.chat.typeMessage")}
      />

      <div className="absolute top-1/2 right-16 transform -translate-y-1/2">
        <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
            >
              <Smile className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-0" side="top" align="end">
            <EmojiPicker
              className="h-[342px]"
              onEmojiSelect={handleEmojiSelect}
            >
              
              <EmojiPickerSearch />
              <ScrollArea className="h-full">
              <EmojiPickerContent />
                </ScrollArea>

              <EmojiPickerFooter />
            </EmojiPicker>
          </PopoverContent>
        </Popover>
      </div>

      <Button 
        className="absolute top-1/2 right-6 transform size-8 -translate-y-1/2" 
        size="icon" 
        type="submit"
      >
        <Send className="size-4" />
      </Button>
    </form>
  )
}