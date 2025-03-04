
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

  useEffect(() => {
    // Check if user is authenticated when component mounts
    const checkAuth = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add links",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (!url || !title) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        toast({
          title: "Authentication error",
          description: "Your session may have expired. Please log in again.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Get classification from Edge Function
      const { data: classificationData, error: classificationError } = await supabase.functions.invoke(
        'classify-document',
        {
          body: { 
            title,
            summary 
          }
        }
      );

      if (classificationError) throw classificationError;

      const { error } = await supabase
        .from('links')
        .insert({
          url,
          title,
          summary: summary || null,
          category,
          classification: classificationData?.classification,
          source: 'web',
          user_id: userId
        });

      if (error) throw error;

      toast({
        title: "Link added successfully",
        description: "Your link has been saved and is now available for AI analysis.",
      });
      navigate("/");
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: "Error adding link",
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
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You must be logged in to add links.
            <Button variant="link" className="p-0 ml-2" onClick={() => navigate("/auth")}>
              Login now
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Link for AI Analysis</h1>
        
        {renderAuthWarning()}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4"
              required
              disabled={!isAuthenticated}
            />
            
            <Input
              type="url"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full mb-4"
              required
              disabled={!isAuthenticated}
            />
            
            <Textarea
              placeholder="Summary (helps the AI understand the content)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full mb-4"
              rows={4}
              disabled={!isAuthenticated}
            />
            
            <Input
              type="text"
              placeholder="Category (e.g., 'funding', 'policy', 'technology')"
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
              {isSubmitting ? "Adding Link..." : "Add Link"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
