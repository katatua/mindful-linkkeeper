
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
    
    console.log("Calling Gemini API...");
    
    // Call the Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
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
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return "Desculpe, encontrei um erro ao gerar uma resposta. Por favor, tente novamente mais tarde.";
  }
}
