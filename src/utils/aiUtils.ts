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
                          userInput.toLowerCase().includes("2024") ||
                          userInput.toLowerCase().includes("2023") ||
                          userInput.toLowerCase().includes("abertos") ||
                          userInput.toLowerCase().includes("open") ||
                          userInput.toLowerCase().includes("funding") ||
                          userInput.toLowerCase().includes("highest") ||
                          userInput.toLowerCase().includes("most") ||
                          userInput.toLowerCase().includes("applications") ||
                          userInput.toLowerCase().includes("upcoming") ||
                          userInput.toLowerCase().includes("deadlines") ||
                          userInput.toLowerCase().includes("regions");

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
        important: "This database uses PostgreSQL. Do NOT use SQLite functions like strftime or DATE('now'). Always use PostgreSQL syntax. DO NOT include semicolons in your SQL queries."
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

// List of suggested database questions
export const suggestedDatabaseQuestions = [
  "What funding programs are currently open for applications?",
  "Show me all funding programs with application deadlines in 2024",
  "Which funding programs have the highest success rates?",
  "List all R&D projects in the healthcare sector",
  "What is the total budget allocated to innovation programs in the last year?",
  "Show me international collaborations with Germany",
  "Which regions have received the most funding in 2023?",
  "What are the upcoming application deadlines for funding programs?",
  "Show me all projects with funding amounts greater than 1 million euros",
  "List all policy frameworks implemented after 2022",
  "Which sectors receive the most innovation funding?",
  "What are the top 5 funding programs by total budget?",
  "Show me all metrics related to patent applications",
  "List all international collaborations focused on renewable energy",
  "What is the average review time for funding applications?"
];
