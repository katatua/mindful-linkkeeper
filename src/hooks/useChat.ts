
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
      
      // Criar um nome de arquivo único
      const fileName = `${Date.now()}-${file.name}`;
      
      // Enviar o arquivo para o Storage do Supabase
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
      
      if (error) {
        console.error("Storage upload error:", error);
        throw new Error(`Upload error: ${error.message}`);
      }
      
      // Obter a URL pública para o arquivo
      const { data: urlData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);
      
      // Adicionar uma mensagem do sistema com o link do arquivo
      if (urlData) {
        const fileUrl = urlData.publicUrl;
        
        // Mensagem inicial sobre o upload
        const messageContent = language === 'en'
          ? `I've uploaded a PDF file: [${file.name}](${fileUrl}). Starting extraction... I'm using the Gemini 2.0 Pro Experimental model for analysis.`
          : `Carreguei um ficheiro PDF: [${file.name}](${fileUrl}). Iniciando extração... Estou usando o modelo Gemini 2.0 Pro Experimental para análise.`;
        
        const message = await chatCore.handleSendCustomMessage(messageContent);
        
        toast.success(language === 'en' 
          ? "File uploaded successfully" 
          : "Ficheiro carregado com sucesso");
        
        // Processar o PDF para extrair informações
        try {
          setIsProcessingPdf(true);
          
          // Informar que o processamento começou
          const processingMessage = language === 'en'
            ? "Processing PDF with Gemini 2.0 Pro Experimental... This may take a moment."
            : "Processando PDF com Gemini 2.0 Pro Experimental... Isso pode levar um momento.";
          
          await chatCore.handleSendCustomMessage(processingMessage, true);
          
          // Chamar a função Edge do Supabase para processar o PDF
          const { data: extractionData, error: extractionError } = await supabase.functions.invoke(
            'pdf-extractor',
            {
              body: { fileUrl, fileName: file.name }
            }
          );
          
          if (extractionError) throw extractionError;
          
          // Criar uma mensagem rica com os resultados da extração e um link para o relatório na página de relatórios
          const reportPath = `/reports?reportId=${extractionData.report.id}`;
          const successMessage = language === 'en'
            ? `✅ PDF processed successfully with Gemini 2.0 Pro Experimental!\n\n**Document:** ${file.name}\n\n**Extracted information:**\n- Text content: ${extractionData.extraction.extracted_text.substring(0, 100)}...\n- ${extractionData.extraction.extracted_numbers.length} numerical data points extracted\n- ${extractionData.extraction.extracted_images.length} images identified\n\n**Report created:** [${extractionData.report.report_title}](${reportPath})`
            : `✅ PDF processado com sucesso usando Gemini 2.0 Pro Experimental!\n\n**Documento:** ${file.name}\n\n**Informações extraídas:**\n- Conteúdo de texto: ${extractionData.extraction.extracted_text.substring(0, 100)}...\n- ${extractionData.extraction.extracted_numbers.length} dados numéricos extraídos\n- ${extractionData.extraction.extracted_images.length} imagens identificadas\n\n**Relatório criado:** [${extractionData.report.report_title}](${reportPath})`;
          
          await chatCore.handleSendCustomMessage(successMessage);
          
          // Opção para navegar diretamente para o relatório
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
