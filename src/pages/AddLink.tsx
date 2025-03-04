
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AddLink() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("No user found");

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

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Link for AI Analysis</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4"
              required
            />
            
            <Input
              type="url"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full mb-4"
              required
            />
            
            <Textarea
              placeholder="Summary (helps the AI understand the content)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full mb-4"
              rows={4}
            />
            
            <Input
              type="text"
              placeholder="Category (e.g., 'funding', 'policy', 'technology')"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
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
