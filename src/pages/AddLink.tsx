
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function AddLink() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement link adding logic
    toast({
      title: "Link adding not implemented yet",
      description: "This feature will be available soon.",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Link</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="url"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
