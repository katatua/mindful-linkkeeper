
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ChartDisplayProps {
  chartData: any;
  chartType: string;
  title?: string;
  description?: string;
  onDownload?: () => void;
  onShare?: () => void;
}

declare global {
  interface Window {
    Chart: any;
  }
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({
  chartData,
  chartType,
  title = "Gráfico Gerado",
  description = "Visualização de dados gerada pela IA",
  onDownload,
  onShare
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Load Chart.js script if it's not already loaded
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.async = true;
      script.onload = () => createChart();
      document.body.appendChild(script);
    } else {
      createChart();
    }

    return () => {
      // Clean up chart instance on unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, chartType]);

  const createChart = () => {
    if (!chartRef.current || !window.Chart) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Configuration for different chart types
    const config: any = {
      type: chartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: title
          }
        }
      }
    };

    // Special configurations for specific chart types
    if (chartType === 'line') {
      config.options.elements = {
        line: {
          tension: 0.2 // Smooth curves
        }
      };
    } else if (chartType === 'bar') {
      config.options.scales = {
        y: {
          beginAtZero: true
        }
      };
    }

    // Create the chart
    chartInstance.current = new window.Chart(ctx, config);
  };

  const handleDownload = () => {
    if (!chartRef.current) return;
    
    try {
      // Create an image from the canvas
      const url = chartRef.current.toDataURL('image/png');
      
      // Create a temporary link and click it to download
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = url;
      link.click();
      
      toast.success("Download concluído", { 
        description: "O gráfico foi salvo com sucesso"
      });
      
      if (onDownload) onDownload();
    } catch (error) {
      console.error("Error downloading chart:", error);
      toast.error("Erro ao baixar", { 
        description: "Não foi possível salvar o gráfico" 
      });
    }
  };

  const handleShare = () => {
    if (!chartRef.current) return;
    
    try {
      // Create an image from the canvas
      const url = chartRef.current.toDataURL('image/png');
      
      // If Web Share API is available, use it
      if (navigator.share) {
        navigator.share({
          title: title,
          text: description,
          files: [new File([dataURLtoBlob(url)], 'chart.png', { type: 'image/png' })]
        })
        .then(() => {
          toast.success("Compartilhado com sucesso");
          if (onShare) onShare();
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          // Fallback if sharing fails
          fallbackShareMethod(url);
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        fallbackShareMethod(url);
      }
    } catch (error) {
      console.error("Error sharing chart:", error);
      toast.error("Erro ao compartilhar", { 
        description: "Não foi possível compartilhar o gráfico" 
      });
    }
  };

  const fallbackShareMethod = (url: string) => {
    // Copy image URL to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success("URL da imagem copiada", { 
          description: "URL do gráfico copiada para a área de transferência" 
        });
      })
      .catch(() => {
        toast.error("Erro ao copiar URL", { 
          description: "Não foi possível copiar a URL do gráfico" 
        });
      });
  };

  // Utility function to convert dataURL to Blob
  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownload} title="Download">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} title="Compartilhar">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="w-full aspect-[16/9]">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartDisplay;
