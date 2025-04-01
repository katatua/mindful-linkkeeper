
import { DataCard } from "@/components/DataCard";
import { ProjectMetricsData } from "@/types/projectTypes";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectMetricsProps {
  metrics: ProjectMetricsData;
}

export const ProjectMetrics = ({ metrics }: ProjectMetricsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DataCard
        title={t('project.metrics.total')}
        value={metrics.totalProjects}
        trend="up"
        percentChange={metrics.totalProjectsChange}
        category={t('project.metrics.all')}
        isGrid={true}
        icon="chart"
      />
      <DataCard
        title={t('project.metrics.active')}
        value={metrics.activeProjects}
        trend="up"
        percentChange={metrics.activeProjectsChange}
        category={t('project.metrics.progress')}
        chartData={metrics.activeProjectsTrend}
        isGrid={true}
        icon="activity"
      />
      <DataCard
        title={t('project.metrics.completion')}
        value={`${metrics.completionRate}%`}
        trend={metrics.completionRateChange > 0 ? "up" : "down"}
        percentChange={Math.abs(metrics.completionRateChange)}
        category={t('project.metrics.last12')}
        isGrid={true}
        icon="chart"
      />
      <DataCard
        title={t('project.metrics.budget')}
        value={`€${metrics.totalBudget}M`}
        trend="up"
        percentChange={metrics.totalBudgetChange}
        category={t('project.metrics.funding')}
        chartData={metrics.totalBudgetTrend}
        isGrid={true}
        icon="activity"
      />
    </div>
  );
};
