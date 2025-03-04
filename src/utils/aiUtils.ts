
import { createClient } from '@supabase/supabase-js';

// Types for AI operations
export interface ClassificationResponse {
  classification: string;
}

export interface ClassificationRequest {
  title: string;
  summary?: string;
  fileName?: string;
}

export interface AIResponse {
  response: string;
  timestamp: Date;
}

// Function to classify documents via Supabase Edge Function
export const classifyDocument = async (data: ClassificationRequest): Promise<string> => {
  try {
    // Create a Supabase client - using public URLs and keys which is fine for edge functions
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration is missing');
      return 'unknown';
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Call the edge function
    const { data: responseData, error } = await supabase.functions.invoke<ClassificationResponse>(
      'classify-document',
      {
        body: data,
      }
    );
    
    if (error) {
      console.error('Error classifying document:', error);
      return 'unknown';
    }
    
    return responseData?.classification || 'unknown';
  } catch (error) {
    console.error('Unexpected error in document classification:', error);
    return 'unknown';
  }
};

// Search uploaded documents and generate an AI response
export const generateResponse = async (userInput: string): Promise<string> => {
  try {
    // Using the hardcoded values from the client.ts file as a fallback
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ncnewevucbkebrqjtufl.supabase.co';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jbmV3ZXZ1Y2JrZWJycWp0dWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NTQ4NTgsImV4cCI6MjA1NTMzMDg1OH0.k1COvdcLYSB9C-X671zop6SdV7yaTPp49A4nJXWvmmc';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration is missing');
      return getFallbackResponse(userInput);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Normalize search query to improve matching
    const normalizedInput = userInput.toLowerCase().trim();
    
    // Search for relevant documents in the database with improved search
    const { data: searchResults, error } = await supabase
      .rpc('search_links_improved', { 
        search_query: normalizedInput,
        similarity_threshold: 0.1  // Lower threshold to catch more potential matches
      });
    
    if (error) {
      console.error('Search error:', error);
      return getFallbackResponse(userInput);
    }
    
    if (!searchResults || searchResults.length === 0) {
      console.log('No search results found for:', normalizedInput);
      
      // Try a more direct query approach as fallback
      const { data: directResults, error: directError } = await supabase
        .from('links')
        .select('title, url, summary, category, classification, file_metadata, source')
        .limit(5);
      
      if (directError || !directResults || directResults.length === 0) {
        console.log('No direct results found either');
        return getFallbackResponse(userInput);
      }
      
      console.log('Found some general results instead');
      return composeResponseFromDocuments(normalizedInput, directResults, false);
    }
    
    console.log(`Found ${searchResults.length} search results for: "${normalizedInput}"`);
    
    // Get the top 3 most relevant documents
    const topLinks = searchResults.slice(0, 3);
    
    // Fetch the full information for these documents
    const { data: documents, error: docsError } = await supabase
      .from('links')
      .select('title, url, summary, category, classification, file_metadata, source')
      .in('id', topLinks.map(result => result.id));
    
    if (docsError || !documents || documents.length === 0) {
      console.log('Error fetching documents:', docsError);
      return getFallbackResponse(userInput);
    }
    
    // Generate a response based on the found documents
    return composeResponseFromDocuments(normalizedInput, documents, true);
  } catch (error) {
    console.error('Error generating AI response:', error);
    return getFallbackResponse(userInput);
  }
};

