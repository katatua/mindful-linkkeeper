import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57',
  '#83a6ed', '#8dd1e1', '#9932cc', '#ff6b6b', '#4caf50'
];

type VisualizationType = "bar" | "line" | "pie" | "area" | "radar" | "scatter";

export interface VisualizationData {
  type: VisualizationType;
  title: string;
  description: string;
  data: any[];
}

export const extractVisualizations = (content: string): VisualizationData[] => {
  const visualizationRegex = /Insert Visualization (\d+)\s*\((.*?):(.*?)\)/gi;
  const ptVisualizationRegex = /Inserir Visualização (\d+)\s*\((.*?):(.*?)\)/gi;
  const visualizations: VisualizationData[] = [];
  
  let match;
  while ((match = visualizationRegex.exec(content)) !== null) {
    const id = parseInt(match[1]);
    const typeStr = match[2].toLowerCase().trim();
    const title = match[3].trim();
    
    let type: VisualizationType = selectVisualizationType(typeStr, title, id);
    
    const data = generateDataForVisualization(type, title, id);
    
    visualizations.push({
      type,
      title,
      description: match[0],
      data
    });
  }
  
  let ptMatch;
  while ((ptMatch = ptVisualizationRegex.exec(content)) !== null) {
    const id = parseInt(ptMatch[1]);
    const typeStr = ptMatch[2].toLowerCase().trim();
    const title = ptMatch[3].trim();
    
    let type: VisualizationType = selectVisualizationType(typeStr, title, id);
    
    const data = generateDataForVisualization(type, title, id);
    
    visualizations.push({
      type,
      title,
      description: ptMatch[0],
      data
    });
  }
  
  return visualizations;
};

const selectVisualizationType = (typeStr: string, title: string, id: number): VisualizationType => {
  if (typeStr.includes("bar")) return "bar";
  if (typeStr.includes("line") || typeStr.includes("linha")) return "line";
  if (typeStr.includes("pie") || typeStr.includes("pizza")) return "pie";
  if (typeStr.includes("area") || typeStr.includes("área")) return "area";
  if (typeStr.includes("radar")) return "radar";
  if (typeStr.includes("scatter") || typeStr.includes("dispersão")) return "scatter";
  
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes("comparison") || lowerTitle.includes("comparação") || lowerTitle.includes("versus") || lowerTitle.includes("vs")) {
    return id % 2 === 0 ? "bar" : "radar";
  }
  
  if (lowerTitle.includes("trend") || lowerTitle.includes("tendência") || lowerTitle.includes("over time") || lowerTitle.includes("ao longo do tempo")) {
    return id % 3 === 0 ? "area" : "line";
  }
  
  if (lowerTitle.includes("distribution") || lowerTitle.includes("distribuição") || lowerTitle.includes("breakdown") || lowerTitle.includes("share")) {
    return id % 2 === 0 ? "pie" : "bar";
  }
  
  if (lowerTitle.includes("correlation") || lowerTitle.includes("correlação") || lowerTitle.includes("relationship") || lowerTitle.includes("relação")) {
    return "scatter";
  }
  
  const types: VisualizationType[] = ["bar", "line", "pie", "area", "radar", "scatter"];
  return types[id % types.length];
};

