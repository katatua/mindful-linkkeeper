
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, LogIn, User, HelpCircle, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const HamburgerMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

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

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate("/auth");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    navigate("/auth");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <div className="flex flex-col gap-4 py-4">
          <div 
            className="flex items-center gap-2 pb-4 border-b cursor-pointer" 
            onClick={() => handleNavigation("/")}
          >
            <img 
              src="https://via.placeholder.com/40?text=ANI" 
              alt="ANI Logo" 
              className="h-8 w-8 rounded" 
            />
            <span className="font-medium">GenAI Innovation Data Space</span>
          </div>
          
          <div className="space-y-3 pt-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/funding")}
            >
              Funding
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/projects")}
            >
              Projects
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/analytics")}
            >
              Analytics
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/reports")}
            >
              Reports
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/policies")}
            >
              Policies
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/add-file")}
            >
              Upload File
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/add-link")}
            >
              Add Link
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/add-category")}
            >
              Add Category
            </Button>
            
            <div className="border-t pt-3 mt-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {}}
              >
                <Languages className="h-4 w-4 mr-2" />
                PT | EN
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {}}
              >
                <User className="h-4 w-4 mr-2" />
                User Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {}}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
              {isAuthenticated ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={handleLogin}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
