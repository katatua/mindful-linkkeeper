
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Share2, Calendar, FileText, Clock, BarChart2, ClipboardCheck, Users, Building, Globe, Award } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PolicyDetailPage = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Sample policy data - in a real app, this would be fetched from an API
  const policy = {
    id: policyId,
    title: policyId === "POL-2023-001" ? "Digital Innovation Incentives" : 
           policyId === "POL-2023-002" ? "R&D Tax Credit Enhancement" :
           policyId === "POL-2023-003" ? "Startup Ecosystem Support" :
           policyId === "POL-2023-004" ? "Academia-Industry Collaboration" :
           policyId === "POL-2022-015" ? "Green Innovation Initiatives" :
           policyId === "POL-2022-012" ? "International Innovation Partnerships" : "Unknown Policy",
    description: "This policy aims to promote and support innovation across various sectors in Portugal, with a focus on digital transformation, sustainability, and international collaboration.",
    status: policyId?.includes("001") || policyId?.includes("002") || policyId?.includes("003") ? "Active" :
            policyId?.includes("004") ? "Pending Review" : "Under Revision",
    category: policyId === "POL-2023-001" ? "Digital Transformation" : 
              policyId === "POL-2023-002" ? "R&D Funding" :
              policyId === "POL-2023-003" ? "Entrepreneurship" :
              policyId === "POL-2023-004" ? "Knowledge Transfer" :
              policyId === "POL-2022-015" ? "Sustainability" : "International Relations",
    effectiveDate: "Jan 15, 2023",
    reviewDate: "Jan 15, 2024",
    framework: "ENEI 2030",
    objectives: [
      "Accelerate digital transformation across Portuguese industries",
      "Increase R&D investment as a percentage of GDP",
      "Enhance knowledge transfer between academia and industry",
      "Support the growth of innovative startups and scaleups",
      "Promote sustainable innovation practices"
    ],
    keyMeasures: [
      "Tax incentives for R&D investments",
      "Grants for digital innovation projects",
      "Support for industry-academia collaboration initiatives",
      "Financing for innovation infrastructure",
      "Regulatory sandboxes for innovative solutions"
    ],
    implementationTimeline: [
      { phase: "Initial Rollout", date: "Q1 2023", status: "Completed" },
      { phase: "Mid-term Review", date: "Q3 2023", status: "In Progress" },
      { phase: "Full Implementation", date: "Q1 2024", status: "Planned" },
      { phase: "Impact Assessment", date: "Q4 2024", status: "Planned" }
    ],
    metrics: [
      { name: "R&D Expenditure", target: "3% of GDP by 2025", current: "1.8% of GDP" },
      { name: "Digital Adoption Index", target: "85% by 2024", current: "72%" },
      { name: "Industry-Academia Projects", target: "500 by 2024", current: "327" },
      { name: "New Startups Created", target: "1000 per year", current: "780 per year" }
    ],
    stakeholders: [
      { name: "Ministry of Economy", role: "Policy Owner" },
      { name: "ANI", role: "Implementation Lead" },
      { name: "IAPMEI", role: "SME Support" },
      { name: "FCT", role: "Academic Research" },
      { name: "Industry Associations", role: "Industry Engagement" }
    ],
    relatedPolicies: [
      "National Strategy for AI",
      "Startup Portugal+",
      "Digital Transition Action Plan",
      "Research & Innovation Framework"
    ]
  };

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = () => {
    toast({
      title: "Policy document downloaded",
      description: `${policy.title} has been downloaded successfully.`,
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
            <h1 className="text-2xl font-bold">{policy.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={
                policy.status === 'Active' ? 'default' : 
                policy.status === 'Under Revision' ? 'outline' : 
                'secondary'
              }>
                {policy.status}
              </Badge>
              <span className="text-sm text-gray-500">ID: {policy.id}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Category</span>
              </div>
              <p className="text-sm">{policy.category}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Effective Date</span>
              </div>
              <p className="text-sm">{policy.effectiveDate}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Next Review</span>
              </div>
              <p className="text-sm">{policy.reviewDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="metrics">Metrics & Impact</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{policy.description}</p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {policy.objectives.map((objective, index) => (
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
            
            <Card>
              <CardHeader>
                <CardTitle>Key Measures</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {policy.keyMeasures.map((measure, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ClipboardCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{measure}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Related Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {policy.relatedPolicies.map((relatedPolicy, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100">
                    {relatedPolicy}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="implementation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-2.5 top-0 h-full w-0.5 bg-gray-200"></div>
                <div className="space-y-8">
                  {policy.implementationTimeline.map((phase, index) => (
                    <div key={index} className="relative pl-10">
                      <div className={`absolute left-0 top-0 h-5 w-5 rounded-full ${
                        phase.status === 'Completed' ? 'bg-green-500' :
                        phase.status === 'In Progress' ? 'bg-blue-500' :
                        'bg-gray-300'
                      } flex items-center justify-center`}>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="font-medium">{phase.phase}</h3>
                          <p className="text-sm text-gray-500">{phase.date}</p>
                        </div>
                        <Badge className={
                          phase.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          phase.status === 'In Progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                          'bg-gray-100 text-gray-800 hover:bg-gray-100'
                        }>
                          {phase.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Framework Integration</CardTitle>
              <CardDescription>How this policy integrates with broader innovation frameworks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Framework: {policy.framework}</h3>
                </div>
                <p className="text-sm text-gray-700">
                  This policy is aligned with the {policy.framework} strategic objectives, 
                  particularly in areas of digital transformation, research excellence, 
                  and innovation ecosystem development.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-1">Alignment with EU Horizon Europe</h3>
                  <p className="text-sm text-gray-600">
                    Ensures compatibility with EU funding mechanisms and strategic priorities
                  </p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-1">National Innovation Strategy</h3>
                  <p className="text-sm text-gray-600">
                    Contributes to Portugal's national innovation goals and smart specialization strategy
                  </p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium mb-1">Regional Development Plans</h3>
                  <p className="text-sm text-gray-600">
                    Supports balanced regional innovation development across Portugal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Metrics to measure policy effectiveness and impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policy.metrics.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                      <h3 className="font-medium">{metric.name}</h3>
                      <Badge variant="outline" className="mt-1 md:mt-0">Target: {metric.target}</Badge>
                    </div>
                    <div className="bg-gray-100 h-2 rounded-full w-full mb-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: metric.current.includes('%') ? metric.current : '60%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Current: {metric.current}</span>
                      <span>{metric.name.includes('Expenditure') ? '3% of GDP' : 
                             metric.name.includes('Index') ? '100%' :
                             metric.name.includes('Projects') ? '500' : '1000'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expected Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Economic Impact</h3>
                  </div>
                  <ul className="space-y-2 pl-5 list-disc text-sm">
                    <li>+2.5% GDP growth contribution</li>
                    <li>15,000 new innovation jobs</li>
                    <li>€500M additional R&D investment</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Industrial Impact</h3>
                  </div>
                  <ul className="space-y-2 pl-5 list-disc text-sm">
                    <li>30% increase in digital adoption</li>
                    <li>200 new innovative products</li>
                    <li>50% more industry-academia projects</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">Social Impact</h3>
                  </div>
                  <ul className="space-y-2 pl-5 list-disc text-sm">
                    <li>Enhanced digital skills development</li>
                    <li>More balanced regional innovation</li>
                    <li>Improved innovation inclusivity</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stakeholders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Stakeholders</CardTitle>
              <CardDescription>Organizations involved in policy implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policy.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="flex items-start gap-3 border rounded-lg p-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{stakeholder.name}</h3>
                      <p className="text-sm text-gray-600">{stakeholder.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Participation & Feedback</CardTitle>
              <CardDescription>How stakeholders can engage with policy implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Public Consultation</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Stakeholders can provide feedback on policy implementation through public consultation channels.
                  </p>
                  <Button variant="outline" size="sm">
                    Participate in Consultation
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Implementation Working Groups</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Join working groups focused on specific aspects of policy implementation.
                  </p>
                  <Button variant="outline" size="sm">
                    View Working Groups
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Impact Assessment Participation</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Contribute to measuring the policy impact by providing data and case studies.
                  </p>
                  <Button variant="outline" size="sm">
                    Submit Case Study
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PolicyDetailPage;
