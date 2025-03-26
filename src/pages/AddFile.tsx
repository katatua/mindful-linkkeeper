import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { classifyDocument } from "@/utils/aiUtils";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";

export default function AddFile() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const sanitizeFilename = (filename: string): string => {
    return filename
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: t('file.select'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const userResult = await supabase.auth.getUser();
      const user = userResult.data.user;
      if (!user) throw new Error("User not authenticated");

      const fileExt = file.name.split('.').pop();
      const sanitizedName = sanitizeFilename(file.name);
      const fileName = `${Date.now()}-${sanitizedName}`;

      const uploadResult = await supabase.storage
        .from('files')
        .upload(fileName, file);

      if (uploadResult.error) throw uploadResult.error;

      const displayTitle = title.trim() || file.name.replace(/\.[^/.]+$/, "");
      
      const classification = await classifyDocument({
        title: displayTitle,
        summary,
        fileName: file.name
      });

      const linkResult = await supabase
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

      if (linkResult.error) throw linkResult.error;

      toast({
        title: t('file.success'),
        description: t('file.success.description'),
      });
      navigate("/");
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: t('file.error'),
        description: t('file.error.description'),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-6 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack} 
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('file.back') || 'Back'}
            </Button>
            <h1 className="text-2xl font-bold">{t('file.title')}</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full mb-4"
              />
              
              <Input
                type="text"
                placeholder={t('file.name')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-4"
              />
              
              <Textarea
                placeholder={t('file.summary')}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full mb-4"
                rows={4}
              />
              
              <Input
                type="text"
                placeholder={t('file.category')}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? t('file.uploading') : t('file.upload')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                disabled={isUploading}
              >
                {t('file.cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
