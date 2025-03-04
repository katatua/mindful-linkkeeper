
export interface ProjectData {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Completed' | 'Pending';
  progress: number;
  deadline: string;
  team: string;
  budget: string;
  category: string;
}

export interface ProjectMetricsData {
  totalProjects: number;
  totalProjectsChange: number;
  activeProjects: number;
  activeProjectsChange: number;
  activeProjectsTrend: number[];
  completionRate: number;
  completionRateChange: number;
  totalBudget: number;
  totalBudgetChange: number;
  totalBudgetTrend: number[];
}
