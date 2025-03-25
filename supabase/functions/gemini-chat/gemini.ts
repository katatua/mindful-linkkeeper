
import { GEMINI_API_KEY, GEMINI_API_URL, getDatabaseSystemPrompt, getGeneralSystemPrompt } from "./utils.ts";

// Function to generate a response from Gemini API
export async function generateGeminiResponse(messages: any[], isDatabaseQuery: boolean): Promise<string> {
  try {
    // Create a copy of the messages to avoid modifying the original
    const geminiMessages = [...messages];
    
    // Add system prompt as the first message
    const systemPrompt = isDatabaseQuery ? getDatabaseSystemPrompt() : getGeneralSystemPrompt();
    
    geminiMessages.unshift({
      role: 'model',
      parts: [{ text: systemPrompt }]
    });
    
    // Use the newer gemini-2.0-pro-exp-02-05 model
    const MODEL_NAME = "gemini-2.0-pro-exp-02-05";
    
    // Prepare the request body for Gemini API
    const requestBody = {
      contents: geminiMessages,
      generationConfig: {
        temperature: 0.2,  // Lower temperature for more factual responses
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 8192,  // Allow for longer responses
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    console.log(`Calling Gemini API with model: ${MODEL_NAME}...`);
    
    // Set timeout for Gemini API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      // Call the Gemini API with the specified model and timeout
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", errorText);
        
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a few moments.");
        } else if (response.status === 404) {
          throw new Error(`Model ${MODEL_NAME} not found. Falling back to standard response.`);
        } else {
          throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
        }
      }
      
      const data = await response.json();
      
      // Extract the response text
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        
        console.log("Gemini response received successfully");
        return data.candidates[0].content.parts[0].text;
      }
      
      throw new Error("Unexpected API response format");
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error("Request timed out. Please try again.");
      }
      
      // Check for network errors
      if (fetchError.message.includes('Failed to fetch') || 
          fetchError.message.includes('NetworkError') ||
          fetchError.message.includes('network')) {
        throw new Error("Network connection error. Please check your internet connection and try again.");
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return `Desculpe, encontrei um erro ao gerar uma resposta: ${error.message}. Por favor, tente novamente mais tarde.`;
  }
}
