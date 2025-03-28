
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
  },
  {
    id: "5ef67g89-0123-4efg-hab4-5678efgh9012",
    name: "Green Energy Innovation Fund",
    description: "Funding for projects developing new renewable energy technologies",
    total_budget: 7500000,
    start_date: "2025-03-01",
    end_date: "2026-09-30",
    application_deadline: "2025-01-31",
    funding_type: "grant",
    sector_focus: ["renewable energy", "energy efficiency", "sustainable power"],
    eligibility_criteria: "Organizations focused on renewable energy solutions",
    success_rate: 28
  },
  {
    id: "6fg78h90-1234-5fgh-iab5-6789fghi0123",
    name: "Sustainable Agriculture Research Initiative",
    description: "Supporting innovative approaches to sustainable farming and agriculture",
    total_budget: 4500000,
    start_date: "2025-02-01",
    end_date: "2026-07-31",
    application_deadline: "2024-12-31",
    funding_type: "research grant",
    sector_focus: ["agriculture", "sustainability", "food production"],
    eligibility_criteria: "Agricultural research institutions and technology companies",
    success_rate: 32
  },
  {
    id: "7gh89i01-2345-6ghi-jab6-7890ghij1234",
    name: "SME Digital Transformation Support",
    description: "Helping small businesses adopt digital technologies and processes",
    total_budget: 2800000,
    start_date: "2025-01-15",
    end_date: "2025-12-15",
    application_deadline: "2024-12-01",
    funding_type: "voucher",
    sector_focus: ["digital transformation", "SMEs", "technology adoption"],
    eligibility_criteria: "Small and medium enterprises seeking to digitalize operations",
    success_rate: 45
  },
  {
    id: "8hi90j12-3456-7hij-kab7-8901hijk2345",
    name: "Advanced Materials Research Grant",
    description: "Funding for development of new materials with industrial applications",
    total_budget: 6000000,
    start_date: "2025-04-01",
    end_date: "2027-03-31",
    application_deadline: "2025-02-15",
    funding_type: "research grant",
    sector_focus: ["materials science", "manufacturing", "nanotechnology"],
    eligibility_criteria: "Research institutions with focus on materials science",
    success_rate: 22
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
  },
  {
    id: "0jk12l34-5678-9jkl-mab9-0123jklm4567",
    title: "Sustainable Biofuel Production from Algae",
    description: "Researching efficient methods to produce biofuels from algae cultivation",
    funding_amount: 850000,
    start_date: "2025-03-01",
    end_date: "2026-08-31",
    status: "approved",
    sector: "biotech",
    region: "Algarve",
    organization: "AlgaeFuel Research Center"
  },
  {
    id: "1kl23m45-6789-0klm-nab0-1234klmn5678",
    title: "AI-Enhanced Medical Imaging Diagnostics",
    description: "Developing machine learning algorithms for improved medical image analysis",
    funding_amount: 1100000,
    start_date: "2025-04-15",
    end_date: "2027-04-14",
    status: "approved",
    sector: "healthcare",
    region: "Porto",
    organization: "Medical AI Solutions"
  },
  {
    id: "2lm34n56-7890-1lmn-oab1-2345lmno6789",
    title: "Precision Agriculture Drone System",
    description: "Creating an automated drone system for monitoring and treating crops",
    funding_amount: 680000,
    start_date: "2025-05-01",
    end_date: "2026-10-31",
    status: "approved",
    sector: "agriculture",
    region: "Alentejo",
    organization: "AgriTech Innovations"
  },
  {
    id: "3mn45o67-8901-2mno-pab2-3456mnop7890",
    title: "Advanced Electric Vehicle Battery Technology",
    description: "Research into high-capacity, fast-charging batteries for electric vehicles",
    funding_amount: 1800000,
    start_date: "2025-06-15",
    end_date: "2027-12-14",
    status: "approved",
    sector: "renewable energy",
    region: "Norte",
    organization: "EV Battery Tech"
  },
  {
    id: "4no56p78-9012-3nop-qab3-4567nopq8901",
    title: "Neural Interface for Prosthetic Limbs",
    description: "Developing advanced neural interfaces for more intuitive prosthetic control",
    funding_amount: 1350000,
    start_date: "2025-07-01",
    end_date: "2027-06-30",
    status: "approved",
    sector: "biotech",
    region: "Coimbra",
    organization: "Neural Prosthetics Lab"
  },
  {
    id: "5op67q89-0123-4opq-rab4-5678opqr9012",
    title: "Blockchain for Supply Chain Transparency",
    description: "Implementing blockchain technology for end-to-end supply chain tracking",
    funding_amount: 900000,
    start_date: "2025-03-15",
    end_date: "2026-09-14",
    status: "approved",
    sector: "technology",
    region: "Lisbon",
    organization: "BlockChain Supply Solutions"
  },
  {
    id: "6pq78r90-1234-5pqr-sab5-6789pqrs0123",
    title: "Offshore Wind Energy Optimization",
    description: "Research into more efficient offshore wind turbine configurations",
    funding_amount: 1650000,
    start_date: "2025-04-01",
    end_date: "2027-03-31",
    status: "approved",
    sector: "renewable energy",
    region: "Norte",
    organization: "Offshore Wind Technologies"
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
  },
  {
    id: "5op67q89-0123-4opq-rab4-5678opqr9012",
    name: "Research Publication Output",
    category: "Innovation",
    value: 1250,
    unit: "count",
    measurement_date: "2024-06-30",
    region: "Lisbon",
    sector: "Academia",
    source: "Research Council"
  },
  {
    id: "6pq78r90-1234-5pqr-sab5-6789pqrs0123",
    name: "Technology Adoption Rate",
    category: "Digitalization",
    value: 76.3,
    unit: "percent",
    measurement_date: "2024-06-30",
    region: "Lisbon",
    sector: "Business",
    source: "Technology Survey 2024"
  },
  {
    id: "7qr89s01-2345-6qrs-tab6-7890qrst1234",
    name: "Innovation Collaboration Index",
    category: "Innovation",
    value: 62.8,
    unit: "score",
    measurement_date: "2024-06-30",
    region: "Lisbon",
    sector: "All",
    source: "Innovation Observatory"
  },
  {
    id: "8rs90t12-3456-7rst-uab7-8901rstu2345",
    name: "AI Implementation Rate",
    category: "Digitalization",
    value: 34.2,
    unit: "percent",
    measurement_date: "2024-06-30",
    region: "Lisbon",
    sector: "Technology",
    source: "AI Survey 2024"
  },
  {
    id: "9st01u23-4567-8stu-vab8-9012stuv3456",
    name: "Green Technology Investment",
    category: "Sustainability",
    value: 890,
    unit: "million EUR",
    measurement_date: "2024-06-30",
    region: "Lisbon",
    sector: "Renewable Energy",
    source: "Green Investment Report"
  },
  {
    id: "0tu12v34-5678-9tuv-wab9-0123tuvw4567",
    name: "Research Success Rate",
    category: "Innovation",
    value: 28.5,
    unit: "percent",
    measurement_date: "2024-06-30",
    region: "Lisbon",
    sector: "Research",
    source: "Research Funding Agency"
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
  },
  {
    id: "9st01u23-4567-8stu-vab8-9012stuv3456",
    program_name: "Nordic-Iberian Renewable Energy Collaboration",
    country: "Sweden",
    partnership_type: "Research and Industry",
    start_date: "2024-02-01",
    end_date: "2026-01-31",
    total_budget: 8500000,
    portuguese_contribution: 1800000,
    focus_areas: ["renewable energy", "clean technology", "energy efficiency"]
  },
  {
    id: "0tu12v34-5678-9tuv-wab9-0123tuvw4567",
    program_name: "European Digital Health Initiative",
    country: "Netherlands",
    partnership_type: "Research and Innovation",
    start_date: "2024-04-01",
    end_date: "2027-03-31",
    total_budget: 14000000,
    portuguese_contribution: 3200000,
    focus_areas: ["digital health", "telemedicine", "health informatics"]
  },
  {
    id: "1uv23w45-6789-0uvw-xab0-1234uvwx5678",
    program_name: "Smart Manufacturing Consortium",
    country: "Germany",
    partnership_type: "Industry and Research",
    start_date: "2024-06-01",
    end_date: "2027-05-31",
    total_budget: 16500000,
    portuguese_contribution: 3800000,
    focus_areas: ["industry 4.0", "automation", "digital manufacturing"]
  },
  {
    id: "2vw34x56-7890-1vwx-yab1-2345vwxy6789",
    program_name: "Southern European Agritech Network",
    country: "Italy",
    partnership_type: "Research",
    start_date: "2024-03-15",
    end_date: "2026-09-14",
    total_budget: 7500000,
    portuguese_contribution: 1500000,
    focus_areas: ["agricultural technology", "precision farming", "sustainable agriculture"]
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
  },
  {
    id: "3wx45y67-8901-2wxy-zab2-3456wxyz7890",
    title: "Research Excellence Program",
    description: "Framework to enhance research quality and international competitiveness",
    scope: "National",
    implementation_date: "2023-07-01",
    status: "active",
    key_objectives: ["research funding", "international collaboration", "talent attraction", "knowledge transfer"]
  },
  {
    id: "4xy56z78-9012-3xyz-aab3-4567xyza8901",
    title: "Digital Transformation Acceleration Plan",
    description: "Comprehensive strategy for accelerating digital transformation across all sectors",
    scope: "National",
    implementation_date: "2023-04-01",
    status: "active",
    key_objectives: ["business digitalization", "digital public services", "digital infrastructure", "digital skills"]
  },
  {
    id: "5yz67a89-0123-4yza-bab4-5678yzab9012",
    title: "SME Innovation Support Framework",
    description: "Policy framework for enhancing innovation capacity in small and medium enterprises",
    scope: "National",
    implementation_date: "2023-03-01",
    status: "active",
    key_objectives: ["financing instruments", "innovation vouchers", "technology adoption", "entrepreneurship"]
  },
  {
    id: "6za78b90-1234-5zab-cab5-6789zabc0123",
    title: "Open Science National Strategy",
    description: "Framework for promoting open access to scientific research and data",
    scope: "National",
    implementation_date: "2023-10-01",
    status: "active",
    key_objectives: ["open access", "research data management", "citizen science", "open innovation"]
  }
];

