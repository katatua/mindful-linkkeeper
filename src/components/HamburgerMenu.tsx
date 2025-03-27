
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, LogIn, User, HelpCircle, Languages, Database, FileCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export const HamburgerMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const { isLoggedIn, logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('logout.success'),
      });
      navigate("/login");
      setOpen(false);
    } catch (error) {
      toast({
        title: t('logout.error'),
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    navigate("/login");
    setOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="flex">
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
            <span className="font-medium">{t('app.title')}</span>
          </div>
          
          <div className="space-y-3 pt-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/funding")}
            >
              {t('nav.funding')}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/projects")}
            >
              {t('nav.projects')}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/analytics")}
            >
              {t('nav.analytics')}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/reports")}
            >
              {t('nav.reports')}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/policies")}
            >
              {t('nav.policies')}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/add-file")}
            >
              {t('nav.upload')}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/add-link")}
            >
              {t('nav.link')}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/add-category")}
            >
              {t('nav.category')}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/database-info")}
            >
              <Database className="h-4 w-4 mr-2" />
              {t('nav.database') || 'Database Info'}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/synthetic-data")}
            >
              <FileCode className="h-4 w-4 mr-2" />
              {t('nav.synthetic') || 'Synthetic Data'}
            </Button>
            
            <div className="border-t pt-3 mt-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={toggleLanguage}
              >
                <Languages className="h-4 w-4 mr-2" />
                {t('language.toggle')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {}}
              >
                <User className="h-4 w-4 mr-2" />
                {t('user.settings')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {}}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                {t('help')}
              </Button>
              {isLoggedIn ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('logout')}
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={handleLogin}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('login')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
