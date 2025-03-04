
import { Calendar, BarChart2, FileText, Activity, TrendingUp } from "lucide-react";

interface DataCardProps {
  title: string;
  value: string | number;
  category?: string;
  date?: string;
  trend?: 'up' | 'down' | 'neutral';
  percentChange?: number;
  chartData?: number[];
  isGrid: boolean;
}

export const DataCard = ({ 
  title, 
  value, 
  category,
  date,
  trend,
  percentChange,
  chartData,
  isGrid 
}: DataCardProps) => {
  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch(trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const renderMiniChart = (data?: number[]) => {
    if (!data || data.length < 2) return null;
    
    // Simple mini sparkline visualization
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="flex items-end h-10 gap-0.5 mt-2">
        {data.map((value, index) => {
          const height = range > 0 ? ((value - min) / range) * 100 : 50;
          return (
            <div 
              key={index}
              className="w-1.5 bg-blue-500 rounded-sm"
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`group animate-fade-in bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isGrid ? "flex flex-col" : "flex items-start"
      }`}
    >
      <div
        className={`flex-1 p-4 ${
          isGrid ? "" : "flex items-start justify-between w-full gap-4"
        }`}
      >
        <div className={isGrid ? "mb-3" : "flex-1"}>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
              {title}
            </h3>
            {trend && (
              <div className={`flex items-center gap-1 ${getTrendColor(trend)}`}>
                {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
                 trend === 'down' ? <Activity className="h-4 w-4 transform rotate-180" /> : 
                 <Activity className="h-4 w-4" />}
                {percentChange !== undefined && <span>{percentChange}%</span>}
              </div>
            )}
          </div>
          
          <div className="mt-2 text-2xl font-semibold">
            {value}
          </div>
          
          {category && (
            <div className="mt-2 text-sm text-gray-600">
              {category}
            </div>
          )}
          
          {chartData && renderMiniChart(chartData)}
        </div>

        <div
          className={`flex items-center gap-4 text-sm text-gray-500 ${
            isGrid ? "mt-2" : ""
          }`}
        >
          {date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
