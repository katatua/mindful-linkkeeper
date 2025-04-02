
// BAI API utility functions for chart generation and API communication

import { toast } from "@/hooks/use-toast";

const BAI_API_URL = "https://bai.chat4b.ai/api/request";
const BAI_API_KEY = "ki3ZfrxYn6G2JocE4A95sNRvwSd17hulamLPXDFbTWqeHjVBUgIy8CMzpK0OQtAuRHk5weX4fclx0KUt8rCgJO3EF1vsNGzPQWYb";
const BAI_ASSISTANT_KEY = "1R5ZBwLgGOMlVSj4p6Ar0H8DX9NKhcfseU2v3CtYJ7PqaIbWkzEoyuximTQdnFSfNaIsoJczCYkjLM3He9pU42EvxVg57Aw60uBd";

export interface BaiRequestOptions {
  chatId?: string;
  request: string;
  report?: string;
}

export interface BaiResponse {
  status: string;
  message: string;
  intent_alias?: string;
  variables?: Record<string, any>;
  id_chat?: string;
  files?: Array<{filename: string | null, download_url: string}>;
}

export interface ChartData {
  type: string;
  data: any;
  options?: any;
}

export async function sendBaiRequest(options: BaiRequestOptions): Promise<BaiResponse> {
  try {
    console.log("Sending request to BAI API:", options);
    
    const response = await fetch(BAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BAI_API_KEY}`
      },
      body: JSON.stringify({
        request: options.request,
        assistant_key: BAI_ASSISTANT_KEY,
        id_chat: options.chatId || "",
        report: options.report || "No"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("BAI API error:", errorText);
      throw new Error(`API call failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("BAI API response:", data);
    return data;
  } catch (error) {
    console.error("Error sending BAI request:", error);
    throw error;
  }
}

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
  
  if (lowercaseText.includes("barra") || lowercaseText.includes("bar")) {
    return "bar";
  } else if (lowercaseText.includes("linha") || lowercaseText.includes("line")) {
    return "line";
  } else if (lowercaseText.includes("pizza") || lowercaseText.includes("pie")) {
    return "pie";
  } else if (lowercaseText.includes("área") || lowercaseText.includes("area")) {
    return "area";
  } else if (lowercaseText.includes("donut")) {
    return "doughnut";
  } else if (lowercaseText.includes("radar")) {
    return "radar";
  } else if (lowercaseText.includes("polar")) {
    return "polarArea";
  } else if (lowercaseText.includes("scatter") || lowercaseText.includes("dispersão")) {
    return "scatter";
  }
  
  // Default to bar chart if no specific type is detected
  return "bar";
}

export function generateSampleChartData(chartType: string): any {
  // Generate random data for demonstration
  const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
  const randomValues = () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 100));
  
  // Different data structures for different chart types
  switch (chartType) {
    case 'bar':
    case 'line':
    case 'area':
      return {
        labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: randomValues(),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
          },
          {
            label: 'Dataset 2',
            data: randomValues(),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1
          }
        ]
      };
    
    case 'pie':
    case 'doughnut':
    case 'polarArea':
      return {
        labels,
        datasets: [{
          data: randomValues(),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderWidth: 1
        }]
      };
    
    case 'radar':
      return {
        labels: ['Vendas', 'Marketing', 'Desenvolvimento', 'Suporte', 'Administração', 'Finanças'],
        datasets: [{
          label: 'Desempenho 2023',
          data: randomValues(),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
      };
    
    case 'scatter':
      return {
        datasets: [{
          label: 'Valores',
          data: labels.map((_, i) => ({
            x: Math.random() * 100,
            y: Math.random() * 100
          })),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 6
        }]
      };
    
    default:
      return {
        labels,
        datasets: [{
          label: 'Valores',
          data: randomValues(),
          backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
      };
  }
}
