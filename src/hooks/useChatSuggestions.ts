
import { useState } from "react";
import { SuggestionLink } from "@/types/chatTypes";
import { genId } from "@/utils/aiUtils";

export const useChatSuggestions = (language: string) => {
  const getInitialSuggestions = (): SuggestionLink[] => {
    if (language === 'en') {
      return [
        { 
          id: genId(), 
          text: "Investment in R&D over the last 3 years",
          query: "What was the investment in R&D over the last 3 years?"
        },
        { 
          id: genId(), 
          text: "Regional investment distribution",
          query: "Show me the investment distribution by region over the last 3 years"
        },
        { 
          id: genId(), 
          text: "Number of patents filed last year",
          query: "How many patents were filed last year?"
        },
        { 
          id: genId(), 
          text: "Active funding programs",
          query: "What are the current active funding programs?"
        }
      ];
    } else {
      return [
        { 
          id: genId(), 
          text: "Investimento em P&D nos últimos 3 anos",
          query: "Qual foi o investimento em P&D nos últimos 3 anos?"
        },
        { 
          id: genId(), 
          text: "Distribuição de investimento por região",
          query: "Mostre-me a distribuição de investimento por região nos últimos 3 anos"
        },
        { 
          id: genId(), 
          text: "Número de patentes registradas no último ano",
          query: "Quantas patentes foram registradas no último ano?"
        },
        { 
          id: genId(), 
          text: "Programas de financiamento ativos",
          query: "Quais são os programas de financiamento ativos atualmente?"
        }
      ];
    }
  };

  const generateContextualSuggestions = (lastQuery: string): SuggestionLink[] => {
    const lowerQuery = lastQuery.toLowerCase();
    
    if (lowerQuery.includes('investment') || lowerQuery.includes('investimento') || 
        lowerQuery.includes('r&d') || lowerQuery.includes('p&d')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Compare with previous year",
            query: "How does this R&D investment compare with the previous year?"
          },
          { 
            id: genId(), 
            text: "Investment by sector",
            query: "What is the distribution of R&D investment by sector?"
          },
          { 
            id: genId(), 
            text: "Future projections",
            query: "What are the projections for R&D investment next year?"
          },
          { 
            id: genId(), 
            text: "Budget allocation",
            query: "How is the innovation budget allocated?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Comparar com ano anterior",
            query: "Como esse investimento em P&D se compara ao do ano anterior?"
          },
          { 
            id: genId(), 
            text: "Investimento por setor",
            query: "Qual é a distribuição do investimento em P&D por setor?"
          },
          { 
            id: genId(), 
            text: "Projeções futuras",
            query: "Quais são as projeções para o investimento em P&D no próximo ano?"
          },
          { 
            id: genId(), 
            text: "Alocação de orçamento",
            query: "Como o orçamento de inovação é alocado?"
          }
        ];
      }
    }
    
    if (lowerQuery.includes('patent') || lowerQuery.includes('patente')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Patents by technology area",
            query: "What is the distribution of patents by technology area?"
          },
          { 
            id: genId(), 
            text: "Patent growth rate",
            query: "What is the growth rate of patent applications over the last 5 years?"
          },
          { 
            id: genId(), 
            text: "International patents",
            query: "How many international patents were filed?"
          },
          { 
            id: genId(), 
            text: "Top patent holders",
            query: "Who are the top patent holders in the country?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Patentes por área tecnológica",
            query: "Qual é a distribuição de patentes por área tecnológica?"
          },
          { 
            id: genId(), 
            text: "Taxa de crescimento de patentes",
            query: "Qual é a taxa de crescimento dos pedidos de patentes nos últimos 5 anos?"
          },
          { 
            id: genId(), 
            text: "Patentes internacionais",
            query: "Quantas patentes internacionais foram registradas?"
          },
          { 
            id: genId(), 
            text: "Principais detentores de patentes",
            query: "Quem são os principais detentores de patentes no país?"
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
            text: "Funding success rates",
            query: "What are the success rates for funding applications?"
          },
          { 
            id: genId(), 
            text: "Application deadlines",
            query: "What are the upcoming funding application deadlines?"
          },
          { 
            id: genId(), 
            text: "Funding by sector",
            query: "How is funding distributed across different sectors?"
          },
          { 
            id: genId(), 
            text: "International funding",
            query: "What international funding programs are available?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Taxas de sucesso de financiamento",
            query: "Quais são as taxas de sucesso para pedidos de financiamento?"
          },
          { 
            id: genId(), 
            text: "Prazos de inscrição",
            query: "Quais são os próximos prazos de inscrição para financiamento?"
          },
          { 
            id: genId(), 
            text: "Financiamento por setor",
            query: "Como o financiamento é distribuído entre diferentes setores?"
          },
          { 
            id: genId(), 
            text: "Financiamento internacional",
            query: "Quais programas de financiamento internacional estão disponíveis?"
          }
        ];
      }
    }
    
    if (lowerQuery.includes('region') || lowerQuery.includes('região') || lowerQuery.includes('regional')) {
      if (language === 'en') {
        return [
          { 
            id: genId(), 
            text: "Top performing regions",
            query: "Which regions have the highest innovation performance?"
          },
          { 
            id: genId(), 
            text: "Regional growth rates",
            query: "What are the innovation growth rates by region?"
          },
          { 
            id: genId(), 
            text: "Regional specializations",
            query: "What are the technology specializations by region?"
          },
          { 
            id: genId(), 
            text: "Regional funding allocation",
            query: "How is funding allocated across different regions?"
          }
        ];
      } else {
        return [
          { 
            id: genId(), 
            text: "Regiões com melhor desempenho",
            query: "Quais regiões têm o maior desempenho em inovação?"
          },
          { 
            id: genId(), 
            text: "Taxas de crescimento regional",
            query: "Quais são as taxas de crescimento de inovação por região?"
          },
          { 
            id: genId(), 
            text: "Especializações regionais",
            query: "Quais são as especializações tecnológicas por região?"
          },
          { 
            id: genId(), 
            text: "Alocação de financiamento regional",
            query: "Como o financiamento é alocado entre diferentes regiões?"
          }
        ];
      }
    }
    
    return getInitialSuggestions();
  };

  const [suggestionLinks, setSuggestionLinks] = useState<SuggestionLink[]>(getInitialSuggestions());

  return {
    suggestionLinks,
    setSuggestionLinks,
    getInitialSuggestions,
    generateContextualSuggestions
  };
};
