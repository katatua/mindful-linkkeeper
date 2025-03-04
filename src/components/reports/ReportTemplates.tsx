
import { ReportTemplateCard, ReportTemplateProps } from "./ReportTemplateCard";

export const ReportTemplates = () => {
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

  return (
    <div className="space-y-4">
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
