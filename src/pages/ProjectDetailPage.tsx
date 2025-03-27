
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Users, EuroIcon, FileText, Building, Tag, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectData } from '@/types/projectTypes';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = () => {
      setLoading(true);
      
      // In a real application, this would fetch from an API
      // For now, we'll simulate loading from the projects sample data
      setTimeout(() => {
        try {
          // Sample projects data (this should ideally be fetched from a shared source)
          const projects = [
            {
              id: "1",
              title: "Advanced Manufacturing Solutions for Industry 4.0",
              description: "Development of advanced manufacturing technologies to enhance competitiveness in Portuguese industrial sectors through digital transformation and Industry 4.0 principles.",
              status: "Active" as const,
              progress: 65,
              deadline: "2025-03-14",
              team: "INESC TEC & Partners",
              budget: "€3.4M",
              category: "Manufacturing"
            },
            {
              id: "2",
              title: "Sustainable Ocean Energy Technologies",
              description: "Research and development of innovative ocean energy technologies, focusing on wave energy converters and floating offshore wind platforms for the Portuguese coastal waters.",
              status: "Active" as const,
              progress: 35,
              deadline: "2026-01-09",
              team: "WavEC & Partners",
              budget: "€4.2M",
              category: "Clean Energy"
            },
            // Add more sample projects as needed
            {
              id: "3",
              title: "Digital Health Innovations for Elderly Care",
              description: "Creation of integrated digital health solutions for remote monitoring and care of elderly patients, incorporating AI diagnostics and telemedicine platforms.",
              status: "Active" as const,
              progress: 80,
              deadline: "2024-08-31",
              team: "CINTESIS & Partners",
              budget: "€2.8M",
              category: "Health & Biotech"
            },
            {
              id: "4",
              title: "Smart Urban Mobility Solutions",
              description: "Development and implementation of integrated smart mobility solutions for urban areas, focusing on multimodal transportation, IoT infrastructure, and sustainable mobility patterns.",
              status: "Completed" as const,
              progress: 100,
              deadline: "2023-05-31",
              team: "CEiiA & Partners",
              budget: "€3.1M",
              category: "Sustainable Mobility"
            },
            {
              id: "5",
              title: "AI-Powered Cybersecurity Systems",
              description: "Development of advanced AI-based cybersecurity solutions for critical infrastructure protection, incorporating machine learning for threat detection and automated response systems.",
              status: "Active" as const,
              progress: 45,
              deadline: "2025-10-31",
              team: "INESC-ID & Partners",
              budget: "€3.7M",
              category: "Digital Technologies"
            },
            {
              id: "6",
              title: "Green Hydrogen Production Technologies",
              description: "Research and development of innovative technologies for green hydrogen production, storage, and distribution, contributing to Portugal's energy transition goals.",
              status: "Pending" as const,
              progress: 0,
              deadline: "2026-08-31",
              team: "LNEG & Partners",
              budget: "€5.3M",
              category: "Clean Energy"
            },
            {
              id: "7",
              title: "Next-Generation Biomedical Materials",
              description: "Development of innovative biocompatible materials for medical applications, including drug delivery systems, tissue engineering scaffolds, and implantable devices.",
              status: "Completed" as const,
              progress: 100,
              deadline: "2022-04-14",
              team: "i3S & Partners",
              budget: "€2.5M",
              category: "Health & Biotech"
            },
            {
              id: "8",
              title: "Smart Agriculture & Food Security",
              description: "Implementation of digital technologies and precision agriculture methods to enhance food production efficiency, quality, and sustainability in Portugal.",
              status: "Active" as const,
              progress: 55,
              deadline: "2025-04-30",
              team: "INIAV & Partners",
              budget: "€3.8M",
              category: "Agri-food"
            }
          ];
          
          const foundProject = projects.find(p => p.id === projectId);
          
          if (foundProject) {
            setProject(foundProject);
          }
        } catch (error) {
          console.error('Error fetching project details:', error);
        } finally {
          setLoading(false);
        }
      }, 800); // Simulate loading delay
    };
    
    fetchProjectDetails();
  }, [projectId]);

  const handleGoBack = () => {
    navigate('/projects');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" className="mb-6" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        
        <div className="space-y-6">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" className="mb-6" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-1">Project Not Found</h2>
            <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleGoBack}>Return to Projects</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" className="mb-6" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">{project.title}</CardTitle>
                <Badge variant={
                  project.status === 'Active' ? 'default' : 
                  project.status === 'Completed' ? 'secondary' : 
                  'outline'
                } className="text-sm">
                  {project.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Project ID: {project.id}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <p className="text-md">{project.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[29px] w-5 h-5 rounded-full bg-primary"></div>
                  <div>
                    <h4 className="font-medium">Project Started</h4>
                    <p className="text-sm text-muted-foreground">Initial planning and resource allocation completed</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[29px] w-5 h-5 rounded-full bg-gray-300"></div>
                  <div>
                    <h4 className="font-medium">Mid-Project Review</h4>
                    <p className="text-sm text-muted-foreground">Evaluation of progress and adjustments to project scope</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[29px] w-5 h-5 rounded-full bg-gray-300"></div>
                  <div>
                    <h4 className="font-medium">Project Deadline</h4>
                    <p className="text-sm text-muted-foreground">{project.deadline}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">{project.deadline}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <EuroIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">{project.budget}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team</p>
                  <p className="font-medium">{project.team}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{project.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Related Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-3 hover:bg-gray-100 transition-colors cursor-pointer">
                <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Project Proposal</p>
                  <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-3 hover:bg-gray-100 transition-colors cursor-pointer">
                <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Midterm Report</p>
                  <p className="text-xs text-muted-foreground">PDF • 1.8 MB</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-3 hover:bg-gray-100 transition-colors cursor-pointer">
                <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Budget Approval</p>
                  <p className="text-xs text-muted-foreground">Excel • 0.7 MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