// Let's add new sample data tables to support more complex queries

export const sampleResearchers = [
  {
    id: "1rs23t45-6789-0rst-uvw0-1234rstu5678",
    name: "Dr. Maria Santos",
    institution_id: "9in01s23-4567-8ins-tab8-9012inst3456",
    specialization: "Renewable Energy",
    h_index: 32,
    publication_count: 78,
    patent_count: 5,
    email: "maria.santos@renewabletech.pt"
  },
  {
    id: "2st34u56-7890-1stu-vwx1-2345stuv6789",
    name: "Dr. João Silva",
    institution_id: "8in90r12-3456-7ins-sab7-8901inst2345",
    specialization: "Artificial Intelligence",
    h_index: 41,
    publication_count: 92,
    patent_count: 3,
    email: "joao.silva@aicenter.pt"
  },
  {
    id: "3tu45v67-8901-2tuv-wxy2-3456tuvw7890",
    name: "Dr. Ana Ferreira",
    institution_id: "7in89q01-2345-6ins-rab6-7890inst1234",
    specialization: "Biotechnology",
    h_index: 38,
    publication_count: 85,
    patent_count: 7,
    email: "ana.ferreira@biotech.pt"
  },
  {
    id: "4uv56w78-9012-3uvw-xyz3-4567uvwx8901",
    name: "Dr. Miguel Costa",
    institution_id: "6in78p90-1234-5ins-qab5-6789inst0123",
    specialization: "Nanotechnology",
    h_index: 29,
    publication_count: 65,
    patent_count: 4,
    email: "miguel.costa@nanotech.pt"
  },
  {
    id: "5vw67x89-0123-4vwx-yza4-5678vwxy9012",
    name: "Dr. Sofia Oliveira",
    institution_id: "5in67o89-0123-4ins-pab4-5678inst9012",
    specialization: "Quantum Computing",
    h_index: 35,
    publication_count: 73,
    patent_count: 2,
    email: "sofia.oliveira@quantum.pt"
  },
  {
    id: "6wx78y90-1234-5wxy-zab5-6789wxyz0123",
    name: "Dr. Rui Almeida",
    institution_id: "4in56n78-9012-3ins-oab3-4567inst8901",
    specialization: "Biotech",
    h_index: 44,
    publication_count: 112,
    patent_count: 8,
    email: "rui.almeida@bioresearch.pt"
  },
  {
    id: "7xy89z01-2345-6xyz-abc6-7890xyza1234",
    name: "Dr. Laura Martins",
    institution_id: "3in45m67-8901-2ins-nab2-3456inst7890",
    specialization: "Renewable Energy",
    h_index: 31,
    publication_count: 69,
    patent_count: 6,
    email: "laura.martins@solartech.pt"
  }
];

