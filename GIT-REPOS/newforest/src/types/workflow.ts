export interface WorkflowRun {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  currentStep?: string;
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  workflowData?: any; // The data being processed
  activities: WorkflowActivity[];
  error?: string;
  userId?: string;
  createdBy: string;
  tags?: string[];
}

export interface WorkflowActivity {
  id: string;
  timestamp: Date;
  step: string;
  action: string;
  status: 'running' | 'completed' | 'failed';
  details?: string;
  data?: any;
  duration?: number; // in milliseconds
  error?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  steps: WorkflowStep[];
  estimatedDuration: number; // in minutes
  tags: string[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  order: number;
  required: boolean;
  estimatedDuration: number; // in seconds
} 