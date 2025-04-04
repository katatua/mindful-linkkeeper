import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Menu, LogOut, LogIn, User, HelpCircle, Languages, 
  FileUp, Link as LinkIcon, FolderPlus, Database, 
  BarChart2, Home, Folder, BarChart, FileText, BookOpen,
  MessageCircle, LineChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const HamburgerMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

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
        title: t('logout.success'),
      });
      navigate("/auth");
      setOpen(false);
    } catch (error) {
      toast({
        title: t('logout.error'),
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    navigate("/auth");
    setOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
    toast({
      title: language === 'en' ? 'Idioma alterado para Português' : 'Language changed to English',
      description: language === 'en' ? 'Todas as páginas serão exibidas em Português' : 'All pages will be displayed in English',
    });
  };

  const mainMenuItems = [
    { title: t('home'), icon: Home, url: "/" },
    { title: t('assistant'), icon: MessageCircle, url: "/assistant" },
    { title: t('funding'), icon: BarChart, url: "/funding" },
    { title: t('projects'), icon: Folder, url: "/projects" },
    { title: t('analytics'), icon: BarChart2, url: "/analytics" },
    { title: t('reports'), icon: FileText, url: "/reports" },
    { title: t('policies'), icon: BookOpen, url: "/policies" },
    { title: t('predictive_models') || "Predictive Models", icon: LineChart, url: "/predictive-models" },
  ];

  const utilityMenuItems = [
    { title: t('upload'), icon: FileUp, url: "/add-file" },
    { title: t('link'), icon: LinkIcon, url: "/add-link" },
    { title: t('category'), icon: FolderPlus, url: "/add-category" },
    { title: t('database'), icon: Database, url: "/database" },
    { title: t('synthetic_data'), icon: BarChart2, url: "/synthetic-data" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="flex">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] overflow-y-auto">
        <div className="flex flex-col gap-4 py-4">
          <div 
            className="flex items-center gap-4 pb-4 border-b cursor-pointer ml-4" 
            onClick={() => handleNavigation("/")}
          >
            <img 
              src="https://via.placeholder.com/40?text=ANI" 
              alt="ANI Logo" 
              className="h-8 w-8 rounded" 
            />
            <span className="font-medium">{t('app.title')}</span>
          </div>
          
          <div className="space-y-1 pt-2">
            <h3 className="font-medium text-sm text-muted-foreground px-6 mb-2">{t('main')}</h3>
            {mainMenuItems.map((item) => (
              <Button 
                key={item.url}
                variant="ghost" 
                className="w-full justify-start px-6" 
                onClick={() => handleNavigation(item.url)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.title}
              </Button>
            ))}
            
            <h3 className="font-medium text-sm text-muted-foreground px-6 mb-2 mt-4">{t('utilities')}</h3>
            {utilityMenuItems.map((item) => (
              <Button 
                key={item.url}
                variant="ghost" 
                className="w-full justify-start px-6" 
                onClick={() => handleNavigation(item.url)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.title}
              </Button>
            ))}
            
            <div className="border-t pt-3 mt-3">
              <h3 className="font-medium text-sm text-muted-foreground px-6 mb-2">{t('settings')}</h3>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-6" 
                onClick={toggleLanguage}
              >
                <Languages className="h-4 w-4 mr-2" />
                {language === 'en' ? 'PT | EN' : 'PT | EN'}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-6" 
                onClick={() => {}}
              >
                <User className="h-4 w-4 mr-2" />
                {t('user.settings')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-6" 
                onClick={() => {}}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                {t('help')}
              </Button>
              {isAuthenticated ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-6" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('logout')}
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-6" 
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
