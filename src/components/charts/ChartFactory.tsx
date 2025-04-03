
import React from 'react';
import { AnalyticsChart } from './AnalyticsChart';

// Investment data
const investmentData = {
  labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Investimento em I&D (M€)',
      data: [2340, 2580, 2750, 3125, 3450, 3680],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    },
    {
      label: '% do PIB',
      data: [1.35, 1.40, 1.58, 1.68, 1.78, 1.85],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1
    }
  ]
};

// Sectoral data
const sectorData = {
  labels: ['Tecnologia', 'Saúde', 'Energia', 'Indústria', 'Agricultura', 'Turismo'],
  datasets: [
    {
      label: 'Índice de Inovação',
      data: [78.5, 72.3, 68.9, 64.2, 58.7, 51.4],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
      ]
    }
  ]
};

// Regional data
const regionalData = {
  labels: ['Lisboa', 'Porto', 'Centro', 'Norte', 'Alentejo', 'Algarve', 'Ilhas'],
  datasets: [
    {
      label: 'Empresas Inovadoras',
      data: [1250, 880, 410, 250, 140, 90, 60],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    },
    {
      label: 'Investimento I&D (M€)',
      data: [1450, 980, 450, 280, 120, 75, 45],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1
    }
  ]
};

// Patent data
const patentData = {
  labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Patentes Registradas',
      data: [620, 685, 715, 750, 810, 842],
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }
  ]
};

// Startup data
const startupData = {
  labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Novas Startups',
      data: [215, 245, 180, 310, 365, 420],
      backgroundColor: 'rgba(255, 159, 64, 0.7)',
      borderColor: 'rgb(255, 159, 64)',
      borderWidth: 1
    },
    {
      label: 'Investimento Anjo (M€)',
      data: [85, 110, 95, 145, 190, 230],
      backgroundColor: 'rgba(153, 102, 255, 0.7)',
      borderColor: 'rgb(153, 102, 255)',
      borderWidth: 1
    }
  ]
};

// Publications data
const publicationsData = {
  labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Publicações Científicas',
      data: [8750, 9250, 9680, 10450, 11200, 12100],
      backgroundColor: 'rgba(153, 102, 255, 0.7)',
      borderColor: 'rgb(153, 102, 255)',
      borderWidth: 1
    },
    {
      label: 'Citações (x1000)',
      data: [42.5, 48.3, 52.7, 61.4, 65.8, 69.2],
      backgroundColor: 'rgba(255, 206, 86, 0.7)',
      borderColor: 'rgb(255, 206, 86)',
      borderWidth: 1
    }
  ]
};

// Funding source data
const fundingSourceData = {
  labels: ['Capital de Risco', 'Fundos Públicos', 'Investidores Anjo', 'Corporativo', 'Crowdfunding'],
  datasets: [
    {
      label: 'Fontes de Financiamento (M€)',
      data: [450, 300, 250, 180, 90],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(153, 102, 255, 0.7)'
      ]
    }
  ]
};

export type ChartTopicType = 
  | 'investment' 
  | 'sector' 
  | 'regional' 
  | 'patents' 
  | 'startups' 
  | 'publications'
  | 'funding'
  | 'default';

export type ChartTypeFormat = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';

interface ChartFactoryProps {
  topic?: ChartTopicType;
  chartType?: ChartTypeFormat;
  title?: string;
  description?: string;
}

export const ChartFactory: React.FC<ChartFactoryProps> = ({
  topic = 'default',
  chartType = 'bar',
  title,
  description
}) => {
  // Determine chart data based on topic
  const getChartData = () => {
    switch (topic) {
      case 'investment':
        return investmentData;
      case 'sector':
        return sectorData;
      case 'regional':
        return regionalData;
      case 'patents':
        return patentData;
      case 'startups':
        return startupData;
      case 'publications':
        return publicationsData;
      case 'funding':
        return fundingSourceData;
      default:
        return investmentData; // Default data
    }
  };

  // Determine appropriate chart title if not provided
  const getChartTitle = () => {
    if (title) return title;
    
    switch (topic) {
      case 'investment':
        return 'Investimento em I&D em Portugal';
      case 'sector':
        return 'Índice de Inovação por Setor';
      case 'regional':
        return 'Inovação por Região';
      case 'patents':
        return 'Patentes Registradas Anualmente';
      case 'startups':
        return 'Crescimento de Startups em Portugal';
      case 'publications':
        return 'Publicações Científicas e Citações';
      case 'funding':
        return 'Fontes de Financiamento para Inovação';
      default:
        return 'Métricas de Inovação';
    }
  };

  // Determine chart description if not provided
  const getChartDescription = () => {
    if (description) return description;
    
    switch (topic) {
      case 'investment':
        return 'Evolução do investimento em I&D e percentagem do PIB';
      case 'sector':
        return 'Comparação do índice de inovação entre diferentes setores econômicos';
      case 'regional':
        return 'Distribuição de empresas inovadoras e investimento por região';
      case 'patents':
        return 'Tendência anual de registros de patentes em Portugal';
      case 'startups':
        return 'Criação de novas startups e investimento anjo recebido';
      case 'publications':
        return 'Produção científica e impacto em citações ao longo do tempo';
      case 'funding':
        return 'Principais fontes de financiamento para atividades de inovação';
      default:
        return 'Análise de indicadores-chave de inovação';
    }
  };

  // Determine best chart type based on topic if not specified
  const getBestChartType = (): ChartTypeFormat => {
    if (chartType !== 'bar') return chartType;
    
    switch (topic) {
      case 'investment':
        return 'line';
      case 'sector':
        return 'radar';
      case 'regional':
        return 'bar';
      case 'patents':
        return 'line';
      case 'startups':
        return 'bar';
      case 'publications':
        return 'line';
      case 'funding':
        return 'pie';
      default:
        return 'bar';
    }
  };

  const actualChartType = getBestChartType();
  const data = getChartData();
  const chartTitle = getChartTitle();
  const chartDescription = getChartDescription();

  return (
    <AnalyticsChart
      title={chartTitle}
      description={chartDescription}
      chartType={actualChartType}
      data={data}
      height={350}
      exportFileName={`${topic}-chart`}
    />
  );
};

export default ChartFactory;
