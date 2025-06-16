import { Workflow, APIIntegration, LogEntry, KPI, Notification } from '../types';

export const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Customer Onboarding Process',
    description: 'Automated end-to-end customer onboarding with document generation and verification',
    status: 'active',
    priority: 'high',
    progress: 75,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 1800000),
    estimatedDuration: 45,
    actualDuration: 32,
    triggers: ['New CRM Contact', 'Payment Confirmed'],
    tags: ['onboarding', 'automated', 'critical'],
    steps: [
      {
        id: 'step-1',
        name: 'Parse Customer Email',
        type: 'ai',
        status: 'completed',
        duration: 2500,
        startTime: new Date(Date.now() - 3000000),
        endTime: new Date(Date.now() - 2997500),
        data: { confidence: 0.95, entities: ['name', 'email', 'requirements'] }
      },
      {
        id: 'step-2',
        name: 'Create CRM Record',
        type: 'api',
        status: 'completed',
        duration: 1200,
        dependencies: ['step-1']
      },
      {
        id: 'step-3',
        name: 'Generate Welcome Document',
        type: 'document',
        status: 'running',
        startTime: new Date(Date.now() - 30000),
        dependencies: ['step-2']
      },
      {
        id: 'step-4',
        name: 'Schedule Follow-up',
        type: 'api',
        status: 'pending',
        dependencies: ['step-3']
      }
    ]
  },
  {
    id: 'wf-2',
    name: 'Invoice Processing & Payment',
    description: 'Automated invoice generation, approval workflow, and payment processing',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 3600000),
    estimatedDuration: 30,
    actualDuration: 28,
    triggers: ['Project Milestone', 'Time-based'],
    tags: ['billing', 'finance', 'automated'],
    steps: [
      {
        id: 'step-5',
        name: 'Generate Invoice',
        type: 'document',
        status: 'completed',
        duration: 1800
      },
      {
        id: 'step-6',
        name: 'Send for Approval',
        type: 'notification',
        status: 'completed',
        duration: 500,
        dependencies: ['step-5']
      },
      {
        id: 'step-7',
        name: 'Process Payment',
        type: 'api',
        status: 'completed',
        duration: 2200,
        dependencies: ['step-6']
      }
    ]
  },
  {
    id: 'wf-3',
    name: 'Project Status Update',
    description: 'Automated project reporting and stakeholder communication',
    status: 'failed',
    priority: 'low',
    progress: 60,
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 900000),
    estimatedDuration: 15,
    triggers: ['Weekly Schedule'],
    tags: ['reporting', 'communication'],
    steps: [
      {
        id: 'step-8',
        name: 'Collect Project Data',
        type: 'api',
        status: 'completed',
        duration: 1500
      },
      {
        id: 'step-9',
        name: 'AI Analysis & Insights',
        type: 'ai',
        status: 'failed',
        error: 'API rate limit exceeded',
        dependencies: ['step-8']
      }
    ]
  }
];

