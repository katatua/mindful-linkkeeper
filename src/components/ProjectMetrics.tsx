
import { DataCard } from "@/components/DataCard";
import { ProjectMetricsData } from "@/types/projectTypes";

interface ProjectMetricsProps {
  metrics: ProjectMetricsData;
}

export const ProjectMetrics = ({ metrics }: ProjectMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DataCard
        title="Total Projects"
        value={metrics.totalProjects}
        trend="up"
        percentChange={metrics.totalProjectsChange}
        category="All Projects"
        isGrid={true}
        icon="chart"
      />
      <DataCard
        title="Active Projects"
        value={metrics.activeProjects}
        trend="up"
        percentChange={metrics.activeProjectsChange}
        category="In Progress"
        chartData={metrics.activeProjectsTrend}
        isGrid={true}
        icon="activity"
      />
      <DataCard
        title="Completion Rate"
        value={`${metrics.completionRate}%`}
        trend={metrics.completionRateChange > 0 ? "up" : "down"}
        percentChange={Math.abs(metrics.completionRateChange)}
        category="Last 12 Months"
        isGrid={true}
        icon="chart"
      />
      <DataCard
        title="Total Budget"
        value={`€${metrics.totalBudget}M`}
        trend="up"
        percentChange={metrics.totalBudgetChange}
        category="Allocated Funding"
        chartData={metrics.totalBudgetTrend}
        isGrid={true}
        icon="activity"
      />
    </div>
  );
};
