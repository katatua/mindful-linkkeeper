
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
  
  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Create a unique filename
      const fileName = `${Date.now()}-${file.name}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error("Storage upload error:", error);
        throw new Error(`Upload error: ${error.message}`);
      }
      
      // Get the public URL for the file
      const { data: urlData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);
      
      // Add a system message with the file link
      if (urlData) {
        const fileUrl = urlData.publicUrl;
        
        // Initial message about the upload
        const messageContent = language === 'en'
          ? `I've uploaded a PDF file: [${file.name}](${fileUrl}). Starting extraction... I'm using the Gemini 2.0 Pro Experimental model for analysis.`
          : `Carreguei um ficheiro PDF: [${file.name}](${fileUrl}). Iniciando extração... Estou usando o modelo Gemini 2.0 Pro Experimental para análise.`;
        
        const message = await chatCore.handleSendCustomMessage(messageContent);
        
        toast.success(language === 'en' 
          ? "File uploaded successfully" 
          : "Ficheiro carregado com sucesso");
        
        // Process PDF to extract information
        try {
          setIsProcessingPdf(true);
          
          // Inform that processing has started
          const processingMessage = language === 'en'
            ? "Processing PDF with Gemini 2.0 Pro Experimental... This may take a moment."
            : "Processando PDF com Gemini 2.0 Pro Experimental... Isso pode levar um momento.";
          
          await chatCore.handleSendCustomMessage(processingMessage, true);
          
          // Call Supabase Edge Function to process PDF
          const { data: extractionData, error: extractionError } = await supabase.functions.invoke(
            'pdf-extractor',
            {
              body: { fileUrl, fileName: file.name }
            }
          );
          
          if (extractionError) throw extractionError;
          
          // Create a rich message with extraction results and a link to the report
          const reportPath = `/reports?reportId=${extractionData.report.id}`;
          
          // Ensure we're using the correct properties from the extraction response
          const extractedTextSample = extractionData.extraction?.extracted_text?.substring(0, 100) || 
                                      extractionData.extraction?.content?.substring(0, 100) || 
                                      "Text content extracted";
          
          const numbersCount = extractionData.extraction?.extracted_numbers?.length || 
                              (extractionData.extraction?.elements?.filter(el => el.type === 'number')?.length) || 0;
          
          const imagesCount = extractionData.extraction?.extracted_images?.length || 
                             (extractionData.extraction?.elements?.filter(el => el.type === 'image')?.length) || 0;
          
          const reportTitle = extractionData.report?.report_title || extractionData.report?.title || "PDF Report";
          
          const successMessage = language === 'en'
            ? `✅ PDF processed successfully with Gemini 2.0 Pro Experimental!\n\n**Document:** ${file.name}\n\n**Extracted information:**\n- Text content: ${extractedTextSample}...\n- ${numbersCount} numerical data points extracted\n- ${imagesCount} images identified\n\n**Report created:** [${reportTitle}](${reportPath})`
            : `✅ PDF processado com sucesso usando Gemini 2.0 Pro Experimental!\n\n**Documento:** ${file.name}\n\n**Informações extraídas:**\n- Conteúdo de texto: ${extractedTextSample}...\n- ${numbersCount} dados numéricos extraídos\n- ${imagesCount} imagens identificadas\n\n**Relatório criado:** [${reportTitle}](${reportPath})`;
          
          await chatCore.handleSendCustomMessage(successMessage);
          
          // Option to navigate directly to the report
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
          
          const errorMessage = language === 'en'
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
      toast.error(language === 'en' 
        ? `Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}` 
        : `Erro ao carregar o ficheiro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