const generateDataForVisualization = (type: VisualizationType, title: string, index: number): any[] => {
  const currentYear = new Date().getFullYear();
  const lowerTitle = title.toLowerCase();
  const isPortuguese = lowerTitle.includes("setor") || lowerTitle.includes("categoria") || lowerTitle.includes("distribuição");
  
  const volatility = 0.2 + (index % 3) * 0.15;
  const trend = index % 2 === 0 ? 1 : -1;
  const baseValue = 50 + (index * 10);
  
  if (type === "bar" || type === "line" || type === "area") {
    if (lowerTitle.includes("over") || lowerTitle.includes("time") || lowerTitle.includes("year") ||
        lowerTitle.includes("ao longo") || lowerTitle.includes("tempo") || lowerTitle.includes("ano")) {
      
      const years = index % 2 === 0 ? 5 : 7;
      const startYear = currentYear - years + 1;
      
      return Array.from({ length: years }, (_, i) => {
        const yearValue = baseValue + (trend * i * 10) + (Math.sin((i/years) * Math.PI * 2) * baseValue * volatility);
        const prevYearValue = baseValue + (trend * (i-1) * 10) + (Math.sin(((i-1)/years) * Math.PI * 2) * baseValue * volatility);
        
        return {
          year: `${startYear + i}`,
          value: Math.max(5, Math.round(yearValue)),
          previousValue: i > 0 ? Math.max(5, Math.round(prevYearValue)) : null
        };
      });
    }
    
    if (lowerTitle.includes("comparison") || lowerTitle.includes("vs") || lowerTitle.includes("versus") ||
        lowerTitle.includes("comparação")) {
      
      let categories: string[] = [];
      
      if (lowerTitle.includes("energy") || lowerTitle.includes("energia")) {
        categories = isPortuguese 
          ? ["Solar", "Eólica", "Hidroelétrica", "Biomassa", "Geotérmica"] 
          : ["Solar", "Wind", "Hydro", "Biomass", "Geothermal"];
      } else if (lowerTitle.includes("sector") || lowerTitle.includes("setor")) {
        categories = isPortuguese 
          ? ["Indústria", "Serviços", "Transporte", "Agricultura", "Residencial"] 
          : ["Industry", "Services", "Transport", "Agriculture", "Residential"];
      } else if (lowerTitle.includes("tech") || lowerTitle.includes("tecnologia")) {
        categories = isPortuguese 
          ? ["IA", "Blockchain", "IoT", "Robótica", "Computação Quântica"] 
          : ["AI", "Blockchain", "IoT", "Robotics", "Quantum Computing"];
      } else {
        categories = isPortuguese 
          ? ["Categoria A", "Categoria B", "Categoria C", "Categoria D", "Categoria E"] 
          : ["Category A", "Category B", "Category C", "Category D", "Category E"];
      }
      
      const numCategories = 3 + (index % 3);
      const selectedCategories = categories.slice(0, numCategories);
      
      return selectedCategories.map((cat, i) => {
        const currentValue = baseValue + (Math.random() * baseValue * volatility) - (baseValue * volatility / 2) + (i * 5 * trend);
        const previousValue = currentValue * (0.7 + Math.random() * 0.6);
        
        return {
          name: cat,
          current: Math.max(5, Math.round(currentValue)),
          previous: Math.max(5, Math.round(previousValue))
        };
      });
    }
    
    if (lowerTitle.includes("funding") || lowerTitle.includes("investment") ||
        lowerTitle.includes("financiamento") || lowerTitle.includes("investimento")) {
      
      const years = 5 + (index % 3);
      const startYear = currentYear - years + 1;
      const startValue = 5 + (index % 5);
      const growthPattern = index % 3;
      
      return Array.from({ length: years }, (_, i) => {
        let value;
        if (growthPattern === 0) {
          value = startValue + (i * 0.8);
        } else if (growthPattern === 1) {
          value = startValue + (i * i * 0.2);
        } else {
          value = startValue + (i * 0.7) + (Math.sin(i * 1.5) * 1.5);
        }
        
        return {
          year: `${startYear + i}`,
          value: Number(value.toFixed(1)),
          name: `${isPortuguese ? "Ano" : "Year"} ${startYear + i}`
        };
      });
    }
    
    if (lowerTitle.includes("region") || lowerTitle.includes("location") ||
        lowerTitle.includes("região") || lowerTitle.includes("localização")) {
      
      const regions = isPortuguese 
        ? [
            { id: "norte", name: "Norte" }, 
            { id: "centro", name: "Centro" }, 
            { id: "lisboa", name: "Lisboa" }, 
            { id: "alentejo", name: "Alentejo" },
            { id: "algarve", name: "Algarve" },
            { id: "madeira", name: "Madeira" },
            { id: "acores", name: "Açores" }
          ]
        : [
            { id: "north", name: "North" }, 
            { id: "central", name: "Central" }, 
            { id: "lisbon", name: "Lisbon" }, 
            { id: "south", name: "South" },
            { id: "islands", name: "Islands" }
          ];
      
      const numRegions = 4 + (index % 4);
      const selectedRegions = regions.slice(0, numRegions);
      
      return selectedRegions.map(region => {
        let value;
        if (region.id === "lisboa" || region.id === "lisbon") {
          value = baseValue + 20 + (Math.random() * 10);
        } else if (region.id === "norte" || region.id === "north") {
          value = baseValue + 10 + (Math.random() * 10);
        } else if (region.id === "madeira" || region.id === "acores" || region.id === "islands") {
          value = baseValue - 10 + (Math.random() * 10);
        } else {
          value = baseValue + (Math.random() * 20) - 10;
        }
        
        return {
          name: region.name,
          value: Math.max(5, Math.round(value))
        };
      });
    }
    
    const numCategories = 4 + (index % 4);
    return Array.from({ length: numCategories }, (_, i) => ({
      name: `${isPortuguese ? "Categoria" : "Category"} ${i + 1}`,
      value: Math.floor(baseValue + (Math.random() * baseValue * volatility) - (baseValue * volatility / 2) + (i * 3 * trend))
    }));
  }
  
  if (type === "pie") {
    const isDistribution = lowerTitle.includes("sector") || lowerTitle.includes("distribution") ||
                          lowerTitle.includes("setor") || lowerTitle.includes("distribuição");
    
    const categories = [];
    
    if (isDistribution) {
      if (lowerTitle.includes("energy") || lowerTitle.includes("energia")) {
        categories.push(
          { id: "solar", name: isPortuguese ? "Solar" : "Solar" },
          { id: "wind", name: isPortuguese ? "Eólica" : "Wind" },
          { id: "hydro", name: isPortuguese ? "Hidrelétrica" : "Hydro" },
          { id: "biomass", name: isPortuguese ? "Biomassa" : "Biomass" },
          { id: "geo", name: isPortuguese ? "Geotérmica" : "Geothermal" }
        );
      } else if (lowerTitle.includes("tech") || lowerTitle.includes("tecnologia")) {
        categories.push(
          { id: "ict", name: isPortuguese ? "TIC" : "ICT" },
          { id: "health", name: isPortuguese ? "Saúde" : "Healthcare" },
          { id: "energy", name: isPortuguese ? "Energia" : "Energy" },
          { id: "manuf", name: isPortuguese ? "Manufatura" : "Manufacturing" },
          { id: "other", name: isPortuguese ? "Outros" : "Other" }
        );
      } else if (lowerTitle.includes("funding") || lowerTitle.includes("financiamento")) {
        categories.push(
          { id: "gov", name: isPortuguese ? "Governo" : "Government" },
          { id: "private", name: isPortuguese ? "Privado" : "Private" },
          { id: "eu", name: isPortuguese ? "UE" : "EU" },
          { id: "intl", name: isPortuguese ? "Internacional" : "International" },
          { id: "academic", name: isPortuguese ? "Acadêmico" : "Academic" }
        );
      } else {
        categories.push(
          { id: "a", name: isPortuguese ? "Categoria A" : "Category A" },
          { id: "b", name: isPortuguese ? "Categoria B" : "Category B" },
          { id: "c", name: isPortuguese ? "Categoria C" : "Category C" },
          { id: "d", name: isPortuguese ? "Categoria D" : "Category D" },
          { id: "e", name: isPortuguese ? "Categoria E" : "Category E" }
        );
      }
    } else {
      categories.push(
        { id: "a", name: isPortuguese ? "Tipo A" : "Type A" },
        { id: "b", name: isPortuguese ? "Tipo B" : "Type B" },
        { id: "c", name: isPortuguese ? "Tipo C" : "Type C" },
        { id: "d", name: isPortuguese ? "Tipo D" : "Type D" },
        { id: "e", name: isPortuguese ? "Tipo E" : "Type E" }
      );
    }
    
    const numEntries = 3 + (index % 3);
    const selectedCategories = categories.slice(0, numEntries);
    
    const totalValue = 100;
    let remainingValue = totalValue;
    
    return selectedCategories.map((cat, i) => {
      let value;
      if (i === selectedCategories.length - 1) {
        value = remainingValue;
      } else {
        const shareBase = totalValue / selectedCategories.length;
        const variation = shareBase * volatility;
        value = Math.round(shareBase + (Math.random() * variation * 2) - variation);
        remainingValue -= value;
      }
      
      return {
        name: cat.name,
        value: Math.max(1, value)
      };
    });
  }
  
  if (type === "radar") {
    const attributes = [];
    
    if (lowerTitle.includes("performance") || lowerTitle.includes("desempenho")) {
      attributes.push(
        isPortuguese ? "Eficiência" : "Efficiency",
        isPortuguese ? "Custo" : "Cost",
        isPortuguese ? "Sustentabilidade" : "Sustainability",
        isPortuguese ? "Escalabilidade" : "Scalability",
        isPortuguese ? "Inovação" : "Innovation"
      );
    } else if (lowerTitle.includes("impact") || lowerTitle.includes("impacto")) {
      attributes.push(
        isPortuguese ? "Econômico" : "Economic",
        isPortuguese ? "Social" : "Social",
        isPortuguese ? "Ambiental" : "Environmental",
        isPortuguese ? "Político" : "Political",
        isPortuguese ? "Tecnológico" : "Technological"
      );
    } else if (lowerTitle.includes("comparison") || lowerTitle.includes("comparação")) {
      if (lowerTitle.includes("energy") || lowerTitle.includes("energia")) {
        attributes.push(
          isPortuguese ? "Custo" : "Cost",
          isPortuguese ? "Eficiência" : "Efficiency",
          isPortuguese ? "Emissões" : "Emissions",
          isPortuguese ? "Disponibilidade" : "Availability",
          isPortuguese ? "Maturidade" : "Maturity"
        );
      } else {
        attributes.push(
          isPortuguese ? "Atributo A" : "Attribute A",
          isPortuguese ? "Atributo B" : "Attribute B",
          isPortuguese ? "Atributo C" : "Attribute C",
          isPortuguese ? "Atributo D" : "Attribute D",
          isPortuguese ? "Atributo E" : "Attribute E"
        );
      }
    } else {
      attributes.push(
        isPortuguese ? "Atributo A" : "Attribute A",
        isPortuguese ? "Atributo B" : "Attribute B",
        isPortuguese ? "Atributo C" : "Attribute C",
        isPortuguese ? "Atributo D" : "Attribute D",
        isPortuguese ? "Atributo E" : "Attribute E"
      );
    }
    
    const numAttributes = 4 + (index % 3);
    const selectedAttributes = attributes.slice(0, numAttributes);
    
    const subjectA = { name: isPortuguese ? "Atual" : "Current" };
    const subjectB = { name: isPortuguese ? "Anterior" : "Previous" };
    
    selectedAttributes.forEach(attr => {
      const valueA = Math.round(baseValue + (Math.random() * baseValue * volatility) - (baseValue * volatility / 2));
      const valueB = Math.round(valueA * (0.6 + Math.random() * 0.5));
      
      subjectA[attr] = Math.max(5, valueA);
      subjectB[attr] = Math.max(5, valueB);
    });
    
    return [subjectA, subjectB];
  }
  
  if (type === "scatter") {
    const numPoints = 15 + (index % 11);
    const xLabel = isPortuguese ? "Valor X" : "X Value";
    const yLabel = isPortuguese ? "Valor Y" : "Y Value";
    const zLabel = isPortuguese ? "Tamanho" : "Size";
    
    const correlationType = index % 3;
    
    return Array.from({ length: numPoints }, (_, i) => {
      const xBase = 10 + (i * 5);
      const xNoise = 10 * volatility;
      const x = xBase + (Math.random() * xNoise * 2) - xNoise;
      
      let y;
      if (correlationType === 0) {
        y = (x * 1.5) + (Math.random() * 20) - 10;
      } else if (correlationType === 1) {
        y = (100 - x) + (Math.random() * 20) - 10;
      } else {
        y = Math.random() * 100;
      }
      
      const z = 10 + Math.random() * 20;
      
      return {
        x: Math.max(1, Math.round(x)),
        y: Math.max(1, Math.round(y)),
        z: Math.round(z),
        name: `${isPortuguese ? "Ponto" : "Point"} ${i+1}`
      };
    });
  }
  
  return Array.from({ length: 5 }, (_, i) => ({
    name: `${isPortuguese ? "Item" : "Item"} ${i + 1}`,
    value: Math.floor(Math.random() * 100) + 10
  }));
};

