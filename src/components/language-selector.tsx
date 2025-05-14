"use client"

import { useEffect, useState } from "react"
import { Globe } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { RegisterApi } from "@/api/register.api"

interface Language {
  language_id: string
  language_name: string
  iso_code: string
  active: boolean
}

interface LanguageSelectorProps {
  mode: "text" | "flag" | "sidebar"
  className?: string
}

export default function LanguageSelector({ mode = "text", className }: LanguageSelectorProps) {
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const { i18n } = useTranslation()

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const languages = await RegisterApi.getLanguage()
        const activeLanguages = languages.filter((lang) => lang.active)
        setLanguages(activeLanguages)

        if (!selectedLanguage && activeLanguages.length > 0) {
          setSelectedLanguage(i18n.language || activeLanguages[0].iso_code)
        }
      } catch (error) {
        console.error("Failed to fetch languages:", error)
      }
    }

    fetchLanguages()
  }, [i18n.language, selectedLanguage])

  const getFlag = (isoCode: string) => {
    const codePoints = Array.from(isoCode.toUpperCase()).map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
    i18n.changeLanguage(value)
  }

  if (mode === "text") {
    return (
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className={cn(className)}>
          <SelectValue>
            {selectedLanguage ? (
              <div className="flex items-center gap-2">
                <span>{getFlag(selectedLanguage)}</span>
                <span>{languages.find((l) => l.iso_code === selectedLanguage)?.language_name || selectedLanguage}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Sélectionner</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.language_id} value={language.iso_code}>
              <div className="flex items-center gap-2">
                <span>{getFlag(language.iso_code)}</span>
                <span>{language.language_name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        {selectedLanguage ? (
          <div className="flex items-center">
            <span className="text-xl">{getFlag(selectedLanguage)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
          <DropdownMenuLabel>Choisir la langue</DropdownMenuLabel>
          <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.language_id}
            onClick={() => handleLanguageChange(language.iso_code)}
            className="flex cursor-pointer items-center gap-2"
          >
            <span>{getFlag(language.iso_code)}</span>
            <span>{language.language_name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
