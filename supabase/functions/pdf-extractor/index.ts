
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7";

// CORS settings
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to extract information from PDF
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get PDF URL and other parameters from request
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (jsonError) {
      console.error("Error parsing request JSON:", jsonError);
      return new Response(
        JSON.stringify({ error: "Invalid request format", details: "Could not parse JSON body" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { fileUrl, fileName, extractionId } = requestBody;
    
    // Validate parameters
    if (!fileUrl || !fileName) {
      return new Response(
        JSON.stringify({ error: "File URL or name not provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting PDF extraction: ${fileName}`);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Simulate extraction (in a real environment, you would use a PDF library)
    // In this simulated example, we're creating fictional data to demonstrate the structure
    
    // 1. Simulate text extraction
    const extractedText = `Conteúdo extraído do documento ${fileName}. 
      Este texto contém informações importantes sobre o projeto.
      Os dados financeiros mostram um crescimento de 15% no último trimestre.`;
    
    // 2. Simulate numerical data extraction
    const extractedNumbers = [
      { type: "percentage", value: 15, context: "crescimento trimestral" },
      { type: "currency", value: 250000, context: "investimento total", unit: "EUR" },
      { type: "count", value: 42, context: "projetos completados" }
    ];
    
    // 3. Simulate image extraction (metadata only, not actual images)
    const extractedImages = [
      { 
        caption: "Gráfico de crescimento trimestral", 
        page: 1, 
        dimensions: { width: 500, height: 300 },
        position: { x: 100, y: 200 }
      },
      { 
        caption: "Organograma da empresa", 
        page: 2, 
        dimensions: { width: 600, height: 400 },
        position: { x: 50, y: 150 }
      }
    ];

    // Create or update record in pdf_extractions table
    let extractionRecord;
    
    try {
      if (extractionId) {
        // Update existing record
        const { data, error } = await supabase
          .from('pdf_extractions')
          .update({
            extracted_text: extractedText,
            extracted_numbers: extractedNumbers,
            extracted_images: extractedImages,
            extraction_status: 'completed',
            metadata: { 
              extraction_date: new Date().toISOString(),
              file_size: "1.2 MB", // Simulated
              page_count: 5 // Simulated
            }
          })
          .eq('id', extractionId)
          .select()
          .single();
          
        if (error) throw error;
        extractionRecord = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('pdf_extractions')
          .insert({
            file_name: fileName,
            file_url: fileUrl,
            extracted_text: extractedText,
            extracted_numbers: extractedNumbers,
            extracted_images: extractedImages,
            extraction_status: 'completed',
            metadata: { 
              extraction_date: new Date().toISOString(),
              file_size: "1.2 MB", // Simulated
              page_count: 5 // Simulated
            }
          })
          .select()
          .single();
          
        if (error) throw error;
        extractionRecord = data;
      }
    } catch (dbError) {
      console.error("Database error when creating/updating extraction record:", dbError);
      return new Response(
        JSON.stringify({ 
          error: "Database error", 
          details: dbError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    try {
      // Create elements for tables and charts
      await supabase
        .from('pdf_extracted_elements')
        .insert({
          pdf_extraction_id: extractionRecord.id,
          element_type: 'table',
          element_data: {
            headers: ["Trimestre", "Receita (EUR)", "Crescimento (%)"],
            rows: [
              ["Q1 2024", "150000", "10"],
              ["Q2 2024", "180000", "12"],
              ["Q3 2024", "210000", "15"],
              ["Q4 2024", "250000", "20"]
            ]
          },
          element_text: "Tabela de desempenho financeiro trimestral",
          position_in_document: { page: 3, x: 100, y: 300 }
        });
        
      await supabase
        .from('pdf_extracted_elements')
        .insert({
          pdf_extraction_id: extractionRecord.id,
          element_type: 'chart',
          element_data: {
            chart_type: "bar",
            x_axis: "Trimestre",
            y_axis: "Crescimento (%)",
            data_points: [
              { x: "Q1", y: 10 },
              { x: "Q2", y: 12 },
              { x: "Q3", y: 15 },
              { x: "Q4", y: 20 }
            ]
          },
          element_text: "Gráfico de crescimento trimestral",
          position_in_document: { page: 1, x: 100, y: 200 }
        });
    } catch (elementsError) {
      console.error("Error creating extracted elements:", elementsError);
      // Continue processing even if elements insertion fails
    }

    // Create a basic report with current date formatted for the title
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
    const reportTitle = `Relatório de Análise - ${fileName.replace(/\.[^/.]+$/, "")} (${formattedDate})`;
    
    let reportData;
    try {
      const { data, error } = await supabase
        .from('pdf_reports')
        .insert({
          pdf_extraction_id: extractionRecord.id,
          report_title: reportTitle,
          report_content: `# ${reportTitle}

## Sumário Executivo
O documento analisado contém informações sobre projetos e desempenho financeiro.

## Principais Descobertas
- Crescimento trimestral de 15%
- Investimento total de €250,000
- 42 projetos completados

## Tabelas Extraídas
Tabela de desempenho financeiro trimestral

## Gráficos Extraídos
Gráfico de crescimento trimestral
`,
          report_data: {
            summary: "O documento apresenta informações financeiras e de projetos",
            key_metrics: extractedNumbers,
            visuals: extractedImages.map(img => img.caption),
            extraction_date: new Date().toISOString(),
            file_name: fileName,
            file_url: fileUrl
          },
          report_status: 'completed'
        })
        .select()
        .single();
        
      if (error) throw error;
      reportData = data;
    } catch (reportError) {
      console.error("Error creating report:", reportError);
      return new Response(
        JSON.stringify({ 
          error: "Error creating report", 
          details: reportError.message,
          extraction: extractionRecord // Return extraction record even if report creation fails
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return successful response with extracted data
    return new Response(
      JSON.stringify({ 
        success: true, 
        extraction: extractionRecord,
        report: reportData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error processing PDF:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process PDF", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
