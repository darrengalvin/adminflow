export interface GlobalActivity {
  id: string;
  name: string;
  type: 'workflow' | 'api_call' | 'email_processing' | 'document_generation' | 'payment_check' | 'data_sync';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'paused';
  stage: string;
  details: string;
  progress: number; // 0-100
  startTime: Date;
  estimatedDuration?: number; // in seconds
  currentStep?: string;
  totalSteps?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  workflowId?: string;
  userId?: string;
  metadata?: {
    [key: string]: any;
  };
}

export interface ActivityStats {
  total: number;
  running: number;
  queued: number;
  completed: number;
  failed: number;
}

export interface ActivityContextType {
  activities: GlobalActivity[];
  stats: ActivityStats;
  addActivity: (activity: Omit<GlobalActivity, 'id' | 'startTime'>) => string;
  updateActivity: (id: string, updates: Partial<GlobalActivity>) => void;
  removeActivity: (id: string) => void;
  clearCompleted: () => void;
  pauseActivity: (id: string) => void;
  resumeActivity: (id: string) => void;
} 