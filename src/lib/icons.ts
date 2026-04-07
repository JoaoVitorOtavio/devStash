import { 
  Code, 
  Sparkles, 
  Terminal, 
  FileText, 
  File, 
  Image as ImageIcon, 
  Link,
  ChevronRight,
  Plus,
  Search,
  Sidebar,
  FolderPlus,
  MoreHorizontal,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  User,
  LayoutDashboard,
  LayoutGrid,
  StickyNote
} from "lucide-react";

export const Icons = {
  // Database / System types
  Code: Code,
  Sparkles: Sparkles,
  Terminal: Terminal,
  FileText: FileText,
  StickyNote: StickyNote,
  File: File,
  Image: ImageIcon,
  Link: Link,

  // Lowercase aliases for backward compatibility or different conventions
  code: Code,
  sparkles: Sparkles,
  terminal: Terminal,
  "file-text": FileText,
  file: File,
  image: ImageIcon,
  link: Link,
  "sticky-note": StickyNote,

  // UI Icons
  chevronRight: ChevronRight,
  plus: Plus,
  search: Search,
  sidebar: Sidebar,
  folderPlus: FolderPlus,
  more: MoreHorizontal,
  star: Star,
  settings: Settings,
  help: HelpCircle,
  logout: LogOut,
  user: User,
  dashboard: LayoutDashboard,
  grid: LayoutGrid
};

export type IconName = keyof typeof Icons;

export function getIcon(name: string) {
  // Try exact match first
  if (Icons[name as IconName]) {
    return Icons[name as IconName];
  }
  
  // Try to find a case-insensitive match
  const lowercaseName = name.toLowerCase();
  const found = Object.keys(Icons).find(key => key.toLowerCase() === lowercaseName);
  
  if (found) {
    return Icons[found as IconName];
  }

  // Default icon
  return File;
}
