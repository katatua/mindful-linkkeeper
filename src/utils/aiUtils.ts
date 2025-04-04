
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

export interface QueryResponseType {
  message: string;
  sqlQuery?: string;
  results?: any[] | null;
  error?: boolean;
  noResults?: boolean;
  queryId?: string;
  analysis?: any;
  isAIResponse?: boolean;
  baiResponse?: string;
  baiError?: string;
  supportingDocuments?: Array<{title: string, url: string, relevance?: number}>;
  baiChatId?: string;
  baiFiles?: Array<{filename: string | null, download_url: string}>;
  intentAlias?: string;
}

export const genId = () => uuidv4();

export const suggestedDatabaseQueries = [
  "Quais são as fontes de dados mais recentes?",
  "Quantas instituições trabalham com tecnologia",
  "Mostre as cooperações internacionais ativas",
  "Qual é o volume total de financiamento de projetos em Lisboa?",
  
  "Quais universidades têm mais patentes registradas em Portugal?",
  "Qual é o índice médio de inovação dos detentores de patentes no setor de tecnologia?",
  "Compare o número de patentes entre instituições educacionais e empresas privadas",
  
  "Quais são as startups mais bem financiadas em Portugal?",
  "Qual região de Portugal tem mais startups no setor de tecnologia?",
  "Qual é o financiamento médio das startups portuguesas fundadas após 2015?",
  "Quantas startups em Lisboa têm mais de 100 funcionários?",
  
  "Qual tecnologia tem a maior taxa de adoção no setor financeiro?",
  "Quais são os principais desafios na adoção de Inteligência Artificial?",
  "Compare as taxas de adoção de tecnologias emergentes entre diferentes setores",
  
  "Quais são as maiores redes de inovação em Portugal por número de membros?",
  "Quais redes de inovação focam em sustentabilidade ou energia renovável?",
  "Que realizações foram alcançadas pela Rede Nacional de Inovação em Saúde?",
  
  "Quais políticas de inovação foram implementadas nos últimos 5 anos?",
  "Quais setores são mais beneficiados pelas políticas de inovação atuais?",
  "Quais são os incentivos fiscais disponíveis para atividades de I&D em Portugal?",
  
  "Quais são as publicações acadêmicas mais citadas de pesquisadores portugueses?",
  "Em quais áreas de pesquisa Portugal tem mais publicações de acesso aberto?",
  "Qual instituição portuguesa tem o maior fator de impacto médio em suas publicações?",
  
  "Qual é o número total de patentes registradas no setor de tecnologia em 2022?",
  "Quantas startups foram fundadas em Lisboa nos últimos 3 anos?",
  "Qual é o valor médio de financiamento por projeto na área de saúde?",
  "Quantos pesquisadores têm um h-index superior a 15 nas instituições portuguesas?",
  "Qual é o orçamento total alocado para políticas de inovação em 2023?",
  "Quantas publicações de acesso aberto foram produzidas por universidades portuguesas em 2022?",
  "Qual é a taxa média de sucesso das candidaturas a financiamento no setor de energia renovável?",
  "Quantas redes de inovação têm mais de 50 membros ativos?",
  "Qual foi o crescimento percentual no número de startups de tecnologia entre 2020 e 2023?",
  "Quantos projetos de colaboração internacional foram iniciados em 2022?",
  "Qual é o valor total de investimento em I&D como percentagem do PIB em Portugal?",
  "Quantas instituições têm mais de 10 colaborações internacionais ativas?",
  "Qual é a média de citações por publicação em pesquisas de inteligência artificial?",
  "Quantos programas de financiamento têm um orçamento superior a 5 milhões de euros?",
  "Qual é a densidade de startups por 100.000 habitantes nas diferentes regiões de Portugal?",
  "Quantas patentes na área de tecnologia verde foram registradas nos últimos 5 anos?",
  "Qual é o tempo médio de processamento (em dias) para aprovação de candidaturas a financiamento?",
  "Qual é a quantidade de políticas de inovação especificamente direcionadas ao setor de saúde?",
  "Qual é o montante médio de financiamento aprovado vs solicitado nas candidaturas bem-sucedidas?",
  "Quantas startups conseguiram investimento superior a 1 milhão de euros em sua fase inicial?"
];

export const formatDatabaseValue = (value: any, columnName: string): string => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  if (columnName.includes('date') || columnName.includes('_at')) {
    if (typeof value === 'string' && value.includes('T')) {
      try {
        const date = new Date(value);
        return date.toLocaleDateString('pt-PT', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return value;
      }
    }
  }
  
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  if (typeof value === 'number') {
    if (columnName.includes('amount') || columnName.includes('budget') || 
        columnName.includes('value') || columnName.includes('funding')) {
      return new Intl.NumberFormat('pt-PT', { 
        style: 'currency', 
        currency: 'EUR',
        maximumFractionDigits: 0
      }).format(value);
    } else if (columnName.includes('rate') || columnName.includes('percentage') ||
               columnName.includes('ratio') || columnName.includes('index')) {
      return Number(value).toLocaleString('pt-PT', { 
        maximumFractionDigits: 2 
      });
    }
    
    return Number(value).toLocaleString('pt-PT');
  }
  
  return String(value);
};

