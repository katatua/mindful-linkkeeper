
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  RadarChart, 
  Radar, 
  ScatterChart, 
  Scatter,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

interface VisualizationData {
  type: 'bar' | 'line' | 'pie' | 'radar' | 'scatter' | 'area';
  title: string;
  description?: string;
  data: any[];
  colors?: string[];
  xAxisKey?: string;
  yAxisKey?: string;
  dataKey?: string;
  valuePath?: string;
  namePath?: string;
  series?: Array<{
    dataKey: string;
    name?: string;
    color?: string;
  }>;
}

interface ReportVisualizerProps {
  visualization: VisualizationData;
}

export const ReportVisualizer: React.FC<ReportVisualizerProps> = ({ visualization }) => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  // Define default colors if not provided
  const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];
  const colors = visualization.colors || defaultColors;

  // Generic error handling for visualizations
  if (!visualization || !visualization.data || visualization.data.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-gray-500">
          {language === 'pt' 
            ? "Dados insuficientes para visualização" 
            : "Insufficient data for visualization"}
        </CardContent>
      </Card>
    );
  }

  const renderVisualization = () => {
    switch (visualization.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visualization.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={visualization.xAxisKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              {visualization.series ? (
                visualization.series.map((serie, index) => (
                  <Bar 
                    key={`bar-${index}`} 
                    dataKey={serie.dataKey} 
                    name={serie.name || serie.dataKey} 
                    fill={serie.color || colors[index % colors.length]} 
                  />
                ))
              ) : (
                <Bar 
                  dataKey={visualization.dataKey || 'value'} 
                  fill={colors[0]} 
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visualization.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={visualization.xAxisKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              {visualization.series ? (
                visualization.series.map((serie, index) => (
                  <Line 
                    key={`line-${index}`} 
                    type="monotone" 
                    dataKey={serie.dataKey} 
                    name={serie.name || serie.dataKey} 
                    stroke={serie.color || colors[index % colors.length]} 
                    activeDot={{ r: 8 }} 
                  />
                ))
              ) : (
                <Line 
                  type="monotone" 
                  dataKey={visualization.dataKey || 'value'} 
                  stroke={colors[0]} 
                  activeDot={{ r: 8 }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={visualization.data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey={visualization.dataKey || 'value'}
                nameKey={visualization.namePath || 'name'}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {visualization.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius={80} data={visualization.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey={visualization.namePath || 'name'} />
              <PolarRadiusAxis />
              {visualization.series ? (
                visualization.series.map((serie, index) => (
                  <Radar 
                    key={`radar-${index}`} 
                    name={serie.name || serie.dataKey} 
                    dataKey={serie.dataKey} 
                    stroke={serie.color || colors[index % colors.length]} 
                    fill={serie.color || colors[index % colors.length]} 
                    fillOpacity={0.6} 
                  />
                ))
              ) : (
                <Radar 
                  name={visualization.dataKey || 'value'} 
                  dataKey={visualization.dataKey || 'value'} 
                  stroke={colors[0]} 
                  fill={colors[0]} 
                  fillOpacity={0.6} 
                />
              )}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey={visualization.xAxisKey || 'x'} 
                name={visualization.xAxisKey || 'x'} 
              />
              <YAxis 
                type="number" 
                dataKey={visualization.yAxisKey || 'y'} 
                name={visualization.yAxisKey || 'y'} 
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              {visualization.series ? (
                visualization.series.map((serie, index) => (
                  <Scatter 
                    key={`scatter-${index}`} 
                    name={serie.name || serie.dataKey} 
                    data={visualization.data} 
                    fill={serie.color || colors[index % colors.length]} 
                  />
                ))
              ) : (
                <Scatter 
                  name={visualization.title} 
                  data={visualization.data} 
                  fill={colors[0]} 
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={visualization.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={visualization.xAxisKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              {visualization.series ? (
                visualization.series.map((serie, index) => (
                  <Area 
                    key={`area-${index}`}
                    type="monotone" 
                    dataKey={serie.dataKey} 
                    name={serie.name || serie.dataKey} 
                    stroke={serie.color || colors[index % colors.length]} 
                    fill={serie.color || colors[index % colors.length]} 
                    fillOpacity={0.3}
                  />
                ))
              ) : (
                <Area 
                  type="monotone" 
                  dataKey={visualization.dataKey || 'value'} 
                  stroke={colors[0]} 
                  fill={colors[0]} 
                  fillOpacity={0.3}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="p-4 text-center text-gray-500">
            {language === 'pt' 
              ? `Tipo de visualização não suportado: ${visualization.type}` 
              : `Unsupported visualization type: ${visualization.type}`}
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        {visualization.title && (
          <h3 className="text-lg font-medium mb-2">{visualization.title}</h3>
        )}
        {visualization.description && (
          <p className="text-sm text-gray-500 mb-4">{visualization.description}</p>
        )}
        {renderVisualization()}
      </CardContent>
    </Card>
  );
};

export const extractVisualizations = (content: string): VisualizationData[] => {
  if (!content) return [];
  
  const visualizationMarkers = content.match(/\[Visualization:[^\]]+\]/g) || [];
  
  return visualizationMarkers.map(marker => {
    try {
      // Extract the portion after "Visualization:" and before closing "]"
      const jsonStartIndex = marker.indexOf(':', 13) + 1;
      const jsonStr = marker.substring(jsonStartIndex, marker.length - 1).trim();
      
      // Check if the JSON is complete (has closing brackets/braces)
      let jsonData: any;

      try {
        jsonData = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Error parsing visualization data:', parseError);
        
        // Attempt to fix common JSON parse errors
        // 1. Try adding missing closing brackets/braces
        let fixedJson = jsonStr;
        
        // Count opening and closing braces/brackets
        const openBraces = (jsonStr.match(/{/g) || []).length;
        const closeBraces = (jsonStr.match(/}/g) || []).length;
        const openBrackets = (jsonStr.match(/\[/g) || []).length;
        const closeBrackets = (jsonStr.match(/\]/g) || []).length;
        
        // Add missing closing braces/brackets
        for (let i = 0; i < openBraces - closeBraces; i++) {
          fixedJson += '}';
        }
        
        for (let i = 0; i < openBrackets - closeBrackets; i++) {
          fixedJson += ']';
        }
        
        try {
          jsonData = JSON.parse(fixedJson);
          console.log('Successfully fixed and parsed JSON:', jsonData);
        } catch (secondError) {
          console.error('Failed to fix JSON:', secondError);
          return null;
        }
      }
      
      // Validate the required fields for a visualization
      if (!jsonData.type || !jsonData.data) {
        console.error('Invalid visualization data: missing required fields');
        return null;
      }
      
      return jsonData;
    } catch (e) {
      console.error('Error processing visualization marker:', e);
      return null;
    }
  }).filter(Boolean);
};
