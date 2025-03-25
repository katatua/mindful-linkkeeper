
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
    // Set a timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      // Use the imported Supabase client instead of creating a new one
      const { data: responseData, error } = await supabase.functions.invoke<ClassificationResponse>(
        'classify-document',
        {
          body: data,
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Error classifying document:', error);
        return 'unknown';
      }
      
      return responseData?.classification || 'unknown';
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle specific error types
      if (fetchError.name === 'AbortError') {
        console.error('Document classification request timed out');
      } else if (fetchError.message && fetchError.message.includes('fetch')) {
        console.error('Network error during document classification:', fetchError);
      } else {
        console.error('Error in document classification:', fetchError);
      }
      
      return 'unknown';
    }
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
    console.log('Calling Gemini 2.0 Pro Experimental with message:', userInput);
    
    // Add user message to chat history (limited to last 20 messages for context)
    chatHistory.push({
      role: 'user',
      content: userInput
    });
    
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(chatHistory.length - 20);
    }
    
    // Set a timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      // Call the Gemini edge function using the imported Supabase client
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          userMessage: userInput,
          chatHistory: chatHistory.slice(0, -1) // Send previous messages as context
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
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
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle specific error types
      if (fetchError.name === 'AbortError') {
        console.error('Gemini API request timed out');
        return "Desculpe, o tempo limite de resposta foi excedido. Por favor, tente novamente ou simplifique sua pergunta.";
      } 
      
      if (fetchError.message && (fetchError.message.includes('fetch') || fetchError.message.includes('network'))) {
        console.error('Network error calling Gemini API:', fetchError);
        return "Parece haver um problema de conexão. Por favor, verifique sua conexão com a internet e tente novamente.";
      }
      
      console.error('Error generating AI response:', fetchError);
      return "Ocorreu um erro ao gerar a resposta. Por favor, tente novamente mais tarde.";
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "Ocorreu um erro ao gerar a resposta. Por favor, tente novamente mais tarde.";
  }
};

// Helper function to generate a unique ID (for messages)
export const genId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};
