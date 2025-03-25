
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleClaudeStream } from "./claude.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userMessage, chatHistory, thinkingEnabled = true } = await req.json();
    
    // Set up response headers for streaming
    const headers = new Headers(corsHeaders);
    headers.set('Content-Type', 'text/event-stream');
    headers.set('Cache-Control', 'no-cache');
    headers.set('Connection', 'keep-alive');
    
    // Create a TransformStream for streaming responses
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Start the Claude stream in a separate process
    handleClaudeStream(userMessage, chatHistory, thinkingEnabled, writer, encoder);
    
    return new Response(stream.readable, { headers });
  } catch (error) {
    console.error('Error in claude-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