// Compose a response based on the found documents
const composeResponseFromDocuments = (query: string, documents: any[], isDirectMatch: boolean): string => {
  // Extract relevant information from documents
  const topics = documents.map(doc => doc.title || 'Untitled document').join(', ');
  const classifications = [...new Set(documents.map(doc => doc.classification).filter(Boolean))];
  const categories = [...new Set(documents.map(doc => doc.category).filter(Boolean))];
  
  // Log documents for debugging
  console.log('Documents found:', documents);
  
  let response = '';
  
  if (isDirectMatch) {
    response = `Com base nos dados da ANI, encontrei ${documents.length} recursos relevantes relacionados com "${query}": ${topics}.`;
  } else {
    response = `Não encontrei documentos que correspondam exatamente à sua consulta, mas posso partilhar informações gerais da base de dados ANI.`;
  }
  
  // Add classification if available
  if (classifications.length > 0) {
    response += ` Estes relacionam-se com as áreas de inovação ${classifications.join(' e ')}.`;
  }
  
  // Add categories if available
  if (categories.length > 0) {
    response += ` Pertencem às categorias ${categories.join(' e ')}.`;
  }
  
  // Add specific information from the documents
  for (const doc of documents) {
    if (doc.summary) {
      response += `\n\nInformação do documento "${doc.title || 'Documento sem título'}": ${doc.summary}`;
    } else if (doc.file_metadata && doc.file_metadata.name) {
      response += `\n\nO documento "${doc.file_metadata.name}" foi carregado e está disponível para consulta.`;
    }
    
    // Add source information for links
    if (doc.source === 'web' && doc.url) {
      response += `\nFonte: ${doc.url}`;
    }
  }
  
  // Add a reference to the found documents
  response += `\n\nPosso fornecer mais informações específicas sobre algum destes recursos? Ou prefere explorar outro tópico?`;
  
  return response;
};

// Fallback to predefined responses when no relevant documents are found
const getFallbackResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  // Simple keyword matching for demo purposes
  const responses: Record<string, string> = {
    "inovação": "O ecossistema de inovação de Portugal tem mostrado um crescimento significativo nos últimos 5 anos, com um aumento de 28% no investimento em I&D e 134 projetos de inovação atualmente monitorados pela ANI.",
    "financiamento": "A ANI gere vários programas de financiamento, incluindo oportunidades do Portugal 2030 e Horizonte Europa. O financiamento total disponível para o ciclo atual é de 24,7 milhões de euros, apoiando 56 startups.",
    "relatório": "Posso ajudar a gerar relatórios sobre métricas de inovação, alocação de fundos ou desempenho de projetos. Que tipo específico de relatório gostaria de criar?",
    "política": "As políticas de inovação atuais estão alinhadas com o quadro ENEI 2030, focando na transformação digital, sustentabilidade e transferência de conhecimento entre academia e indústria.",
    "ajuda": "Posso ajudar com métricas de inovação, informações sobre financiamento, insights sobre políticas, geração de relatórios e conectá-lo com stakeholders relevantes. Em que área específica precisa de ajuda?",
    "projetos": "Existem atualmente 134 projetos de inovação ativos em vários setores, com tecnologia e saúde liderando tanto em número quanto em alocação de financiamento.",
    "analítica": "Nossas ferramentas analíticas podem fornecer insights sobre alocação de fundos, desempenho de projetos, distribuição regional e tendências setoriais. Em que análises específicas está interessado?",
    "setores": "Os principais setores de inovação são: Tecnologias Digitais (32%), Saúde e Biotecnologia (24%), Energia Sustentável (18%), Manufatura Avançada (14%) e Agroalimentar (12%).",
    "ani": "A ANI (Agência Nacional de Inovação) é responsável por promover a colaboração entre entidades do sistema científico e tecnológico nacional e o tecido empresarial. Gerimos vários programas de financiamento e oferecemos suporte técnico para projetos inovadores em Portugal.",
    "informação": "A ANI mantém uma base de conhecimento abrangente sobre projetos de inovação, incluindo detalhes sobre financiamento, resultados, parcerias e impacto. Que tipo específico de informação está procurando?",
  };
  
  // Check for keyword matches
  for (const [keyword, response] of Object.entries(responses)) {
    if (input.includes(keyword)) {
      return response;
    }
  }
  
  // Default response if no keyword matches
  return "Compreendo que está perguntando sobre " + input + ". Embora eu ainda não tenha informações específicas sobre esse tópico na nossa base de dados, posso conectá-lo com um especialista da ANI que pode ajudar. Gostaria que eu fizesse isso?";
};
