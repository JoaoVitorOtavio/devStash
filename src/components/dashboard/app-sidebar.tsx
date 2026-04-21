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
import { getIcon } from "@/lib/icons";

interface ItemType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  count: number;
}

interface Collection {
  id: string;
  name: string;
  isFavorite: boolean;
  primaryColor?: string;
  types?: Array<{ id: string; count: number; color?: string; icon?: string; name?: string }>;
}

interface UserProfile {
  id: string;
  name: string;
  email: string | null;
  image: string;
  isPro: boolean;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  itemTypes: ItemType[];
  collections: Collection[]; // all collections
  recentCollections?: Collection[]; // optional recent collections with primaryColor
  user: UserProfile;
}

export function AppSidebar({ itemTypes, collections, recentCollections, user, ...props }: AppSidebarProps) {
  const favoriteCollections = collections.filter((c) => c.isFavorite).slice(0, 3);
  const recent = (recentCollections && recentCollections.length > 0)
    ? recentCollections.slice(0, 3)
    : collections.slice(0, 3);

  function collectionGradient(collection: Collection) {
    const colors = (collection.types || [])
      .map(t => t.color)
      .filter(Boolean) as string[];

    if (colors.length === 0) return collection.primaryColor || 'var(--color-primary)';
    if (colors.length === 1) return colors[0];

    // Limit to first 3 colors for a tidy gradient
    const used = colors.slice(0, 3).join(', ');
    return `linear-gradient(135deg, ${used})`;
  }

  return (
    <Sidebar variant="inset" collapsible="icon" className="h-svh" {...props}>
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
              {itemTypes.map((type) => {
                const Icon = getIcon(type.icon || 'file');
                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton asChild tooltip={type.name}>
                      <Link
                        href={`/items/${type.id}`}
                        className="flex items-center gap-2 w-[200px] group-data-[collapsible=icon]:justify-center"
                        title={type.name}
                      >
                        <Icon className="size-4" style={{ color: type.color || undefined }} />
                        <span className="truncate group-data-[collapsible=icon]:hidden">{type.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">{type.count}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Favorite Collections</span>
            <Plus className="h-3 w-3 cursor-pointer hover:text-primary" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {favoriteCollections.map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/collections/${collection.id}`}
                      className="flex items-center gap-2 w-[200px] group-data-[collapsible=icon]:justify-center"
                      title={collection.name}
                    >
                      <Star className="size-4 fill-amber-500 text-amber-500" />
                      <span  className="truncate group-data-[collapsible=icon]:hidden">{collection.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {favoriteCollections.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground italic">No favorites yet</div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Recent</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recent.map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/collections/${collection.id}`}
                      className="flex items-center gap-2 w-[200px] group-data-[collapsible=icon]:justify-center"
                      title={collection.name}
                    >
                      <div
                        className="size-4 rounded-full mr-2"
                        style={{ background: collectionGradient(collection), width: 14, height: 14 }}
                      />
                      <span className="truncate group-data-[collapsible=icon]:hidden">{collection.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem>
                        <span>Edit Collection</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              {recent.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground italic">No collections yet</div>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/collections"
                    className="flex items-center gap-2 w-[200px] group-data-[collapsible=icon]:justify-center"
                    title="View all collections"
                  >
                    <ChevronRight className="size-4" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">View all collections</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user.isPro ? (
              <div className="px-3 py-2 mb-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pro Plan</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">AI features and unlimited storage active.</p>
              </div>
            ) : (
              <SidebarMenuButton className="mb-2 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary group-data-[collapsible=icon]:hidden">
                <Sparkles className="h-4 w-4" />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <MoreHorizontal className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
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
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
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
