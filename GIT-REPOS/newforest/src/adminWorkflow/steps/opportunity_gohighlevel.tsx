import React, { useState } from 'react';
import { 
  ExternalLink, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface OpportunityGoHighLevelProps {
  onBack?: () => void;
}

const OpportunityGoHighLevel: React.FC<OpportunityGoHighLevelProps> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [apiKey, setApiKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6InFsbXhGWTY4aHJuVmp5bzhjTlFDIiwiY29tcGFueV9pZCI6InZsbG9vNnhRTTJKUWcyYTNaWVFOIiwidmVyc2lvbiI6MSwiaWF0IjoxNjkwNTE5MzY1ODc4LCJzdWIiOiJ1c2VyX2lkIn0.mDueX_XSe2Gt-b9ITVWxiWDWWwJHGGYjS6LmOlGkSh8');
  const [locationId, setLocationId] = useState('qlmxFY68hrnVjyo8cNQC');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [pipelineData, setPipelineData] = useState<any>(null);

  // Available pipelines from the user's account
  const availablePipelines = [
    {
      id: "GiZpprwMTc0aBVpaGCPL",
      name: "Fun Groups",
      stages: [
        { id: "959215d4-d801-40b2-8816-150712c9fcc6", name: "Initial Contact" },
        { id: "4d53deff-f1d2-4caf-bd8e-38c8431208c4", name: "Information Gathering" },
        { id: "3ab2f51b-110f-452a-864d-963e9cd28e00", name: "Offer Made" },
        { id: "33ae9eb2-6036-4378-a855-d126e92745bb", name: "Event Booked" }
      ]
    },
    {
      id: "oRBN6I2pnT6ZNT6RfJHm",
      name: "Outdoor Education",
      stages: [
        { id: "abb02de0-7b71-4895-a377-e14b6d51d404", name: "Brochure" },
        { id: "a52dfbfc-4be3-4dcc-9c5d-dd11690b1e5b", name: "Info Gathering or PYT" },
        { id: "9718a25d-26ca-4e96-81f3-ff3bafda48c0", name: "Proposal Sent" },
        { id: "c414eea5-d51d-404b-b536-f84c0083c9b0", name: "Deposit Sent" },
        { id: "30752c20-7380-40a2-a0df-6c8bc453fba8", name: "Event Booked" }
      ]
    },
    {
      id: "FU9uCDxUytMhfHOq9rdQ",
      name: "Small Groups",
      stages: [
        { id: "f90fd1ad-e304-4ba8-bb16-cd2a7d487a2e", name: "Brochure" },
        { id: "24076000-ef87-48bd-ac22-a01feb1ffc49", name: "Information Gathering / PYT" },
        { id: "31aee503-0f22-49a4-8d85-70654566d7ea", name: "Offer" },
        { id: "eef09b61-3b16-4654-a38b-4c4f7fc14180", name: "External Voucher Provider" }
      ]
    },
    {
      id: "LgSOBYVw07OAEHbkwsKx",
      name: "Team Building",
      stages: [
        { id: "a4f89e6a-b073-4680-9bf1-ad9c91ecdeaa", name: "Brochure" },
        { id: "2cc00d5b-920a-40ca-8252-877f9ac5fc2a", name: "Information Gathering / PYT" },
        { id: "f9d501aa-5fc2-4f9e-b9ef-ca2bd41aba76", name: "Offer Made" },
        { id: "58f0cc3e-a2bf-4e2a-a232-d5ddbe17846c", name: "Event Booked" }
      ]
    }
  ];

  // Test API connection using the correct v1 API
  const testConnection = async () => {
    setConnectionStatus('testing');
    setTestResult(null);
    
    try {
      console.log('🔄 Testing GoHighLevel API connection...');
      
      // Test connection by fetching pipelines - this is a good test endpoint
      const response = await fetch(`https://rest.gohighlevel.com/v1/pipelines/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok && data.pipelines) {
        setConnectionStatus('connected');
        setIsConnected(true);
        setPipelineData(data);
        setTestResult(`✅ Connected! Found ${data.pipelines.length} pipelines`);
        console.log('✅ API Connection successful:', data);
      } else {
        setConnectionStatus('error');
        setIsConnected(false);
        setTestResult(`❌ Connection failed: ${data.message || JSON.stringify(data)}`);
        console.error('❌ API Connection failed:', data);
      }
    } catch (error) {
      setConnectionStatus('error');
      setIsConnected(false);
      setTestResult(`❌ Connection error: ${error.message}`);
      console.error('❌ API Connection error:', error);
    }
  };

  // Create opportunity in GoHighLevel using correct v1 API structure
  const createOpportunity = async () => {
    setStatus('running');
    setApiResponse(null);
    
    try {
      console.log('🔄 Creating opportunity in GoHighLevel...');
      
      // Use the first available pipeline and its first stage
      const selectedPipeline = availablePipelines[0]; // Fun Groups pipeline
      const selectedStage = selectedPipeline.stages[0]; // Initial Contact stage
      
      console.log('📋 Using pipeline:', selectedPipeline.name, 'stage:', selectedStage.name);

      // Create opportunity with correct v1 API structure
      const opportunityData = {
        title: `${new Date().toLocaleDateString()} | Admin Workflow Demo | ${Date.now()}`,
        status: "open",
        stageId: selectedStage.id,
        email: "demo@adminworkflow.com",
        phone: "+1202-555-0107",
        monetaryValue: 5000,
        source: "admin-workflow-automation",
        name: "Admin Workflow Demo Contact",
        companyName: "Demo Company",
        tags: ["admin-workflow", "api-integration", "demo"]
      };

      console.log('📤 Sending opportunity data:', opportunityData);

      // Use the correct v1 API endpoint with pipeline ID in the path
      const response = await fetch(`https://rest.gohighlevel.com/v1/pipelines/${selectedPipeline.id}/opportunities/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportunityData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setLastRun(new Date());
        setApiResponse({
          success: true,
          data: data,
          timestamp: new Date().toISOString(),
          endpoint: `POST /v1/pipelines/${selectedPipeline.id}/opportunities/`,
          requestData: opportunityData,
          pipelineUsed: selectedPipeline.name,
          stageUsed: selectedStage.name
        });
        console.log('✅ Opportunity created successfully:', data);
      } else {
        setStatus('error');
        setApiResponse({
          success: false,
          error: data,
          timestamp: new Date().toISOString(),
          endpoint: `POST /v1/pipelines/${selectedPipeline.id}/opportunities/`,
          requestData: opportunityData,
          pipelineUsed: selectedPipeline.name,
          stageUsed: selectedStage.name
        });
        console.error('❌ Failed to create opportunity:', data);
      }
    } catch (error) {
      setStatus('error');
      setApiResponse({
        success: false,
        error: { message: error.message },
        timestamp: new Date().toISOString(),
        endpoint: 'POST /v1/pipelines/{pipelineId}/opportunities/',
        requestData: null
      });
      console.error('❌ Error creating opportunity:', error);
    }
  };

  const handleToggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      // Start the workflow
      createOpportunity();
    } else {
      setStatus('idle');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running': return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
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
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Back to Admin Workflow</span>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">GoHighLevel Opportunity Management</h1>
                <p className="text-slate-600 mt-1">Automated opportunity creation using GoHighLevel v1 API</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="text-sm font-medium capitalize">{status}</span>
              </div>
              
              <button
                onClick={handleToggle}
                disabled={!isConnected}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  !isConnected 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : isActive 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isActive ? 'Pause' : 'Create'} Opportunity</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Workflow Configuration */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Workflow Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Workflow Overview</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Purpose</h4>
                  <p className="text-slate-600">
                    Automatically creates and manages opportunities in GoHighLevel CRM using the v1 REST API 
                    with your existing pipelines and stages.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Available Pipelines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availablePipelines.map((pipeline) => (
                      <div key={pipeline.id} className="bg-slate-50 rounded-lg p-3">
                        <h5 className="font-medium text-slate-900">{pipeline.name}</h5>
                        <p className="text-xs text-slate-600 mt-1">{pipeline.stages.length} stages</p>
                        <div className="mt-2 space-y-1">
                          {pipeline.stages.slice(0, 2).map((stage) => (
                            <div key={stage.id} className="text-xs text-slate-500">• {stage.name}</div>
                          ))}
                          {pipeline.stages.length > 2 && (
                            <div className="text-xs text-slate-400">+ {pipeline.stages.length - 2} more...</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* API Connection */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">GoHighLevel API Connection</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location ID
                  </label>
                  <input
                    type="text"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    API Key (JWT Token)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                    <button 
                      onClick={testConnection}
                      disabled={connectionStatus === 'testing'}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                    >
                      {connectionStatus === 'testing' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        'Test'
                      )}
                    </button>
                  </div>
                  
                  {testResult && (
                    <div className={`mt-2 p-3 rounded-lg text-sm ${
                      connectionStatus === 'connected' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {testResult}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">API Endpoints (v1)</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-600 font-mono">
                      GET /v1/pipelines/ - Test connection & get pipelines
                    </p>
                    <p className="text-slate-600 font-mono">
                      POST /v1/pipelines/{`{pipelineId}`}/opportunities/ - Create opportunity
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Using GoHighLevel REST API v1 | <a href="https://public-api.gohighlevel.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">API Documentation</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Workflow Steps</h3>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Connect to GoHighLevel API', description: 'Test connection and fetch available pipelines', status: isConnected ? 'completed' : 'pending' },
                  { step: 2, title: 'Select Pipeline & Stage', description: 'Use "Fun Groups" pipeline, "Initial Contact" stage', status: isConnected ? 'completed' : 'pending' },
                  { step: 3, title: 'Create Opportunity', description: 'Generate new opportunity via v1 API', status: status === 'success' ? 'completed' : status === 'running' ? 'active' : 'pending' },
                  { step: 4, title: 'Apply Tags & Properties', description: 'Set admin-workflow, api-integration tags', status: status === 'success' ? 'completed' : 'pending' },
                  { step: 5, title: 'Show Results', description: 'Display API response and opportunity details', status: apiResponse ? 'completed' : 'pending' }
                ].map((item) => (
                  <div key={item.step} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      item.status === 'completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {item.status === 'active' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        item.step
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Response */}
            {apiResponse && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {apiResponse.success ? '✅ API Response - Success' : '❌ API Response - Error'}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Timestamp:</span>
                      <p className="font-mono text-slate-900">{new Date(apiResponse.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Endpoint:</span>
                      <p className="font-mono text-slate-900">{apiResponse.endpoint}</p>
                    </div>
                    {apiResponse.pipelineUsed && (
                      <>
                        <div>
                          <span className="text-slate-600">Pipeline:</span>
                          <p className="text-slate-900">{apiResponse.pipelineUsed}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Stage:</span>
                          <p className="text-slate-900">{apiResponse.stageUsed}</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {apiResponse.success && apiResponse.data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-green-50 p-4 rounded-lg">
                      <div>
                        <span className="text-green-700 font-medium">Opportunity ID:</span>
                        <p className="font-mono text-green-900">{apiResponse.data.id || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-green-700 font-medium">Title:</span>
                        <p className="text-green-900">{apiResponse.data.title || apiResponse.data.name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-green-700 font-medium">Status:</span>
                        <p className="text-green-900">{apiResponse.data.status || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-green-700 font-medium">Value:</span>
                        <p className="text-green-900">${apiResponse.data.monetaryValue || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">Raw API Response:</h4>
                    <pre className="text-xs text-slate-600 overflow-x-auto font-mono bg-white p-3 rounded border max-h-64">
                      {JSON.stringify(apiResponse.success ? apiResponse.data : apiResponse.error, null, 2)}
                    </pre>
                  </div>
                  
                  {apiResponse.requestData && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Request Data Sent:</h4>
                      <pre className="text-xs text-slate-600 overflow-x-auto font-mono bg-white p-3 rounded border">
                        {JSON.stringify(apiResponse.requestData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">API Connection</span>
                    <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-slate-500'}`}>
                      {isConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Workflow Status</span>
                    <span className={`font-medium ${isActive ? 'text-green-600' : 'text-slate-500'}`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Last Run</span>
                    <span className="text-slate-900">
                      {lastRun ? lastRun.toLocaleString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Pipelines Found</span>
                    <span className="text-green-600 font-medium">{availablePipelines.length}</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {apiResponse && (
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${apiResponse.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="text-sm text-slate-900">
                          {apiResponse.success ? 'Opportunity created successfully' : 'Failed to create opportunity'}
                        </p>
                        <p className="text-xs text-slate-500">{new Date(apiResponse.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-slate-900">API connection established</p>
                      <p className="text-xs text-slate-500">System startup</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={createOpportunity}
                    disabled={!isConnected || status === 'running'}
                    className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <Play className="h-4 w-4" />
                    <span>Create Test Opportunity</span>
                  </button>
                  <button 
                    onClick={testConnection}
                    className="w-full flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Test Connection</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                    <Eye className="h-4 w-4" />
                    <span>View Logs</span>
                  </button>
                  <a 
                    href="https://public-api.gohighlevel.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>API Documentation</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityGoHighLevel; 