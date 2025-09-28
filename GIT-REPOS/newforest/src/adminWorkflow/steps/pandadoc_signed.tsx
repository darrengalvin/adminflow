import React, { useState } from 'react';
import { 
  FileText, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Calendar,
  Lock,
  Users,
  Building,
  Ship,
  Globe,
  Webhook,
  Activity,
  Loader,
  ExternalLink
} from 'lucide-react';

interface PandaDocSignedProps {
  onBack?: () => void;
  onDataProcessed?: (data: any) => void;
}

const PandaDocSigned: React.FC<PandaDocSignedProps> = ({ onBack, onDataProcessed }) => {
  const [isActive, setIsActive] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [webhookUrl, setWebhookUrl] = useState(
    process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001/webhook/pandadoc-signed'
      : 'https://newforest-woad.vercel.app/webhook/pandadoc-signed'
  );
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [demoMode, setDemoMode] = useState(true);
  const [workflowActivities, setWorkflowActivities] = useState<any[]>([]);

  // Demo signed document data
  const demoSignedDocument = {
    documentId: "PD-2024-CE-0156",
    documentName: "Corporate Team Building Proposal - TechCorp Solutions",
    signedBy: "Sarah Johnson",
    signedAt: new Date().toISOString(),
    companyName: "TechCorp Solutions",
    organizerName: "Sarah Johnson",
    numberOfPeople: 25,
    eventDate: "2024-07-15",
    eventType: "Team Building",
    totalValue: 6250,
    customerEmail: "sarah.johnson@techcorp.com",
    customerPhone: "+44 7892 123456",
    eventDetails: {
      activities: ["Outdoor Challenges", "Leadership Development", "Team Bonding"],
      duration: "Full Day",
      location: "New Forest Adventure Centre"
    }
  };

  // FareHarbor API configuration
  const fareHarborConfig = {
    apiKey: 'your-fareharbor-api-key', // This would be configured in settings
    companyShortname: 'newforestadventure',
    baseUrl: 'https://fareharbor.com/api/external/v1'
  };

  const addActivity = (step: string, action: string, status: 'running' | 'completed' | 'failed', details?: string) => {
    const activity = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      step,
      action,
      status,
      details
    };
    
    setWorkflowActivities(prev => [...prev, activity]);
    console.log(`📊 ${step}: ${action} - ${status.toUpperCase()}${details ? ` - ${details}` : ''}`);
  };

  // Test PandaDoc webhook connection
  const testWebhookConnection = async () => {
    setConnectionStatus('testing');
    setTestResult(null);
    
    try {
      console.log('🔄 Testing PandaDoc webhook connection...');
      
      // In a real implementation, this would:
      // 1. Create a test webhook subscription in PandaDoc
      // 2. Verify the webhook URL is accessible
      // 3. Test the signature verification
      
      // For demo purposes, simulate the test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        setConnectionStatus('connected');
        setIsConnected(true);
        setTestResult('✅ Demo Mode: Webhook simulation ready');
        console.log('✅ Demo webhook connection successful');
      } else {
        // Real webhook test would go here
        setConnectionStatus('error');
        setIsConnected(false);
        setTestResult('❌ Real webhook testing not yet implemented');
      }
    } catch (error) {
      setConnectionStatus('error');
      setIsConnected(false);
      setTestResult(`❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('❌ Webhook connection error:', error);
    }
  };

  // Create FareHarbor item (real API call)
  const createFareHarborItem = async (documentData: any) => {
    if (demoMode) {
      // Demo mode simulation
      addActivity('FareHarbor', 'Demo: Creating FareHarbor item', 'running', 'Simulating item creation');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const demoItem = {
        id: 'FH-' + Date.now(),
        name: `${documentData.companyName} - ${documentData.eventType}`,
        privateHeadline: `${documentData.companyName} | ${documentData.organizerName} | ${documentData.numberOfPeople} people`,
        publicHeadline: documentData.eventType === 'Team Building' ? 'Hartford Event' : 'Group Event',
        isLocked: true,
        isUnlisted: true,
        eventDate: documentData.eventDate,
        capacity: documentData.numberOfPeople
      };
      
      addActivity('FareHarbor', 'Demo: FareHarbor item created', 'completed', `Item ID: ${demoItem.id}`);
      return demoItem;
    } else {
      // Real FareHarbor API call would go here
      // This is a placeholder for the actual implementation
      addActivity('FareHarbor', 'Creating real FareHarbor item', 'running', 'Making API call to FareHarbor');
      
      const itemData = {
        name: `${documentData.companyName} - ${documentData.eventType}`,
        description: `Corporate event for ${documentData.companyName}`,
        capacity: documentData.numberOfPeople,
        duration: 480, // 8 hours in minutes
        price: documentData.totalValue,
        private_headline: `${documentData.companyName} | ${documentData.organizerName} | ${documentData.numberOfPeople} people`,
        public_headline: documentData.eventType === 'Team Building' ? 'Hartford Event' : 'Group Event',
        is_locked: true,
        is_unlisted: true,
        availability: [
          {
            date: documentData.eventDate,
            start_time: '09:00',
            end_time: '17:00',
            capacity: documentData.numberOfPeople
          }
        ]
      };

      // Actual API call would be implemented here
      throw new Error('Real FareHarbor API integration not yet implemented');
    }
  };

  // Process signed document workflow
  const processSignedDocument = async () => {
    setStatus('running');
    setApiResponse(null);
    setWorkflowActivities([]);
    
    try {
      console.log('🔄 Processing signed PandaDoc document...');
      
      const documentData = demoMode ? demoSignedDocument : null;
      
      if (!documentData) {
        throw new Error('No document data available');
      }

      // Step 1: Validate signed document
      addActivity('PandaDoc', 'Validating signed document', 'running', 'Checking document signature and completeness');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addActivity('PandaDoc', 'Document validation complete', 'completed', `Document: ${documentData.documentName}`);

      // Step 2: Extract event details
      addActivity('Processing', 'Extracting event details', 'running', 'Parsing document data for automation');
      await new Promise(resolve => setTimeout(resolve, 800));
      addActivity('Processing', 'Event details extracted', 'completed', `${documentData.companyName} - ${documentData.numberOfPeople} people`);

      // Step 3: Create FareHarbor item
      const fareHarborItem = await createFareHarborItem(documentData);

      // Step 4: Configure item settings
      addActivity('FareHarbor', 'Configuring item settings', 'running', 'Setting headlines, locking, and unlisting');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Set private headline with corporate details
      addActivity('FareHarbor', 'Private headline set', 'completed', fareHarborItem.privateHeadline);
      
      // Set public headline based on event type
      addActivity('FareHarbor', 'Public headline set', 'completed', fareHarborItem.publicHeadline);
      
      // Lock and unlist the item
      addActivity('FareHarbor', 'Item locked and unlisted', 'completed', 'Item secured for corporate booking');

      // Step 5: Set up availability
      addActivity('FareHarbor', 'Creating availability', 'running', 'Setting up event date and capacity');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addActivity('FareHarbor', 'Availability created', 'completed', `${documentData.eventDate} - ${documentData.numberOfPeople} capacity`);

      // Success response
      setStatus('success');
      setLastRun(new Date());
      
      const responseData = {
        success: true,
        documentData,
        fareHarborItem,
        processedAt: new Date().toISOString(),
        workflow: 'pandadoc-signed-automation'
      };
      
      setApiResponse(responseData);
      
      // Notify parent component if callback provided
      if (onDataProcessed) {
        onDataProcessed(responseData);
      }
      
      console.log('✅ PandaDoc signed document processed successfully:', responseData);
      
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setApiResponse({
        success: false,
        error: { message: errorMessage },
        timestamp: new Date().toISOString()
      });
      addActivity('Error', 'Workflow failed', 'failed', errorMessage);
      console.error('❌ Error processing signed document:', error);
    }
  };

  const handleToggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      processSignedDocument();
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
      case 'running': return <Loader className="h-4 w-4 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getActivityIcon = (step: string, status: string) => {
    if (status === 'running') {
      return <Loader className="h-3 w-3 animate-spin text-blue-600" />;
    }
    
    switch (step) {
      case 'PandaDoc': return <FileText className="h-3 w-3 text-green-500" />;
      case 'Processing': return <Activity className="h-3 w-3 text-purple-500" />;
      case 'FareHarbor': return <Ship className="h-3 w-3 text-blue-500" />;
      case 'Error': return <AlertCircle className="h-3 w-3 text-red-500" />;
      default: return <Activity className="h-3 w-3 text-slate-500" />;
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
                <h1 className="text-2xl font-bold text-slate-900">PandaDoc Signed Automation</h1>
                <p className="text-slate-600 mt-1">Automated post-signature workflow for FareHarbor integration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Demo Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDemoMode(!demoMode)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    demoMode ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      demoMode ? 'translate-x-1' : 'translate-x-5'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-slate-700">
                  {demoMode ? 'Demo Mode' : 'Live Mode'}
                </span>
              </div>

              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="text-sm font-medium capitalize">{status}</span>
              </div>
              
              <button
                onClick={testWebhookConnection}
                disabled={connectionStatus === 'testing'}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {connectionStatus === 'testing' ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Webhook className="h-4 w-4" />
                )}
                <span>Test Connection</span>
              </button>
              
              <button
                onClick={handleToggle}
                disabled={!isConnected && !demoMode}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  (!isConnected && !demoMode)
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : isActive 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isActive ? 'Stop' : 'Process'} Document</span>
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
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Automation Overview</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Trigger Event</h4>
                  <p className="text-slate-600">
                    Listens for PandaDoc webhook when a document is signed and completed.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Automated Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Ship className="h-4 w-4 text-blue-600" />
                        <h5 className="font-medium text-slate-900">FareHarbor Setup</h5>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-1">
                        <li>• Create locked, unlisted item</li>
                        <li>• Set corporate details in private headline</li>
                        <li>• Configure public headline for event type</li>
                      </ul>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <h5 className="font-medium text-slate-900">Availability Management</h5>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-1">
                        <li>• Set event date and capacity</li>
                        <li>• Configure booking restrictions</li>
                        <li>• Apply corporate pricing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Webhook Configuration */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">PandaDoc Webhook Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Webhook URL
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://your-domain.com/webhook/pandadoc-signed"
                    />
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Webhook Events</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <code>document_completed</code> - Document fully signed</li>
                    <li>• <code>recipient_completed</code> - Individual recipient signed</li>
                  </ul>
                </div>

                {testResult && (
                  <div className={`rounded-lg p-4 ${
                    testResult.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    <p className="text-sm font-medium">{testResult}</p>
                  </div>
                )}
              </div>
            </div>

            {/* API Response Display */}
            {apiResponse && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {apiResponse.success ? 'Automation Results' : 'Error Details'}
                </h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <pre className="text-sm text-slate-600 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">Processing Steps</h3>
                {status === 'running' && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">LIVE</span>
                  </div>
                )}
              </div>
              
              {workflowActivities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 text-sm">
                    No processing activity yet. Click "Process Document" to start automation.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {workflowActivities.map((activity) => (
                    <div 
                      key={activity.id}
                      className={`border rounded-lg p-3 transition-all ${
                        activity.status === 'completed' 
                          ? 'border-green-200 bg-green-50'
                          : activity.status === 'failed'
                            ? 'border-red-200 bg-red-50'
                            : activity.status === 'running'
                              ? 'border-blue-200 bg-blue-50'
                              : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getActivityIcon(activity.step, activity.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-600">{activity.step}</span>
                            <span className="text-xs text-slate-400">
                              {activity.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-900 mt-1">
                            {activity.action}
                          </p>
                          {activity.details && (
                            <p className="text-xs text-slate-600 mt-1">
                              {activity.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo Data Preview */}
        {demoMode && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Demo Document Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div><span className="text-slate-600">Document:</span> <span className="font-medium">{demoSignedDocument.documentName}</span></div>
              <div><span className="text-slate-600">Signed By:</span> <span className="font-medium">{demoSignedDocument.signedBy}</span></div>
              <div><span className="text-slate-600">Company:</span> <span className="font-medium">{demoSignedDocument.companyName}</span></div>
              <div><span className="text-slate-600">Organizer:</span> <span className="font-medium">{demoSignedDocument.organizerName}</span></div>
              <div><span className="text-slate-600">People:</span> <span className="font-medium">{demoSignedDocument.numberOfPeople}</span></div>
              <div><span className="text-slate-600">Event Date:</span> <span className="font-medium">{demoSignedDocument.eventDate}</span></div>
              <div><span className="text-slate-600">Event Type:</span> <span className="font-medium">{demoSignedDocument.eventType}</span></div>
              <div><span className="text-slate-600">Value:</span> <span className="font-medium">£{demoSignedDocument.totalValue.toLocaleString()}</span></div>
              <div><span className="text-slate-600">Activities:</span> <span className="font-medium">{demoSignedDocument.eventDetails.activities.join(', ')}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PandaDocSigned; 