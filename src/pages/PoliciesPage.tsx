import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Calendar, ArrowUpRight, Filter, Book, Flag, BarChart2, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PolicyList } from "@/components/policies/PolicyList";
import { PolicyImpact } from "@/components/policies/PolicyImpact";
import { PolicyFrameworks } from "@/components/policies/PolicyFrameworks";

const PoliciesPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const keyPolicies = [
    {
      title: "Strategy Portugal 2030",
      description: "National innovation strategy framework for the decade",
      date: "Approved: Jun 2021",
      category: "National Strategy"
    },
    {
      title: "Interface Programme",
      description: "Promoting tech transfer between academia and industry",
      date: "Updated: Mar 2023",
      category: "Tech Transfer"
    },
    {
      title: "Startup Portugal+",
      description: "Enhanced national strategy for entrepreneurship",
      date: "Launched: Sep 2022",
      category: "Entrepreneurship"
    },
    {
      title: "Digital Transition Action Plan",
      description: "Framework for Portugal's digital transformation",
      date: "Updated: Jan 2023",
      category: "Digital"
    }
  ];
  
  const policyFrameworks = [
    {
      name: "Horizon Europe",
      type: "EU Framework",
      description: "European Union's key funding programme for research and innovation with a budget of €95.5 billion.",
      key_areas: ["Excellent Science", "Global Challenges", "Innovative Europe"],
      portugal_alignment: "High"
    },
    {
      name: "Portugal 2030",
      type: "National Strategy",
      description: "Strategic framework for Portugal's economic, social and territorial development policies for 2021-2027.",
      key_areas: ["Smart Growth", "Green Transition", "Social Inclusion", "Territorial Cohesion"],
      portugal_alignment: "Very High"
    },
    {
      name: "Recovery and Resilience Plan",
      type: "National Framework",
      description: "Plan supported by NextGenerationEU focusing on economic recovery, climate resilience and digital transition.",
      key_areas: ["Climate Transition", "Digital Transition", "Resilience"],
      portugal_alignment: "Very High"
    }
  ];
  
  const policyHighlights = [
    {
      title: "SIFIDE II Extension",
      description: "Tax incentives for corporate R&D activities extended until 2027",
      status: "Recently Approved",
      impact: "High",
      highlight: "Up to 82.5% of R&D expenses deductible from taxable income"
    },
    {
      title: "National Strategy for AI",
      description: "Framework for artificial intelligence development in Portugal",
      status: "In Implementation",
      impact: "High",
      highlight: "€200M investment over 5 years in AI research and applications"
    },
    {
      title: "Green Deal Portugal",
      description: "Climate neutrality and circular economy transition plan",
      status: "In Implementation",
      impact: "Medium",
      highlight: "Integration of green innovation criteria in funding programs"
    }
  ];

  const handlePolicySubmit = () => {
    toast({
      title: "Policy feedback submitted",
      description: "Thank you for your contribution to policy development.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Innovation Policies</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search policies..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> Filter
          </Button>
          <Button variant="default" size="sm">
            <FileText className="h-4 w-4 mr-1" /> Policy Guide
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Policy Overview</TabsTrigger>
          <TabsTrigger value="frameworks">Policy Frameworks</TabsTrigger>
          <TabsTrigger value="impact">Impact Assessment</TabsTrigger>
          <TabsTrigger value="consultation">Public Consultation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {keyPolicies.map((policy, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base font-medium">{policy.title}</CardTitle>
                      <CardDescription>
                        {policy.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{policy.date}</span>
                  </div>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mt-1">
                    {policy.category}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View Details
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Policy Highlights</CardTitle>
                <CardDescription>
                  Recently updated or significant innovation policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policyHighlights.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-sm">{item.title}</h3>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 mb-2">{item.description}</p>
                      <div className="bg-gray-50 p-2 rounded border-l-2 border-blue-500 text-xs">
                        Key highlight: {item.highlight}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Innovation Policy System</CardTitle>
                <CardDescription>
                  Key entities and their roles in Portugal's innovation policy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Ministério da Economia</h3>
                      <p className="text-xs text-gray-600">Primary policy formulation and strategic direction for innovation and economic development</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg bg-blue-50">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Flag className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">ANI - Agência Nacional de Inovação</h3>
                      <p className="text-xs text-gray-600">Key implementation agency for innovation policies and programs, bridging research and industry</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Book className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">FCT - Fundação para a Ciência e a Tecnologia</h3>
                      <p className="text-xs text-gray-600">Main funding agency for research and science development in Portugal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BarChart2 className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">IAPMEI - Agência para a Competitividade e Inovação</h3>
                      <p className="text-xs text-gray-600">Support agency for SMEs, focusing on competitiveness and business innovation</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <PolicyList />
        </TabsContent>
        
        <TabsContent value="frameworks">
          <div className="grid grid-cols-1 gap-6 mb-6">
            {policyFrameworks.map((framework, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mb-2">
                        {framework.type}
                      </div>
                      <CardTitle>{framework.name}</CardTitle>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Alignment: {framework.portugal_alignment}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-600 mb-4">{framework.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Key Focus Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {framework.key_areas.map((area, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View Framework Details
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <PolicyFrameworks />
        </TabsContent>
        
        <TabsContent value="impact">
          <PolicyImpact />
        </TabsContent>
        
        <TabsContent value="consultation">
          <Card>
            <CardHeader>
              <CardTitle>Public Policy Consultation</CardTitle>
              <CardDescription>
                Contribute to the development of innovation policies in Portugal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Open Consultations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-sm">AI in Public Services</h3>
                          <span className="text-xs text-orange-600 font-medium">Closing in 4 days</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Public consultation on guidelines for AI use in government services</p>
                        <Button variant="link" size="sm" className="px-0 text-xs">
                          Participate
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-sm">Green Innovation Criteria</h3>
                          <span className="text-xs text-green-600 font-medium">Closing in 21 days</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Feedback on proposed sustainability criteria for innovation funding</p>
                        <Button variant="link" size="sm" className="px-0 text-xs">
                          Participate
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-sm">Innovation Procurement</h3>
                          <span className="text-xs text-green-600 font-medium">Closing in 30 days</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Public consultation on new guidelines for innovation procurement in public sector</p>
                        <Button variant="link" size="sm" className="px-0 text-xs">
                          Participate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Innovation Policy Feedback</CardTitle>
                    <CardDescription>
                      Submit your ideas and feedback on innovation policies
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="policy-area" className="block text-sm font-medium">Policy Area</label>
                        <select id="policy-area" className="w-full p-2 border rounded-md text-sm">
                          <option value="">Select a policy area</option>
                          <option value="funding">Funding Programs</option>
                          <option value="startups">Startup Ecosystem</option>
                          <option value="digital">Digital Transformation</option>
                          <option value="sustainability">Green Innovation</option>
                          <option value="science">Science-Industry Collaboration</option>
                          <option value="talent">Talent & Skills</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="policy-title" className="block text-sm font-medium">Feedback Title</label>
                        <Input
                          id="policy-title"
                          placeholder="Concise title for your feedback or suggestion"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="policy-description" className="block text-sm font-medium">Description</label>
                        <textarea
                          id="policy-description"
                          className="w-full p-2 border rounded-md min-h-[100px] text-sm"
                          placeholder="Provide detailed information about your policy feedback, suggestion, or idea"
                        ></textarea>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="policy-impact" className="block text-sm font-medium">Expected Impact</label>
                        <textarea
                          id="policy-impact"
                          className="w-full p-2 border rounded-md min-h-[60px] text-sm"
                          placeholder="Describe the expected benefits or impact of your suggestion"
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button variant="outline" className="mr-2">
                          Cancel
                        </Button>
                        <Button onClick={handlePolicySubmit}>
                          Submit Feedback
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Policy Development Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6 relative">
                      <div className="flex">
                        <div className="flex-none w-4 h-4 rounded-full bg-blue-500 relative left-0 z-10"></div>
                        <div className="ml-4">
                          <h3 className="font-medium text-sm">1. Public Consultation</h3>
                          <p className="text-xs text-gray-600 mt-1">Gathering inputs from stakeholders, companies, and citizens on policy needs and ideas</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-none w-4 h-4 rounded-full bg-gray-200 relative left-0 z-10"></div>
                        <div className="ml-4">
                          <h3 className="font-medium text-sm">2. Policy Draft Development</h3>
                          <p className="text-xs text-gray-600 mt-1">Creating draft policies based on research, strategic objectives, and consultation feedback</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-none w-4 h-4 rounded-full bg-gray-200 relative left-0 z-10"></div>
                        <div className="ml-4">
                          <h3 className="font-medium text-sm">3. Stakeholder Review</h3>
                          <p className="text-xs text-gray-600 mt-1">Feedback from key stakeholders on draft policies before finalization</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-none w-4 h-4 rounded-full bg-gray-200 relative left-0 z-10"></div>
                        <div className="ml-4">
                          <h3 className="font-medium text-sm">4. Policy Approval</h3>
                          <p className="text-xs text-gray-600 mt-1">Official approval process through relevant government channels</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-none w-4 h-4 rounded-full bg-gray-200 relative left-0 z-10"></div>
                        <div className="ml-4">
                          <h3 className="font-medium text-sm">5. Implementation & Monitoring</h3>
                          <p className="text-xs text-gray-600 mt-1">Executing the policy with continuous performance monitoring and evaluation</p>
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

export default PoliciesPage;
