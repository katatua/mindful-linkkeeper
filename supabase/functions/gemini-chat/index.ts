
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleDatabaseQuery } from "./database.ts";
import { generateGeminiResponse } from "./gemini.ts";
import { corsHeaders, isDatabaseQueryRequest } from "./utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userMessage, chatHistory } = await req.json();
    
    // Check if this is a database query request
    const isDatabaseQuery = isDatabaseQueryRequest(userMessage);

    // Prepare chat history for Gemini
    const messages = chatHistory.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    // Add current user message
    messages.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    // Generate response using Gemini API
    let assistantResponse = await generateGeminiResponse(messages, isDatabaseQuery);
    
    // Check if response contains SQL query and execute if needed
    const sqlMatch = assistantResponse.match(/<SQL>([\s\S]*?)<\/SQL>/);
    
    if (sqlMatch && sqlMatch[1]) {
      const sqlQuery = sqlMatch[1].trim();
      assistantResponse = await handleDatabaseQuery(sqlQuery, assistantResponse);
    }
    
    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
