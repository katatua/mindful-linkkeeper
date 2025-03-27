
// Sample data for testing database queries
export const sampleFundingPrograms = [
  {
    id: "1ab23c45-6789-0abc-def0-1234abcd5678",
    name: "EcoInnovate Renewable Energy Fund",
    description: "Funding for innovative renewable energy research and development projects",
    total_budget: 5000000,
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    application_deadline: "2024-11-30",
    funding_type: "grant",
    sector_focus: ["renewable energy", "sustainability", "clean tech"],
    eligibility_criteria: "Research institutions and companies focused on renewable energy innovation",
    success_rate: 35
  },
  {
    id: "2bc34d56-7890-1bcd-efa1-2345bcde6789",
    name: "Digital Transformation Initiative",
    description: "Supporting digital transformation projects across industries",
    total_budget: 10000000,
    start_date: "2025-02-15",
    end_date: "2026-02-14",
    application_deadline: "2024-12-15",
    funding_type: "grant",
    sector_focus: ["technology", "digitalization", "automation"],
    eligibility_criteria: "Small and medium enterprises implementing digital transformation",
    success_rate: 40
  },
  {
    id: "3cd45e67-8901-2cde-fab2-3456cdef7890",
    name: "Biotech Research Advancement Program",
    description: "Supporting cutting-edge biotech research with commercial applications",
    total_budget: 8000000,
    start_date: "2025-03-01",
    end_date: "2027-02-28",
    application_deadline: "2025-01-15",
    funding_type: "research grant",
    sector_focus: ["biotech", "healthcare", "pharmaceuticals"],
    eligibility_criteria: "Research institutions and biotech startups",
    success_rate: 25
  },
  {
    id: "4de56f78-9012-3def-gab3-4567defg8901",
    name: "SME Innovation Accelerator",
    description: "Fast-track funding for innovative SMEs across all sectors",
    total_budget: 3000000,
    start_date: "2025-04-01",
    end_date: "2025-10-31",
    application_deadline: "2025-02-28",
    funding_type: "accelerator",
    sector_focus: ["technology", "manufacturing", "services"],
    eligibility_criteria: "Small and medium enterprises with fewer than 250 employees",
    success_rate: 30
  }
];

export const sampleProjects = [
  {
    id: "5ef67g89-0123-4efg-hab4-5678efgh9012",
    title: "Advanced Solar Cell Efficiency Enhancement",
    description: "Research project developing new materials to improve solar cell efficiency by 40%",
    funding_amount: 750000,
    start_date: "2025-03-15",
    end_date: "2026-09-14",
    status: "approved",
    sector: "renewable energy",
    region: "Lisbon",
    organization: "Instituto Solar de Portugal"
  },
  {
    id: "6fg78h90-1234-5fgh-iab5-6789fghi0123",
    title: "AI-Powered Manufacturing Optimization Platform",
    description: "Developing an AI system to optimize manufacturing processes and reduce waste",
    funding_amount: 1200000,
    start_date: "2025-04-01",
    end_date: "2026-10-31",
    status: "approved",
    sector: "technology",
    region: "Porto",
    organization: "TechOptimize Inc."
  },
  {
    id: "7gh89i01-2345-6ghi-jab6-7890ghij1234",
    title: "Novel Antibiotics Discovery Program",
    description: "Research into new antibiotic compounds effective against resistant bacteria",
    funding_amount: 950000,
    start_date: "2025-05-01",
    end_date: "2027-04-30",
    status: "approved",
    sector: "biotech",
    region: "Coimbra",
    organization: "BioMed Research Institute"
  },
  {
    id: "8hi90j12-3456-7hij-kab7-8901hijk2345",
    title: "Smart City Infrastructure Deployment",
    description: "Implementation of IoT sensors and systems for urban management",
    funding_amount: 1500000,
    start_date: "2025-06-01",
    end_date: "2026-12-31",
    status: "approved",
    sector: "technology",
    region: "Lisbon",
    organization: "Urban Tech Solutions"
  },
  {
    id: "9ij01k23-4567-8ijk-lab8-9012ijkl3456",
    title: "Quantum Computing Applications in Finance",
    description: "Exploring quantum computing applications for financial risk modeling",
    funding_amount: 2000000,
    start_date: "2025-07-01",
    end_date: "2027-06-30",
    status: "approved",
    sector: "technology",
    region: "Porto",
    organization: "Quantum Finance Technologies"
  }
];

