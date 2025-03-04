
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProjectData } from "@/types/projectTypes";
import { Calendar, Users, EuroIcon } from "lucide-react";

interface ProjectListProps {
  projects: ProjectData[];
  isLoading: boolean;
}

export const ProjectList = ({ projects, isLoading }: ProjectListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No projects found matching your criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-all cursor-pointer">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-medium">{project.title}</CardTitle>
              <Badge variant={
                project.status === 'Active' ? 'default' : 
                project.status === 'Completed' ? 'secondary' : 
                'outline'
              }>
                {project.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">{project.description}</p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{project.deadline}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{project.team}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <EuroIcon className="h-4 w-4" />
                  <span>{project.budget}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 text-xs text-gray-500">
            <div className="flex justify-between w-full">
              <span>Category: {project.category}</span>
              <span>ID: {project.id}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
