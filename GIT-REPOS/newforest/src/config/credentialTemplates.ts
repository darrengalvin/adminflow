import { CredentialField } from '../types/auth';

export interface CredentialTemplate {
  service: string;
  displayName: string;
  description: string;
  icon: string;
  fields: Omit<CredentialField, 'value'>[];
}

export const credentialTemplates: CredentialTemplate[] = [
  {
    service: 'gohighlevel',
    displayName: 'GoHighLevel',
    description: 'CRM and Marketing Automation Platform',
    icon: 'Target',
    fields: [
      {
        key: 'jwt_token',
        type: 'password',
        label: 'JWT Token',
        required: true,
        encrypted: true
      },
      {
        key: 'location_id',
        type: 'string',
        label: 'Location ID',
        required: true,
        encrypted: false
      },
      {
        key: 'pipeline_id',
        type: 'string',
        label: 'Default Pipeline ID',
        required: false,
        encrypted: false
      }
    ]
  },
  {
    service: 'gmail',
    displayName: 'Gmail API',
    description: 'Google Gmail API Integration',
    icon: 'Mail',
    fields: [
      {
        key: 'client_id',
        type: 'string',
        label: 'Client ID',
        required: true,
        encrypted: false
      },
      {
        key: 'client_secret',
        type: 'password',
        label: 'Client Secret',
        required: true,
        encrypted: true
      },
      {
        key: 'refresh_token',
        type: 'password',
        label: 'Refresh Token',
        required: false,
        encrypted: true
      }
    ]
  },
  {
    service: 'xero',
    displayName: 'Xero Accounting',
    description: 'Xero Accounting API Integration',
    icon: 'CreditCard',
    fields: [
      {
        key: 'client_id',
        type: 'string',
        label: 'Client ID',
        required: true,
        encrypted: false
      },
      {
        key: 'client_secret',
        type: 'password',
        label: 'Client Secret',
        required: true,
        encrypted: true
      },
      {
        key: 'tenant_id',
        type: 'string',
        label: 'Tenant ID',
        required: true,
        encrypted: false
      }
    ]
  },
  {
    service: 'pandadoc',
    displayName: 'PandaDoc',
    description: 'Document Management and eSignature',
    icon: 'FileText',
    fields: [
      {
        key: 'api_key',
        type: 'password',
        label: 'API Key',
        required: true,
        encrypted: true
      }
    ]
  },
  {
    service: 'custom',
    displayName: 'Custom Service',
    description: 'Create your own custom credential set',
    icon: 'Settings',
    fields: []
  }
];

export const getCredentialTemplate = (service: string): CredentialTemplate | undefined => {
  return credentialTemplates.find(template => template.service === service);
};

export const getServiceDisplayName = (service: string): string => {
  const template = getCredentialTemplate(service);
  return template?.displayName || service;
}; 