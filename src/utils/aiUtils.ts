
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Types for AI operations
export interface ClassificationResponse {
  classification: string;
}

export interface ClassificationRequest {
  title: string;
  summary?: string;
  fileName?: string;
}

export interface AIResponse {
  response: string;
  timestamp: Date;
}

// Function to classify documents via Supabase Edge Function
export const classifyDocument = async (data: ClassificationRequest): Promise<string> => {
  try {
    // Create a Supabase client - using public URLs and keys which is fine for edge functions
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration is missing');
      return 'unknown';
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Call the edge function
    const { data: responseData, error } = await supabase.functions.invoke<ClassificationResponse>(
      'classify-document',
      {
        body: data,
      }
    );
    
    if (error) {
      console.error('Error classifying document:', error);
      return 'unknown';
    }
    
    return responseData?.classification || 'unknown';
  } catch (error) {
    console.error('Unexpected error in document classification:', error);
    return 'unknown';
  }
};

// Chat history for context
let chatHistory: any[] = [];

// Generate an AI response using Gemini via Supabase Edge Function
export const generateResponse = async (userInput: string): Promise<string> => {
  try {
    console.log('Calling Gemini API with message:', userInput);
    
    // Add user message to chat history (limited to last 20 messages for context)
    chatHistory.push({
      role: 'user',
      content: userInput
    });
    
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(chatHistory.length - 20);
    }
    
    // Call the Gemini edge function using the imported Supabase client
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: { 
        userMessage: userInput,
        chatHistory: chatHistory.slice(0, -1) // Send previous messages as context
      }
    });
    
    if (error) {
      console.error('Error calling Gemini API:', error);
      return "Desculpe, encontrei um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.";
    }
    
    // Add assistant response to chat history
    chatHistory.push({
      role: 'assistant',
      content: data.response
    });
    
    return data.response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "Ocorreu um erro ao gerar a resposta. Por favor, tente novamente mais tarde.";
  }
};

// Helper function to generate a unique ID (for messages)
export const genId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

