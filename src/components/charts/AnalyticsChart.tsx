
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type DataPoint = {
  label: string;
  value: number;
};

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
};

interface AnalyticsChartProps {
  title: string;
  description?: string;
  chartType: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: ChartData;
  height?: number;
  width?: string;
  exportFileName?: string;
}

declare global {
  interface Window {
    Chart: any;
  }
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  description,
  chartType,
  data,
  height = 300,
  width = '100%',
  exportFileName
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!chartRef.current) return;

    const loadChartJS = async () => {
      // If Chart.js isn't already loaded, load it
      if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.async = true;
        
        // Wait for script to load
        await new Promise<void>((resolve) => {
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }

      // Clean up previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      // Set chart colors
      const defaultColors = [
        'rgba(54, 162, 235, 0.8)', // blue
        'rgba(255, 99, 132, 0.8)', // red
        'rgba(75, 192, 192, 0.8)', // green
        'rgba(255, 206, 86, 0.8)', // yellow
        'rgba(153, 102, 255, 0.8)', // purple
        'rgba(255, 159, 64, 0.8)', // orange
        'rgba(201, 203, 207, 0.8)', // grey
      ];

      // Apply colors if not specified in the data
      const datasets = data.datasets.map((dataset, index) => {
        if (!dataset.backgroundColor) {
          if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polarArea') {
            dataset.backgroundColor = defaultColors;
          } else {
            dataset.backgroundColor = defaultColors[index % defaultColors.length];
          }
        }
        
        if (!dataset.borderColor && (chartType === 'line' || chartType === 'radar')) {
          dataset.borderColor = typeof dataset.backgroundColor === 'string' 
            ? dataset.backgroundColor 
            : defaultColors[index % defaultColors.length];
        }
        
        if (dataset.borderWidth === undefined) {
          dataset.borderWidth = 1;
        }
        
        return dataset;
      });

      // Create the chart
      chartInstance.current = new window.Chart(ctx, {
        type: chartType,
        data: {
          ...data,
          datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              padding: 12,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 13
              },
              displayColors: true,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  
                  if (context.parsed.y !== undefined) {
                    label += new Intl.NumberFormat('pt-PT', { 
                      maximumFractionDigits: 2 
                    }).format(context.parsed.y);
                  } else if (context.parsed !== undefined) {
                    // For pie/doughnut charts
                    label += new Intl.NumberFormat('pt-PT', { 
                      maximumFractionDigits: 2 
                    }).format(context.parsed);
                  }
                  
                  return label;
                }
              }
            }
          },
          scales: chartType !== 'pie' && chartType !== 'doughnut' && chartType !== 'polarArea' ? {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 12
                }
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                font: {
                  size: 12
                },
                callback: function(value) {
                  return new Intl.NumberFormat('pt-PT', { 
                    maximumFractionDigits: 0 
                  }).format(Number(value));
                }
              }
            }
          } : undefined
        }
      });
    };

    loadChartJS();

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartType, data]);

  const handleDownloadImage = () => {
    if (!chartRef.current) return;
    
    try {
      // Create an image from the canvas
      const url = chartRef.current.toDataURL('image/png');
      
      // Create a temporary link and click it to download
      const link = document.createElement('a');
      link.download = `${exportFileName || title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = url;
      link.click();
      
      toast({
        title: "Download concluído",
        description: "O gráfico foi salvo com sucesso"
      });
    } catch (error) {
      console.error("Error downloading chart:", error);
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível salvar o gráfico", 
        variant: "destructive"
      });
    }
  };

  const handleShareChart = () => {
    if (!chartRef.current) return;
    
    try {
      // Copy canvas to clipboard (this is a simplified approach, actual implementation would be more complex)
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado",
        description: "O link do gráfico foi copiado para a área de transferência"
      });
    } catch (error) {
      console.error("Error sharing chart:", error);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível compartilhar o gráfico",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = () => {
    if (!data) return;
    
    try {
      // Create CSV content
      const headers = ['Label', ...data.datasets.map(ds => ds.label)].join(',');
      const rows = data.labels.map((label, i) => {
        return [
          label,
          ...data.datasets.map(ds => ds.data[i])
        ].join(',');
      });
      
      const csvContent = [headers, ...rows].join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${exportFileName || title.replace(/\s+/g, '-').toLowerCase()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "CSV exportado",
        description: "Os dados foram exportados com sucesso"
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar os dados",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                Exportar
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownloadImage}>
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareChart}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px`, width }}>
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
