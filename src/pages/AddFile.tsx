
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AddFile() {
  const [file, setFile] = useState<File | null>(null);
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

      // Then, create a link entry for the file
      const { error: linkError } = await supabase
        .from('links')
        .insert({
          title: file.name, // Keep original filename for display
          url: fileName, // Use sanitized filename for storage
          source: 'file',
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
        description: "Your file has been uploaded.",
      });
      navigate("/");
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add File</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit">Upload File</Button>
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
