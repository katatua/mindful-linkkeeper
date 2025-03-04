import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { classifyDocument } from "@/utils/aiUtils";
import { Header } from "@/components/Header";

export default function AddFile() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const sanitizeFilename = (filename: string): string => {
    // Remove non-ASCII characters and replace spaces with underscores
    return filename
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Please select a file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // First, upload the file to storage
      const fileExt = file.name.split('.').pop();
      const sanitizedName = sanitizeFilename(file.name);
      const fileName = `${Date.now()}-${sanitizedName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Auto-generate title from filename if not provided
      const displayTitle = title.trim() || file.name.replace(/\.[^/.]+$/, "");
      
      // Get classification from AI for better organization
      const classification = await classifyDocument({
        title: displayTitle,
        summary,
        fileName: file.name
      });

      // Then, create a link entry for the file
      const { error: linkError } = await supabase
        .from('links')
        .insert({
          title: displayTitle,
          url: fileName,
          source: 'file',
          summary: summary || null,
          category: category || null,
          classification,
          file_metadata: {
            name: file.name,
            size: file.size,
            type: file.type
          },
          user_id: user.id
        });

      if (linkError) throw linkError;

      toast({
        title: "File uploaded successfully",
        description: "Your file has been uploaded and is now available for AI analysis.",
      });
      navigate("/");
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-6 flex-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Add File for AI Analysis</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full mb-4"
              />
              
              <Input
                type="text"
                placeholder="Title (optional - will use filename if empty)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-4"
              />
              
              <Textarea
                placeholder="Summary (optional - helps the AI understand the content)"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full mb-4"
                rows={4}
              />
              
              <Input
                type="text"
                placeholder="Category (optional - e.g., 'funding', 'policy', 'technology')"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload File"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
