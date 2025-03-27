import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  Compass,
  Book,
  MessageSquare,
  Database,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  return (
    <div className="flex h-screen">
      <div className="w-60 bg-gray-50 border-r flex-shrink-0">
        {children}
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, text, active, onClick }: SidebarItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={`justify-start px-4 py-2 w-full font-normal ${
              active ? "bg-gray-200 dark:bg-gray-700" : ""
            }`}
            onClick={onClick}
          >
            <div className="flex items-center">
              {icon}
              <span className="ml-2">{text}</span>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <Sidebar>
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="justify-start px-4 py-2 w-full">
              <div className="flex items-center">
                <Avatar className="mr-2">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="font-normal">User Name</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SidebarItem
        icon={<LayoutDashboard className="h-4 w-4" />}
        text="Dashboard"
        active={pathname === "/portal"}
        onClick={() => navigate("/portal")}
      />
      <SidebarItem
        icon={<Compass className="h-4 w-4" />}
        text="Discovery"
        active={pathname.includes("/portal/discovery")}
        onClick={() => navigate("/portal/discovery")}
      />
      <SidebarItem
        icon={<Book className="h-4 w-4" />}
        text="Knowledge Base"
        active={pathname.includes("/portal/knowledge")}
        onClick={() => navigate("/portal/knowledge")}
      />
      <SidebarItem
        icon={<MessageSquare className="h-4 w-4" />}
        text="AI Assistant"
        active={pathname.includes("/portal/ai")}
        onClick={() => navigate("/portal/ai")}
      />
      <SidebarItem
        icon={<Database className="h-4 w-4" />}
        text="Database"
        active={pathname.includes('/portal/database')}
        onClick={() => navigate('/portal/database')}
      />

      <div className="mt-auto p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="border rounded px-2 py-1"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'pt')}
                >
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Theme</Label>
                <Switch
                  id="theme"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    handleThemeChange(checked ? "dark" : "light")
                  }
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
