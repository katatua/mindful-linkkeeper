
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from "recharts";
import { ArrowLeft, Download, Calendar, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

const MetricDetailsPage = () => {
  const { metricId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [metricData, setMetricData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching data
    const fetchMetricData = async () => {
      setIsLoading(true);
      
      // In a real application, this would be an API call
      setTimeout(() => {
        const data = getMetricDataById(metricId);
        setMetricData(data);
        setIsLoading(false);
      }, 500);
    };
    
    fetchMetricData();
  }, [metricId]);
  
  // Simulate data for each metric
  const getMetricDataById = (id: string | undefined) => {
    // Map of metric data based on ID
    const metricsData: Record<string, any> = {
      'active-projects': {
        title: t('dashboard.metrics.active'),
        value: 134,
        trend: 'up',
        percentChange: 12,
        category: "Project Monitoring",
        description: t('metrics.active.description'),
        historicalData: [
          { month: 'Jan', value: 90 },
          { month: 'Feb', value: 95 },
          { month: 'Mar', value: 100 },
          { month: 'Apr', value: 105 },
          { month: 'May', value: 110 },
          { month: 'Jun', value: 115 },
          { month: 'Jul', value: 120 },
          { month: 'Aug', value: 125 },
          { month: 'Sep', value: 130 },
          { month: 'Oct', value: 134 },
        ],
        distributionData: [
          { name: 'AI & ML', value: 45 },
          { name: 'Clean Tech', value: 30 },
          { name: 'Biotech', value: 25 },
          { name: 'Digital', value: 20 },
          { name: 'Other', value: 14 },
        ],
        relatedMetrics: ['investment', 'startups', 'collaborations'],
        chartType: 'line'
      },
      'investment': {
        title: t('dashboard.metrics.investment'),
        value: "€24.7M",
        trend: 'up',
        percentChange: 8,
        category: "Financial",
        description: t('metrics.investment.description'),
        historicalData: [
          { month: 'Jan', value: 10 },
          { month: 'Feb', value: 12 },
          { month: 'Mar', value: 14 },
          { month: 'Apr', value: 16 },
          { month: 'May', value: 18 },
          { month: 'Jun', value: 20 },
          { month: 'Jul', value: 21 },
          { month: 'Aug', value: 22 },
          { month: 'Sep', value: 23 },
          { month: 'Oct', value: 24.7 },
        ],
        distributionData: [
          { name: 'Public Grants', value: 12 },
          { name: 'Private VC', value: 8 },
          { name: 'EU Programs', value: 3 },
          { name: 'Corporate', value: 1.7 },
        ],
        relatedMetrics: ['active-projects', 'patents', 'startups'],
        chartType: 'area'
      },
      'patents': {
        title: t('dashboard.metrics.patents'),
        value: 87,
        trend: 'down',
        percentChange: 3,
        category: "Intellectual Property",
        description: t('metrics.patents.description'),
        historicalData: [
          { month: 'Jan', value: 95 },
          { month: 'Feb', value: 93 },
          { month: 'Mar', value: 91 },
          { month: 'Apr', value: 90 },
          { month: 'May', value: 89 },
          { month: 'Jun', value: 88 },
          { month: 'Jul', value: 88 },
          { month: 'Aug', value: 87 },
          { month: 'Sep', value: 87 },
          { month: 'Oct', value: 87 },
        ],
        distributionData: [
          { name: 'Software', value: 35 },
          { name: 'Hardware', value: 20 },
          { name: 'Process', value: 18 },
          { name: 'Design', value: 14 },
        ],
        relatedMetrics: ['active-projects', 'investment', 'ai'],
        chartType: 'bar'
      },
      'startups': {
        title: t('dashboard.metrics.startups'),
        value: 56,
        trend: 'up',
        percentChange: 15,
        category: "Entrepreneurship",
        description: t('metrics.startups.description'),
        historicalData: [
          { month: 'Jan', value: 32 },
          { month: 'Feb', value: 36 },
          { month: 'Mar', value: 40 },
          { month: 'Apr', value: 44 },
          { month: 'May', value: 47 },
          { month: 'Jun', value: 50 },
          { month: 'Jul', value: 53 },
          { month: 'Aug', value: 55 },
          { month: 'Sep', value: 56 },
          { month: 'Oct', value: 56 },
        ],
        distributionData: [
          { name: 'Tech', value: 28 },
          { name: 'Health', value: 12 },
          { name: 'Climate', value: 9 },
          { name: 'Services', value: 7 },
        ],
        relatedMetrics: ['active-projects', 'investment', 'collaborations'],
        chartType: 'line'
      },
      'collaborations': {
        title: t('dashboard.metrics.collaborations'),
        value: 28,
        trend: 'up',
        percentChange: 4,
        category: "International Relations",
        description: t('metrics.collaborations.description'),
        historicalData: [
          { month: 'Jan', value: 22 },
          { month: 'Feb', value: 23 },
          { month: 'Mar', value: 24 },
          { month: 'Apr', value: 25 },
          { month: 'May', value: 26 },
          { month: 'Jun', value: 27 },
          { month: 'Jul', value: 27 },
          { month: 'Aug', value: 28 },
          { month: 'Sep', value: 28 },
          { month: 'Oct', value: 28 },
        ],
        distributionData: [
          { name: 'EU', value: 15 },
          { name: 'Americas', value: 7 },
          { name: 'Asia', value: 4 },
          { name: 'Other', value: 2 },
        ],
        relatedMetrics: ['active-projects', 'investment', 'startups'],
        chartType: 'bar'
      },
      'ai': {
        title: t('dashboard.metrics.ai'),
        value: 72.3,
        trend: 'up',
        percentChange: 6.5,
        category: "AI & Technology",
        description: t('metrics.ai.description'),
        historicalData: [
          { month: 'Jan', value: 65 },
          { month: 'Feb', value: 66 },
          { month: 'Mar', value: 67 },
          { month: 'Apr', value: 68 },
          { month: 'May', value: 69 },
          { month: 'Jun', value: 70 },
          { month: 'Jul', value: 71 },
          { month: 'Aug', value: 71.5 },
          { month: 'Sep', value: 72 },
          { month: 'Oct', value: 72.3 },
        ],
        distributionData: [
          { name: 'ML', value: 35 },
          { name: 'NLP', value: 20 },
          { name: 'Vision', value: 10 },
          { name: 'Other', value: 7.3 },
        ],
        relatedMetrics: ['active-projects', 'investment', 'patents'],
        chartType: 'area'
      }
    };
    
    return id ? metricsData[id] : null;
  };
  
  const handleDownloadData = () => {
    toast({
      title: t('metrics.download.success'),
      description: t('metrics.download.description'),
    });
  };
  
  const handleShareMetric = () => {
    // Simulate sharing functionality
    toast({
      title: t('metrics.share.success'),
      description: t('metrics.share.description'),
    });
  };
  
  const handleGoBack = () => {
    navigate('/dashboard');
  };
  
  const renderChart = () => {
    if (!metricData || !metricData.historicalData) return null;
    
    const { historicalData, chartType } = metricData;
    
    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              name={metricData.title}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name={metricData.title} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="value" 
              fill="#8884d8" 
              stroke="#8884d8" 
              name={metricData.title}
              fillOpacity={0.3} 
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
    
    return null;
  };
  
  const renderDistributionChart = () => {
    if (!metricData || !metricData.distributionData) return null;
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={metricData.distributionData} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" name={t('metrics.distribution')} />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('metrics.back')}
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!metricData) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('metrics.back')}
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">{t('metrics.notFound')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('metrics.back')}
          </Button>
          <h1 className="text-2xl font-bold">{metricData.title}</h1>
          <Badge 
            variant={metricData.trend === 'up' ? 'default' : 'destructive'}
            className="ml-2"
          >
            {metricData.trend === 'up' ? '+' : ''}{metricData.percentChange}%
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadData}>
            <Download className="h-4 w-4 mr-1" />
            {t('metrics.download')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareMetric}>
            <Share2 className="h-4 w-4 mr-1" />
            {t('metrics.share')}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('metrics.overview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-600">{metricData.description || t('metrics.defaultDescription')}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">{t('metrics.currentValue')}</div>
              <div className="text-2xl font-bold">{metricData.value}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">{t('metrics.category')}</div>
              <div className="text-2xl font-bold">{metricData.category}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">{t('metrics.lastUpdated')}</div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">{t('metrics.historicalTrend')}</h3>
              {renderChart()}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">{t('metrics.distribution')}</h3>
              {renderDistributionChart()}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('metrics.relatedMetrics')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metricData.relatedMetrics?.map((relatedId: string) => {
              const relatedMetric = getMetricDataById(relatedId);
              if (!relatedMetric) return null;
              
              return (
                <Card 
                  key={relatedId} 
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => navigate(`/metrics/${relatedId}`)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">{relatedMetric.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">{relatedMetric.value}</div>
                    <div className="text-sm text-gray-600">{relatedMetric.category}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricDetailsPage;
