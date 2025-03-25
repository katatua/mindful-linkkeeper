
import { useChatCore } from "./useChatCore";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useChat = (language: string) => {
  const chatCore = useChatCore(language);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Create a unique file name
      const fileName = `${Date.now()}-${file.name}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get the public URL for the file
      const { data: urlData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);
      
      // Add a system message with the file link
      if (urlData) {
        const fileUrl = urlData.publicUrl;
        const messageContent = language === 'en'
          ? `I've uploaded a PDF file: [${file.name}](${fileUrl}). Please analyze this document.`
          : `Carreguei um ficheiro PDF: [${file.name}](${fileUrl}). Por favor, analise este documento.`;
        
        await chatCore.handleSendCustomMessage(messageContent);
        
        toast.success(language === 'en' 
          ? "File uploaded successfully" 
          : "Ficheiro carregado com sucesso");
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(language === 'en' 
        ? "Error uploading file" 
        : "Erro ao carregar o ficheiro");
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    ...chatCore,
    handleRefreshSuggestions: chatCore.refreshSuggestions,
    handleFileUpload,
    isUploading
  };
};
