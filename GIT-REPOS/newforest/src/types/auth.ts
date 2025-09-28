export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  lastLogin?: Date;
}

export interface CredentialField {
  key: string;
  value: string;
  type: 'string' | 'password' | 'number' | 'url' | 'email';
  label: string;
  required: boolean;
  encrypted?: boolean;
}

export interface ApiCredential {
  id: string;
  name: string;
  service: string;
  type: 'api_key' | 'oauth' | 'custom';
  fields: CredentialField[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Legacy support
  credentials?: Record<string, any>;
}

export interface WorkflowConfig {
  id: string;
  name: string;
  service: string;
  settings: {
    [key: string]: any;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  credentials: ApiCredential[];
  configs: WorkflowConfig[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CredentialFormData {
  name: string;
  service: ApiCredential['service'];
  type: ApiCredential['type'];
  credentials: {
    [key: string]: string;
  };
} 