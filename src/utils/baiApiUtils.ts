
import { ChartData } from '@/types/chartTypes';

export function isChartRequest(text: string): boolean {
  const chartKeywords = [
    "gráfico", "grafico", "chart", "diagrama", "visualização", "plot",
    "barra", "linha", "pie", "pizza", "donut", "área", "area",
    "histograma", "scatter", "dispersão", "radar", "polar"
  ];
  
  const lowercaseText = text.toLowerCase();
  return chartKeywords.some(keyword => lowercaseText.includes(keyword));
}

export function determineChartType(intentOrRequest: string): string {
  const lowercaseText = intentOrRequest.toLowerCase();
  
  if (lowercaseText.includes("barra") || lowercaseText.includes("bar")) return "bar";
  if (lowercaseText.includes("linha") || lowercaseText.includes("line")) return "line";
  if (lowercaseText.includes("pizza") || lowercaseText.includes("pie")) return "pie";
  if (lowercaseText.includes("área") || lowercaseText.includes("area")) return "area";
  if (lowercaseText.includes("donut")) return "doughnut";
  if (lowercaseText.includes("radar")) return "radar";
  if (lowercaseText.includes("polar")) return "polarArea";
  if (lowercaseText.includes("scatter") || lowercaseText.includes("dispersão")) return "scatter";
  
  // Default to bar chart if no specific type is detected
  return "bar";
}

// Function to generate real-looking data based on chart type and topics in the request
export function generateSampleChartData(chartType: string, request?: string): ChartData {
  const topic = determineDataTopic(request || '');
  
  switch (topic) {
    case 'investimento':
      return generateInvestmentData(chartType);
    case 'patentes':
      return generatePatentData(chartType);
    case 'startups':
      return generateStartupData(chartType);
    case 'setores':
      return generateSectorData(chartType);
    case 'regioes':
      return generateRegionalData(chartType);
    case 'publicacoes':
      return generatePublicationsData(chartType);
    default:
      return generateInnovationMetricsData(chartType);
  }
}

// Helper function to determine the data topic from user request
function determineDataTopic(request: string): string {
  const lowercaseRequest = request.toLowerCase();
  
  if (lowercaseRequest.includes('investimento') || lowercaseRequest.includes('i&d') || 
      lowercaseRequest.includes('r&d') || lowercaseRequest.includes('financiamento')) {
    return 'investimento';
  }
  
  if (lowercaseRequest.includes('patente') || lowercaseRequest.includes('propriedade intelectual')) {
    return 'patentes';
  }
  
  if (lowercaseRequest.includes('startup') || lowercaseRequest.includes('empreendedor')) {
    return 'startups';
  }
  
  if (lowercaseRequest.includes('setor') || lowercaseRequest.includes('sector') || 
      lowercaseRequest.includes('indústria') || lowercaseRequest.includes('area')) {
    return 'setores';
  }
  
  if (lowercaseRequest.includes('região') || lowercaseRequest.includes('regional') || 
      lowercaseRequest.includes('portugal') || lowercaseRequest.includes('lisboa') || 
      lowercaseRequest.includes('porto')) {
    return 'regioes';
  }
  
  if (lowercaseRequest.includes('publicação') || lowercaseRequest.includes('artigo') || 
      lowercaseRequest.includes('jornal') || lowercaseRequest.includes('paper')) {
    return 'publicacoes';
  }
  
  return 'geral';
}

// Investment in R&D data
function generateInvestmentData(chartType: string): ChartData {
  // Realistic data for R&D investment in Portugal (in millions EUR)
  const years = ['2018', '2019', '2020', '2021', '2022', '2023'];
  
  if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') {
    return {
      type: chartType,
      data: {
        labels: ['Empresas', 'Ensino Superior', 'Estado', 'Instituições Privadas'],
        datasets: [{
          data: [1420, 980, 215, 85],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderWidth: 1
        }]
      }
    };
  }
  
  return {
    type: chartType,
    data: {
      labels: years,
      datasets: [
        {
          label: 'Investimento em I&D (Milhões €)',
          data: [2340, 2580, 2750, 3125, 3450, 3680],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: '% do PIB',
          data: [1.35, 1.40, 1.58, 1.68, 1.78, 1.85],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    }
  };
}

// Patent data
function generatePatentData(chartType: string): ChartData {
  const years = ['2018', '2019', '2020', '2021', '2022', '2023'];
  
  if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') {
    return {
      type: chartType,
      data: {
        labels: ['Tecnologia', 'Saúde', 'Engenharia', 'Química', 'Outros'],
        datasets: [{
          data: [340, 280, 190, 150, 95],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderWidth: 1
        }]
      }
    };
  }
  
  return {
    type: chartType,
    data: {
      labels: years,
      datasets: [
        {
          label: 'Patentes Registradas',
          data: [620, 685, 715, 750, 810, 842],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }
      ]
    }
  };
}

