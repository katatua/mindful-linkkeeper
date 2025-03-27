
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, User, HelpCircle, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { HamburgerMenu } from "./HamburgerMenu";
import { useLanguage } from "@/contexts/LanguageContext";

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

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

  const goToDashboard = () => {
    navigate("/portal");
  };

  return (
    <header className="bg-white border-b py-3 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <HamburgerMenu />
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={goToDashboard}
        >
          <img 
            src="https://via.placeholder.com/40?text=ANI" 
            alt="ANI Logo" 
            className="h-10 w-10 rounded" 
          />
          <h1 className="text-xl font-bold sm:block">{t('app.title')}</h1>
        </div>
      </div>
      
      {/* These buttons are now completely hidden as they're in the hamburger menu */}
      <div className="flex items-center gap-2 hidden">
        <Button variant="ghost" size="sm">
          <Languages className="h-4 w-4 mr-2" />
          {t('language.toggle')}
        </Button>
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4 mr-2" />
          {t('user.settings')}
        </Button>
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          {t('help')}
        </Button>
        {isAuthenticated ? (
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={handleLogin}>
            <LogIn className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('login')}</span>
          </Button>
        )}
      </div>
    </header>
  );
};
