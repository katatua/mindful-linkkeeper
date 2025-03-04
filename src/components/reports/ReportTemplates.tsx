
import { ReportTemplateCard, ReportTemplateProps } from "./ReportTemplateCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Plus } from "lucide-react";

export const ReportTemplates = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    description: "",
    category: "",
  });

  const templates: ReportTemplateProps[] = [
    {
      title: "Quarterly Performance Report",
      description: "Comprehensive analysis of quarterly funding allocation and project performance",
      category: "Performance",
      lastUpdated: "Jul 5, 2023",
      usageCount: 28
    },
    {
      title: "Regional Innovation Distribution",
      description: "Geographic analysis of innovation activities and funding across regions",
      category: "Regional",
      lastUpdated: "Jun 20, 2023",
      usageCount: 15
    },
    {
      title: "Sector Analysis Report",
      description: "In-depth analysis of innovation activities by industry sector",
      category: "Sector",
      lastUpdated: "Jul 2, 2023",
      usageCount: 22
    },
    {
      title: "Funding Impact Assessment",
      description: "Evaluation of economic and innovation impact of funding programs",
      category: "Impact",
      lastUpdated: "Jun 15, 2023",
      usageCount: 17
    },
    {
      title: "Program Effectiveness Review",
      description: "Assessment of program KPIs against strategic objectives",
      category: "Performance",
      lastUpdated: "Jul 10, 2023",
      usageCount: 9
    },
    {
      title: "Innovation Ecosystem Mapping",
      description: "Comprehensive map of key innovation stakeholders and relationships",
      category: "Ecosystem",
      lastUpdated: "Jun 28, 2023",
      usageCount: 11
    }
  ];

  const handleCreateTemplate = () => {
    // Validate inputs
    if (!newTemplate.title || !newTemplate.description || !newTemplate.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to create a template",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API to save the template
    toast({
      title: "Template created",
      description: `The template "${newTemplate.title}" has been created successfully`,
    });

    // Close the dialog and reset form
    setIsDialogOpen(false);
    setNewTemplate({
      title: "",
      description: "",
      category: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Report Template</DialogTitle>
              <DialogDescription>
                Design a reusable report template that can be used to generate future reports.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Template Title</label>
                <Input
                  id="title"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                  placeholder="e.g., Monthly Performance Summary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Input
                  id="category"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                  placeholder="e.g., Performance, Regional, Financial"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  placeholder="Describe what this template will be used for..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTemplate}>
                <FileText className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <ReportTemplateCard
            key={index}
            title={template.title}
            description={template.description}
            category={template.category}
            lastUpdated={template.lastUpdated}
            usageCount={template.usageCount}
          />
        ))}
      </div>
    </div>
  );
};
