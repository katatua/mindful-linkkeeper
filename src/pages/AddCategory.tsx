import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) {
      toast({
        title: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    try {
      const userResult = await supabase.auth.getUser();
      const userId = userResult.data.user?.id;
      if (!userId) throw new Error("No user found");

      const result = await supabase
        .from('links')
        .insert({
          title: categoryName,
          url: '#',
          category: categoryName,
          source: 'category',
          summary: description,
          user_id: userId
        });

      if (result.error) throw result.error;

      toast({
        title: "Category added successfully",
        description: "Your category has been created.",
      });
      navigate("/");
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error adding category",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-6 flex-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{t('category.title')}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder={t('category.name')}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full mb-4"
                required
              />
              <Input
                type="text"
                placeholder={t('category.description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit">{t('category.add')}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                {t('category.cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
