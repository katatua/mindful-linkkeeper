
import { useState, useEffect } from "react";
import { ProjectData, ProjectMetricsData } from "@/types/projectTypes";

export const useProjectData = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [metrics, setMetrics] = useState<ProjectMetricsData>({
    totalProjects: 0,
    totalProjectsChange: 0,
    activeProjects: 0,
    activeProjectsChange: 0,
    activeProjectsTrend: [],
    completionRate: 0,
    completionRateChange: 0,
    totalBudget: 0,
    totalBudgetChange: 0,
    totalBudgetTrend: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchProjects = () => {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // Sample project data
        const sampleProjects: ProjectData[] = [
          {
            id: "PRJ-2023-001",
            title: "AI-Powered Healthcare Diagnostics",
            description: "Developing an AI system for early disease detection using machine learning algorithms and clinical data.",
            status: "Active",
            progress: 68,
            deadline: "Dec 2023",
            team: "Team Alpha",
            budget: "€1.2M",
            category: "Healthcare",
          },
          {
            id: "PRJ-2023-002",
            title: "Sustainable Energy Storage Solutions",
            description: "Researching novel materials for high-capacity batteries with improved sustainability and reduced environmental impact.",
            status: "Active",
            progress: 42,
            deadline: "Mar 2024",
            team: "Green Energy Lab",
            budget: "€850K",
            category: "Energy",
          },
          {
            id: "PRJ-2023-003",
            title: "Urban Mobility Innovation Platform",
            description: "Creating an integrated digital platform for smart city transportation management and optimization.",
            status: "Pending",
            progress: 15,
            deadline: "Jun 2024",
            team: "Urban Tech",
            budget: "€720K",
            category: "Smart Cities",
          },
          {
            id: "PRJ-2023-004",
            title: "Advanced Manufacturing Automation",
            description: "Developing robotics and IoT solutions for next-generation manufacturing facilities.",
            status: "Active",
            progress: 53,
            deadline: "Nov 2023",
            team: "Industrial Innovations",
            budget: "€1.5M",
            category: "Manufacturing",
          },
          {
            id: "PRJ-2023-005",
            title: "Quantum Computing Applications",
            description: "Exploring practical applications of quantum computing in cryptography and complex system modeling.",
            status: "Active",
            progress: 32,
            deadline: "Aug 2024",
            team: "Quantum Labs",
            budget: "€2.1M",
            category: "Computing",
          },
          {
            id: "PRJ-2022-012",
            title: "Biotech Crop Resilience",
            description: "Enhancing crop resilience to climate change through biotechnology innovations.",
            status: "Completed",
            progress: 100,
            deadline: "Oct 2022",
            team: "Agri Innovations",
            budget: "€950K",
            category: "Agriculture",
          }
        ];
        
        // Sample metrics data
        const sampleMetrics: ProjectMetricsData = {
          totalProjects: 156,
          totalProjectsChange: 12,
          activeProjects: 84,
          activeProjectsChange: 8,
          activeProjectsTrend: [65, 68, 72, 75, 78, 82, 84],
          completionRate: 92,
          completionRateChange: 3,
          totalBudget: 28.5,
          totalBudgetChange: 15,
          totalBudgetTrend: [20.2, 22.8, 24.5, 25.9, 27.2, 28.5],
        };
        
        setProjects(sampleProjects);
        setMetrics(sampleMetrics);
        setIsLoading(false);
      }, 1200); // Simulate network delay
    };
    
    fetchProjects();
  }, []);

  return { projects, metrics, isLoading };
};