export const sampleInstitutions = [
  {
    id: "9in01s23-4567-8ins-tab8-9012inst3456",
    institution_name: "Instituto de Tecnologias Renováveis",
    type: "Research Institute",
    region: "Lisbon",
    founding_date: "1998-03-15",
    collaboration_count: 24,
    specialization_areas: ["solar energy", "wind power", "energy storage"],
    project_history: ["EcoInnovate Phase I", "Green Energy Transition", "Next-Gen Solar Cells"]
  },
  {
    id: "8in90r12-3456-7ins-sab7-8901inst2345",
    institution_name: "Centro de Inteligência Artificial de Portugal",
    type: "Research Center",
    region: "Porto",
    founding_date: "2005-06-22",
    collaboration_count: 31,
    specialization_areas: ["machine learning", "computer vision", "natural language processing"],
    project_history: ["AI for Health", "Smart City AI Infrastructure", "AI Ethics Framework"]
  },
  {
    id: "7in89q01-2345-6ins-rab6-7890inst1234",
    institution_name: "Instituto Nacional de Biotecnologia",
    type: "National Research Institute",
    region: "Coimbra",
    founding_date: "1992-11-08",
    collaboration_count: 28,
    specialization_areas: ["biomedical research", "pharmaceutical development", "genomics"],
    project_history: ["Novel Antibiotics Program", "Biomarker Discovery", "Vaccine Development Platform"]
  },
  {
    id: "6in78p90-1234-5ins-qab5-6789inst0123",
    institution_name: "Centro de Nanotecnologia Aplicada",
    type: "Research Center",
    region: "Braga",
    founding_date: "2007-04-12",
    collaboration_count: 19,
    specialization_areas: ["nanomaterials", "nanoelectronics", "nanofabrication"],
    project_history: ["Advanced Materials Development", "Nano-coatings Research", "Quantum Dots Applications"]
  },
  {
    id: "5in67o89-0123-4ins-pab4-5678inst9012",
    institution_name: "Instituto Quantum de Lisboa",
    type: "Research Institute",
    region: "Lisbon",
    founding_date: "2012-09-20",
    collaboration_count: 15,
    specialization_areas: ["quantum computing", "quantum cryptography", "quantum sensors"],
    project_history: ["Quantum Algorithms", "Quantum Network Prototype", "Quantum Encryption Standards"]
  },
  {
    id: "4in56n78-9012-3ins-oab3-4567inst8901",
    institution_name: "Centro de Investigação em Biotecnologia",
    type: "Research Center",
    region: "Porto",
    founding_date: "2001-07-14",
    collaboration_count: 22,
    specialization_areas: ["biotech", "bioinformatics", "synthetic biology"],
    project_history: ["Biotech Innovation Program", "Synthetic Biology Applications", "Gene Therapy Research"]
  },
  {
    id: "3in45m67-8901-2ins-nab2-3456inst7890",
    institution_name: "Instituto de Energia Solar",
    type: "Research Institute",
    region: "Faro",
    founding_date: "2009-03-08",
    collaboration_count: 17,
    specialization_areas: ["photovoltaics", "solar thermal energy", "concentrated solar power"],
    project_history: ["High-Efficiency Solar Cells", "Solar Energy Storage", "Integrated Solar Systems"]
  }
];