// Startup data
function generateStartupData(chartType: string): ChartData {
  const years = ['2018', '2019', '2020', '2021', '2022', '2023'];
  
  if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') {
    return {
      type: chartType,
      data: {
        labels: ['TI e Software', 'Saúde e Biotecnologia', 'Energia Verde', 'Finanças', 'Outros'],
        datasets: [{
          data: [425, 215, 180, 135, 145],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderWidth: 1
        }]
      }
    };
  }
  
  return {
    type: chartType,
    data: {
      labels: years,
      datasets: [
        {
          label: 'Novas Startups',
          data: [215, 245, 180, 310, 365, 420],
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgb(255, 159, 64)',
          borderWidth: 1
        },
        {
          label: 'Investimento Anjo (M€)',
          data: [85, 110, 95, 145, 190, 230],
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgb(153, 102, 255)',
          borderWidth: 1
        }
      ]
    }
  };
}

// Innovation sector data
function generateSectorData(chartType: string): ChartData {
  if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') {
    return {
      type: chartType,
      data: {
        labels: ['Tecnologia', 'Saúde', 'Energia', 'Indústria', 'Agricultura', 'Turismo', 'Outros'],
        datasets: [{
          data: [35, 20, 15, 12, 8, 6, 4],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(201, 203, 207, 0.7)'
          ],
          borderWidth: 1
        }]
      }
    };
  }
  
  return {
    type: chartType,
    data: {
      labels: ['Tecnologia', 'Saúde', 'Energia', 'Indústria', 'Agricultura', 'Turismo'],
      datasets: [
        {
          label: 'Índice de Inovação Setorial',
          data: [78.5, 72.3, 68.9, 64.2, 58.7, 51.4],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Investimento (M€)',
          data: [850, 720, 540, 480, 320, 210],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    }
  };
}

// Regional innovation data
function generateRegionalData(chartType: string): ChartData {
  if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') {
    return {
      type: chartType,
      data: {
        labels: ['Lisboa', 'Porto', 'Centro', 'Norte', 'Alentejo', 'Algarve', 'Ilhas'],
        datasets: [{
          data: [42, 28, 12, 8, 5, 3, 2],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(201, 203, 207, 0.7)'
          ],
          borderWidth: 1
        }]
      }
    };
  }
  
  return {
    type: chartType,
    data: {
      labels: ['Lisboa', 'Porto', 'Centro', 'Norte', 'Alentejo', 'Algarve', 'Ilhas'],
      datasets: [
        {
          label: 'Empresas Inovadoras',
          data: [1250, 880, 410, 250, 140, 90, 60],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Investimento I&D (M€)',
          data: [1450, 980, 450, 280, 120, 75, 45],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    }
  };
}

// Scientific publications data
function generatePublicationsData(chartType: string): ChartData {
  const years = ['2018', '2019', '2020', '2021', '2022', '2023'];
  
  if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') {
    return {
      type: chartType,
      data: {
        labels: ['Ciências Médicas', 'Tecnologia', 'Ciências Naturais', 'Ciências Sociais', 'Engenharia'],
        datasets: [{
          data: [2850, 2340, 1920, 1450, 2100],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderWidth: 1
        }]
      }
    };
  }
  
  return {
    type: chartType,
    data: {
      labels: years,
      datasets: [
        {
          label: 'Publicações Científicas',
          data: [8750, 9250, 9680, 10450, 11200, 12100],
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgb(153, 102, 255)',
          borderWidth: 1
        },
        {
          label: 'Citações (x1000)',
          data: [42.5, 48.3, 52.7, 61.4, 65.8, 69.2],
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgb(255, 206, 86)',
          borderWidth: 1
        }
      ]
    }
  };
}

// General innovation metrics
function generateInnovationMetricsData(chartType: string): ChartData {
  const years = ['2018', '2019', '2020', '2021', '2022', '2023'];
  
  if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') {
    return {
      type: chartType,
      data: {
        labels: ['I&D Empresarial', 'I&D Acadêmico', 'Patentes', 'Startups', 'Publicações'],
        datasets: [{
          data: [35, 25, 15, 15, 10],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderWidth: 1
        }]
      }
    };
  }
  
  return {
    type: chartType,
    data: {
      labels: years,
      datasets: [
        {
          label: 'Índice de Inovação',
          data: [42.5, 44.8, 47.2, 49.5, 52.7, 56.3],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Investimento (% PIB)',
          data: [1.35, 1.40, 1.58, 1.68, 1.78, 1.85],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    }
  };
}

export const sendBaiRequest = async ({ request, chatId }: { 
  request: string, 
  chatId?: string 
}) => {
  try {
    const response = await fetch('/api/bai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request,
        chatId
      })
    });

    if (!response.ok) {
      throw new Error('BAI API request failed');
    }

    const data = await response.json();
    return {
      id_chat: data.id_chat || chatId,
      intent_alias: data.intent_alias,
    };
  } catch (error) {
    console.error('Error in BAI API request:', error);
    throw error;
  }
};
