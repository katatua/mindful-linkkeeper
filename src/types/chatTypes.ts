
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  visualizationData?: any[];
  thinking?: string;
}

export interface SuggestionLink {
  id: string;
  text: string;
  query: string;
}
