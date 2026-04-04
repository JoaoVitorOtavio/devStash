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
  LayoutGrid
} from "lucide-react";

export const Icons = {
  code: Code,
  sparkles: Sparkles,
  terminal: Terminal,
  "file-text": FileText,
  file: File,
  image: ImageIcon,
  link: Link,
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
  return Icons[name as IconName] || File;
}
