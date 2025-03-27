
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProjectData } from '@/types/projectTypes';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Users, EuroIcon, FileText, Building, Tag, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchProjectDetails = () => {
      setLoading(true);
      
      // Use localStorage to get the projects data (same as in useProjectData hook)
      setTimeout(() => {
        try {
          // Simulate fetching project by ID
          const allProjects = JSON.parse(localStorage.getItem('sampleProjects') || '[]');
          const foundProject = allProjects.find((p: ProjectData) => p.id === projectId);
          
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
    navigate(-1);
  };

  if (loading) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
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
    </Layout>
  );
};

export default ProjectDetailPage;
