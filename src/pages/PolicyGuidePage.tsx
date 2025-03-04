
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, FileText, BookOpen, CheckCircle2, Info, RefreshCcw, BarChart2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PolicyGuidePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDownload = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '/sample-policy-guide.pdf';
    link.download = 'ANI-Policy-Guide.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Guide downloaded",
      description: "Complete Policy Guide has been downloaded successfully.",
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
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Innovation Policy Guide</h1>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Guide
          </Button>
        </div>
      </div>

      <Card className="bg-blue-50">
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-1">Comprehensive Guide to Innovation Policies</h2>
              <p className="text-sm text-gray-600">This guide provides detailed information on Portugal's innovation policy framework, implementation processes, and best practices for stakeholders.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="processes">Policy Processes</TabsTrigger>
          <TabsTrigger value="bestpractices">Best Practices</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Portugal's Innovation Policy Framework</CardTitle>
              <CardDescription>Key components and objectives of the national innovation system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Strategic Pillars</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-100 p-2 rounded-full mb-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-medium mb-2">Policy Framework</h4>
                        <p className="text-sm text-gray-600">Overarching strategies and policy documents that guide the national innovation system</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-green-100 p-2 rounded-full mb-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-medium mb-2">Implementation Mechanisms</h4>
                        <p className="text-sm text-gray-600">Tools, programs and initiatives that translate policies into concrete actions</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-purple-100 p-2 rounded-full mb-3">
                          <BarChart2 className="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 className="font-medium mb-2">Monitoring & Evaluation</h4>
                        <p className="text-sm text-gray-600">Systems for tracking policy effectiveness and impact on innovation outcomes</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Key Policy Documents</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Portugal 2030</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Strategic framework for Portugal's economic, social and territorial development policies for 2021-2027.
                    </p>
                    <Button variant="outline" size="sm">View Document</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">National Innovation Strategy</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Strategic framework focused on improving Portugal's innovation ecosystem and performance.
                    </p>
                    <Button variant="outline" size="sm">View Document</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Recovery and Resilience Plan</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Plan supported by NextGenerationEU focusing on economic recovery, climate resilience and digital transition.
                    </p>
                    <Button variant="outline" size="sm">View Document</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processes">
          <Card>
            <CardHeader>
              <CardTitle>Policy Development Process</CardTitle>
              <CardDescription>Understanding how innovation policies are created, implemented and evaluated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative py-4">
                <div className="absolute left-[15px] top-0 h-full w-0.5 bg-gray-200"></div>
                <div className="space-y-8">
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Strategic Planning</h3>
                      <p className="text-sm text-gray-600">
                        Identification of priorities based on intelligence gathering, foresight exercises, and stakeholder input
                      </p>
                      <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="font-medium">Key activities:</div>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Strategic intelligence gathering</li>
                          <li>Trend analysis and foresight</li>
                          <li>Stakeholder consultations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Policy Formulation</h3>
                      <p className="text-sm text-gray-600">
                        Designing policy instruments and measures to address identified priorities and challenges
                      </p>
                      <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="font-medium">Key activities:</div>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Policy design workshops</li>
                          <li>Expert consultations</li>
                          <li>International benchmarking</li>
                          <li>Impact assessment</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Implementation</h3>
                      <p className="text-sm text-gray-600">
                        Executing policy measures through appropriate agencies, funding programs, and regulatory frameworks
                      </p>
                      <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="font-medium">Key activities:</div>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Program design and launch</li>
                          <li>Funding allocation</li>
                          <li>Governance setup</li>
                          <li>Stakeholder engagement</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      4
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Monitoring & Evaluation</h3>
                      <p className="text-sm text-gray-600">
                        Systematic tracking of policy implementation and assessment of outcomes and impacts
                      </p>
                      <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="font-medium">Key activities:</div>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>KPI tracking and reporting</li>
                          <li>Mid-term evaluations</li>
                          <li>Impact assessment studies</li>
                          <li>Stakeholder feedback</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      5
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Policy Learning & Adaptation</h3>
                      <p className="text-sm text-gray-600">
                        Using evaluation results to improve and refine policies in an iterative cycle
                      </p>
                      <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="font-medium">Key activities:</div>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Evaluation review workshops</li>
                          <li>Policy revision processes</li>
                          <li>Experimentation with new approaches</li>
                          <li>International learning exchanges</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bestpractices">
          <Card>
            <CardHeader>
              <CardTitle>Best Practices in Policy Implementation</CardTitle>
              <CardDescription>Guidance for effective innovation policy development and execution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">Evidence-Based Policy Design</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">Use robust data and research to inform policy decisions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">Conduct thorough needs assessments before designing new policies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">Benchmark against international best practices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">Develop testable hypotheses about policy effects</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <RefreshCcw className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">Adaptive & Iterative Approach</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">Design policies with flexibility for adjustments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">Use pilot programs to test policy approaches</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">Build in regular review points for course correction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">Create feedback loops with implementers and beneficiaries</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Policy Implementation Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Pre-Implementation Phase</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Stakeholder mapping and engagement plan</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Resource allocation and budgeting</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Legal and regulatory framework review</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Communication strategy development</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Implementation team formation</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Risk assessment and mitigation plan</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 mt-4">
                      <h4 className="font-medium mb-3">Implementation Phase</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Launch communication campaign</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Activate implementation governance</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Deploy monitoring systems</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Conduct regular progress reviews</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Engage with implementing partners</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <span className="text-sm">Document lessons learned</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Policy Resources & Tools</CardTitle>
              <CardDescription>Helpful resources for innovation policy stakeholders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Policy Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-medium">Policy Brief Template</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Standard format for creating concise policy briefs</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-medium">Implementation Plan Template</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Structured template for planning policy implementation</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-medium">Evaluation Framework Template</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Framework for designing policy evaluations</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Guidelines & Handbooks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-medium">Policy Design Handbook</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Comprehensive guide to designing effective innovation policies</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-medium">Stakeholder Engagement Guide</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Best practices for involving stakeholders in policy processes</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-medium">Policy Evaluation Handbook</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Guide to evaluating innovation policy effectiveness</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Tools & Calculators</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-medium">Policy Impact Calculator</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Tool for estimating potential policy impacts</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Access Tool
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-medium">Funding Allocation Modeler</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Simulation tool for policy funding allocation</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Access Tool
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-medium">KPI Dashboard Builder</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Tool for creating policy monitoring dashboards</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Access Tool
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Reference Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">International Policy References</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <a href="#" className="text-sm text-blue-600 hover:underline">OECD Innovation Policy Platform</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <a href="#" className="text-sm text-blue-600 hover:underline">EU Policy Framework for Research and Innovation</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <a href="#" className="text-sm text-blue-600 hover:underline">World Bank Innovation Policy Platform</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <a href="#" className="text-sm text-blue-600 hover:underline">WIPO Global Innovation Index</a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">National Policy References</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <a href="#" className="text-sm text-blue-600 hover:underline">Portugal 2030 Strategic Framework</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <a href="#" className="text-sm text-blue-600 hover:underline">National Innovation Strategy</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <a href="#" className="text-sm text-blue-600 hover:underline">Recovery and Resilience Plan</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <a href="#" className="text-sm text-blue-600 hover:underline">Digital Transition Action Plan</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PolicyGuidePage;
