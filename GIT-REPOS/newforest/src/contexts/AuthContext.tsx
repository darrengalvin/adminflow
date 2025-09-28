import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, ApiCredential, WorkflowConfig, CredentialFormData } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  addCredential: (credential: CredentialFormData) => Promise<void>;
  updateCredential: (id: string, credential: Partial<CredentialFormData>) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;
  getCredential: (service: string) => ApiCredential | null;
  addConfig: (config: Omit<WorkflowConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateConfig: (id: string, config: Partial<WorkflowConfig>) => Promise<void>;
  getConfig: (service: string) => WorkflowConfig | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simple encryption/decryption (in production, use proper encryption)
const encrypt = (text: string): string => {
  return btoa(text); // Base64 encoding (NOT secure for production)
};

const decrypt = (encryptedText: string): string => {
  try {
    return atob(encryptedText); // Base64 decoding
  } catch {
    return encryptedText;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    credentials: [],
    configs: []
  });

  // Load saved auth state on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminflow_auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        // Decrypt credentials
        const decryptedCredentials = parsed.credentials?.map((cred: ApiCredential) => ({
          ...cred,
          credentials: Object.fromEntries(
            Object.entries(cred.credentials).map(([key, value]) => [key, decrypt(value as string)])
          )
        })) || [];
        
        setAuthState({
          ...parsed,
          credentials: decryptedCredentials
        });
      } catch (error) {
        console.error('Failed to load auth state:', error);
        localStorage.removeItem('adminflow_auth');
      }
    }
  }, []);

  // Save auth state to localStorage
  const saveAuthState = (newState: AuthState) => {
    const stateToSave = {
      ...newState,
      credentials: newState.credentials.map(cred => ({
        ...cred,
        credentials: Object.fromEntries(
          Object.entries(cred.credentials).map(([key, value]) => [key, encrypt(value)])
        )
      }))
    };
    localStorage.setItem('adminflow_auth', JSON.stringify(stateToSave));
    setAuthState(newState);
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Demo authentication - in production, call your auth API
    if (credentials.email === 'admin@newforest.com' && credentials.password === 'admin123') {
      const user: User = {
        id: '1',
        email: credentials.email,
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
        lastLogin: new Date()
      };

      const newState = {
        ...authState,
        isAuthenticated: true,
        user,
        token: 'demo_token_' + Date.now()
      };

      saveAuthState(newState);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('adminflow_auth');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      credentials: [],
      configs: []
    });
  };

  const addCredential = async (credentialData: CredentialFormData): Promise<void> => {
    const newCredential: ApiCredential = {
      id: 'cred_' + Date.now(),
      name: credentialData.name,
      service: credentialData.service,
      type: credentialData.type,
      credentials: credentialData.credentials,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newState = {
      ...authState,
      credentials: [...authState.credentials, newCredential]
    };

    saveAuthState(newState);
  };

  const updateCredential = async (id: string, credentialData: Partial<CredentialFormData>): Promise<void> => {
    const updatedCredentials = authState.credentials.map(cred => 
      cred.id === id 
        ? { 
            ...cred, 
            ...credentialData,
            updatedAt: new Date()
          }
        : cred
    );

    const newState = {
      ...authState,
      credentials: updatedCredentials
    };

    saveAuthState(newState);
  };

  const deleteCredential = async (id: string): Promise<void> => {
    const filteredCredentials = authState.credentials.filter(cred => cred.id !== id);

    const newState = {
      ...authState,
      credentials: filteredCredentials
    };

    saveAuthState(newState);
  };

  const getCredential = (service: string): ApiCredential | null => {
    return authState.credentials.find(cred => cred.service === service && cred.isActive) || null;
  };

  const addConfig = async (configData: Omit<WorkflowConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    const newConfig: WorkflowConfig = {
      ...configData,
      id: 'config_' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newState = {
      ...authState,
      configs: [...authState.configs, newConfig]
    };

    saveAuthState(newState);
  };

  const updateConfig = async (id: string, configData: Partial<WorkflowConfig>): Promise<void> => {
    const updatedConfigs = authState.configs.map(config => 
      config.id === id 
        ? { 
            ...config, 
            ...configData,
            updatedAt: new Date()
          }
        : config
    );

    const newState = {
      ...authState,
      configs: updatedConfigs
    };

    saveAuthState(newState);
  };

  const getConfig = (service: string): WorkflowConfig | null => {
    return authState.configs.find(config => config.service === service && config.isActive) || null;
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    addCredential,
    updateCredential,
    deleteCredential,
    getCredential,
    addConfig,
    updateConfig,
    getConfig
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 