export const samplePatentHolders = [
  {
    id: "1ph23t45-6789-0pht-xyz0-1234phtz5678",
    organization_name: "Instituto de Tecnologias Renováveis",
    institution_id: "9in01s23-4567-8ins-tab8-9012inst3456",
    sector: "Renewable Energy",
    country: "Portugal",
    patent_count: 48,
    innovation_index: 78.5,
    year: 2023
  },
  {
    id: "2ph34u56-7890-1phu-yza1-2345phuv6789",
    organization_name: "Centro de Inteligência Artificial de Portugal",
    institution_id: "8in90r12-3456-7ins-sab7-8901inst2345",
    sector: "Technology",
    country: "Portugal",
    patent_count: 65,
    innovation_index: 82.3,
    year: 2023
  },
  {
    id: "3ph45v67-8901-2phv-zab2-3456phvw7890",
    organization_name: "Instituto Nacional de Biotecnologia",
    institution_id: "7in89q01-2345-6ins-rab6-7890inst1234",
    sector: "Biotech",
    country: "Portugal",
    patent_count: 72,
    innovation_index: 85.9,
    year: 2023
  },
  {
    id: "4ph56w78-9012-3phw-abc3-4567phwx8901",
    organization_name: "TechOptimize Inc.",
    institution_id: null,
    sector: "Technology",
    country: "Portugal",
    patent_count: 31,
    innovation_index: 67.4,
    year: 2023
  },
  {
    id: "5ph67x89-0123-4phx-bcd4-5678phxy9012",
    organization_name: "BioMed Research Institute",
    institution_id: null,
    sector: "Biotech",
    country: "Portugal",
    patent_count: 39,
    innovation_index: 71.2,
    year: 2023
  },
  {
    id: "6ph78y90-1234-5phy-cde5-6789phyz0123",
    organization_name: "Quantum Finance Technologies",
    institution_id: null,
    sector: "Technology",
    country: "Portugal",
    patent_count: 25,
    innovation_index: 64.8,
    year: 2023
  },
  {
    id: "7ph89z01-2345-6phz-def6-7890phza1234",
    organization_name: "EV Battery Tech",
    institution_id: null,
    sector: "Renewable Energy",
    country: "Portugal",
    patent_count: 42,
    innovation_index: 73.5,
    year: 2023
  }
];

