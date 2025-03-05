
import { GEMINI_API_KEY, GEMINI_API_URL, getDatabaseSystemPrompt, getGeneralSystemPrompt } from "./utils.ts";

// Function to generate a response from Gemini API
export async function generateGeminiResponse(
  messages: Array<{role: string, parts: Array<{text: string}>}>, 
  isDatabaseQuery: boolean
): Promise<string> {
  // Add system prompt with database schema knowledge if this is a database query
  const systemPrompt = {
    role: 'model',
    parts: [{ 
      text: isDatabaseQuery ? getDatabaseSystemPrompt() : getGeneralSystemPrompt()
    }]
  };
  
  // Insert system prompt at the beginning
  messages.unshift(systemPrompt);

  // Make request to Gemini API
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: messages,
      generationConfig: {
        temperature: isDatabaseQuery ? 0.2 : 0.7, // Lower temperature for SQL generation
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
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
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Gemini API error:', data);
    throw new Error(`Gemini API Error: ${JSON.stringify(data)}`);
  }
  
  // Extract response text
  let assistantResponse = "Desculpe, não consegui processar sua solicitação.";
  
  if (data.candidates && 
      data.candidates[0] && 
      data.candidates[0].content && 
      data.candidates[0].content.parts && 
      data.candidates[0].content.parts[0]) {
    assistantResponse = data.candidates[0].content.parts[0].text;
  }
  
  return assistantResponse;
}
