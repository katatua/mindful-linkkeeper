
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
    // Use the imported Supabase client instead of creating a new one
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
    
    // Check if this is a database query to provide a better system prompt
    const isDatabaseQuery = userInput.toLowerCase().includes("database") || 
                            userInput.toLowerCase().includes("sql") ||
                            userInput.toLowerCase().includes("query") ||
                            userInput.toLowerCase().includes("data") ||
                            userInput.toLowerCase().includes("banco de dados") ||
                            userInput.toLowerCase().includes("consulta") ||
                            userInput.toLowerCase().includes("encontrar") ||
                            userInput.toLowerCase().includes("programas") ||
                            userInput.toLowerCase().includes("ano") ||
                            userInput.toLowerCase().includes("year") ||
                            userInput.toLowerCase().includes("2024");

    // Add user message to chat history (limited to last 20 messages for context)
    chatHistory.push({
      role: 'user',
      content: userInput
    });
    
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(chatHistory.length - 20);
    }
    
    // Prepare the request body with additional context if it's a database query
    const requestBody: any = { 
      userMessage: userInput,
      chatHistory: chatHistory.slice(0, -1) // Send previous messages as context
    };
    
    // If this is a database query, add extra information about PostgreSQL
    if (isDatabaseQuery) {
      requestBody.databaseInfo = {
        type: 'PostgreSQL',
        version: '14.x',
        dateFunctions: {
          currentDate: 'CURRENT_DATE',
          extractYear: 'EXTRACT(YEAR FROM column_name)',
          formatDate: "TO_CHAR(column_name, 'YYYY-MM-DD')"
        },
        important: "This database uses PostgreSQL. Do NOT use SQLite functions like strftime or DATE('now'). Always use PostgreSQL syntax."
      };
    }
    
    // Call the Gemini edge function using the imported Supabase client
    const { data, error } = await supabase.functions.invoke('gemini-chat', {
      body: requestBody
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
