
export interface FonteDados {
  id: number;
  nome_sistema: string;
  descricao: string;
  tecnologia: string;
  entidade?: string;
  data_importacao?: string;
}

export interface DadosExtraidos {
  fonte_id: number;
  tipo: string;
  conteudo: any;
  data_extracao: string;
}

export interface Instituicao {
  id: string;
  nome_instituicao: string;
  localizacao: string;
  area_atividade: string;
  outros_detalhes?: string;
}

export interface CooperacaoInternacional {
  id: string;
  nome_parceiro: string;
  tipo_interacao: string;
  data_inicio: string;
  data_fim?: string;
  outros_detalhes?: string;
}

export interface DocumentoExtraido {
  id: string;
  fonte_id: number;
  nome: string;
  tipo: string;
  tamanho: string;
  data_extracao: string;
  conteudo: string;
  metadata?: Record<string, any>;
  ai_summary?: string;
  ai_analysis?: string;
  fileUrl?: string;
  status?: 'pendente' | 'analisado' | 'erro';
}

export interface AniStartup {
  id: string;
  name: string;
  founding_year: number;
  sector: string;
  funding_raised: number;
  employees_count: number;
  region: string;
  description: string;
  success_metrics?: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AniTechAdoption {
  id: string;
  technology_name: string;
  sector: string;
  adoption_rate: number;
  measurement_year: number;
  region: string;
  benefits: string[];
  challenges: string[];
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface AniInnovationNetwork {
  id: string;
  network_name: string;
  founding_year: number;
  member_count: number;
  focus_areas: string[];
  geographic_scope: string;
  key_partners: string[];
  achievements?: string;
  created_at: string;
  updated_at: string;
}

export interface AniInnovationPolicy {
  id: string;
  policy_name: string;
  implementation_year: number;
  policy_type: string;
  description?: string;
  target_sectors: string[];
  impact_metrics?: Record<string, any>;
  status: string;
  issuing_authority?: string;
  created_at: string;
  updated_at: string;
}

export interface AniResearchPublication {
  id: string;
  title: string;
  authors: string[];
  publication_date: string;
  journal?: string;
  institution?: string;
  research_area: string;
  citation_count: number;
  impact_factor?: number;
  is_open_access: boolean;
  created_at: string;
  updated_at: string;
}
