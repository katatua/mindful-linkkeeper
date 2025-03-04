
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Plus } from "lucide-react";
import { ProjectList } from "@/components/ProjectList";
import { ProjectMetrics } from "@/components/ProjectMetrics";
import { useProjectData } from "@/hooks/useProjectData";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { projects, metrics, isLoading } = useProjectData();
  
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Innovation Projects</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> New Project
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {!isLoading && <ProjectMetrics metrics={metrics} />}
          <ProjectList projects={filteredProjects} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="active">
          <ProjectList 
            projects={filteredProjects.filter(p => p.status === 'Active')} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <ProjectList 
            projects={filteredProjects.filter(p => p.status === 'Completed')} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="pending">
          <ProjectList 
            projects={filteredProjects.filter(p => p.status === 'Pending')} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
