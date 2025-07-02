"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  title,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      items?: {
        title: string
        url: string
      }[]
    }[]
  }[]
  title: string
}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.items ? (
              <>
                {isCollapsed ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        onMouseEnter={(e) => {
                          e.currentTarget.click()
                        }}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="right"
                      align="start"
                      className="w-48"
                      onMouseLeave={(e) => {
                        const trigger = e.currentTarget.previousElementSibling as HTMLElement
                        if (trigger) trigger.click()
                      }}
                    >
                      <DropdownMenuLabel className="font-semibold">{item.title}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.items.map((subItem, index) => (
                        <div key={subItem.title}>
                          {subItem.items ? (
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>{subItem.title}</DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {subItem.items.map((nestedItem) => (
                                  <DropdownMenuItem key={nestedItem.title} onClick={() => navigate(nestedItem.url)} asChild>
                                      {nestedItem.title}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          ) : (
                            <DropdownMenuItem asChild>
                              <Link to={subItem.url} className="w-full">
                                {subItem.title}
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {item.items && index < item.items.length - 1 && <DropdownMenuSeparator />}
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
                    <div>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              {subItem.items ? (
                                <Collapsible className="group/nested-collapsible">
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton>
                                      <span>{subItem.title}</span>
                                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/nested-collapsible:rotate-90" />
                                    </SidebarMenuSubButton>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div className="ml-4 space-y-1">
                                      {subItem.items.map((nestedItem) => (
                                        <SidebarMenuSubButton key={nestedItem.title} onClick={() => navigate(nestedItem.url)} asChild>
                                            <span>{nestedItem.title}</span>
                                        </SidebarMenuSubButton>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              ) : (
                                <SidebarMenuSubButton asChild>
                                  <Link to={subItem.url} className="w-full">
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              )}
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                )}
              </>
            ) : (
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link to={item.url} className="w-full">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
