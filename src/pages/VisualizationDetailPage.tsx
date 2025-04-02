import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, RadarChart, Radar, 
  ScatterChart, Scatter, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { DownloadIcon, Share2Icon, Code, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Tooltip as UITooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock data (this would typically come from the database)
const performanceData = [
  { year: 2018, investment: 1200, publications: 350, patents: 120, startups: 80 },
  { year: 2019, investment: 1350, publications: 380, patents: 135, startups: 95 },
  { year: 2020, investment: 1500, publications: 420, patents: 150, startups: 110 },
  { year: 2021, investment: 1650, publications: 450, patents: 165, startups: 125 },
  { year: 2022, investment: 1800, publications: 480, patents: 180, startups: 140 },
  { year: 2023, investment: 2000, publications: 520, patents: 200, startups: 160 },
];

const fundingData = [
  { name: 'Capital de Risco', value: 450 },
  { name: 'Fundos Públicos', value: 300 },
  { name: 'Investidores Anjo', value: 250 },
];

const regionData = [
  { name: 'Lisboa', value: 400 },
  { name: 'Porto', value: 300 },
  { name: 'Centro', value: 150 },
  { name: 'Norte', value: 100 },
  { name: 'Sul', value: 50 },
];

const sectorData = [
  { name: 'Tecnologia', value: 350 },
  { name: 'Saúde', value: 250 },
  { name: 'Energia', value: 200 },
  { name: 'Indústria', value: 150 },
  { name: 'Turismo', value: 50 },
];

const scatterData = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6B6B', '#4ECDC4', '#8675A9'];

const VisualizationDetailPage = () => {
  const [activeTab, setActiveTab] = useState('chart');
  const [showDataLabels, setShowDataLabels] = useState(true);
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
      html2canvas(chartContainer, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', [canvas.width, canvas.height]);
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 4, canvas.height / 4);
        pdf.save('visualization.pdf');
        toast({
          title: "Download Iniciado",
          description: "O PDF será baixado em breve.",
        });
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível encontrar o contêiner do gráfico.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPNG = () => {
    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
      html2canvas(chartContainer, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'visualization.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: "Download Iniciado",
          description: "A imagem será baixada em breve.",
        });
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível encontrar o contêiner do gráfico.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCSV = () => {
    const csvRows = [];
    const headers = Object.keys(performanceData[0]);
    csvRows.push(headers.join(','));

    for (const row of performanceData) {
      const values = headers.map(header => row[header]);
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'visualization.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({
      title: "Download Iniciado",
      description: "O CSV será baixado em breve.",
    });
  };

  const handleShareVisualization = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Visualização de Dados',
        text: 'Confira esta visualização de dados!',
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copiado",
        description: "O link foi copiado para a área de transferência.",
      });
    }
  };

  const getChartJSX = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="investment" stroke="#8884d8" name="Investimento (M€)" dot={showDataLabels} />
          <Line type="monotone" dataKey="publications" stroke="#82ca9d" name="Publicações" dot={showDataLabels} />
          <Line type="monotone" dataKey="patents" stroke="#ffc658" name="Patentes" dot={showDataLabels} />
          <Line type="monotone" dataKey="startups" stroke="#e45641" name="Startups" dot={showDataLabels} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const getCodeSnippet = () => {
    return `
    import React from 'react';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

    const data = ${JSON.stringify(performanceData, null, 2)};

    const SimpleLineChart = () => {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="investment" stroke="#8884d8" />
            <Line type="monotone" dataKey="publications" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    export default SimpleLineChart;
    `;
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Evolução de Indicadores de Inovação</h1>
            <p className="text-gray-500">Visualização detalhada de métricas-chave do ecossistema de inovação</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baixar como PDF</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleDownloadPNG}>
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    PNG
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baixar como imagem</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baixar dados brutos</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleShareVisualization}>
                    <Share2Icon className="h-4 w-4 mr-1" />
                    Compartilhar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compartilhar visualização</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
                <TabsList>
                  <TabsTrigger value="chart">Gráfico</TabsTrigger>
                  <TabsTrigger value="table">Tabela</TabsTrigger>
                  <TabsTrigger value="code">Código</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="show-labels" className="flex items-center">
                      <input
                        id="show-labels"
                        type="checkbox"
                        checked={showDataLabels}
                        onChange={() => setShowDataLabels(!showDataLabels)}
                        className="mr-2"
                      />
                      Mostrar rótulos
                    </Label>
                  </div>
                </div>
              </div>
              
              <TabsContent value="chart" className="pt-4">
                <div id="chart-container" className="w-full h-96 p-4 bg-white rounded-md">
                  {getChartJSX()}
                </div>
                
                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <div className="flex items-start space-x-2">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Sobre esta visualização</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Esta visualização mostra a evolução temporal de indicadores-chave de inovação em Portugal, 
                        incluindo investimento em I&D, publicações científicas, patentes registradas e startups criadas. 
                        Os dados são compilados de diversas fontes oficiais e oferecem uma visão geral do ecossistema 
                        de inovação português.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="table" className="pt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b text-left">Ano</th>
                        <th className="py-2 px-4 border-b text-left">Investimento em I&D (M€)</th>
                        <th className="py-2 px-4 border-b text-left">Publicações</th>
                        <th className="py-2 px-4 border-b text-left">Patentes</th>
                        <th className="py-2 px-4 border-b text-left">Startups</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((entry) => (
                        <tr key={entry.year} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b">{entry.year}</td>
                          <td className="py-2 px-4 border-b">{entry.investment}</td>
                          <td className="py-2 px-4 border-b">{entry.publications}</td>
                          <td className="py-2 px-4 border-b">{entry.patents}</td>
                          <td className="py-2 px-4 border-b">{entry.startups}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="pt-4">
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm font-mono">
                    <code>{getCodeSnippet()}</code>
                  </pre>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Copiar código
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Análises relacionadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-medium">Distribuição regional de patentes</h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">Análise da concentração geográfica de propriedade intelectual</p>
                <Button variant="ghost" size="sm" className="mt-2">Ver análise</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-medium">Impacto das políticas de inovação</h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">Avaliação de resultados das principais iniciativas governamentais</p>
                <Button variant="ghost" size="sm" className="mt-2">Ver análise</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-medium">Fontes de financiamento para startups</h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">Mapeamento dos recursos disponíveis para empreendedores</p>
                <Button variant="ghost" size="sm" className="mt-2">Ver análise</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VisualizationDetailPage;
