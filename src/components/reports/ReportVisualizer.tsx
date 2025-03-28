
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
  Area
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28'];

type VisualizationType = "bar" | "line" | "pie" | "area";

interface VisualizationData {
  type: VisualizationType;
  title: string;
  description: string;
  data: any[];
}

// This function extracts visualization placeholders from the text and returns
// visualization data objects with synthetic data
export const extractVisualizations = (content: string): VisualizationData[] => {
  const visualizationRegex = /Insert Visualization (\d+)\s*\((.*?):(.*?)\)/gi;
  const visualizations: VisualizationData[] = [];
  
  let match;
  while ((match = visualizationRegex.exec(content)) !== null) {
    const id = parseInt(match[1]);
    const typeStr = match[2].toLowerCase().trim();
    const title = match[3].trim();
    
    // Determine visualization type
    let type: VisualizationType = "bar";
    if (typeStr.includes("line")) {
      type = "line";
    } else if (typeStr.includes("pie")) {
      type = "pie";
    } else if (typeStr.includes("area")) {
      type = "area";
    }
    
    // Generate synthetic data based on the title and type
    const data = generateDataForVisualization(type, title);
    
    visualizations.push({
      type,
      title,
      description: match[0],
      data
    });
  }
  
  return visualizations;
};

// Generate appropriate synthetic data based on the visualization type and title
const generateDataForVisualization = (type: VisualizationType, title: string): any[] => {
  const currentYear = new Date().getFullYear();
  
  if (type === "bar" || type === "line" || type === "area") {
    if (title.toLowerCase().includes("over") && title.toLowerCase().includes("year")) {
      // Time series data
      return Array.from({ length: 5 }, (_, i) => ({
        year: `${currentYear - 4 + i}`,
        value: Math.floor(Math.random() * 100) + 50,
        previousValue: Math.floor(Math.random() * 80) + 40
      }));
    }
    
    if (title.toLowerCase().includes("vs") || title.toLowerCase().includes("versus")) {
      // Comparison data
      const categories = ["Research", "Development", "Innovation", "Patents", "Startups"];
      return categories.map(cat => ({
        name: cat,
        current: Math.floor(Math.random() * 100) + 50,
        previous: Math.floor(Math.random() * 80) + 40
      }));
    }
    
    // Default time or category-based data
    if (title.toLowerCase().includes("funding") || title.toLowerCase().includes("investment")) {
      return Array.from({ length: 5 }, (_, i) => ({
        year: `${currentYear - 4 + i}`,
        value: (Math.random() * 10 + 5).toFixed(1),
        name: `Year ${currentYear - 4 + i}`
      }));
    }
    
    // Regional data
    if (title.toLowerCase().includes("region") || title.toLowerCase().includes("location")) {
      return [
        { name: "North", value: Math.floor(Math.random() * 30) + 10 },
        { name: "Central", value: Math.floor(Math.random() * 30) + 20 },
        { name: "Lisbon", value: Math.floor(Math.random() * 40) + 30 },
        { name: "South", value: Math.floor(Math.random() * 20) + 10 },
        { name: "Islands", value: Math.floor(Math.random() * 15) + 5 }
      ];
    }
    
    // Generic categories
    return Array.from({ length: 5 }, (_, i) => ({
      name: `Category ${i + 1}`,
      value: Math.floor(Math.random() * 100) + 20
    }));
  }
  
  if (type === "pie") {
    // Generate sectors or categories for pie charts
    const categories = [];
    
    if (title.toLowerCase().includes("sector") || title.toLowerCase().includes("distribution")) {
      categories.push(
        { name: "ICT", value: Math.floor(Math.random() * 30) + 15 },
        { name: "Healthcare", value: Math.floor(Math.random() * 25) + 10 },
        { name: "Energy", value: Math.floor(Math.random() * 20) + 10 },
        { name: "Manufacturing", value: Math.floor(Math.random() * 15) + 5 },
        { name: "Other", value: Math.floor(Math.random() * 10) + 5 }
      );
    } else {
      categories.push(
        { name: "Category A", value: Math.floor(Math.random() * 40) + 20 },
        { name: "Category B", value: Math.floor(Math.random() * 30) + 15 },
        { name: "Category C", value: Math.floor(Math.random() * 20) + 10 },
        { name: "Category D", value: Math.floor(Math.random() * 10) + 5 }
      );
    }
    
    return categories;
  }
  
  // Default fallback data
  return Array.from({ length: 5 }, (_, i) => ({
    name: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 100) + 10
  }));
};

interface ReportVisualizerProps {
  visualization: VisualizationData;
  height?: number;
}

export const ReportVisualizer = ({ visualization, height = 300 }: ReportVisualizerProps) => {
  const { type, title, data } = visualization;
  
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
              <Bar dataKey="value" fill="#8884d8" name={title} />
              {data[0]?.previousValue !== undefined && (
                <Bar dataKey="previousValue" fill="#82ca9d" name="Previous Year" />
              )}
              {data[0]?.current !== undefined && (
                <Bar dataKey="current" fill="#8884d8" name="Current" />
              )}
              {data[0]?.previous !== undefined && (
                <Bar dataKey="previous" fill="#82ca9d" name="Previous" />
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
              <Line type="monotone" dataKey="value" stroke="#8884d8" name={title} />
              {data[0]?.previousValue !== undefined && (
                <Line type="monotone" dataKey="previousValue" stroke="#82ca9d" name="Previous Year" />
              )}
              {data[0]?.current !== undefined && (
                <Line type="monotone" dataKey="current" stroke="#8884d8" name="Current" />
              )}
              {data[0]?.previous !== undefined && (
                <Line type="monotone" dataKey="previous" stroke="#82ca9d" name="Previous" />
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
                fill="#8884d8"
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
              <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" name={title} />
              {data[0]?.previousValue !== undefined && (
                <Area type="monotone" dataKey="previousValue" fill="#82ca9d" stroke="#82ca9d" name="Previous Year" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Unsupported visualization type</div>;
    }
  };
  
  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {renderVisualization()}
    </div>
  );
};
