"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  MoreHorizontal, 
  Plus, 
  Star, 
  User as UserIcon,
  LogOut,
  Settings,
  Sparkles
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MOCK_USER, MOCK_ITEM_TYPES, MOCK_COLLECTIONS } from "@/lib/mock-data";
import { getIcon } from "@/lib/icons";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const favoriteCollections = MOCK_COLLECTIONS.filter((c) => c.isFavorite);
  const recentCollections = MOCK_COLLECTIONS.slice(0, 3);

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton size="lg" asChild tooltip="DevStash">
              <Link href="/dashboard" className="flex-1">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="font-bold">D</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">DevStash</span>
                  <span className="truncate text-xs text-muted-foreground">Workspace</span>
                </div>
              </Link>
            </SidebarMenuButton>
            <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:hidden" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Knowledge Base</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MOCK_ITEM_TYPES.map((type) => {
                const Icon = getIcon(type.icon);
                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton asChild tooltip={type.name}>
                      <Link href={`/items/${type.id.replace("type_", "")}`}>
                        <Icon className="size-4" style={{ color: type.color }} />
                        <span>{type.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{type.count}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarMenu>
            {favoriteCollections.map((collection) => (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton asChild tooltip={collection.name}>
                  <Link href={`/collections/${collection.id}`}>
                    <Star className="size-4 text-yellow-500" />
                    <span>{collection.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Recent Collections</span>
            <button className="text-muted-foreground hover:text-foreground">
              <Plus className="size-3" />
            </button>
          </SidebarGroupLabel>
          <SidebarMenu>
            {recentCollections.map((collection) => (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton asChild tooltip={collection.name}>
                  <Link href={`/collections/${collection.id}`}>
                    <ChevronRight className="size-4" />
                    <span>{collection.name}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction>
                      <MoreHorizontal />
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    <DropdownMenuItem>Edit Collection</DropdownMenuItem>
                    <DropdownMenuItem>Share Collection</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  size="lg"
                  tooltip={MOCK_USER.name}
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={MOCK_USER.image} alt={MOCK_USER.name} />
                    <AvatarFallback className="rounded-lg">
                      {MOCK_USER.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{MOCK_USER.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{MOCK_USER.email}</span>
                  </div>
                  {MOCK_USER.isPro && (
                    <Badge variant="secondary" className="ml-auto text-[10px] px-1 h-4">Pro</Badge>
                  )}
                  <ChevronRight className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={MOCK_USER.image} alt={MOCK_USER.name} />
                      <AvatarFallback className="rounded-lg">
                        {MOCK_USER.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{MOCK_USER.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{MOCK_USER.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 size-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 size-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