export const sampleMetrics = [
  {
    id: "0jk12l34-5678-9jkl-mab9-0123jklm4567",
    name: "R&D Investment Ratio",
    category: "Innovation",
    value: 2.5,
    unit: "percent of GDP",
    measurement_date: "2024-06-30",
    region: "Lisbon",
    sector: "All",
    source: "Innovation Survey 2024"
  },
  {
    id: "1kl23m45-6789-0klm-nab0-1234klmn5678",
    name: "Patent Applications",
    category: "Innovation",
    value: 450,
    unit: "count",
    measurement_date: "2024-06-30",
    region: "Lisbon",
    sector: "Technology",
    source: "Patent Office"
  },
  {
    id: "2lm34n56-7890-1lmn-oab1-2345lmno6789",
    name: "Startup Formation Rate",
    category: "Entrepreneurship",
    value: 8.5,
    unit: "percent YoY",
    measurement_date: "2024-06-30",
    region: "Porto",
    sector: "All",
    source: "Startup Registry"
  },
  {
    id: "3mn45o67-8901-2mno-pab2-3456mnop7890",
    name: "Renewable Energy Adoption",
    category: "Sustainability",
    value: 42.0,
    unit: "percent",
    measurement_date: "2024-06-30",
    region: "North",
    sector: "Energy",
    source: "Energy Department"
  },
  {
    id: "4no56p78-9012-3nop-qab3-4567nopq8901",
    name: "Digital Transformation Index",
    category: "Digitalization",
    value: 68.5,
    unit: "score",
    measurement_date: "2024-06-30",
    region: "National",
    sector: "All",
    source: "Digital Economy Report"
  }
];

export const sampleCollaborations = [
  {
    id: "5op67q89-0123-4opq-rab4-5678opqr9012",
    program_name: "Horizon Europe Quantum Initiative",
    country: "Germany",
    partnership_type: "Research",
    start_date: "2024-01-01",
    end_date: "2027-12-31",
    total_budget: 15000000,
    portuguese_contribution: 3000000,
    focus_areas: ["quantum computing", "AI research", "cybersecurity"]
  },
  {
    id: "6pq78r90-1234-5pqr-sab5-6789pqrs0123",
    program_name: "Renewable Energy Research Network",
    country: "Denmark",
    partnership_type: "Research",
    start_date: "2024-03-01",
    end_date: "2026-02-28",
    total_budget: 9500000,
    portuguese_contribution: 2000000,
    focus_areas: ["renewable energy", "energy storage", "power grid optimization"]
  },
  {
    id: "7qr89s01-2345-6qrs-tab6-7890qrst1234",
    program_name: "Mediterranean Biotech Alliance",
    country: "Spain",
    partnership_type: "Research and Commercialization",
    start_date: "2024-05-01",
    end_date: "2028-04-30",
    total_budget: 12000000,
    portuguese_contribution: 2500000,
    focus_areas: ["biotech", "pharmaceuticals", "medical research"]
  },
  {
    id: "8rs90t12-3456-7rst-uab7-8901rstu2345",
    program_name: "Atlantic AI Research Corridor",
    country: "France",
    partnership_type: "Research",
    start_date: "2024-07-01",
    end_date: "2027-06-30",
    total_budget: 18000000,
    portuguese_contribution: 4000000,
    focus_areas: ["AI research", "machine learning", "natural language processing"]
  }
];

export const samplePolicyFrameworks = [
  {
    id: "9st01u23-4567-8stu-vab8-9012stuv3456",
    title: "Digital Portugal 2030",
    description: "Strategic framework for Portugal's digital transformation and innovation ecosystem",
    scope: "National",
    implementation_date: "2023-01-01",
    status: "active",
    key_objectives: ["digital infrastructure", "digital skills", "e-government", "digital economy"]
  },
  {
    id: "0tu12v34-5678-9tuv-wab9-0123tuvw4567",
    title: "Green Innovation Roadmap",
    description: "Policy framework for sustainable innovation and green technology development",
    scope: "National",
    implementation_date: "2023-06-01",
    status: "active",
    key_objectives: ["renewable energy", "circular economy", "sustainable transport", "green jobs"]
  },
  {
    id: "1uv23w45-6789-0uvw-xab0-1234uvwx5678",
    title: "Bioeconomy Strategy 2035",
    description: "Long-term strategy for developing Portugal's bioeconomy sectors",
    scope: "National",
    implementation_date: "2024-01-01",
    status: "active",
    key_objectives: ["biotechnology", "sustainable agriculture", "blue economy", "forest bioeconomy"]
  },
  {
    id: "2vw34x56-7890-1vwx-yab1-2345vwxy6789",
    title: "AI Ethics and Governance Framework",
    description: "Guidelines and regulations for ethical AI development and deployment",
    scope: "National",
    implementation_date: "2023-09-01",
    status: "active",
    key_objectives: ["ethical AI", "algorithmic transparency", "data protection", "AI skills"]
  }
];
