
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';

// Cores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

interface DataVisualizationProps {
  data: any[];
  onClose: () => void;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, onClose }) => {
  const [visualizationType, setVisualizationType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [dataKeys, setDataKeys] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('Visualização de Dados');

  useEffect(() => {
    determineDataAndVisualization();
  }, [data]);

  const determineDataAndVisualization = () => {
    if (!data || data.length === 0) return;

    // Descobrir as chaves e determinar o melhor tipo de visualização
    const sampleItem = data[0];
    const keys = Object.keys(sampleItem).filter(key => 
      !['id', 'created_at', 'updated_at'].includes(key) && 
      typeof sampleItem[key] !== 'object'
    );

    // Verificar se os dados têm datas/anos (para séries temporais)
    const hasDates = keys.some(key => 
      key.includes('date') || 
      key.includes('year') || 
      key.includes('measurement_date') || 
      (key === 'name' && String(sampleItem[key]).match(/\b20\d{2}\b/))
    );

    // Verificar se temos dados numéricos para visualizar
    const numericKeys = keys.filter(key => 
      typeof sampleItem[key] === 'number' || 
      !isNaN(parseFloat(sampleItem[key]))
    );

    // Determinar título baseado nos dados
    let vizTitle = 'Visualização de Dados';
    if (keys.includes('category')) {
      vizTitle = `Dados de ${sampleItem.category}`;
    } else if (keys.includes('name') && sampleItem.name.includes('R&D')) {
      vizTitle = 'Investimento em P&D';
    } else if (keys.includes('name') && sampleItem.name.includes('Patent')) {
      vizTitle = 'Dados de Patentes';
    } else if (keys.includes('sector')) {
      vizTitle = 'Dados por Setor';
    } else if (keys.includes('region')) {
      vizTitle = 'Dados por Região';
    }
    
    setTitle(vizTitle);

    // Determinar o melhor tipo de visualização
    let vizType: 'bar' | 'line' | 'pie' = 'bar';
    let processedDataItems: any[] = [];
    let dataVisKeys: string[] = [];

    if (data.length === 1) {
      // Para um único item, provavelmente um gráfico de pizza é melhor
      vizType = 'pie';
      processedDataItems = keys
        .filter(key => typeof sampleItem[key] === 'number' || !isNaN(parseFloat(sampleItem[key])))
        .map(key => ({
          name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          value: parseFloat(sampleItem[key]) || 0
        }));
      dataVisKeys = ['value'];
    } else if (data.length <= 5 && keys.includes('name') && keys.includes('value')) {
      // Dados parecem ser métricas simples (nome-valor), bom para pizza
      vizType = 'pie';
      processedDataItems = data.map(item => ({
        name: item.name,
        value: parseFloat(item.value) || 0
      }));
      dataVisKeys = ['value'];
    } else if (hasDates) {
      // Dados de série temporal, bom para linhas
      vizType = 'line';
      
      // Tentar extrair a data/ano dos dados
      processedDataItems = data.map(item => {
        const result: any = {};
        
        // Determinar o nome do período (geralmente um ano)
        if (item.year) {
          result.period = item.year;
        } else if (item.measurement_date) {
          result.period = new Date(item.measurement_date).getFullYear();
        } else if (item.date) {
          result.period = new Date(item.date).getFullYear();
        } else if (item.name && item.name.match(/\b20\d{2}\b/)) {
          const matches = item.name.match(/\b20\d{2}\b/);
          if (matches) result.period = matches[0];
          else result.period = item.name;
        } else {
          result.period = `Item ${processedDataItems.length + 1}`;
        }
        
        // Adicionar valores numéricos
        numericKeys.forEach(key => {
          result[key] = parseFloat(item[key]) || 0;
        });
        
        return result;
      });
      
      dataVisKeys = numericKeys;
    } else if (data.length > 1 && data.length <= 10) {
      // Poucos items, bom para barras
      vizType = 'bar';
      
      // Determinar a chave para nomes
      const nameKey = keys.find(k => k === 'name' || k === 'title' || k === 'category' || k === 'region' || k === 'sector') || keys[0];
      
      processedDataItems = data.map(item => {
        const result: any = { name: item[nameKey] || `Item ${processedDataItems.length + 1}` };
        
        // Adicionar valores numéricos
        numericKeys.forEach(key => {
          if (key !== nameKey) {
            result[key.replace(/_/g, ' ')] = parseFloat(item[key]) || 0;
          }
        });
        
        return result;
      });
      
      dataVisKeys = numericKeys.filter(k => k !== nameKey).map(k => k.replace(/_/g, ' '));
    } else {
      // Muitos items, use barras para os primeiros 10
      vizType = 'bar';
      
      // Determinar a chave para nomes
      const nameKey = keys.find(k => k === 'name' || k === 'title' || k === 'category' || k === 'region' || k === 'sector') || keys[0];
      const valueKey = numericKeys.find(k => k !== nameKey) || 'value';
      
      processedDataItems = data.slice(0, 10).map(item => ({
        name: item[nameKey] || `Item ${processedDataItems.length + 1}`,
        [valueKey]: parseFloat(item[valueKey]) || 0
      }));
      
      dataVisKeys = [valueKey];
    }

    setVisualizationType(vizType);
    setProcessedData(processedDataItems);
    setDataKeys(dataVisKeys);
  };

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={COLORS[index % COLORS.length]} 
                  name={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={COLORS[index % COLORS.length]} 
                  name={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Não foi possível gerar uma visualização para os dados.</div>;
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Visualização baseada em {data.length} registro{data.length !== 1 ? 's' : ''}
          </CardDescription>
        </div>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
          <X className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        {renderVisualization()}
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
