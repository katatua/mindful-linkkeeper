import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Plus, Users, CalendarClock, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Project type definition
interface Project {
  id: string;
  title: string;
  acronym: string;
  category: string;
  status: 'Active' | 'Completed' | 'Pending';
  startDate: string;
  endDate: string;
  budget: string;
  partners: string[];
  description: string;
  progress: number;
}

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Sample projects data based on ANI's real projects
  const projects: Project[] = [
    {
      id: "1",
      title: "Advanced Manufacturing Solutions for Industry 4.0",
      acronym: "PRODUTECH",
      category: "Manufacturing",
      status: "Active",
      startDate: "2022-03-15",
      endDate: "2025-03-14",
      budget: "€3.4M",
      partners: ["INESC TEC", "Universidade do Porto", "AIMMAP", "PRODUTECH"],
      description: "Development of advanced manufacturing technologies to enhance competitiveness in Portuguese industrial sectors through digital transformation and Industry 4.0 principles.",
      progress: 65
    },
    {
      id: "2",
      title: "Sustainable Ocean Energy Technologies",
      acronym: "OCEANERGIA",
      category: "Clean Energy",
      status: "Active",
      startDate: "2023-01-10",
      endDate: "2026-01-09",
      budget: "€4.2M",
      partners: ["WavEC", "IST", "EDP", "Corpower Ocean"],
      description: "Research and development of innovative ocean energy technologies, focusing on wave energy converters and floating offshore wind platforms for the Portuguese coastal waters.",
      progress: 35
    },
    {
      id: "3",
      title: "Digital Health Innovations for Elderly Care",
      acronym: "DIGI-CARE",
      category: "Health & Biotech",
      status: "Active",
      startDate: "2021-09-01",
      endDate: "2024-08-31",
      budget: "€2.8M",
      partners: ["CINTESIS", "Universidade de Aveiro", "IPO Porto", "Fraunhofer Portugal"],
      description: "Creation of integrated digital health solutions for remote monitoring and care of elderly patients, incorporating AI diagnostics and telemedicine platforms.",
      progress: 80
    },
    {
      id: "4",
      title: "Smart Urban Mobility Solutions",
      acronym: "MOBICITY",
      category: "Sustainable Mobility",
      status: "Completed",
      startDate: "2020-06-01",
      endDate: "2023-05-31",
      budget: "€3.1M",
      partners: ["CEiiA", "Metro do Porto", "Universidade do Minho", "NOS"],
      description: "Development and implementation of integrated smart mobility solutions for urban areas, focusing on multimodal transportation, IoT infrastructure, and sustainable mobility patterns.",
      progress: 100
    },
    {
      id: "5",
      title: "AI-Powered Cybersecurity Systems",
      acronym: "SECUR-AI",
      category: "Digital Technologies",
      status: "Active",
      startDate: "2022-11-01",
      endDate: "2025-10-31",
      budget: "€3.7M",
      partners: ["INESC-ID", "Universidade de Lisboa", "S21sec", "Altice Labs"],
      description: "Development of advanced AI-based cybersecurity solutions for critical infrastructure protection, incorporating machine learning for threat detection and automated response systems.",
      progress: 45
    },
    {
      id: "6",
      title: "Green Hydrogen Production Technologies",
      acronym: "H2GREEN",
      category: "Clean Energy",
      status: "Pending",
      startDate: "2023-09-01",
      endDate: "2026-08-31",
      budget: "€5.3M",
      partners: ["LNEG", "Galp", "EDP", "IST"],
      description: "Research and development of innovative technologies for green hydrogen production, storage, and distribution, contributing to Portugal's energy transition goals.",
      progress: 0
    },
    {
      id: "7",
      title: "Next-Generation Biomedical Materials",
      acronym: "BIOMAT+",
      category: "Health & Biotech",
      status: "Completed",
      startDate: "2019-04-15",
      endDate: "2022-04-14",
      budget: "€2.5M",
      partners: ["i3S", "Universidade do Minho", "Medinfar", "CeNTI"],
      description: "Development of innovative biocompatible materials for medical applications, including drug delivery systems, tissue engineering scaffolds, and implantable devices.",
      progress: 100
    },
    {
      id: "8",
      title: "Smart Agriculture & Food Security",
      acronym: "AGRIFOOD",
      category: "Agri-food",
      status: "Active",
      startDate: "2022-05-01",
      endDate: "2025-04-30",
      budget: "€3.8M",
      partners: ["INIAV", "Universidade de Évora", "Syngenta", "Fraunhofer Portugal"],
      description: "Implementation of digital technologies and precision agriculture methods to enhance food production efficiency, quality, and sustainability in Portugal.",
      progress: 55
    }
  ];

  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.acronym.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Project metrics
  const metrics = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'Active').length,
    completedProjects: projects.filter(p => p.status === 'Completed').length,
    pendingProjects: projects.filter(p => p.status === 'Pending').length,
    totalBudget: "€28.8M",
    avgCompletion: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
  };

  const handleDownload = () => {
    toast({
      title: "Export Started",
      description: "The projects report is being downloaded.",
    });
  };

  const handleNewProject = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Project creation functionality will be available in the next update.",
    });
  };

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Innovation Projects</h1>
        
        <div className="flex flex-wrap items-center gap-2">
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
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button size="sm" onClick={handleNewProject}>
            <Plus className="h-4 w-4 mr-1" /> New Project
          </Button>
        </div>
      </div>
      
      {/* Project Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProjects}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeProjects}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedProjects}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingProjects}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBudget}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Avg. Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgCompletion}%</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Projects Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredProjects.map(project => (
            <Card key={project.id} className="group hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="flex gap-x-4 flex-wrap mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Badge variant="outline">{project.acronym}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart2 className="h-4 w-4" />
                        <span>{project.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarClock className="h-4 w-4" />
                        <span>{project.startDate.substring(0, 4)} - {project.endDate.substring(0, 4)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{project.partners.length} Partners</span>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm line-clamp-2">{project.description}</p>
                    
                    {/* Progress bar */}
                    {project.status !== 'Pending' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4 lg:mt-0">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{project.budget}</Badge>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No projects found matching your search criteria.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active">
          {filteredProjects
            .filter(p => p.status === 'Active')
            .map(project => (
              
              <Card key={project.id} className="group hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <div className="flex gap-x-4 flex-wrap mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline">{project.acronym}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart2 className="h-4 w-4" />
                          <span>{project.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarClock className="h-4 w-4" />
                          <span>{project.startDate.substring(0, 4)} - {project.endDate.substring(0, 4)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{project.partners.length} Partners</span>
                        </div>
                      </div>
                      
                      <p className="mt-2 text-sm line-clamp-2">{project.description}</p>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 lg:mt-0">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{project.budget}</Badge>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        
        <TabsContent value="completed">
          {filteredProjects
            .filter(p => p.status === 'Completed')
            .map(project => (
              
              <Card key={project.id} className="group hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <div className="flex gap-x-4 flex-wrap mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline">{project.acronym}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart2 className="h-4 w-4" />
                          <span>{project.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarClock className="h-4 w-4" />
                          <span>{project.startDate.substring(0, 4)} - {project.endDate.substring(0, 4)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{project.partners.length} Partners</span>
                        </div>
                      </div>
                      
                      <p className="mt-2 text-sm line-clamp-2">{project.description}</p>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 lg:mt-0">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{project.budget}</Badge>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        
        <TabsContent value="pending">
          {filteredProjects
            .filter(p => p.status === 'Pending')
            .map(project => (
              
              <Card key={project.id} className="group hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <div className="flex gap-x-4 flex-wrap mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline">{project.acronym}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart2 className="h-4 w-4" />
                          <span>{project.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarClock className="h-4 w-4" />
                          <span>{project.startDate.substring(0, 4)} - {project.endDate.substring(0, 4)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{project.partners.length} Partners</span>
                        </div>
                      </div>
                      
                      <p className="mt-2 text-sm line-clamp-2">{project.description}</p>
                    </div>
                    
                    <div className="flex gap-2 mt-4 lg:mt-0">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{project.budget}</Badge>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectsPage;