export const sampleFundingApplications = [
  {
    id: "1fa23t45-6789-0fat-def0-1234fatd5678",
    program_id: "1ab23c45-6789-0abc-def0-1234abcd5678",
    application_date: "2024-08-15",
    decision_date: "2024-10-30",
    requested_amount: 650000,
    approved_amount: 580000,
    status: "approved",
    sector: "renewable energy",
    region: "Lisbon",
    organization: "Instituto de Tecnologias Renováveis",
    year: 2024
  },
  {
    id: "2fa34u56-7890-1fau-efg1-2345faue6789",
    program_id: "2bc34d56-7890-1bcd-efa1-2345bcde6789",
    application_date: "2024-09-10",
    decision_date: "2024-11-15",
    requested_amount: 950000,
    approved_amount: 800000,
    status: "approved",
    sector: "technology",
    region: "Porto",
    organization: "Centro de Inteligência Artificial de Portugal",
    year: 2024
  },
  {
    id: "3fa45v67-8901-2fav-fgh2-3456favf7890",
    program_id: "3cd45e67-8901-2cde-fab2-3456cdef7890",
    application_date: "2024-10-05",
    decision_date: "2024-12-20",
    requested_amount: 780000,
    approved_amount: 780000,
    status: "approved",
    sector: "biotech",
    region: "Coimbra",
    organization: "Instituto Nacional de Biotecnologia",
    year: 2024
  },
  {
    id: "4fa56w78-9012-3faw-ghi3-4567fawg8901",
    program_id: "4de56f78-9012-3def-gab3-4567defg8901",
    application_date: "2024-11-12",
    decision_date: "2025-01-15",
    requested_amount: 450000,
    approved_amount: 0,
    status: "rejected",
    sector: "manufacturing",
    region: "Aveiro",
    organization: "Manufacturing Innovations Ltd",
    year: 2024
  },
  {
    id: "5fa67x89-0123-4fax-hij4-5678faxh9012",
    program_id: "5ef67g89-0123-4efg-hab4-5678efgh9012",
    application_date: "2024-11-25",
    decision_date: "2025-01-30",
    requested_amount: 720000,
    approved_amount: 650000,
    status: "approved",
    sector: "renewable energy",
    region: "Faro",
    organization: "Instituto de Energia Solar",
    year: 2024
  },
  {
    id: "6fa78y90-1234-5fay-ijk5-6789fayi0123",
    program_id: "6fg78h90-1234-5fgh-iab5-6789fghi0123",
    application_date: "2024-10-18",
    decision_date: "2024-12-15",
    requested_amount: 540000,
    approved_amount: 480000,
    status: "approved",
    sector: "agriculture",
    region: "Alentejo",
    organization: "AgriTech Innovations",
    year: 2024
  },
  {
    id: "7fa89z01-2345-6faz-jkl6-7890fazj1234",
    program_id: "7gh89i01-2345-6ghi-jab6-7890ghij1234",
    application_date: "2024-09-22",
    decision_date: "2024-11-10",
    requested_amount: 320000,
    approved_amount: 280000,
    status: "approved",
    sector: "technology",
    region: "Lisbon",
    organization: "Digital Solutions Portugal",
    year: 2024
  },
  {
    id: "8fa90a12-3456-7faa-klm7-8901faak2345",
    program_id: "8hi90j12-3456-7hij-kab7-8901hijk2345",
    application_date: "2024-10-30",
    decision_date: "2025-01-05",
    requested_amount: 680000,
    approved_amount: 0,
    status: "pending",
    sector: "materials science",
    region: "Braga",
    organization: "Advanced Materials Research",
    year: 2024
  }
];

// Don't need to export any other sample data from this file.
