
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Eye, ArrowUpRight, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface PolicyListProps {
  searchQuery: string;
}

export const PolicyList = ({ searchQuery }: PolicyListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [policyToDownload, setPolicyToDownload] = useState<string | null>(null);
  
  // Sample data for policies
  const policies = [
    {
      id: "POL-2023-001",
      title: "Digital Innovation Incentives",
      description: "Policy framework for incentivizing digital transformation and innovation across sectors.",
      category: "Digital Transformation",
      status: "Active",
      effectiveDate: "Jan 15, 2023",
      reviewDate: "Jan 15, 2024",
      framework: "ENEI 2030"
    },
    {
      id: "POL-2023-002",
      title: "R&D Tax Credit Enhancement",
      description: "Extended tax benefits for companies investing in research and development activities.",
      category: "R&D Funding",
      status: "Active",
      effectiveDate: "Mar 1, 2023",
      reviewDate: "Mar 1, 2024",
      framework: "ENEI 2030"
    },
    {
      id: "POL-2023-003",
      title: "Startup Ecosystem Support",
      description: "Comprehensive policy for nurturing the startup ecosystem and entrepreneurship.",
      category: "Entrepreneurship",
      status: "Active",
      effectiveDate: "Feb 10, 2023",
      reviewDate: "Feb 10, 2024",
      framework: "Startup Portugal+"
    },
    {
      id: "POL-2023-004",
      title: "Academia-Industry Collaboration",
      description: "Framework for enhancing knowledge transfer between academic institutions and industry.",
      category: "Knowledge Transfer",
      status: "Pending Review",
      effectiveDate: "Apr 5, 2023",
      reviewDate: "Jul 30, 2023",
      framework: "ENEI 2030"
    },
    {
      id: "POL-2022-015",
      title: "Green Innovation Initiatives",
      description: "Policy measures to promote and support sustainable and environmental innovation.",
      category: "Sustainability",
      status: "Under Revision",
      effectiveDate: "Nov 20, 2022",
      reviewDate: "Aug 15, 2023",
      framework: "Green Deal Portugal"
    },
    {
      id: "POL-2022-012",
      title: "International Innovation Partnerships",
      description: "Guidelines for establishing and maintaining international innovation collaborations.",
      category: "International Relations",
      status: "Active",
      effectiveDate: "Oct 1, 2022",
      reviewDate: "Oct 1, 2023",
      framework: "EU Partnership Program"
    }
  ];
  
  const filteredPolicies = policies.filter(policy => 
    policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.framework.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPolicy = (policyId: string) => {
    navigate(`/policies/${policyId}`);
  };

  const handleDownloadPolicy = (policyId: string) => {
    toast({
      title: "Policy PDF downloaded",
      description: `Policy ${policyId} has been downloaded successfully.`,
    });
    setPolicyToDownload(null);
  };

  if (filteredPolicies.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No policies found matching your criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPolicies.map((policy) => (
        <Card key={policy.id} className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-medium">{policy.title}</CardTitle>
              <Badge variant={
                policy.status === 'Active' ? 'default' : 
                policy.status === 'Under Revision' ? 'outline' : 
                'secondary'
              }>
                {policy.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{policy.description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <FileText className="h-4 w-4" />
                <span>Category: {policy.category}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Effective: {policy.effectiveDate}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Review: {policy.reviewDate}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between items-center">
            <span className="text-xs text-gray-500">Framework: {policy.framework}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleViewPolicy(policy.id)}>
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>
              <Dialog open={policyToDownload === policy.id} onOpenChange={(open) => {
                if (!open) setPolicyToDownload(null);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setPolicyToDownload(policy.id)}
                  >
                    <Download className="h-4 w-4 mr-1" /> PDF
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Download Policy PDF</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p>Are you sure you want to download the PDF for {policy.title}?</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setPolicyToDownload(null)}>Cancel</Button>
                    <Button onClick={() => handleDownloadPolicy(policy.id)}>Download</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" onClick={() => handleViewPolicy(policy.id)}>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
