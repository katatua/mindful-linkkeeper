
export interface FonteDados {
  id: number;
  nome_sistema: string;
  descricao: string;
  tecnologia: string;
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
}
