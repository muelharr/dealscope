export interface AISummary {
  dealScore: number;
  verdict: 'BUY NOW' | 'WAIT' | 'AVOID';
  confidence: number;
  summary: string;
  forecast?: string;
  insights: AIInsight[];
}

export interface AIInsight {
  id: string;
  type: 'positive' | 'warning' | 'info';
  text: string;
}
