import React, { useState } from 'react';
import { 
  Key, 
  Plus, 
  Edit3, 
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
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ApiCredential, CredentialFormData, WorkflowConfig } from '../types/auth';

interface CredentialManagerProps {
  onBack?: () => void;
}

const CredentialManager: React.FC<CredentialManagerProps> = ({ onBack }) => {
  const { credentials, configs, addCredential, updateCredential, deleteCredential, addConfig, updateConfig } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'credentials' | 'configs'>('credentials');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [editingCredential, setEditingCredential] = useState<ApiCredential | null>(null);
  const [editingConfig, setEditingConfig] = useState<WorkflowConfig | null>(null);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  const [credentialForm, setCredentialForm] = useState<CredentialFormData>({
    name: '',
    service: 'gmail',
    type: 'api_key',
    credentials: {}
  });

  const [configForm, setConfigForm] = useState({
    name: '',
    service: '',
    settings: {}
  });

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
        { key: 'api_key', label: 'API Key', type: 'password', required: true },
        { key: 'sandbox', label: 'Sandbox Mode', type: 'checkbox', required: false }
      ]
    },
    fareharbor: {
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password', required: true },
        { key: 'user_key', label: 'User Key', type: 'password', required: true },
        { key: 'shortname', label: 'Company Shortname', type: 'text', required: true }
      ]
    }
  };

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCredential) {
        await updateCredential(editingCredential.id, credentialForm);
        setEditingCredential(null);
      } else {
        await addCredential(credentialForm);
      }
      setShowAddForm(false);
      setCredentialForm({
        name: '',
        service: 'gmail',
        type: 'api_key',
        credentials: {}
      });
    } catch (error) {
      console.error('Failed to save credential:', error);
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingConfig) {
        await updateConfig(editingConfig.id, { ...configForm, isActive: true });
        setEditingConfig(null);
      } else {
        await addConfig({ ...configForm, isActive: true });
      }
      setShowConfigForm(false);
      setConfigForm({
        name: '',
        service: '',
        settings: {}
      });
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  const togglePasswordVisibility = (credentialId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
  };

  const startEditCredential = (credential: ApiCredential) => {
    setCredentialForm({
      name: credential.name,
      service: credential.service,
      type: credential.type,
      credentials: credential.credentials
    });
    setEditingCredential(credential);
    setShowAddForm(true);
  };

  const startEditConfig = (config: WorkflowConfig) => {
    setConfigForm({
      name: config.name,
      service: config.service,
      settings: config.settings
    });
    setEditingConfig(config);
    setShowConfigForm(true);
  };

  const getServiceConfig = (service: string) => {
    return serviceConfigs[service as keyof typeof serviceConfigs] || { fields: [] };
  };

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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-8 w-fit">
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'credentials'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4 inline mr-2" />
            API Credentials
          </button>
          <button
            onClick={() => setActiveTab('configs')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'configs'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Configurations
          </button>
        </div>

        {/* Credentials Tab */}
        {activeTab === 'credentials' && (
          <div className="space-y-6">
            {/* Add Credential Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">API Credentials</h2>
                <p className="text-slate-600">Securely store and manage your API keys and tokens</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Credential</span>
              </button>
            </div>

            {/* Credentials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {credentials.map((credential) => {
                const ServiceIcon = serviceIcons[credential.service] || Globe;
                return (
                  <div key={credential.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ServiceIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{credential.name}</h3>
                          <p className="text-sm text-slate-600 capitalize">{credential.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {credential.isActive ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {Object.entries(credential.credentials).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 capitalize">{key.replace('_', ' ')}:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-slate-900">
                              {showPasswords[credential.id] ? value : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(credential.id)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              {showPasswords[credential.id] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        {credential.lastUsed ? `Last used ${credential.lastUsed.toLocaleDateString()}` : 'Never used'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditCredential(credential)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCredential(credential.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add/Edit Credential Form */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      {editingCredential ? 'Edit Credential' : 'Add New Credential'}
                    </h3>

                    <form onSubmit={handleCredentialSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Credential Name
                        </label>
                        <input
                          type="text"
                          value={credentialForm.name}
                          onChange={(e) => setCredentialForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Gmail Production API"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Service
                        </label>
                        <select
                          value={credentialForm.service}
                          onChange={(e) => setCredentialForm(prev => ({ ...prev, service: e.target.value as any, credentials: {} }))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="gmail">Gmail</option>
                          <option value="gohighlevel">GoHighLevel</option>
                          <option value="xero">Xero</option>
                          <option value="pandadoc">PandaDoc</option>
                          <option value="fareharbor">FareHarbor</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Dynamic fields based on service */}
                      {getServiceConfig(credentialForm.service).fields.map((field) => (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          {field.type === 'checkbox' ? (
                            <input
                              type="checkbox"
                              checked={credentialForm.credentials[field.key] === 'true'}
                              onChange={(e) => setCredentialForm(prev => ({
                                ...prev,
                                credentials: {
                                  ...prev.credentials,
                                  [field.key]: e.target.checked.toString()
                                }
                              }))}
                              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                          ) : (
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
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              required={field.required}
                            />
                          )}
                        </div>
                      ))}

                      <div className="flex items-center justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            setEditingCredential(null);
                            setCredentialForm({
                              name: '',
                              service: 'gmail',
                              type: 'api_key',
                              credentials: {}
                            });
                          }}
                          className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {editingCredential ? 'Update' : 'Add'} Credential
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Configurations Tab */}
        {activeTab === 'configs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Workflow Configurations</h2>
                <p className="text-slate-600">Manage pipeline IDs, campaign settings, and other workflow parameters</p>
              </div>
              <button
                onClick={() => setShowConfigForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Configuration</span>
              </button>
            </div>

            {/* Configs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {configs.map((config) => (
                <div key={config.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{config.name}</h3>
                      <p className="text-sm text-slate-600">{config.service}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditConfig(config)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(config.settings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 capitalize">{key.replace('_', ' ')}:</span>
                        <span className="font-mono text-slate-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add/Edit Config Form */}
            {showConfigForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      {editingConfig ? 'Edit Configuration' : 'Add New Configuration'}
                    </h3>

                    <form onSubmit={handleConfigSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Configuration Name
                        </label>
                        <input
                          type="text"
                          value={configForm.name}
                          onChange={(e) => setConfigForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., GoHighLevel Pipeline Settings"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Service
                        </label>
                        <input
                          type="text"
                          value={configForm.service}
                          onChange={(e) => setConfigForm(prev => ({ ...prev, service: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., gohighlevel, xero, gmail"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Settings (JSON)
                        </label>
                        <textarea
                          value={JSON.stringify(configForm.settings, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              setConfigForm(prev => ({ ...prev, settings: parsed }));
                            } catch {
                              // Invalid JSON, keep the text for editing
                            }
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                          rows={6}
                          placeholder='{"pipeline_id": "abc123", "default_stage": "new_lead"}'
                        />
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowConfigForm(false);
                            setEditingConfig(null);
                            setConfigForm({
                              name: '',
                              service: '',
                              settings: {}
                            });
                          }}
                          className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {editingConfig ? 'Update' : 'Add'} Configuration
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CredentialManager; 