const callBaiApi = async (query: string, previousChatId?: string): Promise<{ response: string | undefined; error: string | undefined; chatId: string | undefined; files: Array<{filename: string | null, download_url: string}> | undefined }> => {
  try {
    console.log("Calling BAI API with query:", query);
    
    const requestBody = {
      "request": query,
      "assistant_key": "1R5ZBwLgGOMlVSj4p6Ar0H8DX9NKhcfseU2v3CtYJ7PqaIbWkzEoyuximTQdnFSfNaIsoJczCYkjLM3He9pU42EvxVg57Aw60uBd",
      "id_chat": previousChatId || "", // Use previous chat ID if provided, otherwise empty string
      "report": "No"
    };
    
    console.log("Sending request to BAI API:", JSON.stringify(requestBody));
    
    const response = await fetch("https://bai.chat4b.ai/api/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ki3ZfrxYn6G2JocE4A95sNRvwSd17hulamLPXDFbTWqeHjVBUgIy8CMzpK0OQtAuRHk5weX4fclx0KUt8rCgJO3EF1vsNGzPQWYb"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("BAI API error response:", errorText, "Status:", response.status);
      return { 
        response: undefined, 
        error: `API call failed with status: ${response.status}, ${errorText}`,
        chatId: undefined,
        files: undefined
      };
    }
    
    const responseData = await response.json();
    
    // Log the full response for debugging
    console.log("Full BAI API response:", JSON.stringify(responseData, null, 2));
    
    // Extract response, chat ID and files
    const textResponse = responseData.message || responseData.response;
    const chatId = responseData.id_chat;
    const files = responseData.files || [];
    
    // Process files to ensure download_url is not empty
    const processedFiles = files.map(file => {
      // Make sure download_url is never undefined, set to empty string if not provided
      return {
        filename: file.filename || null,
        download_url: file.download_url || ""
      };
    });
    
    if (!textResponse) {
      return { 
        response: undefined, 
        error: "Resposta vazia ou sem conteúdo", 
        chatId,
        files: processedFiles
      };
    }
    
    return { 
      response: textResponse, 
      error: undefined,
      chatId,
      files: processedFiles
    };
  } catch (error) {
    console.error("Erro ao chamar a API BAI:", error);
    return { 
      response: undefined,
      error: `Erro de rede ou de API: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      chatId: undefined,
      files: undefined
    };
  }
};

export const generateResponse = async (query: string, previousChatId?: string): Promise<QueryResponseType> => {
  try {
    console.log("Gerando resposta para consulta:", query);
    
    // Primeira tentativa: usar a função de borda do Supabase para gerar resposta
    const { data: dbData, error: dbError } = await supabase.functions.invoke('gemini-chat', {
      body: { query }
    });
    
    // Chamada em paralelo para a API BAI
    let baiResponse = null;
    let baiError = null;
    let baiResult = await callBaiApi(query, previousChatId);
    
    if (baiResult.error) {
      console.error("Erro na API BAI:", baiResult.error);
      baiError = baiResult.error;
      
      // Se houver uma resposta mesmo com erro, use-a
      if (baiResult.response) {
        baiResponse = baiResult.response;
      }
    } else if (baiResult.response) {
      baiResponse = baiResult.response;
      console.log("Resposta BAI recebida:", baiResponse);
    } else {
      baiError = "Resposta vazia do assistente BAI";
    }
    
    // Preparar documentos de suporte se houver resposta BAI
    let supportingDocs = undefined;
    if (baiResult.response) {
      supportingDocs = [
        {
          title: "Documento de Referência ANI",
          url: "https://ani.pt/documentos-referencia",
          relevance: 0.95
        }
      ];
    }
    
    // Ensure that files is always an array, even if undefined
    const files = baiResult.files || [];
    
    // Retornar a resposta com todas as informações
    return {
      message: dbData?.message || baiResponse || "Sem resposta do assistente.",
      sqlQuery: dbData?.sqlQuery || "",
      results: dbData?.results || null,
      error: dbData?.error || false,
      noResults: dbData?.noResults || false,
      queryId: dbData?.queryId,
      analysis: dbData?.analysis,
      isAIResponse: dbData?.isAIResponse || false,
      baiResponse: baiResponse,
      baiError: baiError,
      supportingDocuments: supportingDocs,
      baiChatId: baiResult.chatId,
      baiFiles: files
    };
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);
    return {
      message: `Erro ao processar sua consulta: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      sqlQuery: "",
      results: null,
      error: true
    };
  }
};

export const classifyDocument = async (document: { title: string, summary: string, fileName: string }): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('classify-document', {
      body: { 
        title: document.title,
        summary: document.summary,
        fileName: document.fileName
      }
    });
    
    if (error) {
      console.error("Error calling classify-document function:", error);
      return "unclassified";
    }
    
    return data?.classification || "unclassified";
  } catch (error) {
    console.error("Error in classifyDocument:", error);
    return "unclassified";
  }
};
