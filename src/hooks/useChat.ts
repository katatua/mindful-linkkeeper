
import { useChatCore } from "./useChatCore";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useChat = (language: string) => {
  const chatCore = useChatCore(language);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const navigate = useNavigate();
  
  const sanitizeFileName = (fileName: string): string => {
    // Remove accents and special characters
    const normalized = fileName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Replace spaces with underscores and remove non-alphanumeric characters except for periods, underscores, and hyphens
    return normalized
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");
  };
  
  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Add user feedback message about upload starting
      const uploadingMessage = language === 'en'
        ? `Starting upload of ${file.name}...`
        : `Iniciando o upload de ${file.name}...`;
      
      toast.info(uploadingMessage, { duration: 3000 });
      
      // Create a unique filename with sanitization
      const sanitizedName = sanitizeFileName(file.name);
      const fileName = `${Date.now()}-${sanitizedName}`;
      
      // Upload file to Supabase Storage with better error handling
      const { data, error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
      
      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        
        // Handle specific storage errors
        if (uploadError.message.includes('JWT')) {
          throw new Error(language === 'en' 
            ? "Authentication error. Please refresh the page and try again." 
            : "Erro de autenticação. Por favor, atualize a página e tente novamente.");
        } else if (uploadError.message.includes('network')) {
          throw new Error(language === 'en' 
            ? "Network connection error. Please check your internet connection and try again." 
            : "Erro de conexão de rede. Por favor, verifique sua conexão com a internet e tente novamente.");
        } else {
          throw new Error(`Upload error: ${uploadError.message}`);
        }
      }
      
      // Get public URL for the file with error handling
      const { data: urlData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);
      
      // Add system message with file link
      if (urlData) {
        const fileUrl = urlData.publicUrl;
        
        // Upload confirmation message
        const messageContent = language === 'en'
          ? `I've uploaded a PDF file: [${file.name}](${fileUrl}). Starting extraction... I'm using the Gemini 2.0 Pro Experimental model for analysis.`
          : `Carreguei um ficheiro PDF: [${file.name}](${fileUrl}). Iniciando extração... Estou usando o modelo Gemini 2.0 Pro Experimental para análise.`;
        
        await chatCore.handleSendCustomMessage(messageContent);
        
        toast.success(language === 'en' 
          ? "File uploaded successfully" 
          : "Ficheiro carregado com sucesso");
        
        // Process PDF to extract information with enhanced error handling
        try {
          setIsProcessingPdf(true);
          
          // Inform that processing has started
          const processingMessage = language === 'en'
            ? "Processing PDF with Gemini 2.0 Pro Experimental... This may take a moment."
            : "Processando PDF com Gemini 2.0 Pro Experimental... Isso pode levar um momento.";
          
          await chatCore.handleSendCustomMessage(processingMessage, true);
          
          // Call Edge Function with timeout and better error handling
          const timeoutDuration = 60000; // 60 seconds timeout
          
          // Set up a timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error(language === 'en' 
                ? "Request timed out. The PDF processing took too long." 
                : "A solicitação expirou. O processamento do PDF demorou muito."));
            }, timeoutDuration);
          });
          
          // Call Supabase Edge Function
          const functionPromise = supabase.functions.invoke(
            'pdf-extractor',
            {
              body: { fileUrl, fileName: file.name }
            }
          );
          
          // Race between the function call and the timeout
          const { data: extractionData, error: extractionError } = await Promise.race([
            functionPromise,
            timeoutPromise.then(() => {
              throw new Error(language === 'en' 
                ? "Request timed out. The PDF processing took too long." 
                : "A solicitação expirou. O processamento do PDF demorou muito.");
            })
          ]) as any;
          
          if (extractionError) {
            console.error("PDF extraction error:", extractionError);
            
            let errorMessage = language === 'en'
              ? "Error during PDF extraction. Please try again later."
              : "Erro durante a extração do PDF. Por favor, tente novamente mais tarde.";
              
            if (extractionError.message) {
              if (extractionError.message.includes('network') || extractionError.message.includes('fetch')) {
                errorMessage = language === 'en'
                  ? "Network connection error. Please check your internet connection and try again."
                  : "Erro de conexão de rede. Por favor, verifique sua conexão com a internet e tente novamente.";
              } else if (extractionError.message.includes('timeout')) {
                errorMessage = language === 'en'
                  ? "Request timed out. The PDF processing took too long. Please try with a smaller file."
                  : "A solicitação expirou. O processamento do PDF demorou muito. Por favor, tente com um arquivo menor.";
              }
            }
            
            throw new Error(errorMessage);
          }
          
          if (!extractionData) {
            throw new Error(language === 'en' 
              ? "No data returned from PDF extractor. Please try again." 
              : "Nenhum dado retornado do extrator de PDF. Por favor, tente novamente.");
          }
          
          // Create rich message with extraction results and link to report page
          const reportPath = `/reports?reportId=${extractionData.report.id}`;
          const successMessage = language === 'en'
            ? `✅ PDF processed successfully with Gemini 2.0 Pro Experimental!\n\n**Document:** ${file.name}\n\n**Extracted information:**\n- Text content: ${extractionData.extraction.extracted_text.substring(0, 100)}...\n- ${extractionData.extraction.extracted_numbers.length} numerical data points extracted\n- ${extractionData.extraction.extracted_images.length} images identified\n\n**Report created:** [${extractionData.report.report_title}](${reportPath})`
            : `✅ PDF processado com sucesso usando Gemini 2.0 Pro Experimental!\n\n**Documento:** ${file.name}\n\n**Informações extraídas:**\n- Conteúdo de texto: ${extractionData.extraction.extracted_text.substring(0, 100)}...\n- ${extractionData.extraction.extracted_numbers.length} dados numéricos extraídos\n- ${extractionData.extraction.extracted_images.length} imagens identificadas\n\n**Relatório criado:** [${extractionData.report.report_title}](${reportPath})`;
          
          await chatCore.handleSendCustomMessage(successMessage);
          
          // Option to navigate directly to report
          toast.success(
            language === 'en'
            ? "PDF Report Created" 
            : "Relatório PDF Criado",
            {
              action: {
                label: language === 'en' ? "View Report" : "Ver Relatório",
                onClick: () => navigate(reportPath)
              },
              duration: 6000,
            }
          );
          
        } catch (processingError) {
          console.error("Error processing PDF:", processingError);
          
          let errorMessage = language === 'en'
            ? `Error processing PDF: ${processingError.message || "Unknown error"}. The file was uploaded but couldn't be analyzed.`
            : `Erro ao processar o PDF: ${processingError.message || "Erro desconhecido"}. O arquivo foi carregado mas não pôde ser analisado.`;
          
          await chatCore.handleSendCustomMessage(errorMessage);
          
          toast.error(language === 'en' 
            ? "Error processing PDF" 
            : "Erro ao processar o PDF");
        } finally {
          setIsProcessingPdf(false);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Determine if it's a network error
      const isNetworkError = error.message && (
        error.message.includes('network') || 
        error.message.includes('fetch') || 
        error.message.includes('connection') ||
        error.message.includes('offline')
      );
      
      const errorMessage = isNetworkError
        ? (language === 'en' 
            ? "Network connection error. Please check your internet connection and try again." 
            : "Erro de conexão de rede. Por favor, verifique sua conexão com a internet e tente novamente.")
        : (language === 'en' 
            ? `Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}` 
            : `Erro ao carregar o ficheiro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      
      toast.error(errorMessage);
      
      // Add message to chat about upload failure
      const chatErrorMessage = language === 'en'
        ? `❌ Failed to upload PDF: ${errorMessage}`
        : `❌ Falha ao carregar PDF: ${errorMessage}`;
      
      await chatCore.handleSendCustomMessage(chatErrorMessage);
      
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    ...chatCore,
    handleRefreshSuggestions: chatCore.refreshSuggestions,
    handleFileUpload,
    isUploading: isUploading || isProcessingPdf
  };
};
