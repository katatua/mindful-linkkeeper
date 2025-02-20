
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function AddFile() {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Please select a file",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement file upload logic
    toast({
      title: "File upload not implemented yet",
      description: "This feature will be available soon.",
    });
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
