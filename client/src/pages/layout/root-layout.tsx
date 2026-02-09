"use client"
import { Link, useLocation } from "react-router-dom"
import type React from "react"
import { useState, useEffect } from "react"

import {
  BarChart3,
  Home,
  Settings,
  FolderOpen,
  Bell,
  HelpCircle,
  LogOut,
  User,
  ChevronDown,
  Plus,
  Menu,
  Brain,
  LucideComputer
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Simplified navigation data - just 5-6 main tabs
const navigationData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "AI Quiz",
    url: "/quiz",
    icon: Brain,
    badge: "New",
  },
  {
    title: "Code Challenge",
    url: "/code",
    icon: LucideComputer,
  },
  {
    title: "Soft Skills",
    url: "/soft-skills",
    icon: FolderOpen,
  },
  {
    title: "Discussions",
    url: "/chat",
    icon: Settings,
  },
]

export function GoogleSidebar() {
  const location = useLocation()
  const [userData, setUserData] = useState({ name: 'Workspace Pro', email: 'team@company.com' });

  useEffect(() => {
    // Fetch user data from localStorage
    const stored = localStorage.getItem('userData');
    if (stored) {
      const data = JSON.parse(stored);
      setUserData(data);
    }

    // Listen for user data updates
    const handleUserDataUpdate = (event: CustomEvent) => {
      setUserData(event.detail);
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate as EventListener);

    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate as EventListener);
    };
  }, []);

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard"
    }
    return location.pathname.startsWith(url)
  }

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        className="border-r border-gray-200"
        collapsible="icon"
        style={
          {
            "--sidebar-width-icon": "4rem",
          } as React.CSSProperties
        }
      >
        <SidebarHeader className="border-b border-gray-100 p-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center">
          <SidebarMenu>
            <SidebarMenuItem className="group-data-[collapsible=icon]:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-blue-50 data-[state=open]:text-blue-700 hover:bg-blue-50 hover:text-blue-700 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:mx-0"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white group-data-[collapsible=icon]:hidden">
                      <Menu className="size-4" />
                    </div>
                    <Menu className="hidden group-data-[collapsible=icon]:block size-5 text-gray-700" />
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-semibold text-gray-900">Learning AI</span>
                      <span className="truncate text-xs text-gray-500">{userData.email}</span>
                    </div>
                    <ChevronDown className="ml-auto size-4 text-gray-400 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-popper-anchor-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuItem className="hover:bg-blue-50 focus:bg-blue-50">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <div className="flex size-6 items-center justify-center rounded-sm bg-blue-500 text-white">
                        <Menu className="size-3" color="white" />
                      </div>
                      <div className="grid flex-1">
                        <span className="font-medium text-gray-900">{userData.name}</span>
                        <span className="text-xs text-gray-500">Active workspace</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-blue-50 focus:bg-blue-50">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <div className="flex size-6 items-center justify-center rounded-sm bg-green-500 text-white">
                        <Plus className="size-3" color="white" />
                      </div>
                      <div className="grid flex-1">
                        <span className="font-medium text-gray-900">Personal</span>
                        <span className="text-xs text-gray-500">Switch workspace</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
          <SidebarGroup className="group-data-[collapsible=icon]:w-full">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:space-y-3 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
                {navigationData.map((item) => (
                  <SidebarMenuItem key={item.title} className="group-data-[collapsible=icon]:w-auto">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          size="lg"
                          tooltip={item.title}
                          className={`
  relative transition-all duration-200 ease-in-out h-12 px-4 py-3 mx-1
  hover:bg-blue-50 hover:text-blue-700
  data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 data-[active=true]:font-medium
  data-[active=true]:shadow-sm
  group rounded-lg
  group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 
  group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-0
  group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center
  group-data-[collapsible=icon]:flex-shrink-0
`}
                        >
                          <Link
                            to={item.url}
                            className="flex items-center gap-4 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:gap-0"
                          >
                            <item.icon className="size-5 transition-colors group-data-[collapsible=icon]:size-5 flex-shrink-0" />
                            <span className="flex-1 text-base group-data-[collapsible=icon]:sr-only">{item.title}</span>
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className="ml-auto bg-red-100 text-red-700 hover:bg-red-100 text-xs px-2 py-1 group-data-[collapsible=icon]:hidden"
                              >
                                {item.badge}
                              </Badge>
                            )}
                            {isActive(item.url) && (
                              <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 group-data-[collapsible=icon]:left-1/2 group-data-[collapsible=icon]:top-0 group-data-[collapsible=icon]:h-1 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:-translate-x-1/2 group-data-[collapsible=icon]:translate-y-0 group-data-[collapsible=icon]:rounded-b-full group-data-[collapsible=icon]:rounded-r-none group-data-[collapsible=icon]:-mt-1" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="group-data-[collapsible=expanded]:hidden">
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-100 p-2 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-blue-50 data-[state=open]:text-blue-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                  >
                    <Avatar className="h-8 w-8 rounded-lg group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback className="rounded-lg bg-blue-500 text-white text-xs">{getInitials(userData.name)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-semibold text-gray-900">{userData.name}</span>
                      <span className="truncate text-xs text-gray-500">{userData.email}</span>
                    </div>
                    <ChevronDown className="ml-auto size-4 text-gray-400 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-popper-anchor-width] min-w-56 rounded-lg"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem className="hover:bg-blue-50 focus:bg-blue-50">
                    <User className="mr-2 size-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-blue-50 focus:bg-blue-50">
                    <Bell className="mr-2 size-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-blue-50 focus:bg-blue-50">
                    <Settings className="mr-2 size-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-blue-50 focus:bg-blue-50">
                    <HelpCircle className="mr-2 size-4" />
                    <span>Help</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-red-50 focus:bg-red-50 text-red-600">
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}