
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Paperclip, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  handleFileUpload?: (file: File) => Promise<void>;
  isTyping: boolean;
  language: string;
  isUploading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSendMessage,
  handleFileUpload,
  isTyping,
  language,
  isUploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validar tipo de arquivo
    if (file.type !== 'application/pdf') {
      toast.error(language === 'en' 
        ? "Only PDF files are supported" 
        : "Apenas ficheiros PDF são suportados");
      return;
    }
    
    // Validar tamanho do arquivo (máx 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error(language === 'en' 
        ? "File size must be less than 10MB" 
        : "O tamanho do ficheiro deve ser inferior a 10MB");
      return;
    }

    if (handleFileUpload) {
      await handleFileUpload(file);
    }
    
    // Limpar o input para permitir enviar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2 pb-4">
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="flex-1 flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          type="button" 
          onClick={handleSelectFile}
          disabled={isTyping || isUploading}
          className="flex-shrink-0"
        >
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
        </Button>
        
        <Input
          placeholder={language === 'en' 
            ? isUploading 
              ? "Processing PDF..." 
              : "Ask about innovation metrics, funding, or policies..." 
            : isUploading 
              ? "Processando PDF..." 
              : "Pergunte sobre métricas de inovação, financiamento ou políticas..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-1"
          disabled={isUploading}
        />
      </div>
      
      <Button 
        onClick={handleSendMessage} 
        disabled={isTyping || isUploading || !input.trim()}
      >
        <SendHorizonal className="h-5 w-5" />
      </Button>
    </div>
  );
};
