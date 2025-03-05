
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { FileCode, Download, RefreshCw, Database } from "lucide-react";
import { generateResponse } from "@/utils/aiUtils";
import { Header } from "@/components/Header";

const SyntheticDataPage = () => {
  const [dataType, setDataType] = useState("funding");
  const [rowCount, setRowCount] = useState(10);
  const [generatingData, setGeneratingData] = useState(false);
  const [generatedData, setGeneratedData] = useState("");
  const [parameters, setParameters] = useState<Record<string, any>>({
    funding: {
      minBudget: 50000,
      maxBudget: 5000000,
      startDateRange: "2024-2026",
      sectors: ["Digital", "Health", "Energy", "Manufacturing"]
    },
    projects: {
      minFunding: 10000,
      maxFunding: 1000000,
      duration: "1-3 years",
      regions: ["North", "Center", "Lisbon", "Alentejo"]
    },
    metrics: {
      categories: ["Investment", "Innovation", "Patents"],
      timePeriod: "2020-2024",
      regions: ["Portugal", "Europe"]
    }
  });
  const { toast } = useToast();

  const handleParameterChange = (dataTypeKey: string, paramKey: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [dataTypeKey]: {
        ...prev[dataTypeKey],
        [paramKey]: value
      }
    }));
  };

  const generateSyntheticData = async () => {
    setGeneratingData(true);
    
    try {
      // Construct a prompt based on the selected parameters
      const currentParams = parameters[dataType];
      let prompt = `Generate synthetic data in SQL INSERT format for ${rowCount} rows of ANI ${dataType} data with the following parameters:\n`;
      
      Object.entries(currentParams).forEach(([key, value]) => {
        prompt += `- ${key}: ${Array.isArray(value) ? value.join(", ") : value}\n`;
      });
      
      prompt += `\nThe SQL should be valid for the 'ani_${dataType === 'funding' ? 'funding_programs' : dataType}' table. Only return valid SQL INSERT statements.`;
      
      // Call AI to generate the data
      const response = await generateResponse(prompt);
      setGeneratedData(response);
      
      toast({
        title: "Data Generated",
        description: `Successfully generated ${rowCount} rows of synthetic ${dataType} data.`
      });
    } catch (error) {
      console.error("Error generating synthetic data:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate synthetic data. Please try again."
      });
    } finally {
      setGeneratingData(false);
    }
  };

  const downloadSQL = () => {
    if (!generatedData) return;
    
    const blob = new Blob([generatedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthetic_${dataType}_data.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-6">
      <Header />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Synthetic Data Generator</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Parameters
              </CardTitle>
              <CardDescription>
                Configure parameters for synthetic data generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-type">Data Type</Label>
                <Select value={dataType} onValueChange={setDataType}>
                  <SelectTrigger id="data-type">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funding">Funding Programs</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="metrics">Metrics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="row-count">Number of Rows</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="row-count"
                    value={[rowCount]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(value) => setRowCount(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{rowCount}</span>
                </div>
              </div>
              
              <Tabs defaultValue="funding" value={dataType} onValueChange={setDataType}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="funding">Funding</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="funding" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Budget Range (€)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          value={parameters.funding.minBudget}
                          onChange={(e) => handleParameterChange('funding', 'minBudget', parseInt(e.target.value))}
                          placeholder="Min Budget"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={parameters.funding.maxBudget}
                          onChange={(e) => handleParameterChange('funding', 'maxBudget', parseInt(e.target.value))}
                          placeholder="Max Budget"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Start Date Range</Label>
                    <Input
                      value={parameters.funding.startDateRange}
                      onChange={(e) => handleParameterChange('funding', 'startDateRange', e.target.value)}
                      placeholder="e.g., 2024-2026"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sectors (comma-separated)</Label>
                    <Textarea
                      value={parameters.funding.sectors.join(", ")}
                      onChange={(e) => handleParameterChange('funding', 'sectors', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="Digital, Health, Energy..."
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="projects" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Funding Range (€)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          value={parameters.projects.minFunding}
                          onChange={(e) => handleParameterChange('projects', 'minFunding', parseInt(e.target.value))}
                          placeholder="Min Funding"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={parameters.projects.maxFunding}
                          onChange={(e) => handleParameterChange('projects', 'maxFunding', parseInt(e.target.value))}
                          placeholder="Max Funding"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={parameters.projects.duration}
                      onChange={(e) => handleParameterChange('projects', 'duration', e.target.value)}
                      placeholder="e.g., 1-3 years"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Regions (comma-separated)</Label>
                    <Textarea
                      value={parameters.projects.regions.join(", ")}
                      onChange={(e) => handleParameterChange('projects', 'regions', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="North, Center, Lisbon..."
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="metrics" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Categories (comma-separated)</Label>
                    <Textarea
                      value={parameters.metrics.categories.join(", ")}
                      onChange={(e) => handleParameterChange('metrics', 'categories', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="Investment, Innovation, Patents..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Time Period</Label>
                    <Input
                      value={parameters.metrics.timePeriod}
                      onChange={(e) => handleParameterChange('metrics', 'timePeriod', e.target.value)}
                      placeholder="e.g., 2020-2024"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Regions (comma-separated)</Label>
                    <Textarea
                      value={parameters.metrics.regions.join(", ")}
                      onChange={(e) => handleParameterChange('metrics', 'regions', e.target.value.split(",").map(s => s.trim()))}
                      placeholder="Portugal, Europe..."
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={generateSyntheticData}
                disabled={generatingData}
              >
                {generatingData ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Generate Synthetic Data
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  Generated SQL
                </span>
                {generatedData && (
                  <Button variant="outline" size="sm" onClick={downloadSQL}>
                    <Download className="h-4 w-4 mr-2" />
                    Download SQL
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                SQL statements for synthetic data generation
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Textarea
                value={generatedData}
                placeholder="Generated SQL will appear here..."
                className="h-[500px] font-mono text-sm"
                readOnly
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SyntheticDataPage;
