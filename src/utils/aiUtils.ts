
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
  thinking?: string;
  toString(): string;
}

// Model definitions
export interface AIModel {
  id: 'gemini' | 'claude';
  name: string;
  description: string;
  capabilities: string[];
  thinking: boolean;
}

export const AI_MODELS: Record<string, AIModel> = {
  claude: {
    id: 'claude',
    name: 'Claude-3-7-Sonnet',
    description: 'Anthropic\'s most advanced model with reasoning capabilities',
    capabilities: ['Extended thinking', 'High accuracy', 'Complex reasoning'],
    thinking: true
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini 2.0 Pro',
    description: 'Google\'s large language model',
    capabilities: ['Fast responses', 'General knowledge', 'Creative writing'],
    thinking: false
  }
};

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

// Generate a response using either Gemini or Claude
export const generateResponse = async (userInput: string, useModel: 'gemini' | 'claude' = 'claude'): Promise<AIResponse> => {
  try {
    if (useModel === 'claude') {
      console.log('Calling Claude-3-7-Sonnet with message:', userInput);
      
      // Call the Claude edge function
      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: { 
          userMessage: userInput,
          chatHistory: [], // Reset chat history for synthetic data generation
          thinkingEnabled: true
        }
      });
      
      if (error) {
        console.error('Error calling Claude API:', error);
        return {
          response: "Error generating response",
          timestamp: new Date(),
          toString() { return this.response; }
        };
      }
      
      return {
        response: data.response,
        thinking: data.thinking,
        timestamp: new Date(),
        toString() { return this.response; }
      };
    } else {
      console.log('Calling Gemini 2.0 Pro Experimental with message:', userInput);
      
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
        return {
          response: "Error generating response",
          timestamp: new Date(),
          toString() { return this.response; }
        };
      }
      
      return {
        response: data.response,
        timestamp: new Date(),
        toString() { return this.response; }
      };
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      response: "Unexpected error occurred",
      timestamp: new Date(),
      toString() { return this.response; }
    };
  }
};

// Helper function to generate a unique ID (for messages)
export const genId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};
