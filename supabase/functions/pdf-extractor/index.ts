
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.7";

// Configurações CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para extrair informações do PDF
serve(async (req) => {
  // Gerenciar requisições preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter a URL do PDF e outros parâmetros da requisição
    const { fileUrl, fileName, extractionId } = await req.json();
    
    // Validar parâmetros
    if (!fileUrl || !fileName) {
      return new Response(
        JSON.stringify({ error: "URL do arquivo ou nome não fornecidos" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Iniciando extração do PDF: ${fileName}`);
    
    // Inicializar o cliente Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Simular extração de dados (em um ambiente real, você usaria uma biblioteca de PDF)
    // Neste exemplo simulado, estamos criando dados fictícios para demonstrar a estrutura
    
    // 1. Simular extração de texto
    const extractedText = `Conteúdo extraído do documento ${fileName}. 
      Este texto contém informações importantes sobre o projeto.
      Os dados financeiros mostram um crescimento de 15% no último trimestre.`;
    
    // 2. Simular extração de dados numéricos
    const extractedNumbers = [
      { type: "percentage", value: 15, context: "crescimento trimestral" },
      { type: "currency", value: 250000, context: "investimento total", unit: "EUR" },
      { type: "count", value: 42, context: "projetos completados" }
    ];
    
    // 3. Simular extração de imagens (apenas metadados, não as imagens reais)
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

    // Criar ou atualizar registro na tabela pdf_extractions
    let extractionRecord;
    
    if (extractionId) {
      // Atualizar registro existente
      const { data, error } = await supabase
        .from('pdf_extractions')
        .update({
          extracted_text: extractedText,
          extracted_numbers: extractedNumbers,
          extracted_images: extractedImages,
          extraction_status: 'completed',
          metadata: { 
            extraction_date: new Date().toISOString(),
            file_size: "1.2 MB", // Simulado
            page_count: 5 // Simulado
          }
        })
        .eq('id', extractionId)
        .select()
        .single();
        
      if (error) throw error;
      extractionRecord = data;
    } else {
      // Criar novo registro
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
            file_size: "1.2 MB", // Simulado
            page_count: 5 // Simulado
          }
        })
        .select()
        .single();
        
      if (error) throw error;
      extractionRecord = data;
    }

    // Criar elementos extraídos
    
    // 1. Criar entrada para tabela fictícia
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
      
    // 2. Criar entrada para gráfico fictício
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

    // Criar um relatório básico
    const { data: reportData, error: reportError } = await supabase
      .from('pdf_reports')
      .insert({
        pdf_extraction_id: extractionRecord.id,
        report_title: `Relatório de ${fileName}`,
        report_content: `# Relatório Automático de ${fileName}

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
          visuals: extractedImages.map(img => img.caption)
        },
        report_status: 'completed'
      })
      .select()
      .single();
      
    if (reportError) throw reportError;

    // Retornar resposta de sucesso com os dados extraídos
    return new Response(
      JSON.stringify({ 
        success: true, 
        extraction: extractionRecord,
        report: reportData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Erro ao processar PDF:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Falha ao processar o PDF", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
