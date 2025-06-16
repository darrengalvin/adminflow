export interface WorkflowStep {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  type?: 'api' | 'ai' | 'decision' | 'notification' | 'document' | 'data-input';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'active' | 'error';
  duration?: number;
  startTime?: Date;
  endTime?: Date;
  data?: any;
  error?: string;
  errorMessage?: string;
  dependencies?: string[];
  tips?: string[];
  phase?: string;
  config?: {
    fields?: string[];
    description?: string;
    icon?: string;
    [key: string]: any;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  steps: WorkflowStep[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  estimatedDuration: number;
  actualDuration?: number;
  triggers: string[];
  tags: string[];
}

export interface APIIntegration {
  id: string;
  name: string;
  type: 'crm' | 'document' | 'payment' | 'email' | 'calendar' | 'accounting' | 'booking';
  status: 'connected' | 'disconnected' | 'error' | 'authenticating';
  lastSync: Date;
  requestCount: number;
  errorRate: number;
  responseTime: number;
  icon: string;
  color: string;
  isOAuth?: boolean;
  scopes?: string[];
  connectedAccount?: string;
  authUrl?: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  data?: any;
  workflowId?: string;
  stepId?: string;
  userId?: string;
}

export interface KPI {
  id: string;
  name: string;
  value: number | string;
  change: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  workflowId?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: string;
  timeSpent: number;
  impact: string;
  priority: string;
  softwareUsed: string[];
  painPoints: string;
  alternativeActivities: string;
  aiSuggestion: any;
  apiOpportunities: string[];
  createdAt?: string;
}