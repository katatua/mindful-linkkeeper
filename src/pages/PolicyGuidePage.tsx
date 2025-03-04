
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Bookmark, FileText, BookOpen, Lightbulb, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";

const PolicyGuidePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Guide downloaded",
      description: "The policy guide has been downloaded successfully.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="w-fit" 
            onClick={() => navigate('/policies')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Policies
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Policy Implementation Guide</h1>
            <p className="text-gray-500 mt-1">A comprehensive resource for innovation policy stakeholders</p>
          </div>
          
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Full Guide
          </Button>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Guide</CardTitle>
                <CardDescription>Purpose and structure of the policy implementation guide</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  This comprehensive guide is designed to support policymakers, innovation agencies, 
                  research institutions, and industry partners in effectively implementing Portugal's 
                  innovation policy framework. It provides practical guidance, tools, case studies, 
                  and best practices for maximizing the impact of innovation policies.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">Guide Contents</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span>Strategic policy frameworks overview</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span>Implementation roadmaps and checklists</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span>Governance and coordination models</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span>Monitoring, evaluation and impact assessment</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-medium">Key Benefits</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Accelerate policy implementation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Improve stakeholder coordination</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Enhance policy outcomes and impact</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Foster evidence-based decision making</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Policy Framework Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">
                  This guide connects to existing strategic frameworks and provides practical tools for implementation across various policy domains.
                </p>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">National Innovation Strategy</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Comprehensive vision for Portugal's innovation ecosystem development through 2030.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/frameworks/FRAMEWORK-002')}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Framework
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Portugal 2030</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Strategic funding and development framework aligned with EU priorities.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/frameworks/FRAMEWORK-001')}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Framework
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Horizon Europe</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      European research and innovation framework programme (2021-2027).
                    </p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/frameworks/FRAMEWORK-003')}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Framework
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="implementation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Process</CardTitle>
                <CardDescription>Step-by-step guidance for effective policy implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pb-6">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 z-0"></div>
                  <div className="space-y-8">
                    <div className="relative pl-12">
                      <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center z-10">
                        <span className="font-medium text-blue-600">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Policy Assessment & Alignment</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Evaluate existing policy landscape and align new initiatives with strategic frameworks and regional priorities.
                        </p>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm">
                          <strong>Tools:</strong> Policy Mapping Template, Alignment Assessment Checklist
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative pl-12">
                      <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center z-10">
                        <span className="font-medium text-blue-600">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Stakeholder Engagement</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Identify and engage key stakeholders across government, industry, academia, and civil society.
                        </p>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm">
                          <strong>Tools:</strong> Stakeholder Mapping Matrix, Consultation Planning Guide
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative pl-12">
                      <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center z-10">
                        <span className="font-medium text-blue-600">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Action Planning & Resource Allocation</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Develop detailed implementation plans with clear responsibilities, timelines, and resource requirements.
                        </p>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm">
                          <strong>Tools:</strong> Implementation Roadmap Template, Resource Planning Toolkit
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative pl-12">
                      <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center z-10">
                        <span className="font-medium text-blue-600">4</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Governance & Coordination</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Establish effective governance structures and coordination mechanisms for policy implementation.
                        </p>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm">
                          <strong>Tools:</strong> Governance Model Templates, Cross-Agency Coordination Framework
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative pl-12">
                      <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center z-10">
                        <span className="font-medium text-blue-600">5</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Monitoring & Evaluation</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Implement robust monitoring frameworks and evaluation processes to track progress and impact.
                        </p>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm">
                          <strong>Tools:</strong> KPI Framework, Impact Assessment Methodology
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="best-practices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Practices & Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-green-50">
                    <h3 className="font-medium mb-2">Policy Design</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Design policies based on evidence and stakeholder input</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Ensure flexibility to adapt to changing market conditions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Consider long-term sustainability beyond funding periods</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-medium mb-2">Implementation</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Adopt agile implementation approaches with regular reviews</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Establish clear roles and responsibilities across agencies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Develop simplified processes to reduce administrative burden</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-purple-50">
                    <h3 className="font-medium mb-2">Stakeholder Engagement</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Maintain continuous dialogue throughout implementation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Create multi-stakeholder platforms for collaboration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Leverage existing networks and communities of practice</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-yellow-50">
                    <h3 className="font-medium mb-2">Monitoring & Evaluation</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Establish baseline data before implementation begins</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Implement real-time monitoring for adaptive management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Include both quantitative and qualitative indicators</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="case-studies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Studies</CardTitle>
                <CardDescription>Real-world examples of successful policy implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-blue-50 p-4 border-b">
                      <h3 className="font-medium">Digital Innovation Hub Network</h3>
                      <p className="text-sm text-blue-700">Success factors in establishing Portugal's network of DIHs</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3">
                        Portugal successfully established a network of Digital Innovation Hubs to accelerate
                        industry digitalization. This case study examines the implementation process,
                        governance model, and impact on SME digital transformation.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Implementation Period:</strong> 2019-2022
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Budget:</strong> €15 million
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Stakeholders:</strong> 35+ organizations
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Read Full Case Study
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-green-50 p-4 border-b">
                      <h3 className="font-medium">Collaborative Laboratory Program</h3>
                      <p className="text-sm text-green-700">Building effective public-private research partnerships</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3">
                        This case study examines the implementation of the CoLAB program, which
                        created new institutional arrangements for research-industry collaboration.
                        It explores governance mechanisms, funding structures, and impact measurement.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Implementation Period:</strong> 2017-2021
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Budget:</strong> €100 million
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Stakeholders:</strong> 40+ organizations
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Read Full Case Study
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-purple-50 p-4 border-b">
                      <h3 className="font-medium">Regional Innovation Strategy Coordination</h3>
                      <p className="text-sm text-purple-700">Aligning national and regional innovation priorities</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3">
                        This case study explores how Portugal implemented a multi-level governance
                        approach to coordinate national innovation policy with regional smart
                        specialization strategies, enhancing policy coherence and impact.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Implementation Period:</strong> 2020-2022
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Regions:</strong> 7 regions
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <strong>Stakeholders:</strong> 100+ organizations
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Read Full Case Study
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PolicyGuidePage;
