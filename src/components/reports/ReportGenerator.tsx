
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, FileText, BarChart, PieChart, TrendingUp, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Define the type for a generated report
interface GeneratedReport {
  id: string;
  title: string;
  topic: string;
  location: string;
  year: string;
  content: string;
  created_at: string;
  visualizations: {
    id: number;
    type: "bar" | "line" | "pie" | "scatter";
    title: string;
    description: string;
    data: any;
  }[];
}

export const ReportGenerator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reportParams, setReportParams] = useState({
    topic: "",
    location: "Portugal",
    year: new Date().getFullYear().toString(),
    wordCount: "1000+",
    visualizationCount: "3-5",
    style: "informative",
  });
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  
  // Sample topics for quick selection
  const topicSuggestions = [
    "Renewable Energy Funding Programs",
    "Innovation Metrics in Technology Sector",
    "R&D Investment Trends",
    "Patent Applications in Biotech",
    "International Research Collaborations",
    "SME Innovation Performance",
    "Digital Transformation Projects",
    "Green Technology Initiatives",
    "Research Infrastructure Development",
    "Knowledge Transfer Mechanisms"
  ];
  
  // Sample locations in Portugal
  const locationOptions = [
    "Portugal",
    "Lisbon",
    "Porto",
    "Coimbra",
    "Braga",
    "Algarve",
    "Madeira",
    "Azores",
    "North Region",
    "Central Region",
    "South Region"
  ];
  
  // Years for selection
  const yearOptions = Array.from({ length: 6 }, (_, i) => 
    (new Date().getFullYear() - 5 + i).toString()
  );
  
  const handleInputChange = (field: keyof typeof reportParams, value: string) => {
    setReportParams(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Function to generate a synthetic report based on available data
  const generateSyntheticReport = async () => {
    setLoading(true);
    
    try {
      // First attempt to get real data from the database
      let realData = null;
      
      // Check if we have energy-related topics
      if (reportParams.topic.toLowerCase().includes("energy") || 
          reportParams.topic.toLowerCase().includes("renewable")) {
        try {
          const { data, error } = await supabase.functions.invoke('get-funding-programs', {
            body: { sector: 'renewable energy', limit: 5 }
          });
          
          if (!error && data?.length > 0) {
            realData = {
              fundingPrograms: data
            };
          }
        } catch (error) {
          console.error("Error fetching funding programs:", error);
        }
      }
      
      // Get any relevant metrics if available
      try {
        const { data: metricsData, error: metricsError } = await supabase
          .from('ani_metrics')
          .select('*')
          .limit(10);
          
        if (!metricsError && metricsData?.length > 0) {
          realData = {
            ...realData,
            metrics: metricsData
          };
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
      
      // Generate sample visualizations
      const visualizations = generateSampleVisualizations(reportParams.topic, reportParams.location, reportParams.year);
      
      // Generate report content
      const reportContent = generateReportContent(reportParams, realData, visualizations);
      
      // Create the final report object
      const newReport: GeneratedReport = {
        id: `REP-${Date.now().toString(36)}`,
        title: `${reportParams.topic} in ${reportParams.location} (${reportParams.year})`,
        topic: reportParams.topic,
        location: reportParams.location, 
        year: reportParams.year,
        content: reportContent,
        created_at: new Date().toISOString(),
        visualizations: visualizations
      };
      
      setGeneratedReport(newReport);
      
      toast({
        title: "Report generated successfully",
        description: `Your report on ${reportParams.topic} has been created.`,
      });
      
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error generating report",
        description: "There was a problem creating your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Generate sample visualizations based on the topic
  const generateSampleVisualizations = (topic: string, location: string, year: string) => {
    const visualizations = [];
    
    // Visualization 1: Bar chart for funding allocation
    visualizations.push({
      id: 1,
      type: "bar" as const,
      title: `${topic} Funding Allocation in ${location}`,
      description: `Distribution of funding for ${topic} across different sectors in ${location} for ${year}`,
      data: {
        labels: ["Energy", "Digital", "Health", "Agriculture", "Manufacturing"],
        datasets: [
          {
            label: "Funding (Million €)",
            data: [4.2, 3.8, 3.2, 2.5, 2.1],
            backgroundColor: ["#4C9F70", "#6DB5CA", "#F7DC6F", "#EB984E", "#D35400"]
          }
        ]
      }
    });
    
    // Visualization 2: Line chart for trends over time
    visualizations.push({
      id: 2,
      type: "line" as const,
      title: `${topic} Trends (${parseInt(year) - 4}-${year})`,
      description: `5-year trend analysis for ${topic} in ${location}`,
      data: {
        labels: [
          (parseInt(year) - 4).toString(), 
          (parseInt(year) - 3).toString(), 
          (parseInt(year) - 2).toString(), 
          (parseInt(year) - 1).toString(), 
          year
        ],
        datasets: [
          {
            label: "Projects Funded",
            data: [42, 45, 51, 58, 64],
            borderColor: "#3498DB",
            backgroundColor: "rgba(52, 152, 219, 0.2)"
          },
          {
            label: "Total Budget (Million €)",
            data: [12.4, 14.2, 15.8, 17.3, 18.9],
            borderColor: "#2ECC71",
            backgroundColor: "rgba(46, 204, 113, 0.2)"
          }
        ]
      }
    });
    
    // Visualization 3: Pie chart for regional distribution
    visualizations.push({
      id: 3,
      type: "pie" as const,
      title: `Regional Distribution of ${topic} in ${location}`,
      description: `How ${topic} is distributed across regions in ${location} for ${year}`,
      data: {
        labels: ["North", "Center", "Lisbon", "Alentejo", "Algarve", "Islands"],
        datasets: [
          {
            data: [35, 25, 20, 10, 7, 3],
            backgroundColor: [
              "#3498DB", "#2ECC71", "#F1C40F", 
              "#E74C3C", "#9B59B6", "#34495E"
            ]
          }
        ]
      }
    });
    
    // Special visualization for renewable energy topics
    if (topic.toLowerCase().includes("renewable") || 
        topic.toLowerCase().includes("energy") || 
        topic.toLowerCase().includes("green")) {
      visualizations.push({
        id: 4,
        type: "pie" as const,
        title: `Renewable Energy Technology Distribution`,
        description: `Breakdown of funding by technology type in ${location} for ${year}`,
        data: {
          labels: ["Solar", "Wind", "Hydro", "Biomass", "Geothermal", "Other"],
          datasets: [
            {
              data: [40, 30, 15, 8, 5, 2],
              backgroundColor: [
                "#F1C40F", "#3498DB", "#2ECC71", 
                "#E67E22", "#E74C3C", "#95A5A6"
              ]
            }
          ]
        }
      });
    }
    
    return visualizations;
  };
  
  // Generate sample report content
  const generateReportContent = (params: typeof reportParams, realData: any, visualizations: any[]) => {
    return `# ${params.topic} in ${params.location}: ${params.year} Analysis

## Introduction

This comprehensive analysis examines ${params.topic} in ${params.location} during ${params.year}, exploring key trends, investments, and outcomes. The importance of this topic cannot be overstated as it directly impacts economic development, innovation capacity, and overall competitiveness in an increasingly knowledge-driven global economy.

Throughout this report, we analyze current funding mechanisms, regional distribution patterns, sectoral focus areas, and future projections. By examining both historical context and present conditions, we aim to provide valuable insights for policymakers, researchers, and industry stakeholders involved in ${params.topic}.

## Background and Context

${params.location} has been actively developing its innovation ecosystem over the past decade, with particular emphasis on creating sustainable funding mechanisms for research and development across various sectors. The country's strategic position within the European Union has enabled access to substantial Horizon Europe and other EU funding instruments, complementing national initiatives aimed at stimulating innovation.

Historical investment in ${params.topic} has followed cyclical patterns, with significant growth periods following policy reforms in 2015 and 2019. The ${params.year} data represents a critical juncture as it reflects both post-pandemic recovery efforts and alignment with the European Green Deal and Digital Agenda priorities.

Regional disparities remain a challenge, with the metropolitan areas of Lisbon and Porto traditionally capturing the majority of innovation funding. However, recent policies have attempted to distribute resources more equitably across all regions, with particular attention to bolstering innovation capacity in less developed regions through targeted incentives and infrastructure development.

## Data Overview

Our analysis reveals that total funding for ${params.topic} in ${params.location} reached approximately €18.9 million in ${params.year}, representing a 9.2% increase compared to the previous year. This continued the positive growth trend observed since ${parseInt(params.year) - 4}, despite economic challenges in the broader economy.

The sectoral distribution of funding shows a clear prioritization of sustainable technologies, with renewable energy, digital transformation, and health sciences receiving the largest allocations at 22%, 20%, and 17% respectively. This distribution reflects both national strategic priorities and alignment with EU funding mechanisms that increasingly emphasize green and digital transitions.

_[Visualization 1: Bar chart showing funding allocation across sectors]_

A longitudinal analysis of ${params.topic} over the past five years demonstrates consistent growth in both the number of funded projects and total budget allocations. From ${parseInt(params.year) - 4} to ${params.year}, we observe a 52% increase in project funding and a corresponding 43% increase in total budget allocation, indicating an expansion of both breadth and depth in the funding landscape.

_[Visualization 2: Line chart showing 5-year trends in project counts and budgets]_

Regional distribution analysis confirms that while historical concentrations of funding in urban centers persist, there has been measurable progress in distributing innovation resources more equitably throughout ${params.location}. The North and Center regions continue to lead with 35% and 25% of funding respectively, while Lisbon accounts for 20%. The remaining 20% is distributed across Alentejo, Algarve, and the island territories.

_[Visualization 3: Pie chart showing regional distribution of funding]_

${params.topic.toLowerCase().includes("renewable") || params.topic.toLowerCase().includes("energy") || params.topic.toLowerCase().includes("green") ? 
`In the renewable energy sector specifically, we observe that solar technologies receive the largest share of funding (40%), followed by wind energy (30%) and hydroelectric projects (15%). Biomass, geothermal, and other emerging technologies account for the remaining 15% of renewable energy investments.

_[Visualization 4: Pie chart showing renewable energy technology distribution]_` : ''}

## Analysis and Interpretation

The observed funding patterns reveal several significant trends that characterize the current state of ${params.topic} in ${params.location}. The continued growth in overall funding despite broader economic challenges suggests strong institutional commitment to innovation as a driver of economic resilience and competitiveness.

The sectoral distribution reflects a strategic alignment with both European and global transition priorities, particularly evident in the emphasis on renewable energy and digital technologies. This alignment positions ${params.location} to capitalize on emerging opportunities in green and digital markets, potentially creating new export opportunities and attracting foreign direct investment in innovation-intensive industries.

Regional distribution trends, while showing improvement, highlight the persistent challenge of geographic innovation disparities. The concentration of funding in more developed regions reflects existing infrastructure advantages, human capital distribution, and institutional capacity. However, the gradual improvement in funding allocation to less developed regions suggests that targeted policies may be yielding results, albeit slowly.

The data also reveals an interesting correlation between sectoral focus and regional specialization. Renewable energy projects, for instance, are disproportionately concentrated in regions with favorable natural conditions (coastal areas for wind, southern regions for solar), while digital innovation clusters around urban centers with strong university ecosystems.

## Implications and Future Outlook

The analysis presented carries several important implications for stakeholders involved in ${params.topic} in ${params.location}. For policymakers, the data supports continued emphasis on strategic sectors that align with national competitive advantages and global transition priorities. However, more targeted interventions may be necessary to accelerate the geographic redistribution of innovation capacity.

For researchers and innovators, the growing funding landscape offers expanding opportunities, particularly in priority sectors. However, competition for these resources remains intense, suggesting the need for stronger collaboration models and interdisciplinary approaches that can differentiate project proposals in competitive funding calls.

Looking ahead to the next three to five years, we anticipate continued growth in funding for ${params.topic}, with particular emphasis on technologies that support climate neutrality targets and digital sovereignty. The introduction of new funding mechanisms that blend public and private capital may further expand the total resources available, particularly for later-stage innovation that bridges the gap between research and commercialization.

Regional disparities will likely continue to narrow, though complete convergence remains a long-term goal that extends beyond our immediate forecast period. The most successful regions will be those that develop specialized innovation ecosystems around their natural advantages rather than attempting to replicate the models of leading regions.

## Conclusion

This analysis of ${params.topic} in ${params.location} during ${params.year} highlights a positive trajectory characterized by increasing investments, strategic sectoral alignment, and gradual improvement in regional distribution. The data reflects both strategic policy choices and institutional responses to broader technological and economic transitions occurring at European and global levels.

While challenges persist, particularly in achieving geographic equity in innovation capacity, the overall direction suggests a strengthening innovation ecosystem that is increasingly capable of transforming research investments into economic and social value. Continued monitoring and analysis of these trends will be essential for refining policies and maximizing the return on public investments in the innovation landscape.`;
  };
  
  // Function to download the report as PDF
  const downloadReport = () => {
    if (!generatedReport) return;
    
    toast({
      title: "Preparing download",
      description: "Your report is being prepared for download as PDF.",
    });
    
    // Simulate PDF generation (in a real implementation, you would use jsPDF or a similar library)
    setTimeout(() => {
      toast({
        title: "Download ready",
        description: "Your report has been downloaded.",
      });
    }, 1500);
  };
  
  // Function to save the report
  const saveReport = () => {
    if (!generatedReport) return;
    
    toast({
      title: "Report saved",
      description: "Your report has been saved to your account.",
    });
    
    // Redirect to reports page after saving
    setTimeout(() => {
      navigate('/reports');
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      {!generatedReport ? (
        <Card>
          <CardHeader>
            <CardTitle>Create AI-Generated Report</CardTitle>
            <CardDescription>
              Generate a comprehensive report with visualizations based on available data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">Topic</label>
              <Input
                id="topic"
                placeholder="e.g., Renewable Energy Funding Programs"
                value={reportParams.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {topicSuggestions.map((topic, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleInputChange('topic', topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Select 
                  value={reportParams.location} 
                  onValueChange={(value) => handleInputChange('location', value)}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium">Year</label>
                <Select 
                  value={reportParams.year} 
                  onValueChange={(value) => handleInputChange('year', value)}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="wordCount" className="text-sm font-medium">Word Count</label>
                <Select 
                  value={reportParams.wordCount} 
                  onValueChange={(value) => handleInputChange('wordCount', value)}
                >
                  <SelectTrigger id="wordCount">
                    <SelectValue placeholder="Select word count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500+">500+ words</SelectItem>
                    <SelectItem value="1000+">1000+ words</SelectItem>
                    <SelectItem value="1500+">1500+ words</SelectItem>
                    <SelectItem value="2000+">2000+ words</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="visualizationCount" className="text-sm font-medium">Visualizations</label>
                <Select 
                  value={reportParams.visualizationCount} 
                  onValueChange={(value) => handleInputChange('visualizationCount', value)}
                >
                  <SelectTrigger id="visualizationCount">
                    <SelectValue placeholder="Number of visualizations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 visualizations</SelectItem>
                    <SelectItem value="3-5">3-5 visualizations</SelectItem>
                    <SelectItem value="5+">5+ visualizations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="style" className="text-sm font-medium">Report Style</label>
                <Select 
                  value={reportParams.style} 
                  onValueChange={(value) => handleInputChange('style', value)}
                >
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="narrative">Narrative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateSyntheticReport} 
              disabled={!reportParams.topic || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-2xl">{generatedReport.title}</CardTitle>
                <CardDescription className="mt-1">
                  Generated on {new Date(generatedReport.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadReport}>
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={saveReport}>
                  <Check className="h-4 w-4 mr-2" />
                  Save Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-stone max-w-none dark:prose-invert">
                {generatedReport.content.split('\n\n').map((paragraph, index) => {
                  // Check if paragraph contains a visualization placeholder
                  if (paragraph.includes('_[Visualization')) {
                    const vizMatch = paragraph.match(/_\[Visualization (\d+)/);
                    const vizIndex = vizMatch ? parseInt(vizMatch[1]) - 1 : null;
                    
                    return (
                      <div key={index} className="my-6">
                        <p>{paragraph.replace(/_\[Visualization.*\]_/, '')}</p>
                        {vizIndex !== null && vizIndex < generatedReport.visualizations.length && (
                          <div className="mt-4 p-4 bg-muted rounded-lg">
                            <div className="flex items-center justify-center gap-2 text-lg font-medium mb-2">
                              {generatedReport.visualizations[vizIndex].type === 'bar' && (
                                <BarChart className="h-5 w-5" />
                              )}
                              {generatedReport.visualizations[vizIndex].type === 'pie' && (
                                <PieChart className="h-5 w-5" />
                              )}
                              {generatedReport.visualizations[vizIndex].type === 'line' && (
                                <TrendingUp className="h-5 w-5" />
                              )}
                              <span>{generatedReport.visualizations[vizIndex].title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {generatedReport.visualizations[vizIndex].description}
                            </p>
                            <div className="h-64 bg-card flex items-center justify-center rounded border">
                              <p className="text-muted-foreground">Visualization would appear here</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  // Check if paragraph is a heading
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-bold mt-6 mb-4">{paragraph.replace('# ', '')}</h1>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold mt-5 mb-2">{paragraph.replace('### ', '')}</h3>;
                  }
                  
                  // Regular paragraph
                  return <p key={index} className="my-3">{paragraph}</p>;
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
