
import {
  Plus,
  LogOut,
  FolderPlus,
  Link as LinkIcon,
  FileUp,
  LogIn,
  Database,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/SidebarContext";

const menuItems = [
  { title: "Add File", icon: FileUp, url: "/add-file" },
  { title: "Add Link", icon: LinkIcon, url: "/add-link" },
  { title: "Add Category", icon: FolderPlus, url: "/add-category" },
  { title: "Database Explorer", icon: Database, url: "/database" },
  { title: "Generate Test Data", icon: BarChart2, url: "/synthetic-data" },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isOpen, toggle } = useSidebar();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <div className={`w-64 h-full bg-white border-r transition-all ${isOpen ? '' : 'w-0 overflow-hidden'}`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">ANI Portal</h2>
          <Button variant="ghost" size="sm" onClick={toggle}>
            {isOpen ? "←" : "→"}
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Actions</h3>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.title}
              href={item.url}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </a>
          ))}
          
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
            >
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
