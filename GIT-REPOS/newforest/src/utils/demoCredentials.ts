import { ApiCredential, WorkflowConfig } from '../types/auth';

export const demoCredentials: Omit<ApiCredential, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'GoHighLevel Production',
    service: 'gohighlevel',
    type: 'jwt',
    credentials: {
      location_id: 'qlmxFY68hrnVjyo8cNQC',
      jwt_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6InFsbXhGWTY4aHJuVmp5bzhjTlFDIiwiY29tcGFueV9pZCI6InZsbG9vNnhRTTJKUWcyYTNaWVFOIiwidmVyc2lvbiI6MSwiaWF0IjoxNjkwNTE5MzY1ODc4LCJzdWIiOiJ1c2VyX2lkIn0.mDueX_XSe2Gt-b9ITVWxiWDWWwJHGGYjS6LmOlGkSh8',
      pipeline_id: 'GiZpprwMTc0aBVpaGCPL'
    },
    isActive: true,
    lastUsed: new Date()
  },
  {
    name: 'Gmail API Demo',
    service: 'gmail',
    type: 'oauth',
    credentials: {
      client_id: 'your-gmail-client-id',
      client_secret: 'your-gmail-client-secret',
      refresh_token: 'your-gmail-refresh-token'
    },
    isActive: false, // Start inactive since it's not configured
    lastUsed: undefined
  },
  {
    name: 'Xero Accounting Demo',
    service: 'xero',
    type: 'oauth',
    credentials: {
      client_id: 'your-xero-client-id',
      client_secret: 'your-xero-client-secret',
      tenant_id: 'your-xero-tenant-id'
    },
    isActive: false,
    lastUsed: undefined
  },
  {
    name: 'PandaDoc Demo',
    service: 'pandadoc',
    type: 'api_key',
    credentials: {
      api_key: 'your-pandadoc-api-key',
      sandbox: 'true'
    },
    isActive: false,
    lastUsed: undefined
  }
];

export const demoConfigs: Omit<WorkflowConfig, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'GoHighLevel Pipeline Configuration',
    service: 'gohighlevel',
    settings: {
      pipelines: [
        {
          id: "GiZpprwMTc0aBVpaGCPL",
          name: "Fun Groups",
          stages: [
            { id: "959215d4-d801-40b2-8816-150712c9fcc6", name: "Initial Contact" },
            { id: "stage-2", name: "Proposal Sent" },
            { id: "stage-3", name: "Won" }
          ]
        },
        {
          id: "pipeline-2",
          name: "Outdoor Education",
          stages: [
            { id: "stage-edu-1", name: "Inquiry" },
            { id: "stage-edu-2", name: "Booking" }
          ]
        }
      ],
      default_pipeline: "GiZpprwMTc0aBVpaGCPL",
      default_stage: "959215d4-d801-40b2-8816-150712c9fcc6",
      tags: {
        gmail_lead: "gmail-lead",
        ai_processed: "ai-processed",
        team_building: "team-building"
      }
    },
    isActive: true
  },
  {
    name: 'Gmail Processing Rules',
    service: 'gmail',
    settings: {
      trigger_subject: "Incoming Lead",
      label_processed: "processed-by-ai",
      label_failed: "processing-failed",
      ai_model: "claude-3-sonnet",
      confidence_threshold: 0.8
    },
    isActive: true
  },
  {
    name: 'Xero Invoice Settings',
    service: 'xero',
    settings: {
      account_code: "063",
      deposit_percentage: 50,
      payment_terms: 14,
      currency: "GBP",
      tax_rate: 20
    },
    isActive: true
  }
];

export const getServiceDescription = (service: string): string => {
  const descriptions = {
    gmail: 'Monitors Gmail for lead emails and processes them with AI',
    gohighlevel: 'Creates and manages opportunities in your GoHighLevel CRM',
    xero: 'Handles invoicing and payment tracking in Xero accounting',
    pandadoc: 'Manages document creation and e-signature workflows',
    fareharbor: 'Integrates with FareHarbor for activity bookings and manifests',
    other: 'Custom API integration for specialized workflows'
  };
  return descriptions[service as keyof typeof descriptions] || 'Custom integration';
};

export const getServiceRequirements = (service: string): string[] => {
  const requirements = {
    gmail: [
      'Google Cloud Console project with Gmail API enabled',
      'OAuth 2.0 credentials configured',
      'Refresh token generated for your Gmail account'
    ],
    gohighlevel: [
      'GoHighLevel account with API access',
      'JWT token from your GoHighLevel settings',
      'Location ID from your GoHighLevel account'
    ],
    xero: [
      'Xero Developer account and app registration',
      'OAuth 2.0 credentials configured',
      'Tenant ID from your Xero organization'
    ],
    pandadoc: [
      'PandaDoc account with API access',
      'API key from PandaDoc settings',
      'Sandbox mode for testing (recommended)'
    ],
    fareharbor: [
      'FareHarbor account with API access',
      'API key and User key from FareHarbor',
      'Company shortname configured'
    ]
  };
  return requirements[service as keyof typeof requirements] || ['API credentials required'];
}; 