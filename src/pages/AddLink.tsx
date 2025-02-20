
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AddLink() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
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
      // Get classification from Edge Function
      const { data: classificationData, error: classificationError } = await supabase.functions.invoke(
        'classify-document',
        {
          body: { title }
        }
      );

      if (classificationError) throw classificationError;

      const { error } = await supabase
        .from('links')
        .insert({
          url,
          title,
          tags: tags.split(',').map(tag => tag.trim()),
          classification: classificationData.classification
        });

      if (error) throw error;

      toast({
        title: "Link added successfully",
        description: "Your link has been saved.",
      });
      navigate("/");
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: "Error adding link",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Link</h1>
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
            <Input
              type="text"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit">Add Link</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
