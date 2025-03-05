
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  visualizationData?: any[];
}

export interface SuggestionLink {
  id: string;
  text: string;
  query: string;
}
