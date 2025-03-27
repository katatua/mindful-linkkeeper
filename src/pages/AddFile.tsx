
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { classifyDocument } from "@/utils/aiUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Layout } from "@/components/Layout";

export default function AddFile() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiTitle, setAiTitle] = useState("");
  const [aiCategory, setAiCategory] = useState("");
  const [useAiSuggestions, setUseAiSuggestions] = useState(true);
  const navigate = useNavigate();
  const { toast: toastNotification } = useToast();
  const { t } = useLanguage();
  
  const form = useForm({
    defaultValues: {
      file: "",
      title: "",
      summary: "",
      category: ""
    }
  });

  const sanitizeFilename = (filename: string): string => {
    // Remove non-ASCII characters and replace spaces with underscores
    return filename
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
  };

  const generateAiAnalysis = async (fileContent: string, fileName: string, fileType: string): Promise<{
    suggestedTitle: string,
    suggestedCategory: string,
    summary: string,
    analysis: string
  }> => {
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
        suggestedTitle: data.suggestedTitle || fileName.replace(/\.[^/.]+$/, ""),
        suggestedCategory: data.suggestedCategory || "",
        summary: data.summary || "No summary generated",
        analysis: data.analysis || "No analysis generated"
      };
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      return {
        suggestedTitle: fileName.replace(/\.[^/.]+$/, ""),
        suggestedCategory: "",
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
      const { suggestedTitle, suggestedCategory, summary, analysis } = 
        await generateAiAnalysis(fileContent, file.name, file.type);
      
      // Update state with AI results
      setAiTitle(suggestedTitle);
      setAiCategory(suggestedCategory);
      setAiSummary(summary);
      setAiAnalysis(analysis);
      
      // Auto-populate fields with AI suggestions if enabled
      if (useAiSuggestions) {
        setTitle(suggestedTitle);
        setCategory(suggestedCategory);
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

      // Use either user-provided or AI-suggested values
      const displayTitle = title.trim() || aiTitle || file.name.replace(/\.[^/.]+$/, "");
      const displayCategory = category.trim() || aiCategory || null;
      const displaySummary = summary.trim() || aiSummary || null;
      
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

      // Get classification from AI for better organization
      const classification = await classifyDocument({
        title: displayTitle,
        summary: displaySummary || "",
        fileName: file.name
      });
      
      // Then, create a link entry for the file
      const { error: linkError } = await supabase
        .from('links')
        .insert({
          title: displayTitle,
          url: fileName,
          source: 'file',
          summary: displaySummary,
          category: displayCategory,
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
      navigate("/database");
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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('file.title') || "Add File for AI Analysis"}</h1>
        <p className="text-muted-foreground mt-2">
          Upload a document for AI analysis and categorization
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border rounded-lg p-6 space-y-6">
          <div className="grid gap-4">
            <FormLabel htmlFor="file-upload">Select File</FormLabel>
            <Input
              id="file-upload"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
              accept=".pdf,.csv,.txt,.doc,.docx"
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, CSV, TXT, DOC, DOCX (max 10MB)
            </p>
          </div>
          
          {file && (
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAnalyzeFile}
                disabled={isAnalyzing}
                className="w-full mt-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('file.analyzing') || "Analyzing..."}
                  </>
                ) : (
                  t('file.analyze') || "Analyze with AI"
                )}
              </Button>
              
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="useAiSuggestions"
                  checked={useAiSuggestions}
                  onChange={(e) => setUseAiSuggestions(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="useAiSuggestions" className="text-sm text-muted-foreground">
                  {t('file.useAiSuggestions') || "Use AI suggestions automatically"}
                </label>
              </div>
            </div>
          )}
          
          {(aiSummary || aiAnalysis || aiTitle || aiCategory) && (
            <div className="p-4 border rounded-md mb-4 space-y-3 bg-muted/20">
              <h3 className="font-medium text-sm">AI Analysis Results</h3>
              
              {aiTitle && (
                <div>
                  <h4 className="font-medium text-xs text-muted-foreground">{t('file.ai.title') || "AI Suggested Title"}</h4>
                  <p className="text-sm mt-1">{aiTitle}</p>
                </div>
              )}
              
              {aiCategory && (
                <div>
                  <h4 className="font-medium text-xs text-muted-foreground">{t('file.ai.category') || "AI Suggested Category"}</h4>
                  <p className="text-sm mt-1">{aiCategory}</p>
                </div>
              )}
              
              {aiSummary && (
                <div>
                  <h4 className="font-medium text-xs text-muted-foreground">{t('file.ai.summary') || "AI Summary"}</h4>
                  <p className="text-sm mt-1">{aiSummary}</p>
                </div>
              )}
              
              {aiAnalysis && (
                <div>
                  <h4 className="font-medium text-xs text-muted-foreground">{t('file.ai.analysis') || "AI Analysis"}</h4>
                  <p className="text-sm mt-1 whitespace-pre-line">{aiAnalysis}</p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 mt-6">
            <div className="grid gap-2">
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title"
              />
            </div>
            
            <div className="grid gap-2">
              <FormLabel htmlFor="summary">Summary</FormLabel>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief description of the document"
                rows={4}
              />
            </div>
            
            <div className="grid gap-2">
              <FormLabel htmlFor="category">Category</FormLabel>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., 'funding', 'policy', 'technology'"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isUploading || !file}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('file.uploading') || "Uploading..."}
              </>
            ) : (
              t('file.upload') || "Upload File"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/database")}
            disabled={isUploading}
          >
            {t('file.cancel') || "Cancel"}
          </Button>
        </div>
      </form>
    </div>
  );
}
