
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddFile() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const navigate = useNavigate();
  const { toast: toastNotification } = useToast();
  const { t } = useLanguage();

  const sanitizeFilename = (filename: string): string => {
    // Remove non-ASCII characters and replace spaces with underscores
    return filename
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
  };

  const generateAiAnalysis = async (fileContent: string, fileName: string, fileType: string): Promise<{summary: string, analysis: string}> => {
    try {
      setIsAnalyzing(true);
      
      // Call the Supabase Edge Function for AI analysis
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: {
          content: fileContent,
          title: fileName,
          type: fileType
        }
      });
      
      if (error) throw error;
      
      return {
        summary: data.summary || "No summary generated",
        analysis: data.analysis || "No analysis generated"
      };
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      return {
        summary: "Failed to generate summary",
        analysis: "Failed to generate analysis"
      };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result.toString());
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsText(file);
    });
  };

  const handleAnalyzeFile = async () => {
    if (!file) {
      toast.error(t('file.select'));
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // Read the file content
      const fileContent = await readFileContent(file);
      
      // Generate AI analysis
      const { summary, analysis } = await generateAiAnalysis(fileContent, file.name, file.type);
      
      // Update state with AI results
      setAiSummary(summary);
      setAiAnalysis(analysis);
      
      // Auto-populate summary field if it's empty
      if (!summary.trim()) {
        setSummary(summary);
      }
      
      toast.success(t('file.analysis.success'));
    } catch (error) {
      console.error('Error analyzing file:', error);
      toast.error(t('file.analysis.error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toastNotification({
        title: t('file.select'),
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
      
      // If AI analysis hasn't been performed yet, do it now
      let finalAiSummary = aiSummary;
      let finalAiAnalysis = aiAnalysis;
      
      if (!aiSummary || !aiAnalysis) {
        try {
          const fileContent = await readFileContent(file);
          const { summary, analysis } = await generateAiAnalysis(fileContent, file.name, file.type);
          finalAiSummary = summary;
          finalAiAnalysis = analysis;
        } catch (error) {
          console.error('Error generating AI analysis during submission:', error);
          // Continue with submission even if analysis fails
        }
      }

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
          ai_summary: finalAiSummary || null,
          ai_analysis: finalAiAnalysis || null,
          user_id: user.id
        });

      if (linkError) throw linkError;

      toast.success(t('file.success'));
      navigate("/");
    } catch (error) {
      console.error('Error uploading file:', error);
      toastNotification({
        title: t('file.error'),
        description: t('file.error.description'),
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
          <h1 className="text-2xl font-bold mb-6">{t('file.title')}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full mb-4"
              />
              
              {file && (
                <div className="mb-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAnalyzeFile}
                    disabled={isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('file.analyzing')}
                      </>
                    ) : (
                      t('file.analyze')
                    )}
                  </Button>
                </div>
              )}
              
              {(aiSummary || aiAnalysis) && (
                <div className="p-4 border rounded-md mb-4 space-y-3 bg-muted/30">
                  {aiSummary && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">{t('file.ai.summary')}</h3>
                      <p className="text-sm mt-1">{aiSummary}</p>
                    </div>
                  )}
                  
                  {aiAnalysis && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">{t('file.ai.analysis')}</h3>
                      <p className="text-sm mt-1 whitespace-pre-line">{aiAnalysis}</p>
                    </div>
                  )}
                </div>
              )}
              
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
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('file.uploading')}
                  </>
                ) : (
                  t('file.upload')
                )}
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
};
