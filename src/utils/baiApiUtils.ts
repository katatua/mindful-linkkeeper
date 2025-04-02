
import { ChartData } from '@/types/chartTypes'; // Assuming we'll create this type definition

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

export function generateSampleChartData(chartType: string): ChartData {
  const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
  const randomValues = () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 100));
  
  switch (chartType) {
    case 'bar':
    case 'line':
    case 'area':
      return {
        type: chartType,
        data: {
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
        }
      };
    
    case 'pie':
    case 'doughnut':
    case 'polarArea':
      return {
        type: chartType,
        data: {
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
        }
      };
    
    case 'radar':
      return {
        type: chartType,
        data: {
          labels: ['Vendas', 'Marketing', 'Desenvolvimento', 'Suporte', 'Administração', 'Finanças'],
          datasets: [{
            label: 'Desempenho 2023',
            data: randomValues(),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
          }]
        }
      };
    
    case 'scatter':
      return {
        type: chartType,
        data: {
          datasets: [{
            label: 'Valores',
            data: labels.map(() => ({
              x: Math.random() * 100,
              y: Math.random() * 100
            })),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          }]
        }
      };
    
    default:
      return {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Valores',
            data: randomValues(),
            backgroundColor: 'rgba(54, 162, 235, 0.5)'
          }]
        }
      };
  }
}
