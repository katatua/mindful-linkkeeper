
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) {
      toast({
        title: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement category adding logic
    toast({
      title: "Category adding not implemented yet",
      description: "This feature will be available soon.",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit">Add Category</Button>
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
