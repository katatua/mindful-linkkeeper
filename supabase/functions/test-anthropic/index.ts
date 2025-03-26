
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const { apiKey } = await req.json();
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: "API key is required" 
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    // Simple test request to the Anthropic API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1024,
        messages: [
          { role: "user", content: "Hello, Claude" }
        ]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: data.error?.message || "Anthropic API request failed",
          details: data 
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Successfully connected to Anthropic API",
        response: {
          id: data.id,
          model: data.model,
          contentLength: data.content?.length || 0,
          usage: data.usage
        }
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
    
  } catch (error) {
    console.error("Error testing Anthropic connection:", error);
    
    return new Response(
      JSON.stringify({ 
        error: `Error testing Anthropic connection: ${error.message || String(error)}` 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
