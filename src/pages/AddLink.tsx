import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddLink() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const result = await supabase.auth.getSession();
      setIsAuthenticated(!!result.data.session);
      setIsLoading(false);
    };
    
    checkAuth();
    
    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      if (subscription && subscription.data) {
        subscription.data.subscription.unsubscribe();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: t('link.auth.required'),
        description: t('link.auth.description'),
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (!url || !title) {
      toast({
        title: t('link.fill'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const userResult = await supabase.auth.getUser();
      const userId = userResult.data.user?.id;
      
      if (!userId) {
        toast({
          title: t('link.auth.required'),
          description: "Your session may have expired. Please log in again.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const classificationResult = await supabase.functions.invoke(
        'classify-document',
        {
          body: { 
            title,
            summary 
          }
        }
      );

      if (classificationResult.error) throw classificationResult.error;

      const insertResult = await supabase
        .from('links')
        .insert({
          url,
          title,
          summary: summary || null,
          category,
          classification: classificationResult.data?.classification,
          source: 'web',
          user_id: userId
        });

      if (insertResult.error) throw insertResult.error;

      toast({
        title: t('link.success'),
        description: "Your link has been saved and is now available for AI analysis.",
      });
      navigate("/");
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: t('link.error'),
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAuthWarning = () => {
    if (!isAuthenticated && !isLoading) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('link.auth.required')}</AlertTitle>
          <AlertDescription>
            {t('link.auth.description')}
            <Button variant="link" className="p-0 ml-2" onClick={() => navigate("/auth")}>
              {t('link.auth.login')}
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto p-6 flex justify-center items-center flex-1">
          <p>{t('link.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-6 flex-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{t('link.title')}</h1>
          
          {renderAuthWarning()}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder={t('link.name')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-4"
                required
                disabled={!isAuthenticated}
              />
              
              <Input
                type="url"
                placeholder={t('link.url')}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full mb-4"
                required
                disabled={!isAuthenticated}
              />
              
              <Textarea
                placeholder={t('link.summary')}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full mb-4"
                rows={4}
                disabled={!isAuthenticated}
              />
              
              <Input
                type="text"
                placeholder={t('link.category')}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full"
                disabled={!isAuthenticated}
              />
            </div>
            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || !isAuthenticated}
              >
                {isSubmitting ? t('link.adding') : t('link.add')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
              >
                {t('link.cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
