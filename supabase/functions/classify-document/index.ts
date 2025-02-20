
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  title: string;
  summary?: string;
  fileName?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, summary, fileName } = await req.json() as RequestBody;

    // Prepare content for classification
    const content = [
      `Title: ${title}`,
      summary ? `Summary: ${summary}` : '',
      fileName ? `File: ${fileName}` : ''
    ].filter(Boolean).join('\n');

    console.log('Classification request:', { content });

    // Call OpenAI API for classification
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using the more powerful GPT-4 model
        messages: [
          {
            role: 'system',
            content: 'You are a document classifier. Provide a single category that best describes the document. Use only one word, lowercase, no special characters.'
          },
          {
            role: 'user',
            content
          }
        ],
        temperature: 0.3,
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to classify document');
    }

    const data = await response.json();
    const classification = data.choices[0].message.content.trim().toLowerCase();

    console.log('Classification result:', { content, classification });

    return new Response(JSON.stringify({ classification }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
