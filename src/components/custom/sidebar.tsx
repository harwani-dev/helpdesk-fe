"use client"
import {
    Bell,
    ChevronsUpDown,
    GalleryVerticalEnd,
    LayoutDashboard,
    LogOut,
    TicketPlus,
    Tickets,
    User,
} from "lucide-react"

import * as React from "react"
import { useLocation } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// TODO: use this when working on admin screen
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from "@/components/ui/collapsible"
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
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import { Label } from "../ui/label"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    projects: [
        {
            name: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "New Ticket",
            url: "/create",
            icon: TicketPlus,
        },
        {
            name: "My Tickets",
            url: "/tickets",
            icon: Tickets,
        },
        {
            name: "Profile",
            url: "/profile",
            icon: User,
        },
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isMobile } = useSidebar()
    const location = useLocation()
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        size={"lg"}
                            className=" hover:outline-0 hover:bg-secondary-background data-[state=open]:bg-main data-[state=open]:text-main-foreground data-[state=open]:outline-border data-[state=open]:outline-2"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-base">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-lg leading-tight">
                                <span className="truncate font-heading">
                                    Helpdesk
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenu>
                        {data.projects.map((item) => (
                            <SidebarMenuItem key={item.name} className="m-1 font-bold border-2 rounded-xl">
                                <SidebarMenuButton
                                    asChild
                                    isActive={location.pathname === item.url}
                                >
                                    <a href={item.url}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    className="group-data-[state=collapsed]:hover:outline-0 group-data-[state=collapsed]:hover:bg-transparent overflow-visible"
                                    size="lg"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src="https://cdn.prod.website-files.com/6706802514ffa549d0bf0b7e/67495000c9a162229994c586_Aub%20Logo.svg"
                                            alt="CN"
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-heading">
                                            Aubergine Employee
                                        </span>
                                        <span className="truncate text-xs">employee@aubergine.co</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                                side={isMobile ? "bottom" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-base">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src="https://cdn.prod.website-files.com/6706802514ffa549d0bf0b7e/67495000c9a162229994c586_Aub%20Logo.svg"
                                                alt="CN"
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-heading">
                                                Aubergine Employee
                                            </span>
                                            <span className="truncate text-xs">
                                                employee@aubergine.co
                                            </span>
                                        </div>
                                    </div>
                                <DropdownMenuSeparator />
                                </DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Bell />
                                        Notifications
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOut />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
