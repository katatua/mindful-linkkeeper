
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowUpRight, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export const PolicyFrameworks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  
  const frameworks = [
    {
      id: "FRAMEWORK-001",
      title: "Portugal 2030",
      type: "National Strategy",
      description: "Strategic framework for Portugal's economic, social and territorial development policies for 2021-2027.",
      keyAreas: ["Smart Growth", "Green Transition", "Social Inclusion", "Territorial Cohesion"],
      funds: "€23 billion"
    },
    {
      id: "FRAMEWORK-002",
      title: "National Innovation Strategy",
      type: "National Framework",
      description: "Strategic framework focused on improving Portugal's innovation ecosystem and performance.",
      keyAreas: ["R&D Intensity", "Knowledge Transfer", "Digital Innovation", "Talent Development"],
      funds: "€3.5 billion"
    },
    {
      id: "FRAMEWORK-003",
      title: "Horizon Europe",
      type: "European Framework",
      description: "The EU's key funding programme for research and innovation with a budget of €95.5 billion.",
      keyAreas: ["Excellent Science", "Global Challenges", "Innovative Europe"],
      funds: "€95.5 billion (EU-wide)"
    }
  ];

  const handleViewFramework = (frameworkId: string) => {
    navigate(`/frameworks/${frameworkId}`);
  };

  const handleDownloadFramework = (frameworkId: string) => {
    toast({
      title: "Framework PDF downloaded",
      description: `Framework documentation has been downloaded successfully.`,
    });
    setSelectedFramework(null);
  };

  return (
    <div className="space-y-6">
      {frameworks.map((framework, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mb-2">
                  {framework.type}
                </div>
                <CardTitle>{framework.title}</CardTitle>
                <CardDescription className="mt-2">
                  {framework.description}
                </CardDescription>
              </div>
              <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {framework.funds}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Key Focus Areas:</h4>
              <div className="flex flex-wrap gap-2">
                {framework.keyAreas.map((area, i) => (
                  <span key={i} className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex gap-2 w-full justify-between">
              <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => handleViewFramework(framework.id)}>
                View Framework Details
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
              
              <Dialog open={selectedFramework === framework.id} onOpenChange={(open) => {
                if (!open) setSelectedFramework(null);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedFramework(framework.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download Framework
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Download Framework Documentation</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p>Are you sure you want to download the documentation for {framework.title}?</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setSelectedFramework(null)}>Cancel</Button>
                    <Button onClick={() => handleDownloadFramework(framework.id)}>Download</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardFooter>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Policy Alignment Matrix</CardTitle>
          <CardDescription>
            How Portuguese innovation policies align with major framework objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2 text-left text-sm">Policy Area</th>
                  <th className="border px-4 py-2 text-left text-sm">Portugal 2030</th>
                  <th className="border px-4 py-2 text-left text-sm">National Innovation Strategy</th>
                  <th className="border px-4 py-2 text-left text-sm">Horizon Europe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 text-sm font-medium">R&D Investment</td>
                  <td className="border px-4 py-2 text-sm text-green-600">High</td>
                  <td className="border px-4 py-2 text-sm text-green-600">Very High</td>
                  <td className="border px-4 py-2 text-sm text-green-600">High</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm font-medium">Digital Transformation</td>
                  <td className="border px-4 py-2 text-sm text-green-600">High</td>
                  <td className="border px-4 py-2 text-sm text-green-600">High</td>
                  <td className="border px-4 py-2 text-sm text-yellow-600">Medium</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm font-medium">Entrepreneurship</td>
                  <td className="border px-4 py-2 text-sm text-green-600">Medium</td>
                  <td className="border px-4 py-2 text-sm text-green-600">High</td>
                  <td className="border px-4 py-2 text-sm text-green-600">Medium</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm font-medium">Sustainability</td>
                  <td className="border px-4 py-2 text-sm text-green-600">Very High</td>
                  <td className="border px-4 py-2 text-sm text-yellow-600">Medium</td>
                  <td className="border px-4 py-2 text-sm text-green-600">Very High</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-sm font-medium">Social Innovation</td>
                  <td className="border px-4 py-2 text-sm text-green-600">High</td>
                  <td className="border px-4 py-2 text-sm text-yellow-600">Low</td>
                  <td className="border px-4 py-2 text-sm text-green-600">Medium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            Download Full Matrix
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
