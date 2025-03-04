
import { Calendar, BarChart2, FileText, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface DataCardProps {
  title: string;
  value: string | number;
  category?: string;
  date?: string;
  trend?: 'up' | 'down' | 'neutral';
  percentChange?: number;
  chartData?: number[];
  isGrid: boolean;
  icon?: string;
  description?: string;
  footer?: string;
}

export const DataCard = ({ 
  title, 
  value, 
  category,
  date,
  trend,
  percentChange,
  chartData,
  isGrid,
  icon,
  description,
  footer
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
      <div className="flex items-end h-12 gap-0.5 mt-3">
        {data.map((value, index) => {
          const height = range > 0 ? ((value - min) / range) * 100 : 50;
          return (
            <div 
              key={index}
              className={`w-1.5 ${index === data.length - 1 ? 'bg-blue-600' : 'bg-blue-400'} rounded-sm transition-all duration-200 hover:bg-blue-700`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    );
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconMap: Record<string, JSX.Element> = {
      'chart': <BarChart2 className="h-5 w-5 text-blue-500" />,
      'calendar': <Calendar className="h-5 w-5 text-indigo-500" />,
      'file': <FileText className="h-5 w-5 text-emerald-500" />,
      'activity': <Activity className="h-5 w-5 text-purple-500" />
    };
    
    return iconMap[icon] || null;
  };

  return (
    <Card className="group animate-fade-in overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {renderIcon()}
            <CardTitle className="text-base font-medium">{title}</CardTitle>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 ${getTrendColor(trend)}`}>
              {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
               trend === 'down' ? <TrendingDown className="h-4 w-4" /> : 
               <Activity className="h-4 w-4" />}
              {percentChange !== undefined && <span className="text-sm font-medium">{percentChange}%</span>}
            </div>
          )}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <CardContent>
        <div className="mt-1 text-2xl font-bold">{value}</div>
        
        {category && (
          <div className="mt-1 text-sm text-gray-600">
            {category}
          </div>
        )}
        
        {chartData && renderMiniChart(chartData)}
      </CardContent>
      
      {(date || footer) && (
        <CardFooter className="pt-0 text-sm text-gray-500">
          {date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{date}</span>
            </div>
          )}
          {footer && <div className="ml-auto">{footer}</div>}
        </CardFooter>
      )}
    </Card>
  );
};