export const mockAPIIntegrations: APIIntegration[] = [
  {
    id: 'gmail',
    name: 'Gmail API',
    type: 'email',
    status: 'connected',
    lastSync: new Date(Date.now() - 120000),
    requestCount: 2341,
    errorRate: 0.8,
    responseTime: 120,
    icon: 'Mail',
    color: '#EA4335',
    isOAuth: true,
    scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
    connectedAccount: 'events@adminflow.co.uk'
  },
  {
    id: 'gohighlevel',
    name: 'GoHighLevel',
    type: 'crm',
    status: 'connected',
    lastSync: new Date(Date.now() - 180000),
    requestCount: 1847,
    errorRate: 1.2,
    responseTime: 195,
    icon: 'Zap',
    color: '#FF6B35',
    isOAuth: true,
    scopes: ['contacts.readonly', 'contacts.write', 'campaigns.write', 'pipelines.readonly'],
    connectedAccount: 'AdminFlow Automation'
  },
  {
    id: 'salesforce',
    name: 'Salesforce CRM',
    type: 'crm',
    status: 'error',
    lastSync: new Date(Date.now() - 1800000),
    requestCount: 1247,
    errorRate: 8.1,
    responseTime: 645,
    icon: 'Database',
    color: '#00A1E0'
  },
  {
    id: 'pandadoc',
    name: 'PandaDoc',
    type: 'document',
    status: 'connected',
    lastSync: new Date(Date.now() - 600000),
    requestCount: 892,
    errorRate: 1.3,
    responseTime: 180,
    icon: 'FileText',
    color: '#00D4AA'
  },
  {
    id: 'fareharbor',
    name: 'FareHarbor',
    type: 'booking',
    status: 'connected',
    lastSync: new Date(Date.now() - 300000),
    requestCount: 456,
    errorRate: 2.1,
    responseTime: 220,
    icon: 'Ship',
    color: '#0066CC'
  },
  {
    id: 'xero',
    name: 'Xero Accounting',
    type: 'accounting',
    status: 'connected',
    lastSync: new Date(Date.now() - 900000),
    requestCount: 156,
    errorRate: 3.5,
    responseTime: 290,
    icon: 'Calculator',
    color: '#13B5EA'
  },
  {
    id: 'gcalendar',
    name: 'Google Calendar',
    type: 'calendar',
    status: 'connected',
    lastSync: new Date(Date.now() - 240000),
    requestCount: 567,
    errorRate: 1.2,
    responseTime: 165,
    icon: 'Calendar',
    color: '#4285F4'
  },
  {
    id: 'stripe',
    name: 'Stripe Payments',
    type: 'payment',
    status: 'authenticating',
    lastSync: new Date(Date.now() - 3600000),
    requestCount: 89,
    errorRate: 0.0,
    responseTime: 340,
    icon: 'CreditCard',
    color: '#635BFF'
  }
];

export const mockKPIs: KPI[] = [
  {
    id: 'automation-rate',
    name: 'Automation Rate',
    value: '94.2%',
    change: 5.7,
    unit: '%',
    trend: 'up',
    color: '#10B981',
    icon: 'TrendingUp'
  },
  {
    id: 'time-saved',
    name: 'Time Saved',
    value: 127,
    change: 23,
    unit: 'hours/week',
    trend: 'up',
    color: '#3B82F6',
    icon: 'Clock'
  },
  {
    id: 'error-rate',
    name: 'Error Rate',
    value: '2.1%',
    change: -1.3,
    unit: '%',
    trend: 'down',
    color: '#EF4444',
    icon: 'AlertTriangle'
  },
  {
    id: 'cost-savings',
    name: 'Cost Savings',
    value: '£24.8K',
    change: 18.5,
    unit: '/month',
    trend: 'up',
    color: '#F59E0B',
    icon: 'DollarSign'
  }
];

export const mockLogs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 300000),
    level: 'info',
    source: 'WorkflowEngine',
    message: 'Workflow "Customer Onboarding Process" completed successfully',
    workflowId: 'wf-1',
    stepId: 'step-2'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 450000),
    level: 'warning',
    source: 'APIService',
    message: 'High response time detected for Xero API (890ms)',
    data: { responseTime: 890, threshold: 500 }
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 600000),
    level: 'error',
    source: 'AIProcessor',
    message: 'Failed to process document: Rate limit exceeded',
    workflowId: 'wf-3',
    stepId: 'step-9',
    data: { error: 'Rate limit exceeded', retryAfter: 300 }
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 750000),
    level: 'debug',
    source: 'DatabaseService',
    message: 'Cache refresh completed for user preferences',
    data: { cacheSize: '2.4MB', refreshTime: '45ms' }
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'success',
    title: 'Workflow Completed',
    message: 'Customer Onboarding Process finished successfully',
    timestamp: new Date(Date.now() - 300000),
    read: false,
    workflowId: 'wf-1'
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'Performance Alert',
    message: 'Xero API response time above threshold',
    timestamp: new Date(Date.now() - 450000),
    read: false
  },
  {
    id: 'notif-3',
    type: 'error',
    title: 'Workflow Failed',
    message: 'Project Status Update workflow encountered an error',
    timestamp: new Date(Date.now() - 600000),
    read: true,
    workflowId: 'wf-3'
  }
];