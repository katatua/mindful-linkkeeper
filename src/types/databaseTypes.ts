
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
