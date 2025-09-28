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

// Enhanced Task Analysis Types
export interface EnhancedTaskAnalysis {
  id: string;
  created_at: string;
  updated_at: string;
  version: number;
  
  task: {
    title: string;
    description: string;
    content: string;
    type: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: string;
    tags: string[];
    category: string;
  };
  
  context: {
    project_id: string;
    project_name: string;
    repository_url: string;
    branch: string;
    file_paths: string[];
    related_tasks: string[];
    dependencies: string[];
    environment: string;
    technology_stack: string[];
  };
  
  assignment: {
    assigned_to: string;
    assigned_by: string;
    team: string;
    estimated_hours: number;
    actual_hours: number;
    due_date: string;
  };
  
  current_state: {
    approach: string;
    implementation_details: {
      architecture: string;
      technologies_used: string[];
      file_structure: string[];
      current_endpoints: APIEndpoint[];
      current_flow: string[];
    };
    pain_points: string[];
    performance_metrics: {
      response_time: string;
      memory_usage: string;
      scalability: string;
    };
  };
  
  suggested_approach: {
    methodology: string;
    architecture: string;
    technologies_recommended: string[];
    implementation_strategy: string;
    recommended_endpoints: APIEndpoint[];
  };
  
  implementation_steps: ImplementationStep[];
  
  api_specifications: {
    base_url: string;
    version: string;
    authentication: string;
    content_type: string;
    rate_limiting: Record<string, string>;
    security_headers: {
      required: string[];
    };
    error_handling: {
      format: string;
      standard_errors: Record<string, string>;
    };
  };
  
  ai_analysis: {
    analysis_timestamp: string;
    model_version: string;
    confidence_score: number;
    complexity: {
      level: 'low' | 'medium' | 'high' | 'very_high';
      score: number;
      factors: string[];
    };
    effort_estimation: {
      estimated_hours: number;
      confidence: number;
      breakdown: Record<string, number>;
    };
    risk_assessment: {
      overall_risk: string;
      risks: Risk[];
    };
    technical_requirements: {
      skills_needed: string[];
      external_dependencies: string[];
      infrastructure_needs: string[];
      testing_requirements: string[];
    };
    suggestions: string[];
    similar_tasks: SimilarTask[];
  };
  
  considerations: {
    security: {
      concerns: string[];
      solutions: string[];
    };
    scalability: {
      horizontal_scaling: string;
      database_considerations: string;
      caching_strategy: string;
      load_balancing: string;
    };
    performance: {
      optimizations: string[];
      monitoring: string[];
    };
    user_experience: {
      improvements: string[];
    };
    compliance: {
      data_protection: string;
      password_requirements: string;
      audit_logging: string;
      session_management: string;
    };
  };
  
  workflow: {
    current_stage: string;
    stages: WorkflowStage[];
    blockers: string[];
    progress_percentage: number;
  };
  
  collaboration: {
    comments: Comment[];
    reviewers: string[];
    stakeholders: string[];
  };
  
  metrics: {
    code_changes: {
      files_modified: number;
      lines_added: number;
      lines_removed: number;
    };
    quality_scores: {
      code_quality: number;
      test_coverage: number;
      documentation_score: number;
    };
  };
  
  integrations: {
    jira_ticket: string;
    pull_request: string;
    deployment_status: string;
    ci_cd_status: string;
  };
  
  testing: {
    unit_tests: string[];
    integration_tests: string[];
    security_tests: string[];
    performance_tests: string[];
  };
  
  deployment: {
    strategy: string;
    rollback_plan: string;
    monitoring: {
      metrics: string[];
      alerts: string[];
    };
  };
  
  documentation: {
    api_docs: string;
    migration_guide: string;
    security_guide: string;
    troubleshooting: string;
  };
  
  metadata: {
    source: string;
    last_ai_analysis: string;
    analysis_triggers: string[];
    data_version: string;
    archived: boolean;
  };
}

export interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  parameters: {
    required: Parameter[];
    optional: Parameter[];
  };
  headers?: {
    required: string[];
    optional?: string[];
  };
  response: {
    success: Record<string, any>;
    error: Record<string, any>;
  };
  status_codes?: Record<string, string>;
}

export interface Parameter {
  name: string;
  type: string;
  validation?: string;
  example?: string;
  default?: any;
  description?: string;
}

export interface ImplementationStep {
  step: number;
  phase: string;
  title: string;
  description: string;
  tasks: string[];
  estimated_time: string;
  dependencies: string[];
  deliverables?: string[];
  files_to_create?: string[];
  acceptance_criteria?: string[];
}

export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
}

export interface SimilarTask {
  task_id: string;
  similarity_score: number;
  reason: string;
}

export interface WorkflowStage {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  started_at?: string;
  completed_at?: string;
}

export interface Comment {
  id: string;
  user_id: string;
  timestamp: string;
  content: string;
  type: string;
}