
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  content: string;
  title: string;
  type: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, title, type } = await req.json() as RequestBody;
    
    // Limit content to a reasonable size for API calls
    const truncatedContent = content.length > 15000 
      ? content.substring(0, 15000) + "..." 
      : content;
    
    // Get file extension from title or type
    let fileType = "";
    if (title.includes('.')) {
      fileType = title.split('.').pop()?.toLowerCase() || "";
    } else if (type.includes('/')) {
      fileType = type.split('/').pop()?.toLowerCase() || "";
    }
    
    // Create prompt for analysis
    const systemPrompt = `You are an expert document analyzer with deep expertise in innovation, research, and policy documents. 
    Your task is to analyze the provided document (a ${fileType} file titled "${title}") and:
    1. Suggest a clear, descriptive title for the document (maximum 60 characters)
    2. Provide a clear, concise summary (maximum 150 words)
    3. Give a critical analysis of the document's content, relevance, and potential applications or implications
    4. Suggest an appropriate category for the document from one of these options: Research Report, Policy Document, Funding Information, Technical Documentation, Statistical Data, Case Study, Guidelines, International Collaboration
    
    Your response must be formatted exactly like this:
    TITLE: [your suggested title]
    CATEGORY: [your suggested category]
    SUMMARY: [your summary]
    ANALYSIS: [your critical analysis]
    
    Focus on extracting key insights, highlighting strengths and limitations, and identifying potential applications or relevance 
    to innovation policies, funding opportunities, or research priorities.`;

    // Call OpenAI API for analysis
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using the more efficient model for faster responses
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Document content: ${truncatedContent}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to analyze document');
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content.trim();
    
    // Extract title, category, summary and analysis from the text
    let suggestedTitle = "";
    let suggestedCategory = "";
    let summary = "";
    let analysis = "";
    
    // Extract sections using regex
    const titleMatch = analysisText.match(/TITLE:\s*(.*?)(?=\n*CATEGORY:|$)/s);
    const categoryMatch = analysisText.match(/CATEGORY:\s*(.*?)(?=\n*SUMMARY:|$)/s);
    const summaryMatch = analysisText.match(/SUMMARY:\s*(.*?)(?=\n*ANALYSIS:|$)/s);
    const analysisMatch = analysisText.match(/ANALYSIS:\s*(.*?)$/s);
    
    if (titleMatch && titleMatch[1]) suggestedTitle = titleMatch[1].trim();
    if (categoryMatch && categoryMatch[1]) suggestedCategory = categoryMatch[1].trim();
    if (summaryMatch && summaryMatch[1]) summary = summaryMatch[1].trim();
    if (analysisMatch && analysisMatch[1]) analysis = analysisMatch[1].trim();
    
    // Fallbacks if regex fails
    if (!suggestedTitle) suggestedTitle = title.replace(/\.[^/.]+$/, ""); // Use original filename without extension
    if (!suggestedCategory) suggestedCategory = "Research Report"; // Default category
    
    if (!summary && !analysis && analysisText) {
      // If the AI didn't follow the format, use a simpler approach
      const paragraphs = analysisText.split("\n\n");
      summary = paragraphs[0]?.trim() || "No summary generated";
      analysis = paragraphs.slice(1).join("\n\n").trim() || "No analysis generated";
    }

    console.log('Document analysis complete:', { 
      title: suggestedTitle.substring(0, 40) + "...",
      category: suggestedCategory,
      summary: summary.substring(0, 50) + "..." 
    });

    return new Response(JSON.stringify({ 
      suggestedTitle,
      suggestedCategory,
      summary, 
      analysis
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      suggestedTitle: "",
      suggestedCategory: "",
      summary: "Failed to generate summary due to an error.",
      analysis: "The document analysis could not be completed. Please try again later."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
