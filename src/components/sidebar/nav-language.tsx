"use client"

import { useEffect, useState } from "react"
import { ChevronsUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTranslation } from "react-i18next"
import { RegisterApi } from "@/api/register.api"

interface Language {
  language_id: string
  language_name: string
  iso_code: string
  active: boolean
}

export function NavLanguage() {
  const { isMobile } = useSidebar()
  const { i18n, t } = useTranslation()
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const langs = await RegisterApi.getLanguage()
        const activeLangs = langs.filter((l) => l.active)
        setLanguages(activeLangs)

        if (!selectedLanguage && activeLangs.length > 0) {
          const currentLang = i18n.language || activeLangs[0].iso_code
          setSelectedLanguage(currentLang)
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
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                  <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {getFlag(selectedLanguage)} {languages.find(l => l.iso_code === selectedLanguage)?.language_name}
                    </span>
                  </div>

                    <ChevronsUpDown className="ml-auto size-4 " />
                </>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-48 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="px-2 py-1 text-sm font-semibold">
              {t("sidebar.main.menuLanguage.title", "Choisir la langue")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.language_id}
                  onClick={() => handleLanguageChange(lang.iso_code)}
                  className="flex items-center gap-2"
                >
                  <span>{getFlag(lang.iso_code)}</span>
                  <span>{lang.language_name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
