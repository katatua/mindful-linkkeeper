
import { supabase } from "@/integrations/supabase/client";
import { getCurrentAIProvider } from './settingsManager';
import { extractEnergyKeywords, extractTechnologyKeywords, extractRegionKeywords } from './keywordExtractor';
import { generateFallbackResponse } from './fallbackResponder';
import { delay } from './constants';

// Enhanced query handling with better context extraction, error management and retry mechanism
export const generateResponse = async (prompt: string, retryCount = 0, maxRetries = 2) => {
  try {
    // Extract keywords for energy-related queries to improve matching
    const energyKeywords = extractEnergyKeywords(prompt);
    
    // Add technology-related keywords extraction
    const techKeywords = extractTechnologyKeywords(prompt);
    
    // Add region-related keywords extraction for better city/region matching
    const regionKeywords = extractRegionKeywords(prompt);
    
    // Determine which AI provider to use
    const provider = await getCurrentAIProvider();
    
    // Call the appropriate edge function based on the provider
    const functionName = provider === 'openai' ? 'openai-chat' : 'gemini-chat';
    
    console.log(`Using AI provider: ${provider}`);
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: { 
        prompt, 
        chatHistory: [],
        // Pass additional context to help the query processing
        additionalContext: {
          energyKeywords,
          techKeywords,
          regionKeywords
        }
      }
    });

    if (error) {
      console.error(`Error invoking ${functionName} function:`, error);
      
      // Check if error contains rate limit or quota information (status 429)
      const isRateLimitError = error.message?.includes('429') || 
                            error.message?.includes('quota') ||
                            error.message?.includes('rate limit');
      
      if (isRateLimitError && retryCount < maxRetries) {
        // Calculate exponential backoff time
        const backoffTime = Math.pow(2, retryCount) * 1000;
        console.log(`Rate limit detected, retrying in ${backoffTime}ms (attempt ${retryCount + 1}/${maxRetries})`);
        
        // Wait for the backoff time
        await delay(backoffTime);
        
        // Retry the request
        return generateResponse(prompt, retryCount + 1, maxRetries);
      }
      
      if (isRateLimitError) {
        console.error('AI API quota exceeded:', error);
        return await generateFallbackResponse(prompt);
      } else {
        // For other errors, attempt to switch to the alternate provider
        if (retryCount < 1) {
          console.log(`Trying to switch providers due to error with ${provider}`);
          
          // Switch provider temporarily for this request
          const alternateProvider = provider === 'openai' ? 'gemini' : 'openai';
          const alternateFunctionName = alternateProvider === 'openai' ? 'openai-chat' : 'gemini-chat';
          
          console.log(`Attempting with alternate provider: ${alternateProvider}`);
          
          try {
            const { data: alternateData, error: alternateError } = await supabase.functions.invoke(alternateFunctionName, {
              body: { 
                prompt, 
                chatHistory: [],
                additionalContext: {
                  energyKeywords,
                  techKeywords,
                  regionKeywords
                }
              }
            });
            
            if (alternateError) {
              throw alternateError;
            }
            
            return {
              message: alternateData.response || 'Sorry, I could not process your query.',
              sqlQuery: alternateData.sqlQuery || '',
              results: alternateData.results || null
            };
          } catch (alternateProviderError) {
            console.error(`Error with alternate provider ${alternateProvider}:`, alternateProviderError);
            // Continue to fallback
          }
        }
        
        // If we get here, both providers failed or we've already tried alternates
        return await generateFallbackResponse(prompt);
      }
    }

    // Fallback handling if data structure is unexpected
    if (!data || (!data.response && !data.error)) {
      console.error('Received invalid response format from AI service');
      return await generateFallbackResponse(prompt);
    }
    
    // If there's an error message in the response, log it and use fallback
    if (data.error) {
      console.error('Error in AI response:', data.error);
      
      // Try to extract API key error patterns
      if (data.error.includes('API key') || data.error.includes('authentication')) {
        return {
          message: "There appears to be an issue with the AI provider's API key. Please check your API key configuration in the Supabase edge function secrets. For OpenAI, make sure you're using a key from platform.openai.com.",
          sqlQuery: '',
          results: null
        };
      }
      
      return await generateFallbackResponse(prompt);
    }

    // Store query history in the database
    try {
      const userResponse = await supabase.auth.getUser();
      const userId = userResponse.data?.user?.id;
      
      const { error: historyError } = await supabase.from('query_history').insert({
        query_text: prompt,
        user_id: userId || null,
        was_successful: true,
        language: 'en',
        error_message: null,
        created_tables: null
      });

      if (historyError) {
        console.error('Error storing query history:', historyError);
      }
    } catch (historyStoreError) {
      console.error('Error storing query history:', historyStoreError);
    }
    
    return {
      message: data.response || 'Sorry, I could not process your query.',
      sqlQuery: data.sqlQuery || '',
      results: data.results || null
    };
  } catch (error) {
    console.error('Error generating response:', error);
    return await generateFallbackResponse(prompt);
  }
};
