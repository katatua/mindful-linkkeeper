
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
        // Sample project data (extended to 15 projects)
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
          },
          {
            id: "PRJ-2023-006",
            title: "Neural Interface for Prosthetics",
            description: "Developing advanced neural interfaces for next-generation prosthetic limbs with enhanced sensory feedback.",
            status: "Active",
            progress: 37,
            deadline: "Apr 2024",
            team: "NeuroTech",
            budget: "€1.8M",
            category: "Healthcare",
          },
          {
            id: "PRJ-2023-007",
            title: "Ocean Plastic Remediation",
            description: "Creating scalable solutions for detecting and collecting microplastics from marine environments.",
            status: "Active",
            progress: 61,
            deadline: "Jul 2024",
            team: "Ocean Cleanup Initiative",
            budget: "€1.1M",
            category: "Environment",
          },
          {
            id: "PRJ-2023-008",
            title: "Satellite-based Precision Agriculture",
            description: "Developing satellite imaging and AI analysis for optimal crop management and resource utilization.",
            status: "Pending",
            progress: 8,
            deadline: "May 2024",
            team: "AgroSpace",
            budget: "€975K",
            category: "Agriculture",
          },
          {
            id: "PRJ-2022-013",
            title: "Biodegradable Electronics",
            description: "Creating eco-friendly electronics components that decompose naturally at end-of-life.",
            status: "Completed",
            progress: 100,
            deadline: "Sep 2022",
            team: "GreenTech Electronics",
            budget: "€780K",
            category: "Sustainability",
          },
          {
            id: "PRJ-2023-009",
            title: "Advanced Water Filtration Technologies",
            description: "Developing nanomaterial filters for efficient contaminant removal from drinking water supplies.",
            status: "Active",
            progress: 45,
            deadline: "Feb 2024",
            team: "Clean Water Solutions",
            budget: "€920K",
            category: "Environmental Technology",
          },
          {
            id: "PRJ-2023-010",
            title: "Blockchain for Supply Chain Transparency",
            description: "Implementing blockchain solutions to enhance visibility and traceability in international supply chains.",
            status: "Active",
            progress: 58,
            deadline: "Jan 2024",
            team: "Distributed Systems Group",
            budget: "€750K",
            category: "Digital Technology",
          },
          {
            id: "PRJ-2023-011",
            title: "Smart Grid Optimization",
            description: "Developing AI algorithms for real-time power distribution optimization and renewable energy integration.",
            status: "Active",
            progress: 72,
            deadline: "Oct 2023",
            team: "Energy Systems Lab",
            budget: "€1.3M",
            category: "Energy",
          },
          {
            id: "PRJ-2022-014",
            title: "Drone-based Environmental Monitoring",
            description: "Creating automated drone systems for ecological assessment and forest fire detection.",
            status: "Completed",
            progress: 100,
            deadline: "Nov 2022",
            team: "Aerial Robotics Group",
            budget: "€680K",
            category: "Environmental Monitoring",
          },
          {
            id: "PRJ-2023-015",
            title: "AR/VR for Technical Training",
            description: "Developing immersive training environments for industrial and technical skill development.",
            status: "Pending",
            progress: 22,
            deadline: "Sep 2024",
            team: "Virtual Training Systems",
            budget: "€1.05M",
            category: "Education Technology",
          }
        ];
        
        // Enhanced sample metrics data
        const sampleMetrics: ProjectMetricsData = {
          totalProjects: 186,
          totalProjectsChange: 18,
          activeProjects: 112,
          activeProjectsChange: 14,
          activeProjectsTrend: [65, 72, 78, 84, 96, 104, 112],
          completionRate: 92,
          completionRateChange: 5,
          totalBudget: 42.8,
          totalBudgetChange: 18,
          totalBudgetTrend: [20.2, 24.5, 28.9, 32.7, 36.5, 39.8, 42.8],
        };
        
        // Generate realistic funding program data (more entries)
        const generateFundingPrograms = () => {
          const sectors = ['Technology', 'Healthcare', 'Agriculture', 'Education', 'Manufacturing', 'Clean Energy', 'Tourism', 'Digital Transformation'];
          const fundingTypes = ['grant', 'loan', 'tax_incentive', 'equity', 'hybrid'];
          const now = new Date();
          const oneYearFromNow = new Date(now);
          oneYearFromNow.setFullYear(now.getFullYear() + 1);
          
          let programs = [];
          for (let i = 0; i < 20; i++) {
            const applicationDeadline = new Date(now.getTime() + Math.random() * (oneYearFromNow.getTime() - now.getTime()));
            const endDate = new Date(applicationDeadline);
            endDate.setMonth(applicationDeadline.getMonth() + Math.floor(Math.random() * 24) + 6);
            
            const startDate = new Date(now);
            startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 90));
            
            programs.push({
              id: `FP-2023-${(i + 1).toString().padStart(3, '0')}`,
              name: `Funding Program ${i + 1} - ${sectors[i % sectors.length]}`,
              description: `This is a synthetic funding program for ${sectors[i % sectors.length]} sector with a focus on innovation and research.`,
              total_budget: Math.floor(Math.random() * 9900000) + 100000,
              start_date: startDate.toISOString().split('T')[0],
              end_date: endDate.toISOString().split('T')[0],
              application_deadline: applicationDeadline.toISOString().split('T')[0],
              next_call_date: new Date(now.getTime() + Math.random() * (applicationDeadline.getTime() - now.getTime())).toISOString().split('T')[0],
              funding_type: fundingTypes[Math.floor(Math.random() * fundingTypes.length)],
              sector_focus: [sectors[i % sectors.length], sectors[(i + 3) % sectors.length]].filter((v, i, a) => a.indexOf(v) === i),
              eligibility_criteria: 'Organizations must be registered in Portugal and have at least 2 years of operation.',
              application_process: 'Online application through ANI portal with required documentation.',
              review_time_days: Math.floor(Math.random() * 60) + 30,
              success_rate: Math.random() * 0.7 + 0.1,
            });
          }
          
          return programs;
        };
        
        // Generate international collaborations data
        const generateInternationalCollaborations = () => {
          const countries = ['Spain', 'France', 'Germany', 'United Kingdom', 'Italy', 'Netherlands', 'Belgium', 'Sweden', 'United States', 'Brazil', 'Japan', 'China'];
          const partnershipTypes = ['Research', 'Academic Exchange', 'Industry Collaboration', 'Government Partnership', 'Innovation Hub'];
          const focusAreas = ['AI', 'Renewable Energy', 'Biotechnology', 'Advanced Materials', 'Digital Transformation', 'Climate Action', 'Space Technology', 'Quantum Computing'];
          
          const now = new Date();
          const twoYearsAgo = new Date(now);
          twoYearsAgo.setFullYear(now.getFullYear() - 2);
          
          const fiveYearsFromNow = new Date(now);
          fiveYearsFromNow.setFullYear(now.getFullYear() + 5);
          
          let collaborations = [];
          for (let i = 0; i < 15; i++) {
            const startDate = new Date(twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime()));
            const endDate = new Date(now.getTime() + Math.random() * (fiveYearsFromNow.getTime() - now.getTime()));
            const totalBudget = Math.floor(Math.random() * 1800000) + 200000;
            
            collaborations.push({
              id: `IC-2023-${(i + 1).toString().padStart(3, '0')}`,
              program_name: `International Collaboration ${i + 1} with ${countries[i % countries.length]}`,
              country: countries[i % countries.length],
              partnership_type: partnershipTypes[i % partnershipTypes.length],
              start_date: startDate.toISOString().split('T')[0],
              end_date: endDate.toISOString().split('T')[0],
              total_budget: totalBudget,
              portuguese_contribution: Math.floor(totalBudget * (Math.random() * 0.4 + 0.2)),
              focus_areas: [focusAreas[i % focusAreas.length], focusAreas[(i + 4) % focusAreas.length]].filter((v, i, a) => a.indexOf(v) === i),
            });
          }
          
          return collaborations;
        };
        
        // Generate metrics data
        const generateMetricsData = () => {
          const categories = ['R&D Investment', 'Patent Applications', 'Innovation Index', 'Startup Funding', 'Academic Collaboration'];
          const sectors = ['Technology', 'Healthcare', 'Agriculture', 'Education', 'Manufacturing', 'Clean Energy', 'Tourism', 'Digital Transformation'];
          const regions = ['Lisboa', 'Porto', 'Algarve', 'Centro', 'Alentejo', 'Norte', 'Açores', 'Madeira'];
          const units = ['Million EUR', 'Percentage', 'Count', 'Per Capita', 'Growth Rate'];
          const sources = ['Eurostat', 'INE', 'ANI Survey', 'Ministry Report', 'EU Commission'];
          
          const now = new Date();
          const fiveYearsAgo = new Date(now);
          fiveYearsAgo.setFullYear(now.getFullYear() - 5);
          
          let metrics = [];
          for (let i = 0; i < 25; i++) {
            const measurementDate = new Date(fiveYearsAgo.getTime() + Math.random() * (now.getTime() - fiveYearsAgo.getTime()));
            
            metrics.push({
              id: `ME-2023-${(i + 1).toString().padStart(3, '0')}`,
              name: `${categories[i % categories.length]} Metric ${i + 1}`,
              category: categories[i % categories.length],
              value: Math.random() * 100,
              unit: units[i % units.length],
              measurement_date: measurementDate.toISOString().split('T')[0],
              region: regions[i % regions.length],
              sector: sectors[i % sectors.length],
              source: sources[i % sources.length],
              description: `Synthetic metric measuring ${categories[i % categories.length]} in ${sectors[i % sectors.length]} sector for ${regions[i % regions.length]} region.`,
            });
          }
          
          return metrics;
        };
        
        // Generate policy frameworks data
        const generatePolicyFrameworks = () => {
          const now = new Date();
          const threeYearsAgo = new Date(now);
          threeYearsAgo.setFullYear(now.getFullYear() - 3);
          
          const policyScopes = ['National', 'Regional', 'European', 'Sectoral', 'Institutional'];
          const keyObjectives = [
            'Increase R&D investment', 
            'Promote technology transfer', 
            'Support startup ecosystem', 
            'Enhance international collaboration', 
            'Develop innovation infrastructure',
            'Accelerate digital transformation',
            'Promote sustainable innovation',
            'Enhance skill development',
            'Support SME innovation'
          ];
          
          let frameworks = [];
          for (let i = 0; i < 10; i++) {
            const implementationDate = new Date(threeYearsAgo.getTime() + Math.random() * (now.getTime() - threeYearsAgo.getTime()));
            
            // Select 2-4 random objectives
            const selectedObjectives = [];
            const objectiveCount = Math.floor(Math.random() * 3) + 2;
            for (let j = 0; j < objectiveCount; j++) {
              const objective = keyObjectives[Math.floor(Math.random() * keyObjectives.length)];
              if (!selectedObjectives.includes(objective)) {
                selectedObjectives.push(objective);
              }
            }
            
            frameworks.push({
              id: `PF-2023-${(i + 1).toString().padStart(3, '0')}`,
              title: `Innovation Policy Framework ${i + 1}`,
              description: `A comprehensive policy framework designed to enhance innovation and research capabilities in Portugal.`,
              implementation_date: implementationDate.toISOString().split('T')[0],
              status: i < 7 ? 'active' : 'in development',
              scope: policyScopes[i % policyScopes.length],
              key_objectives: selectedObjectives,
              related_legislation: `Resolution No. ${2023 - i}/ANI on Innovation Support`,
            });
          }
          
          return frameworks;
        };
        
        // Generate data for additional tables
        const fundingPrograms = generateFundingPrograms();
        const collaborations = generateInternationalCollaborations();
        const metricsData = generateMetricsData();
        const policyFrameworks = generatePolicyFrameworks();
        
        // Store all this data in localStorage for other components to use
        localStorage.setItem('sampleFundingPrograms', JSON.stringify(fundingPrograms));
        localStorage.setItem('sampleCollaborations', JSON.stringify(collaborations));
        localStorage.setItem('sampleMetrics', JSON.stringify(metricsData));
        localStorage.setItem('samplePolicyFrameworks', JSON.stringify(policyFrameworks));
        
        setProjects(sampleProjects);
        setMetrics(sampleMetrics);
        setIsLoading(false);
      }, 1200); // Simulate network delay
    };
    
    fetchProjects();
  }, []);

  return { projects, metrics, isLoading };
};
