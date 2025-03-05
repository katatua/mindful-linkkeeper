import {
  LayoutDashboard,
  File,
  Settings,
  HelpCircle,
  Database,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

interface AppSidebarProps {
  isCollapsed: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed }) => {
  return (
    <div className={`w-64 flex-shrink-0 border-r bg-secondary ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="h-full p-3 flex flex-col">
        <div className="px-2 mb-4">
          <Link to="/" className="flex items-center gap-2 px-2 py-1.5 text-sm">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/documents" className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <File size={18} />
                <span>Documents</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/database-info" className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <Database size={18} />
                <span>Database Info</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/settings" className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/help" className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default AppSidebar;
