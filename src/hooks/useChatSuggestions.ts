
import { useState } from "react";
import { SuggestionLink } from "@/types/chatTypes";
import { genId } from "@/utils/aiUtils";

export const useChatSuggestions = (language: string) => {
  const getInitialSuggestions = (): SuggestionLink[] => {
    if (language === 'en') {
      return [
        { 
          id: genId(), 
          text: "R&D investment in the last 3 years",
          query: "What was the R&D investment in Portugal over the last 3 years?"
        },
        { 
          id: genId(), 
          text: "Active funding programs",
          query: "Show me the active funding programs with deadlines"
        },
        { 
          id: genId(), 
          text: "Patent statistics by sector",
          query: "How many patents were registered by sector?"
        },
        { 
          id: genId(), 
          text: "Top research institutions",
          query: "Which are the top research institutions by project count?"
        }
      ];
    } else {
      return [
        { 
          id: genId(), 
          text: "Investimento em I&D nos últimos 3 anos",
          query: "Qual foi o investimento em I&D em Portugal nos últimos 3 anos?"
        },
        { 
          id: genId(), 
          text: "Programas de financiamento ativos",
          query: "Mostre os programas de financiamento ativos com prazos"
        },
        { 
          id: genId(), 
          text: "Estatísticas de patentes por setor",
          query: "Quantas patentes foram registradas por setor?"
        },
        { 
          id: genId(), 
          text: "Principais instituições de pesquisa",
          query: "Quais são as principais instituições de pesquisa por número de projetos?"
        }
      ];
    }
  };

  const generateContextualSuggestions = (lastQuery: string): SuggestionLink[] => {
    const lowerQuery = lastQuery.toLowerCase();
    
    if (lowerQuery.includes('investment') || lowerQuery.includes('investimento') || 
        lowerQuery.includes('r&d') || lowerQuery.includes('i&d')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Compare with previous year",
            query: "How does R&D investment compare with the previous year?"
          },
          { 
            id: genId(), 
            text: "Investment by sector",
            query: "What is the distribution of R&D investment by sector?"
          },
          { 
            id: genId(), 
            text: "Regional investment trends",
            query: "Show me R&D investment trends by region"
          },
          { 
            id: genId(), 
            text: "Project funding distribution",
            query: "How is funding distributed among active projects?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Comparar com ano anterior",
            query: "Como o investimento em I&D se compara ao do ano anterior?"
          },
          { 
            id: genId(), 
            text: "Investimento por setor",
            query: "Qual é a distribuição do investimento em I&D por setor?"
          },
          { 
            id: genId(), 
            text: "Tendências de investimento regional",
            query: "Mostre as tendências de investimento em I&D por região"
          },
          { 
            id: genId(), 
            text: "Distribuição de financiamento de projetos",
            query: "Como o financiamento está distribuído entre projetos ativos?"
          }
        ];
      }
    }
    
    if (lowerQuery.includes('patent') || lowerQuery.includes('patente')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Patents by institution",
            query: "Which institutions have the most patents?"
          },
          { 
            id: genId(), 
            text: "Patent growth rate",
            query: "What is the growth rate of patent registrations over the last 5 years?"
          },
          { 
            id: genId(), 
            text: "Patents by researcher",
            query: "Who are the researchers with the most patents?"
          },
          { 
            id: genId(), 
            text: "Innovation index by sector",
            query: "What is the innovation index by sector based on patent counts?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Patentes por instituição",
            query: "Quais instituições têm mais patentes?"
          },
          { 
            id: genId(), 
            text: "Taxa de crescimento de patentes",
            query: "Qual é a taxa de crescimento dos registros de patentes nos últimos 5 anos?"
          },
          { 
            id: genId(), 
            text: "Patentes por pesquisador",
            query: "Quais são os pesquisadores com mais patentes?"
          },
          { 
            id: genId(), 
            text: "Índice de inovação por setor",
            query: "Qual é o índice de inovação por setor com base na contagem de patentes?"
          }
        ];
      }
    }
    
    if (lowerQuery.includes('funding') || lowerQuery.includes('program') || 
        lowerQuery.includes('financiamento') || lowerQuery.includes('programa')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Funding application success rates",
            query: "What are the success rates for funding applications by sector?"
          },
          { 
            id: genId(), 
            text: "Upcoming application deadlines",
            query: "What are the upcoming funding application deadlines?"
          },
          { 
            id: genId(), 
            text: "Funding by sector focus",
            query: "How is funding distributed across different sector focuses?"
          },
          { 
            id: genId(), 
            text: "Average review time",
            query: "What is the average review time for funding applications?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Taxas de sucesso de candidaturas",
            query: "Quais são as taxas de sucesso para candidaturas de financiamento por setor?"
          },
          { 
            id: genId(), 
            text: "Próximos prazos de candidatura",
            query: "Quais são os próximos prazos de candidatura para financiamento?"
          },
          { 
            id: genId(), 
            text: "Financiamento por foco setorial",
            query: "Como o financiamento é distribuído entre diferentes focos setoriais?"
          },
          { 
            id: genId(), 
            text: "Tempo médio de análise",
            query: "Qual é o tempo médio de análise para candidaturas de financiamento?"
          }
        ];
      }
    }
    
    if (lowerQuery.includes('institution') || lowerQuery.includes('instituição') || 
        lowerQuery.includes('research') || lowerQuery.includes('pesquisa')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Top institutions by projects",
            query: "Which institutions have the most research projects?"
          },
          { 
            id: genId(), 
            text: "Institutions by region",
            query: "How are research institutions distributed by region?"
          },
          { 
            id: genId(), 
            text: "Institution specializations",
            query: "What are the main specialization areas of research institutions?"
          },
          { 
            id: genId(), 
            text: "Institution collaboration network",
            query: "Which institutions have the highest collaboration counts?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Principais instituições por projetos",
            query: "Quais instituições têm mais projetos de pesquisa?"
          },
          { 
            id: genId(), 
            text: "Instituições por região",
            query: "Como as instituições de pesquisa estão distribuídas por região?"
          },
          { 
            id: genId(), 
            text: "Especializações das instituições",
            query: "Quais são as principais áreas de especialização das instituições de pesquisa?"
          },
          { 
            id: genId(), 
            text: "Rede de colaboração entre instituições",
            query: "Quais instituições têm o maior número de colaborações?"
          }
        ];
      }
    }
    
    if (lowerQuery.includes('project') || lowerQuery.includes('projeto')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Active projects by sector",
            query: "How many active projects are there by sector?"
          },
          { 
            id: genId(), 
            text: "Projects by status",
            query: "What is the distribution of projects by status?"
          },
          { 
            id: genId(), 
            text: "Projects completion rate",
            query: "What is the completion rate of projects over the past year?"
          },
          { 
            id: genId(), 
            text: "Researchers per project",
            query: "What is the average number of researchers per project?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Projetos ativos por setor",
            query: "Quantos projetos ativos existem por setor?"
          },
          { 
            id: genId(), 
            text: "Projetos por status",
            query: "Qual é a distribuição de projetos por status?"
          },
          { 
            id: genId(), 
            text: "Taxa de conclusão de projetos",
            query: "Qual é a taxa de conclusão de projetos no último ano?"
          },
          { 
            id: genId(), 
            text: "Pesquisadores por projeto",
            query: "Qual é o número médio de pesquisadores por projeto?"
          }
        ];
      }
    }
    
    return getInitialSuggestions();
  };

  const generateRandomSuggestions = (lastQuery: string): SuggestionLink[] => {
    if (lastQuery && lastQuery.trim() !== '') {
      const contextualSuggestions = generateContextualSuggestions(lastQuery);
      
      const allSuggestions = getAllPossibleSuggestions(language);
      const currentSuggestionTexts = contextualSuggestions.map(s => s.text);
      const differentSuggestions = allSuggestions.filter(s => !currentSuggestionTexts.includes(s.text));
      
      if (differentSuggestions.length > 0) {
        const shuffled = differentSuggestions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
      }
    }
    
    return getRandomSelection(getAllPossibleSuggestions(language), 4);
  };

  const getAllPossibleSuggestions = (lang: string): SuggestionLink[] => {
    if (lang === 'en') {
      return [
        // Investment and R&D queries
        { 
          id: genId(), 
          text: "R&D investment in the last 3 years",
          query: "What was the R&D investment in Portugal over the last 3 years?"
        },
        { 
          id: genId(), 
          text: "Regional investment distribution",
          query: "Show me the investment distribution by region over the last 3 years"
        },
        { 
          id: genId(), 
          text: "Compare with previous year",
          query: "How does R&D investment compare with the previous year?"
        },
        { 
          id: genId(), 
          text: "Investment by sector",
          query: "What is the distribution of R&D investment by sector?"
        },
        { 
          id: genId(), 
          text: "Regional investment trends",
          query: "Show me R&D investment trends by region"
        },
        
        // Patent queries
        { 
          id: genId(), 
          text: "Patent statistics by sector",
          query: "How many patents were registered by sector?"
        },
        { 
          id: genId(), 
          text: "Patents by institution",
          query: "Which institutions have the most patents?"
        },
        { 
          id: genId(), 
          text: "Patent growth rate",
          query: "What is the growth rate of patent registrations over the last 5 years?"
        },
        { 
          id: genId(), 
          text: "Patents by researcher",
          query: "Who are the researchers with the most patents?"
        },
        { 
          id: genId(), 
          text: "Innovation index by sector",
          query: "What is the innovation index by sector based on patent counts?"
        },
        
        // Funding and program queries
        { 
          id: genId(), 
          text: "Active funding programs",
          query: "Show me the active funding programs with deadlines"
        },
        { 
          id: genId(), 
          text: "Funding application success rates",
          query: "What are the success rates for funding applications by sector?"
        },
        { 
          id: genId(), 
          text: "Upcoming application deadlines",
          query: "What are the upcoming funding application deadlines?"
        },
        { 
          id: genId(), 
          text: "Funding by sector focus",
          query: "How is funding distributed across different sector focuses?"
        },
        { 
          id: genId(), 
          text: "Average review time",
          query: "What is the average review time for funding applications?"
        },
        
        // Institution and research queries
        { 
          id: genId(), 
          text: "Top research institutions",
          query: "Which are the top research institutions by project count?"
        },
        { 
          id: genId(), 
          text: "Institutions by region",
          query: "How are research institutions distributed by region?"
        },
        { 
          id: genId(), 
          text: "Institution specializations",
          query: "What are the main specialization areas of research institutions?"
        },
        { 
          id: genId(), 
          text: "Institution collaboration network",
          query: "Which institutions have the highest collaboration counts?"
        },
        
        // Project queries
        { 
          id: genId(), 
          text: "Active projects by sector",
          query: "How many active projects are there by sector?"
        },
        { 
          id: genId(), 
          text: "Projects by status",
          query: "What is the distribution of projects by status?"
        },
        { 
          id: genId(), 
          text: "Projects completion rate",
          query: "What is the completion rate of projects over the past year?"
        },
        { 
          id: genId(), 
          text: "Researchers per project",
          query: "What is the average number of researchers per project?"
        },
        { 
          id: genId(), 
          text: "International collaborations",
          query: "What are the major international collaboration programs?"
        }
      ];
    } else {
      return [
        // Investment and R&D queries in Portuguese
        { 
          id: genId(), 
          text: "Investimento em I&D nos últimos 3 anos",
          query: "Qual foi o investimento em I&D em Portugal nos últimos 3 anos?"
        },
        { 
          id: genId(), 
          text: "Distribuição de investimento por região",
          query: "Mostre-me a distribuição de investimento por região nos últimos 3 anos"
        },
        { 
          id: genId(), 
          text: "Comparar com ano anterior",
          query: "Como o investimento em I&D se compara ao do ano anterior?"
        },
        { 
          id: genId(), 
          text: "Investimento por setor",
          query: "Qual é a distribuição do investimento em I&D por setor?"
        },
        { 
          id: genId(), 
          text: "Tendências de investimento regional",
          query: "Mostre as tendências de investimento em I&D por região"
        },
        
        // Patent queries in Portuguese
        { 
          id: genId(), 
          text: "Estatísticas de patentes por setor",
          query: "Quantas patentes foram registradas por setor?"
        },
        { 
          id: genId(), 
          text: "Patentes por instituição",
          query: "Quais instituições têm mais patentes?"
        },
        { 
          id: genId(), 
          text: "Taxa de crescimento de patentes",
          query: "Qual é a taxa de crescimento dos registros de patentes nos últimos 5 anos?"
        },
        { 
          id: genId(), 
          text: "Patentes por pesquisador",
          query: "Quais são os pesquisadores com mais patentes?"
        },
        { 
          id: genId(), 
          text: "Índice de inovação por setor",
          query: "Qual é o índice de inovação por setor com base na contagem de patentes?"
        },
        
        // Funding and program queries in Portuguese
        { 
          id: genId(), 
          text: "Programas de financiamento ativos",
          query: "Mostre os programas de financiamento ativos com prazos"
        },
        { 
          id: genId(), 
          text: "Taxas de sucesso de candidaturas",
          query: "Quais são as taxas de sucesso para candidaturas de financiamento por setor?"
        },
        { 
          id: genId(), 
          text: "Próximos prazos de candidatura",
          query: "Quais são os próximos prazos de candidatura para financiamento?"
        },
        { 
          id: genId(), 
          text: "Financiamento por foco setorial",
          query: "Como o financiamento é distribuído entre diferentes focos setoriais?"
        },
        { 
          id: genId(), 
          text: "Tempo médio de análise",
          query: "Qual é o tempo médio de análise para candidaturas de financiamento?"
        },
        
        // Institution and research queries in Portuguese
        { 
          id: genId(), 
          text: "Principais instituições de pesquisa",
          query: "Quais são as principais instituições de pesquisa por número de projetos?"
        },
        { 
          id: genId(), 
          text: "Instituições por região",
          query: "Como as instituições de pesquisa estão distribuídas por região?"
        },
        { 
          id: genId(), 
          text: "Especializações das instituições",
          query: "Quais são as principais áreas de especialização das instituições de pesquisa?"
        },
        { 
          id: genId(), 
          text: "Rede de colaboração entre instituições",
          query: "Quais instituições têm o maior número de colaborações?"
        },
        
        // Project queries in Portuguese
        { 
          id: genId(), 
          text: "Projetos ativos por setor",
          query: "Quantos projetos ativos existem por setor?"
        },
        { 
          id: genId(), 
          text: "Projetos por status",
          query: "Qual é a distribuição de projetos por status?"
        },
        { 
          id: genId(), 
          text: "Taxa de conclusão de projetos",
          query: "Qual é a taxa de conclusão de projetos no último ano?"
        },
        { 
          id: genId(), 
          text: "Pesquisadores por projeto",
          query: "Qual é o número médio de pesquisadores por projeto?"
        },
        { 
          id: genId(), 
          text: "Colaborações internacionais",
          query: "Quais são os principais programas de colaboração internacional?"
        }
      ];
    }
  };

  const getRandomSelection = (suggestions: SuggestionLink[], count: number): SuggestionLink[] => {
    const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const [suggestionLinks, setSuggestionLinks] = useState<SuggestionLink[]>(getInitialSuggestions());

  return {
    suggestionLinks,
    setSuggestionLinks,
    getInitialSuggestions,
    generateContextualSuggestions,
    generateRandomSuggestions
  };
};
