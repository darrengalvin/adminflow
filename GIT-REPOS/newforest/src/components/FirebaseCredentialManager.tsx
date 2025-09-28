import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Edit3,
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle, 
  XCircle,
  Settings,
  Globe,
  Mail,
  CreditCard,
  FileText,
  Target,
  Calendar,
  Loader,
  AlertCircle,
  Database
} from 'lucide-react';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { ApiCredential, WorkflowConfig } from '../types/auth';
import { seedFirebaseWithDemoData, hasExistingData } from '../utils/seedFirebaseData';

interface FirebaseCredentialManagerProps {
  onBack?: () => void;
}

interface CredentialFormData {
  name: string;
  service: string;
  type: string;
  credentials: Record<string, any>;
}

const FirebaseCredentialManager: React.FC<FirebaseCredentialManagerProps> = ({ onBack }) => {
  const { user, saveCredential, getAllCredentials, deleteCredential, saveConfig, getAllConfigs, deleteConfig } = useFirebaseAuth();
  
  const [activeTab, setActiveTab] = useState<'credentials' | 'configs'>('credentials');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCredential, setEditingCredential] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // State for credentials and configs
  const [credentials, setCredentials] = useState<Record<string, ApiCredential>>({});
  const [configs, setConfigs] = useState<Record<string, WorkflowConfig>>({});

  const [credentialForm, setCredentialForm] = useState<CredentialFormData>({
    name: '',
    service: 'gmail',
    type: 'api_key',
    credentials: {}
  });

  // Load data from Firebase on component mount and seed demo data if needed
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Check if user has existing data
        const hasData = await hasExistingData(user.uid);
        
        // If no existing data, seed with demo credentials
        if (!hasData) {
          console.log('🌱 New user detected, seeding with demo data...');
          await seedFirebaseWithDemoData(user.uid);
        }
        
        // Load credentials and configs
        const [credentialsData, configsData] = await Promise.all([
          getAllCredentials(),
          getAllConfigs()
        ]);
        setCredentials(credentialsData);
        setConfigs(configsData);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load credentials and configurations');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, getAllCredentials, getAllConfigs]);

  const serviceIcons = {
    gmail: Mail,
    gohighlevel: Target,
    xero: CreditCard,
    pandadoc: FileText,
    fareharbor: Calendar,
    other: Globe
  };

  const serviceConfigs = {
    gmail: {
      fields: [
        { key: 'client_id', label: 'Client ID', type: 'text', required: true },
        { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
        { key: 'refresh_token', label: 'Refresh Token', type: 'password', required: false }
      ]
    },
    gohighlevel: {
      fields: [
        { key: 'location_id', label: 'Location ID', type: 'text', required: true },
        { key: 'jwt_token', label: 'JWT Token', type: 'password', required: true },
        { key: 'pipeline_id', label: 'Default Pipeline ID', type: 'text', required: false }
      ]
    },
    xero: {
      fields: [
        { key: 'client_id', label: 'Client ID', type: 'text', required: true },
        { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
        { key: 'tenant_id', label: 'Tenant ID', type: 'text', required: true }
      ]
    },
    pandadoc: {
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password', required: true }
      ]
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading credentials from Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  ← Back
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Security Center</h1>
                  <p className="text-slate-600">Manage API credentials and workflow configurations</p>
                </div>
              </div>
            </div>
            
            {/* Firebase Status */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <Database className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Firebase Secured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Firebase Info Banner */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Database className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">🔒 Secure Firebase Storage</h3>
              <p className="text-xs text-blue-700">
                Your API credentials are now stored securely in Firebase Firestore with enterprise-grade encryption. 
                Only you can access your credentials, and they're never stored in your browser.
              </p>
            </div>
          </div>
        </div>

        {/* Simple Credentials List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">API Credentials</h2>
              <p className="text-slate-600">Securely store and manage your API keys and tokens</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Credential</span>
            </button>
          </div>

          {/* Credentials Display */}
          {Object.keys(credentials).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Ready for Firebase Storage</h3>
              <p className="text-slate-600 mb-6">Add your first API credential to store it securely in Firebase</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={async () => {
                    if (user) {
                      try {
                        setSaving(true);
                        await seedFirebaseWithDemoData(user.uid);
                        // Reload data
                        const [credentialsData, configsData] = await Promise.all([
                          getAllCredentials(),
                          getAllConfigs()
                        ]);
                        setCredentials(credentialsData);
                        setConfigs(configsData);
                      } catch (error: any) {
                        setError(error.message);
                      } finally {
                        setSaving(false);
                      }
                    }
                  }}
                  disabled={saving}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                  <span>Load Demo Credentials</span>
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add First Credential
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(credentials).map(([service, credential]) => {
                const IconComponent = serviceIcons[service as keyof typeof serviceIcons] || Globe;
                return (
                  <div key={service} className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{credential.name}</h3>
                          <p className="text-sm text-slate-500 capitalize">{credential.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center space-x-1">
                          <Database className="h-3 w-3" />
                          <span>Firebase</span>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <button
                          onClick={() => {
                            setCredentialForm({
                              name: credential.name,
                              service: credential.service,
                              type: credential.type,
                              credentials: credential.credentials
                            });
                            setEditingService(service);
                            setShowAddForm(true);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Edit credential"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete the ${credential.name} credential?`)) {
                              try {
                                await deleteCredential(service);
                                const updatedCredentials = await getAllCredentials();
                                setCredentials(updatedCredentials);
                              } catch (error: any) {
                                setError(error.message);
                              }
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete credential"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Simple Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {editingService ? 'Edit Credential' : 'Add New Credential'}
            </h3>
            <p className="text-sm text-slate-600 mb-6">This will be stored securely in Firebase Firestore</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Service</label>
                <select
                  value={credentialForm.service}
                  onChange={(e) => setCredentialForm(prev => ({ ...prev, service: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="gmail">Gmail</option>
                  <option value="gohighlevel">GoHighLevel</option>
                  <option value="xero">Xero</option>
                  <option value="pandadoc">PandaDoc</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={credentialForm.name}
                  onChange={(e) => setCredentialForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Gmail Production API"
                />
              </div>

              {/* Dynamic Credential Fields */}
              {serviceConfigs[credentialForm.service as keyof typeof serviceConfigs] && (
                <div className="space-y-4">
                  <div className="border-t border-slate-200 pt-6 mt-6">
                    <h4 className="text-lg font-medium text-slate-900 mb-4 flex items-center space-x-2">
                      <Key className="h-5 w-5 text-blue-600" />
                      <span>API Credentials</span>
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">Enter your {credentialForm.service.toUpperCase()} API credentials below:</p>
                    <div className="grid grid-cols-1 gap-4">
                      {serviceConfigs[credentialForm.service as keyof typeof serviceConfigs].fields.map((field) => (
                        <div key={field.key} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <input
                            type={field.type}
                            value={credentialForm.credentials[field.key] || ''}
                            onChange={(e) => setCredentialForm(prev => ({
                              ...prev,
                              credentials: {
                                ...prev.credentials,
                                [field.key]: e.target.value
                              }
                            }))}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            placeholder={`Enter your ${field.label.toLowerCase()}`}
                            required={field.required}
                          />
                          {field.key === 'jwt_token' && (
                            <p className="text-xs text-slate-500 mt-1">
                              This is your GoHighLevel JWT token from the API settings
                            </p>
                          )}
                          {field.key === 'location_id' && (
                            <p className="text-xs text-slate-500 mt-1">
                              Found in your GoHighLevel account settings
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingService(null);
                    setCredentialForm({
                      name: '',
                      service: 'gmail',
                      type: 'api_key',
                      credentials: {}
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!credentialForm.name.trim()) {
                      setError('Please enter a credential name');
                      return;
                    }
                    
                    try {
                      setSaving(true);
                      const newCredential: ApiCredential = {
                        id: editingService || `${credentialForm.service}_${Date.now()}`,
                        name: credentialForm.name,
                        service: credentialForm.service,
                        type: credentialForm.type as 'api_key' | 'oauth',
                        credentials: credentialForm.credentials,
                        isActive: true,
                        createdAt: editingService ? credentials[editingService]?.createdAt || new Date() : new Date(),
                        updatedAt: new Date()
                      };
                      
                      await saveCredential(credentialForm.service, newCredential);
                      
                      // Reload credentials
                      const updatedCredentials = await getAllCredentials();
                      setCredentials(updatedCredentials);
                      
                      // Reset form
                      setShowAddForm(false);
                      setEditingService(null);
                      setCredentialForm({
                        name: '',
                        service: 'gmail',
                        type: 'api_key',
                        credentials: {}
                      });
                    } catch (error: any) {
                      setError(error.message);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                  <span>{editingService ? 'Update' : 'Save to Firebase'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseCredentialManager; 