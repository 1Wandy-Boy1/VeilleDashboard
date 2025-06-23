export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface PatchInfo {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'applied' | 'not_applicable';
  tool: string;
  discoveredAt: string;
  link: string;
  notes?: string;
  source: {
    url: string;
    type: 'rss' | 'html' | 'api' | 'graphql';
    format?: 'json' | 'markdown' | 'xml';
  };
} 