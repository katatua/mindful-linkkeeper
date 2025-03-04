
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Share2, FileText, Building, Users, Globe, BarChart2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const FrameworkDetailPage = () => {
  const { frameworkId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Sample framework data - in a real app, this would be fetched from an API
  const framework = {
    id: frameworkId,
    title: frameworkId === "FRAMEWORK-001" ? "Portugal 2030" : 
           frameworkId === "FRAMEWORK-002" ? "National Innovation Strategy" :
           frameworkId === "FRAMEWORK-003" ? "Horizon Europe" : "Unknown Framework",
    type: frameworkId?.includes("001") ? "National Strategy" :
          frameworkId?.includes("002") ? "National Framework" : "European Framework",
    description: "This framework outlines the strategic priorities and funding mechanisms for innovation and development over the period 2021-2030.",
    funds: frameworkId === "FRAMEWORK-001" ? "€23 billion" :
           frameworkId === "FRAMEWORK-002" ? "€3.5 billion" : "€95.5 billion (EU-wide)",
    period: "2021-2030",
    keyAreas: [
      frameworkId?.includes("001") ? "Smart Growth" : "R&D Intensity",
      frameworkId?.includes("001") ? "Green Transition" : "Knowledge Transfer",
      frameworkId?.includes("001") ? "Social Inclusion" : "Digital Innovation",
      frameworkId?.includes("001") ? "Territorial Cohesion" : "Talent Development"
    ],
    objectives: [
      "Increase R&D investment to 3% of GDP by 2030",
      "Accelerate digital transformation across all sectors",
      "Enhance global competitiveness of Portuguese innovation",
      "Promote sustainable growth and development",
      "Strengthen academia-industry collaboration"
    ],
    fundingMechanisms: [
      { name: "Innovation Grants", allocation: "40%" },
      { name: "Tax Incentives", allocation: "25%" },
      { name: "Venture Capital", allocation: "15%" },
      { name: "International Cooperation", allocation: "10%" },
      { name: "Infrastructure Support", allocation: "10%" }
    ],
    governanceStructure: [
      { entity: "Framework Steering Committee", role: "Strategic Direction" },
      { entity: "Technical Evaluation Panels", role: "Project Assessment" },
      { entity: "Funding Allocation Board", role: "Resource Allocation" },
      { entity: "Monitoring & Evaluation Team", role: "Performance Tracking" }
    ],
    keyPerformanceIndicators: [
      { indicator: "R&D Intensity", target: "3% of GDP", baseline: "1.4% of GDP" },
      { indicator: "Innovation Output", target: "Top 15 in EU", baseline: "21st in EU" },
      { indicator: "Digital Economy Share", target: "25% of GDP", baseline: "19% of GDP" },
      { indicator: "Patent Applications", target: "50% increase", baseline: "1,200 per year" }
    ]
  };

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = () => {
    toast({
      title: "Framework document downloaded",
      description: `${framework.title} has been downloaded successfully.`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share options",
      description: "Sharing options dialog would appear here.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-3">
        <Button 
          variant="ghost" 
          className="w-fit" 
          onClick={() => navigate('/policies')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Policies
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">{framework.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">
                {framework.type}
              </Badge>
              <span className="text-sm text-gray-500">Period: {framework.period}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-3 md:mt-0">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Total Funding</span>
              </div>
              <p className="text-sm font-semibold">{framework.funds}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Coverage</span>
              </div>
              <p className="text-sm">{frameworkId?.includes("003") ? "European Union" : "Portugal"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Framework Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{framework.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Focus Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {framework.keyAreas.map((area, index) => (
                  <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Strategic Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {framework.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="funding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funding Allocation</CardTitle>
              <CardDescription>Distribution of funding across different mechanisms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {framework.fundingMechanisms.map((mechanism, index) => (
                  <div key={index} className="relative">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{mechanism.name}</span>
                      <span className="text-sm text-gray-500">{mechanism.allocation}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: mechanism.allocation }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Funding Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Research Institutions</h3>
                  <p className="text-sm text-gray-600">
                    Universities, research centers, and technology institutes engaged in fundamental or applied research.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Private Companies</h3>
                  <p className="text-sm text-gray-600">
                    SMEs and large enterprises with innovation-focused projects and R&D activities.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Public-Private Consortia</h3>
                  <p className="text-sm text-gray-600">
                    Collaborative projects involving both public and private entities.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Non-Profit Organizations</h3>
                  <p className="text-sm text-gray-600">
                    NGOs and foundations working on innovation in social and environmental sectors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="governance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Governance Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {framework.governanceStructure.map((entity, index) => (
                  <div key={index} className="flex items-start gap-3 border rounded-lg p-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{entity.entity}</h3>
                      <p className="text-sm text-gray-600">{entity.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Implementation Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-2.5 top-0 h-full w-0.5 bg-gray-200"></div>
                <div className="space-y-8">
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center"></div>
                    <div>
                      <h3 className="font-medium">Strategy Definition</h3>
                      <p className="text-sm text-gray-500">Setting priorities and objectives based on national and European innovation strategies.</p>
                    </div>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center"></div>
                    <div>
                      <h3 className="font-medium">Call for Proposals</h3>
                      <p className="text-sm text-gray-500">Publication of funding opportunities with detailed requirements.</p>
                    </div>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center"></div>
                    <div>
                      <h3 className="font-medium">Evaluation & Selection</h3>
                      <p className="text-sm text-gray-500">Assessment of proposals by technical panels and expert committees.</p>
                    </div>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center"></div>
                    <div>
                      <h3 className="font-medium">Implementation & Monitoring</h3>
                      <p className="text-sm text-gray-500">Project execution with regular progress monitoring and reporting.</p>
                    </div>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center"></div>
                    <div>
                      <h3 className="font-medium">Impact Assessment</h3>
                      <p className="text-sm text-gray-500">Evaluation of results against set objectives and KPIs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {framework.keyPerformanceIndicators.map((kpi, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                      <h3 className="font-medium">{kpi.indicator}</h3>
                      <Badge variant="outline" className="mt-1 md:mt-0">Target: {kpi.target}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-500">Baseline:</span>
                      <span>{kpi.baseline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expected Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Economic Impact</h3>
                  </div>
                  <ul className="space-y-2 pl-5 list-disc text-sm">
                    <li>GDP growth contribution of 1.5-2%</li>
                    <li>Creation of 50,000+ high-skilled jobs</li>
                    <li>Increased export competitiveness</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Innovation Capacity</h3>
                  </div>
                  <ul className="space-y-2 pl-5 list-disc text-sm">
                    <li>Expanded R&D infrastructure</li>
                    <li>Enhanced technology transfer</li>
                    <li>Growth in patent applications</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">Societal Benefits</h3>
                  </div>
                  <ul className="space-y-2 pl-5 list-disc text-sm">
                    <li>Digital inclusion improvements</li>
                    <li>Environmental sustainability gains</li>
                    <li>Enhanced public service delivery</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-2">Annual Progress Reports</h3>
                  <p className="text-sm text-gray-600">
                    Comprehensive annual evaluation against key metrics and targets.
                  </p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-2">Mid-term Review (2025)</h3>
                  <p className="text-sm text-gray-600">
                    Deep analysis of implementation progress and potential strategy adjustments.
                  </p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-2">Final Impact Assessment (2030)</h3>
                  <p className="text-sm text-gray-600">
                    Comprehensive evaluation of outcomes, impacts, and lessons learned.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FrameworkDetailPage;