interface ReportVisualizerProps {
  visualization: VisualizationData;
  height?: number;
}

export const ReportVisualizer = ({ visualization, height = 300 }: ReportVisualizerProps) => {
  const { type, title, data } = visualization;
  const { language } = useLanguage();
  
  const renderVisualization = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS[0]} name={title} />
              {data[0]?.previousValue !== undefined && (
                <Bar dataKey="previousValue" fill={COLORS[1]} name={language === 'pt' ? "Ano Anterior" : "Previous Year"} />
              )}
              {data[0]?.current !== undefined && (
                <Bar dataKey="current" fill={COLORS[0]} name={language === 'pt' ? "Atual" : "Current"} />
              )}
              {data[0]?.previous !== undefined && (
                <Bar dataKey="previous" fill={COLORS[1]} name={language === 'pt' ? "Anterior" : "Previous"} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={COLORS[0]} name={title} />
              {data[0]?.previousValue !== undefined && (
                <Line type="monotone" dataKey="previousValue" stroke={COLORS[1]} name={language === 'pt' ? "Ano Anterior" : "Previous Year"} />
              )}
              {data[0]?.current !== undefined && (
                <Line type="monotone" dataKey="current" stroke={COLORS[0]} name={language === 'pt' ? "Atual" : "Current"} />
              )}
              {data[0]?.previous !== undefined && (
                <Line type="monotone" dataKey="previous" stroke={COLORS[1]} name={language === 'pt' ? "Anterior" : "Previous"} />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill={COLORS[0]}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, title]} />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" fill={COLORS[0]} stroke={COLORS[0]} name={title} />
              {data[0]?.previousValue !== undefined && (
                <Area type="monotone" dataKey="previousValue" fill={COLORS[1]} stroke={COLORS[1]} name={language === 'pt' ? "Ano Anterior" : "Previous Year"} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case "radar":
        const dataKeys = Object.keys(data[0]).filter(key => key !== "name");
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart cx="50%" cy="50%" outerRadius={80} data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              {dataKeys.map((key, index) => (
                <Radar 
                  key={`radar-${index}`}
                  name={key} 
                  dataKey={key} 
                  stroke={COLORS[index % COLORS.length]} 
                  fill={COLORS[index % COLORS.length]} 
                  fillOpacity={0.6} 
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name={language === 'pt' ? "Valor X" : "X Value"} />
              <YAxis type="number" dataKey="y" name={language === 'pt' ? "Valor Y" : "Y Value"} />
              <ZAxis type="number" dataKey="z" range={[60, 400]} name={language === 'pt' ? "Tamanho" : "Size"} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name={title} data={data} fill={COLORS[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>{language === 'pt' ? "Tipo de visualização não suportado" : "Unsupported visualization type"}</div>;
    }
  };
  
  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {renderVisualization()}
    </div>
  );
};
