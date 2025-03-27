
import React, { useState } from 'react';
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase, getTable } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface SyntheticDataFormValues {
  table: string;
  count: number;
}

const VALID_TABLES = [
  'ani_funding_programs',
  'ani_projects',
  'ani_metrics',
  'ani_international_collaborations',
  'ani_policy_frameworks',
  'ani_patent_holders',
  'ani_institutions',
  'ani_researchers'
];

const SyntheticDataPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SyntheticDataFormValues>({
    defaultValues: {
      table: "ani_funding_programs",
      count: 20
    }
  });

  const generateRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  
  const generateRandomAmount = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const generateUUID = () => {
    return crypto.randomUUID();
  };

  const getRandomItem = <T extends any>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };

  const generateFundingPrograms = async (count: number) => {
    const sectors = ['Technology', 'Healthcare', 'Agriculture', 'Education', 'Manufacturing', 'Clean Energy', 'Tourism', 'Digital Transformation', 'Biotechnology', 'Quantum Computing', 'Aerospace', 'Marine Sciences', 'Cybersecurity'];
    const fundingTypes = ['grant', 'loan', 'tax_incentive', 'equity', 'hybrid', 'voucher', 'prize', 'accelerator'];
    const programs = [];
    
    const now = new Date();
    const oneYearFromNow = new Date(now);
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    for (let i = 0; i < count; i++) {
      const applicationDeadline = generateRandomDate(now, oneYearFromNow);
      const endDate = new Date(applicationDeadline);
      endDate.setMonth(applicationDeadline.getMonth() + Math.floor(Math.random() * 24) + 6);
      
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 90));
      
      // Select 1-3 sectors for focus
      const sectorCount = Math.floor(Math.random() * 3) + 1;
      const sectorFocus = [];
      for (let j = 0; j < sectorCount; j++) {
        const sector = getRandomItem(sectors);
        if (!sectorFocus.includes(sector)) {
          sectorFocus.push(sector);
        }
      }
      
      const program = {
        name: `${getRandomItem(['Innovation', 'Research', 'Development', 'Technology', 'Horizon', 'Future', 'Next-Gen'])} Program ${i + 1} - ${getRandomItem(sectors)}`,
        description: `This funding program aims to support innovative projects in ${sectorFocus.join(' and ')} with an emphasis on sustainable and scalable solutions for the Portuguese market and beyond.`,
        total_budget: generateRandomAmount(500000, 15000000),
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        application_deadline: format(applicationDeadline, 'yyyy-MM-dd'),
        next_call_date: format(generateRandomDate(now, applicationDeadline), 'yyyy-MM-dd'),
        funding_type: getRandomItem(fundingTypes),
        sector_focus: sectorFocus,
        eligibility_criteria: `Organizations must ${getRandomItem(['be registered in Portugal', 'have operations in the EU', 'be SMEs with less than 250 employees', 'be research institutions'])} and have at least ${getRandomItem([1, 2, 3])} years of operation.`,
        application_process: getRandomItem(['Online application through ANI portal with required documentation.', 'Two-stage application process with initial concept note followed by full proposal.', 'Continuous submission with monthly evaluation cycles.', 'Competitive call with fixed deadline and peer review.']),
        review_time_days: generateRandomAmount(30, 120),
        success_rate: Math.random() * 0.7 + 0.1,
      };
      
      programs.push(program);
    }
    
    return programs;
  };
  
  const generateProjects = async (count: number) => {
    const sectors = ['Technology', 'Healthcare', 'Agriculture', 'Education', 'Manufacturing', 'Clean Energy', 'Tourism', 'Digital Transformation', 'AI', 'Robotics', 'Biotech', 'Fintech', 'Smart Cities'];
    const regions = ['Lisboa', 'Porto', 'Algarve', 'Centro', 'Alentejo', 'Norte', 'Açores', 'Madeira', 'Coimbra', 'Braga', 'Aveiro'];
    const statuses = ['submitted', 'in_review', 'approved', 'in_progress', 'completed', 'rejected', 'suspended'];
    const organizations = [
      'Universidade de Lisboa', 
      'Universidade do Porto', 
      'Instituto Superior Técnico', 
      'Universidade de Coimbra', 
      'Universidade do Minho', 
      'INESC TEC', 
      'INOV', 
      'INESC ID',
      'Instituto Pedro Nunes',
      'Fraunhofer Portugal',
      'Centro de Neurociências de Coimbra',
      'Universidade de Aveiro',
      'Laboratório Ibérico Internacional de Nanotecnologia',
      'Critical Software',
      'Feedzai',
      'Farfetch'
    ];
    
    const projectTitles = [
      'Advanced AI for Healthcare Diagnostics',
      'Sustainable Energy Storage Solutions',
      'Smart Agriculture Monitoring System',
      'Next-Gen Educational Technologies',
      'Robotics for Manufacturing Automation',
      'Renewable Energy Integration Platform',
      'Tourism Experience Enhancement through AR/VR',
      'Digital Transformation of Small Businesses',
      'AI-Powered Financial Fraud Detection',
      'Smart City Infrastructure Management',
      'Biotechnology for Waste Treatment',
      'Quantum Computing for Cryptography',
      'Marine Plastics Remediation Technology',
      'Space Technology for Earth Observation',
      'Cybersecurity Enhancement Framework',
      'Neuro-adaptive Learning Platforms',
      'Autonomous Driving Technologies',
      'Precision Medicine Development',
      'Circular Economy Business Models',
      'Digital Heritage Preservation'
    ];
    
    const projects = [];
    
    const now = new Date();
    const twoYearsAgo = new Date(now);
    twoYearsAgo.setFullYear(now.getFullYear() - 2);
    
    const threeYearsFromNow = new Date(now);
    threeYearsFromNow.setFullYear(now.getFullYear() + 3);
    
    for (let i = 0; i < count; i++) {
      const startDate = generateRandomDate(twoYearsAgo, now);
      const endDate = generateRandomDate(now, threeYearsFromNow);
      const projectTitle = i < projectTitles.length ? projectTitles[i] : `Research Project ${i + 1} - ${getRandomItem(sectors)}`;
      
      const project = {
        title: projectTitle,
        description: `This innovative research project focuses on developing ${projectTitle.toLowerCase()} with potential applications in ${getRandomItem(sectors)} and ${getRandomItem(sectors)}.`,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        funding_amount: generateRandomAmount(100000, 2000000),
        status: getRandomItem(statuses),
        sector: getRandomItem(sectors),
        region: getRandomItem(regions),
        organization: getRandomItem(organizations),
        contact_email: `contact${i}@${getRandomItem(['research.pt', 'innovation.org', 'uni.pt', 'lab.edu', 'tech.pt'])}`,
        contact_phone: `+351 9${generateRandomAmount(10000000, 99999999)}`,
      };
      
      projects.push(project);
    }
    
    return projects;
  };
  
  const generateMetrics = async (count: number) => {
    const metrics = [];
    const categories = [
      'R&D Investment', 
      'Patent Applications', 
      'Innovation Index', 
      'Startup Funding', 
      'Academic Collaboration',
      'Technology Transfer',
      'International Partnerships',
      'Research Output',
      'Innovation Capacity',
      'Talent Development'
    ];
    const sectors = ['Technology', 'Healthcare', 'Agriculture', 'Education', 'Manufacturing', 'Clean Energy', 'Tourism', 'Digital Transformation'];
    const regions = ['Lisboa', 'Porto', 'Algarve', 'Centro', 'Alentejo', 'Norte', 'Açores', 'Madeira'];
    const units = ['Million EUR', 'Percentage', 'Count', 'Per Capita', 'Growth Rate', 'Index Points', 'Ratio', 'Score'];
    const sources = ['Eurostat', 'INE', 'ANI Survey', 'Ministry Report', 'EU Commission', 'OECD', 'World Bank', 'Independent Research'];
    
    const now = new Date();
    const fiveYearsAgo = new Date(now);
    fiveYearsAgo.setFullYear(now.getFullYear() - 5);
    
    for (let i = 0; i < count; i++) {
      const measurementDate = generateRandomDate(fiveYearsAgo, now);
      const category = getRandomItem(categories);
      const sector = getRandomItem(sectors);
      const region = getRandomItem(regions);
      let value;
      
      // Generate realistic values based on category
      switch (category) {
        case 'R&D Investment':
          value = (Math.random() * 1000 + 100).toFixed(2); // 100-1100M EUR
          break;
        case 'Patent Applications':
          value = Math.floor(Math.random() * 500 + 50); // 50-550 applications
          break;
        case 'Innovation Index':
          value = (Math.random() * 100).toFixed(1); // 0-100 index
          break;
        case 'Startup Funding':
          value = (Math.random() * 500 + 50).toFixed(2); // 50-550M EUR
          break;
        default:
          value = (Math.random() * 100).toFixed(2); // Generic value
      }
      
      const metric = {
        name: `${category} - ${sector} - ${region}`,
        category: category,
        value: parseFloat(value),
        unit: getRandomItem(units),
        measurement_date: format(measurementDate, 'yyyy-MM-dd'),
        region: region,
        sector: sector,
        source: getRandomItem(sources),
        description: `A metric measuring ${category.toLowerCase()} in the ${sector.toLowerCase()} sector for the ${region} region of Portugal.`,
      };
      
      metrics.push(metric);
    }
    
    return metrics;
  };

  const generateCollaborations = async (count: number) => {
    const countries = ['Spain', 'France', 'Germany', 'United Kingdom', 'Italy', 'Netherlands', 'Belgium', 'Sweden', 'United States', 'Brazil', 'Japan', 'China', 'Canada', 'Australia', 'India', 'South Korea', 'Singapore', 'Israel'];
    const partnershipTypes = ['Research', 'Academic Exchange', 'Industry Collaboration', 'Government Partnership', 'Innovation Hub', 'Joint Laboratory', 'Technology Transfer', 'Startup Acceleration'];
    const focusAreas = ['AI', 'Renewable Energy', 'Biotechnology', 'Advanced Materials', 'Digital Transformation', 'Climate Action', 'Space Technology', 'Quantum Computing', 'Nanotechnology', 'Robotics', 'Ocean Sciences', 'Smart Cities', 'Healthcare Innovation'];
    
    const collaborations = [];
    
    const now = new Date();
    const twoYearsAgo = new Date(now);
    twoYearsAgo.setFullYear(now.getFullYear() - 2);
    
    const fiveYearsFromNow = new Date(now);
    fiveYearsFromNow.setFullYear(now.getFullYear() + 5);
    
    for (let i = 0; i < count; i++) {
      const startDate = generateRandomDate(twoYearsAgo, now);
      const endDate = generateRandomDate(now, fiveYearsFromNow);
      const totalBudget = generateRandomAmount(200000, 5000000);
      const country = getRandomItem(countries);
      
      // Select 2-3 focus areas
      const areaCount = Math.floor(Math.random() * 2) + 2;
      const selectedAreas = [];
      for (let j = 0; j < areaCount; j++) {
        const area = getRandomItem(focusAreas);
        if (!selectedAreas.includes(area)) {
          selectedAreas.push(area);
        }
      }
      
      const collaboration = {
        program_name: `Portugal-${country} Collaboration on ${selectedAreas[0]}`,
        country: country,
        partnership_type: getRandomItem(partnershipTypes),
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        total_budget: totalBudget,
        portuguese_contribution: Math.floor(totalBudget * (Math.random() * 0.4 + 0.2)),
        focus_areas: selectedAreas,
      };
      
      collaborations.push(collaboration);
    }
    
    return collaborations;
  };
  
  const generatePolicyFrameworks = async (count: number) => {
    const frameworks = [];
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
      'Support SME innovation',
      'Foster industry-academia partnerships',
      'Increase patent applications',
      'Improve commercialization rates',
      'Enhance regional innovation capacity',
      'Attract international talent',
      'Develop innovation clusters'
    ];
    
    const policyTitles = [
      'National Innovation Strategy',
      'Digital Transformation Framework',
      'Sustainable Technology Initiative',
      'Research Excellence Program',
      'SME Innovation Support Scheme',
      'Industry 4.0 Framework',
      'Knowledge Transfer Guidelines',
      'Regional Innovation Smart Specialization',
      'International Research Collaboration Framework',
      'Green Technology Development Plan',
      'AI and Data Science Strategy',
      'Technological Sovereignty Program',
      'Entrepreneurship Ecosystem Framework',
      'Open Science Advancement Plan',
      'Research Integrity and Ethics Framework'
    ];
    
    for (let i = 0; i < count; i++) {
      const implementationDate = generateRandomDate(threeYearsAgo, now);
      
      // Select 2-4 random objectives
      const selectedObjectives = [];
      const objectiveCount = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < objectiveCount; j++) {
        const objective = getRandomItem(keyObjectives);
        if (!selectedObjectives.includes(objective)) {
          selectedObjectives.push(objective);
        }
      }
      
      const title = i < policyTitles.length ? policyTitles[i] : `Innovation Policy Framework ${i + 1}`;
      
      frameworks.push({
        title: title,
        description: `A comprehensive policy framework designed to ${selectedObjectives[0].toLowerCase()} and ${selectedObjectives[1].toLowerCase()} across the Portuguese innovation ecosystem.`,
        implementation_date: format(implementationDate, 'yyyy-MM-dd'),
        status: Math.random() > 0.2 ? 'active' : 'in development',
        scope: getRandomItem(policyScopes),
        key_objectives: selectedObjectives,
        related_legislation: `Resolution No. ${2020 + Math.floor(Math.random() * 4)}/${Math.floor(Math.random() * 200) + 1} on Innovation Support`,
      });
    }
    
    return frameworks;
  };
  
  const generatePatentHolders = async (count: number) => {
    const patentHolders = [];
    const organizations = [
      'Universidade de Lisboa', 
      'Universidade do Porto', 
      'Instituto Superior Técnico', 
      'Universidade de Coimbra', 
      'Universidade do Minho', 
      'INESC TEC', 
      'Critical Software',
      'Feedzai',
      'Farfetch',
      'Hovione',
      'Bial',
      'Sonae',
      'EDP Inovação',
      'Siemens Portugal',
      'Bosch Portugal',
      'Fraunhofer Portugal',
      'Nokia Portugal',
      'Altice Labs',
      'PHC Software',
      'OutSystems'
    ];
    const sectors = ['Technology', 'Healthcare', 'Energy', 'Manufacturing', 'Telecommunications', 'Biotechnology', 'Software', 'Electronics', 'Materials Science', 'Pharmaceuticals'];
    
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < count; i++) {
      const orgName = i < organizations.length ? organizations[i] : `Innovation Company ${i + 1}`;
      const sector = getRandomItem(sectors);
      
      patentHolders.push({
        organization_name: orgName,
        sector: sector,
        country: 'Portugal',
        patent_count: generateRandomAmount(5, 120),
        innovation_index: (Math.random() * 10).toFixed(2),
        year: currentYear - Math.floor(Math.random() * 3),
      });
    }
    
    return patentHolders;
  };
  
  const generateInstitutions = async (count: number) => {
    const institutions = [];
    const institutionTypes = ['University', 'Research Center', 'Technology Park', 'Innovation Hub', 'Corporate R&D Center', 'Laboratory', 'Polytechnic Institute'];
    const regions = ['Lisboa', 'Porto', 'Algarve', 'Centro', 'Alentejo', 'Norte', 'Açores', 'Madeira', 'Coimbra', 'Braga', 'Aveiro'];
    const specializations = [
      'Artificial Intelligence',
      'Biotechnology',
      'Renewable Energy',
      'Material Sciences',
      'Computer Science',
      'Electronics',
      'Mechanical Engineering',
      'Chemical Engineering',
      'Life Sciences',
      'Environmental Sciences',
      'Marine Sciences',
      'Aerospace',
      'Nanotechnology',
      'Health Sciences',
      'Quantum Computing'
    ];
    
    const now = new Date();
    const institutionNames = [
      'University of Lisbon',
      'University of Porto',
      'University of Coimbra',
      'Technical University of Lisbon',
      'INESC TEC',
      'Institute for Systems and Computer Engineering',
      'Centre for Nanotechnology',
      'Laboratory for Robotics and Systems in Engineering',
      'Biomaterials Research Center',
      'Advanced Computing Research Lab',
      'Center for Renewable Energy Studies',
      'Institute for Bioengineering',
      'Digital Transformation Hub',
      'Sustainable Manufacturing Research Center',
      'Artificial Intelligence Research Institute',
      'Center for Space Technologies',
      'Quantum Computing Laboratory',
      'Institute for Pharmaceutical Research',
      'Marine Sciences Observatory',
      'Center for Smart Cities Research'
    ];
    
    for (let i = 0; i < count; i++) {
      // Generate founding date (between 30 years ago and 2 years ago)
      const thirtyYearsAgo = new Date(now);
      thirtyYearsAgo.setFullYear(now.getFullYear() - 30);
      
      const twoYearsAgo = new Date(now);
      twoYearsAgo.setFullYear(now.getFullYear() - 2);
      
      const foundingDate = generateRandomDate(thirtyYearsAgo, twoYearsAgo);
      
      // Select 2-4 specialization areas
      const areaCount = Math.floor(Math.random() * 3) + 2;
      const selectedAreas = [];
      for (let j = 0; j < areaCount; j++) {
        const area = getRandomItem(specializations);
        if (!selectedAreas.includes(area)) {
          selectedAreas.push(area);
        }
      }
      
      // Generate some example projects
      const projectCount = Math.floor(Math.random() * 3) + 1;
      const projectHistory = [];
      for (let j = 0; j < projectCount; j++) {
        projectHistory.push(`${getRandomItem(['Research on', 'Development of', 'Investigation into', 'Study of'])} ${getRandomItem(selectedAreas)} (${2018 + j}-${2020 + j})`);
      }
      
      const institutionName = i < institutionNames.length ? institutionNames[i] : `Research Institute ${i + 1}`;
      
      institutions.push({
        institution_name: institutionName,
        type: getRandomItem(institutionTypes),
        region: getRandomItem(regions),
        founding_date: format(foundingDate, 'yyyy-MM-dd'),
        specialization_areas: selectedAreas,
        project_history: projectHistory,
        collaboration_count: generateRandomAmount(5, 50),
      });
    }
    
    return institutions;
  };
  
  const generateResearchers = async (count: number) => {
    const researchers = [];
    const specializationAreas = [
      'Artificial Intelligence',
      'Machine Learning',
      'Biotechnology',
      'Quantum Computing',
      'Materials Science',
      'Renewable Energy',
      'Robotics',
      'Computer Vision',
      'Natural Language Processing',
      'Bioinformatics',
      'Nanotechnology',
      'Neuroscience',
      'Data Science',
      'Human-Computer Interaction',
      'Cybersecurity',
      'Software Engineering',
      'Genome Sequencing',
      'Climate Modeling',
      'Sustainable Technologies',
      'Digital Humanities'
    ];
    
    const firstNames = ['Maria', 'João', 'Ana', 'Pedro', 'Miguel', 'Sofia', 'Carlos', 'Luísa', 'António', 'Inês', 'Manuel', 'Catarina', 'José', 'Filipa', 'Paulo', 'Mariana', 'Ricardo', 'Beatriz', 'Fernando', 'Teresa'];
    const lastNames = ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Sousa', 'Fernandes', 'Gonçalves', 'Alves', 'Ribeiro', 'Lopes', 'Marques', 'Carvalho', 'Teixeira', 'Dias', 'Mendes', 'Correia'];
    
    const institutionIds = []; // In a real scenario, these would be actual UUIDs from the institutions table
    
    for (let i = 0; i < count; i++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      
      researchers.push({
        name: `${firstName} ${lastName}`,
        specialization: getRandomItem(specializationAreas),
        institution_id: institutionIds.length > 0 ? getRandomItem(institutionIds) : null,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomItem(['research.pt', 'university.pt', 'science.org', 'institute.edu', 'lab.pt'])}`,
        h_index: generateRandomAmount(1, 40),
        publication_count: generateRandomAmount(5, 150),
        patent_count: generateRandomAmount(0, 15),
      });
    }
    
    return researchers;
  };

  const isValidTableName = (tableName: string): boolean => {
    return VALID_TABLES.includes(tableName);
  };

  const generateData = async (table: string, count: number) => {
    switch (table) {
      case 'ani_funding_programs':
        return await generateFundingPrograms(count);
      case 'ani_projects':
        return await generateProjects(count);
      case 'ani_metrics':
        return await generateMetrics(count);
      case 'ani_international_collaborations':
        return await generateCollaborations(count);
      case 'ani_policy_frameworks':
        return await generatePolicyFrameworks(count);
      case 'ani_patent_holders':
        return await generatePatentHolders(count);
      case 'ani_institutions':
        return await generateInstitutions(count);
      case 'ani_researchers':
        return await generateResearchers(count);
      default:
        throw new Error('Unsupported table type');
    }
  };

  const generateInitialSampleData = async () => {
    try {
      setIsGenerating(true);
      
      // Generate more data for each table
      const fundingPrograms = await generateFundingPrograms(25);
      const projects = await generateProjects(30);
      const metrics = await generateMetrics(40);
      const collaborations = await generateCollaborations(20);
      const policyFrameworks = await generatePolicyFrameworks(15);
      const patentHolders = await generatePatentHolders(20);
      const institutions = await generateInstitutions(15);
      const researchers = await generateResearchers(25);
      
      // Insert data into Supabase tables (if they exist)
      try {
        const { error: fundingError } = await supabase
          .from('ani_funding_programs')
          .insert(fundingPrograms);
          
        if (fundingError) {
          console.error('Error inserting funding programs:', fundingError);
          // Fall back to local storage
          localStorage.setItem('sampleFundingPrograms', JSON.stringify(fundingPrograms));
        }
      } catch (err) {
        console.log('Falling back to localStorage for funding programs');
        localStorage.setItem('sampleFundingPrograms', JSON.stringify(fundingPrograms));
      }
      
      try {
        const { error: projectsError } = await supabase
          .from('ani_projects')
          .insert(projects);
          
        if (projectsError) {
          console.error('Error inserting projects:', projectsError);
          localStorage.setItem('sampleProjects', JSON.stringify(projects));
        }
      } catch (err) {
        console.log('Falling back to localStorage for projects');
        localStorage.setItem('sampleProjects', JSON.stringify(projects));
      }
      
      try {
        const { error: metricsError } = await supabase
          .from('ani_metrics')
          .insert(metrics);
          
        if (metricsError) {
          console.error('Error inserting metrics:', metricsError);
          localStorage.setItem('sampleMetrics', JSON.stringify(metrics));
        }
      } catch (err) {
        console.log('Falling back to localStorage for metrics');
        localStorage.setItem('sampleMetrics', JSON.stringify(metrics));
      }
      
      try {
        const { error: collabsError } = await supabase
          .from('ani_international_collaborations')
          .insert(collaborations);
          
        if (collabsError) {
          console.error('Error inserting collaborations:', collabsError);
          localStorage.setItem('sampleCollaborations', JSON.stringify(collaborations));
        }
      } catch (err) {
        console.log('Falling back to localStorage for collaborations');
        localStorage.setItem('sampleCollaborations', JSON.stringify(collaborations));
      }
      
      try {
        const { error: policyError } = await supabase
          .from('ani_policy_frameworks')
          .insert(policyFrameworks);
          
        if (policyError) {
          console.error('Error inserting policy frameworks:', policyError);
          localStorage.setItem('samplePolicyFrameworks', JSON.stringify(policyFrameworks));
        }
      } catch (err) {
        console.log('Falling back to localStorage for policy frameworks');
        localStorage.setItem('samplePolicyFrameworks', JSON.stringify(policyFrameworks));
      }
      
      try {
        const { error: patentError } = await supabase
          .from('ani_patent_holders')
          .insert(patentHolders);
          
        if (patentError) {
          console.error('Error inserting patent holders:', patentError);
          localStorage.setItem('samplePatentHolders', JSON.stringify(patentHolders));
        }
      } catch (err) {
        console.log('Falling back to localStorage for patent holders');
        localStorage.setItem('samplePatentHolders', JSON.stringify(patentHolders));
      }
      
      try {
        const { error: institutionsError } = await supabase
          .from('ani_institutions')
          .insert(institutions);
          
        if (institutionsError) {
          console.error('Error inserting institutions:', institutionsError);
          localStorage.setItem('sampleInstitutions', JSON.stringify(institutions));
        }
      } catch (err) {
        console.log('Falling back to localStorage for institutions');
        localStorage.setItem('sampleInstitutions', JSON.stringify(institutions));
      }
      
      try {
        const { error: researchersError } = await supabase
          .from('ani_researchers')
          .insert(researchers);
          
        if (researchersError) {
          console.error('Error inserting researchers:', researchersError);
          localStorage.setItem('sampleResearchers', JSON.stringify(researchers));
        }
      } catch (err) {
        console.log('Falling back to localStorage for researchers');
        localStorage.setItem('sampleResearchers', JSON.stringify(researchers));
      }
      
      toast({
        title: "Sample data initialized",
        description: "Comprehensive sample data has been generated for all tables",
      });
    } catch (error) {
      console.error('Error generating initial sample data:', error);
      toast({
        title: "Error initializing sample data",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (values: SyntheticDataFormValues) => {
    try {
      setIsGenerating(true);
      
      if (!isValidTableName(values.table)) {
        throw new Error(`Invalid table name: ${values.table}`);
      }
      
      // Generate data for the selected table
      const data = await generateData(values.table, values.count);
      
      // Try to insert into Supabase first
      try {
        console.log(`Inserting ${data.length} records into ${values.table}`);
        const { error } = await getTable(values.table)
          .insert(data);
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Success!",
          description: `Generated ${values.count} synthetic records for ${values.table} and inserted into the database`,
        });
      } catch (supabaseError) {
        console.error('Error inserting into Supabase:', supabaseError);
        
        // Fall back to localStorage
        localStorage.setItem(`sample${values.table.slice(4).charAt(0).toUpperCase() + values.table.slice(5)}`, JSON.stringify(data));
        
        toast({
          title: "Data Generated",
          description: `Generated ${values.count} synthetic records for ${values.table} and stored in browser memory (could not insert into database)`,
        });
      }
    } catch (error) {
      console.error('Error generating synthetic data:', error);
      toast({
        title: "Error generating data",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    const checkSampleData = async () => {
      try {
        let hasData = false;
        
        // Check if there's data in Supabase tables
        for (const table of VALID_TABLES) {
          try {
            const { data, error } = await getTable(table)
              .select('id')
              .limit(1);
              
            if (error) {
              console.error(`Error checking ${table}:`, error);
              continue;
            }
            
            if (data && data.length > 0) {
              hasData = true;
              break;
            }
          } catch (err) {
            console.log(`Table ${table} might not exist yet, checking localStorage`);
          }
        }
        
        // Also check localStorage for fallback data
        const localStorageKeys = [
          'sampleFundingPrograms',
          'sampleProjects',
          'sampleMetrics',
          'sampleCollaborations',
          'samplePolicyFrameworks'
        ];
        
        for (const key of localStorageKeys) {
          const data = localStorage.getItem(key);
          if (data && JSON.parse(data).length > 0) {
            hasData = true;
            break;
          }
        }
        
        if (!hasData) {
          toast({
            title: "No sample data detected",
            description: "It appears there's no sample data in the database or local storage. You can use the 'Initialize Sample Data' button to generate comprehensive records.",
          });
        }
      } catch (error) {
        console.error('Error checking for sample data:', error);
      }
    };
    
    checkSampleData();
  }, [toast]);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Synthetic Data Generator</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Generate Test Data</CardTitle>
            <CardDescription>
              Create synthetic data for all ANI database tables. Data will be saved to the selected table in the database or fallback to browser storage if database is not available.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="table">Target Table</Label>
                  <Select
                    defaultValue={form.getValues().table}
                    onValueChange={(value) => form.setValue('table', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a table" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ani_funding_programs">Funding Programs</SelectItem>
                      <SelectItem value="ani_projects">Projects</SelectItem>
                      <SelectItem value="ani_metrics">Metrics</SelectItem>
                      <SelectItem value="ani_international_collaborations">International Collaborations</SelectItem>
                      <SelectItem value="ani_policy_frameworks">Policy Frameworks</SelectItem>
                      <SelectItem value="ani_patent_holders">Patent Holders</SelectItem>
                      <SelectItem value="ani_institutions">Institutions</SelectItem>
                      <SelectItem value="ani_researchers">Researchers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Records</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="200"
                    {...form.register('count', { 
                      valueAsNumber: true,
                      min: { value: 1, message: "Must generate at least 1 record" },
                      max: { value: 200, message: "Cannot generate more than 200 records at once" }
                    })}
                  />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Data"
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={generateInitialSampleData}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    "Initialize Comprehensive Sample Data"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Synthetic Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This tool generates realistic synthetic data for testing and development. The generated data follows the schema of the ANI database tables and includes:
              </p>
              
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Funding Programs (25 records):</strong> Creates funding programs with realistic deadlines, budgets, sector focus and detailed descriptions.</li>
                <li><strong>Projects (30 records):</strong> Generates research projects with appropriate funding amounts, statuses, and regional distribution.</li>
                <li><strong>Metrics (40 records):</strong> Creates metrics data for tracking innovations, investments, and other key indicators.</li>
                <li><strong>International Collaborations (20 records):</strong> Generates data about international partnerships with various countries.</li>
                <li><strong>Policy Frameworks (15 records):</strong> Produces policy data with implementation dates, objectives, and status information.</li>
                <li><strong>Patent Holders (20 records):</strong> Creates organizations with patent counts and innovation indices.</li>
                <li><strong>Institutions (15 records):</strong> Generates research institutions with specialization areas and collaborative history.</li>
                <li><strong>Researchers (25 records):</strong> Produces researcher profiles with publication metrics and specializations.</li>
              </ul>
              
              <p className="text-sm text-muted-foreground">
                Note: All generated data is fictional and should only be used for testing purposes. The generated records follow realistic patterns but do not represent actual ANI programs or projects.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SyntheticDataPage;
