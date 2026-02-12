"use client"
import {
    Bell,
    GalleryVerticalEnd,
    LayoutDashboard,
    TicketPlus,
    Tickets,
    BarChart3,
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
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const location = useLocation()
    const { username, email, image, userType } = useAuth()
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
            ...((userType === "EMPLOYEE" || userType === "MANAGER")
                ? [{
                    name: "New Ticket",
                    url: "/create",
                    icon: TicketPlus,
                }]
                : []),
            {
                name: userType === "ADMIN" ? "All Tickets" : "My Tickets",
                url: "/tickets",
                icon: Tickets,
            },
            ...(userType === "ADMIN"
                ? [
                    {
                        name: "Activity",
                        url: "/activity",
                        icon: Bell,
                    },
                    {
                        name: "Performance",
                        url: "/feedback",
                        icon: BarChart3,
                    },
                ]
                : []),
        ]
    }
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
                        <SidebarMenuButton
                            className="hover:outline-0 hover:bg-secondary-background group-data-[state=collapsed]:hover:outline-0 group-data-[state=collapsed]:hover:bg-transparent overflow-visible"
                            size="lg"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={image}
                                    alt="CN"
                                />
                                <AvatarFallback>
                                    <img
                                        src="https://cdn.prod.website-files.com/6706802514ffa549d0bf0b7e/67495000c9a162229994c586_Aub%20Logo.svg"
                                        alt="CN"
                                    />
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-heading">
                                    {username}
                                </span>
                                <span className="truncate text-xs">{email}</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
