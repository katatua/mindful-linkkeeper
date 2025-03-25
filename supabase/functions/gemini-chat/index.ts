
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

    // Check if this is a direct SQL execution request
    const isDirectSql = userMessage.toLowerCase().includes('execute esta consulta sql') || 
                        userMessage.toLowerCase().includes('execute this sql query');
    
    if (isDirectSql) {
      // Extract SQL query from the message
      const sqlQuery = userMessage.replace(/execute\s+esta\s+consulta\s+sql\s*:?\s*/i, '')
                               .replace(/execute\s+this\s+sql\s+query\s*:?\s*/i, '')
                               .trim();
      
      console.log("Detected direct SQL query execution request:", sqlQuery);
      
      // Execute the SQL query directly
      const queryResult = await handleDatabaseQuery(sqlQuery, "");
      
      return new Response(
        JSON.stringify({ response: queryResult }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for regional investment query in Portuguese
    const isRegionalInvestmentQuery = userMessage.toLowerCase().includes('investimento') && 
                                    (userMessage.toLowerCase().includes('região') || userMessage.toLowerCase().includes('regiao')) &&
                                    (userMessage.toLowerCase().includes('últimos') || userMessage.toLowerCase().includes('ultimos'));
    
    // Log query detection
    if (isDatabaseQuery) {
      console.log("Detected database query in message:", userMessage);
      if (isRegionalInvestmentQuery) {
        console.log("Specifically detected regional investment query");
      }
    } else {
      console.log("Not a database query, using general prompt");
    }

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

    // Generate response using Gemini API with the new model
    let assistantResponse = await generateGeminiResponse(messages, isDatabaseQuery || isRegionalInvestmentQuery);
    
    // Check if response contains SQL query and execute if needed
    const sqlMatch = assistantResponse.match(/<SQL>([\s\S]*?)<\/SQL>/);
    
    if (sqlMatch && sqlMatch[1]) {
      const sqlQuery = sqlMatch[1].trim();
      console.log("Extracted SQL query from assistant response:", sqlQuery);
      
      // Execute the query and get the results
      const queryResults = await handleDatabaseQuery(sqlQuery, assistantResponse);
      
      // Replace the SQL section with the query results
      assistantResponse = assistantResponse.replace(/<SQL>[\s\S]*?<\/SQL>/, 
        queryResults);
    }
    
    // Add model information to the response
    if (!assistantResponse.includes("gemini-2.0-pro-exp-02-05")) {
      const modelInfo = "\n\n---\n*Powered by gemini-2.0-pro-exp-02-05*";
      assistantResponse += modelInfo;
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
