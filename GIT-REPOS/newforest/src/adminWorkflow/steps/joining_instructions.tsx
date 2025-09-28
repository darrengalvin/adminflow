import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  Download,
  Mail,
  MapPin,
  Shield
} from 'lucide-react';

interface JoiningInstructionsProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

const JoiningInstructions: React.FC<JoiningInstructionsProps> = ({ 
  isActive, 
  onComplete, 
  demoMode, 
  onDemoModeChange 
}) => {
  const [activities, setActivities] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'error' | 'warning';
    message: string;
    timestamp: Date;
    phase: 'Template' | 'PandaDoc' | 'CRM' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [templateStatus, setTemplateStatus] = useState<'pending' | 'loading' | 'customized'>('pending');
  const [pandadocStatus, setPandadocStatus] = useState<'pending' | 'generating' | 'ready'>('pending');
  const [crmStatus, setCrmStatus] = useState<'pending' | 'sending' | 'sent'>('pending');

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'Template' | 'PandaDoc' | 'CRM' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processJoiningInstructions = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting joining instructions automation', 'System');
      
      // Step 1: Load and customize joining instructions template
      setTemplateStatus('loading');
      addActivity('info', 'Loading joining instructions template for event location', 'Template');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        addActivity('success', 'Demo: Template loaded for New Forest Activities site', 'Template');
        addActivity('info', 'Demo: Adding event details to first page', 'Template');
        addActivity('info', 'Demo: Company: TechCorp Solutions, Date: 15/08/2024, Time: 9:30 AM', 'Template');
        addActivity('info', 'Demo: Adding FareHarbor waiver link to "Don\'t Forget" page', 'Template');
        addActivity('success', 'Demo: Template customized with event-specific information', 'Template');
        setTemplateStatus('customized');
      } else {
        setTemplateStatus('customized');
        addActivity('success', 'Joining instructions template customized successfully', 'Template');
      }
      
      // Step 2: Generate PDF using PandaDoc
      setPandadocStatus('generating');
      addActivity('info', 'Generating PDF document using PandaDoc', 'PandaDoc');
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      if (demoMode) {
        addActivity('success', 'Demo: Connected to PandaDoc successfully', 'PandaDoc');
        addActivity('info', 'Demo: Converting template to PDF format', 'PandaDoc');
        addActivity('info', 'Demo: PDF generated: TechCorp_JoiningInstructions_15Aug2024.pdf', 'PandaDoc');
        addActivity('success', 'Demo: PDF ready for email attachment', 'PandaDoc');
        setPandadocStatus('ready');
      } else {
        setPandadocStatus('ready');
        addActivity('success', 'PDF document generated successfully', 'PandaDoc');
      }
      
      // Step 3: Send via CRM using joining instructions snippet
      setCrmStatus('sending');
      addActivity('info', 'Sending joining instructions via CRM snippet', 'CRM');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        addActivity('success', 'Demo: Connected to GoHighLevel CRM', 'CRM');
        addActivity('info', 'Demo: Using "Joining Instructions" snippet template', 'CRM');
        addActivity('info', 'Demo: Attaching PDF to email', 'CRM');
        addActivity('success', 'Demo: Email sent to sarah.johnson@techcorp.com', 'CRM');
        addActivity('info', 'Demo: Email includes venue details, parking, and safety information', 'CRM');
        setCrmStatus('sent');
      } else {
        setCrmStatus('sent');
        addActivity('success', 'Joining instructions sent via CRM successfully', 'CRM');
      }
      
      addActivity('success', 'Joining instructions automation completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Joining instructions automation failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Template': return <FileText className="w-4 h-4" />;
      case 'PandaDoc': return <Download className="w-4 h-4" />;
      case 'CRM': return <Mail className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Template': return 'bg-blue-100 text-blue-800';
      case 'PandaDoc': return 'bg-orange-100 text-orange-800';
      case 'CRM': return 'bg-green-100 text-green-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Send Joining Instructions</h3>
            <p className="text-sm text-gray-600">Generate PDF with event details and waiver link, send via CRM</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Demo Mode</span>
            <button
              onClick={() => onDemoModeChange(!demoMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                demoMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  demoMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <button
            onClick={processJoiningInstructions}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Send Instructions'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              templateStatus === 'customized' ? 'bg-green-500' : 
              templateStatus === 'loading' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Template</h4>
              <p className="text-sm text-gray-600">
                {templateStatus === 'pending' && 'Ready to load'}
                {templateStatus === 'loading' && 'Customizing...'}
                {templateStatus === 'customized' && 'Template ready'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              pandadocStatus === 'ready' ? 'bg-green-500' : 
              pandadocStatus === 'generating' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">PDF Generation</h4>
              <p className="text-sm text-gray-600">
                {pandadocStatus === 'pending' && 'Waiting for template'}
                {pandadocStatus === 'generating' && 'Generating PDF...'}
                {pandadocStatus === 'ready' && 'PDF ready'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              crmStatus === 'sent' ? 'bg-green-500' : 
              crmStatus === 'sending' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">CRM Delivery</h4>
              <p className="text-sm text-gray-600">
                {crmStatus === 'pending' && 'Waiting for PDF'}
                {crmStatus === 'sending' && 'Sending email...'}
                {crmStatus === 'sent' && 'Email sent'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Joining Instructions Preview */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Joining Instructions Content</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Event Details (First Page)</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Company: TechCorp Solutions Ltd</li>
              <li>• Event Date: Thursday, 15th August 2024</li>
              <li>• Arrival Time: 9:30 AM</li>
              <li>• Location: New Forest Activities Centre</li>
              <li>• Activity: Team Building Experience</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Important Information</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Parking: Free on-site parking available</li>
              <li>• What to bring: Comfortable clothing & footwear</li>
              <li>• Weather contingency plans included</li>
              <li>• Emergency contact details provided</li>
              <li>• Dietary requirements confirmed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Waiver Link Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">FareHarbor Waiver Integration</h4>
            <div className="text-sm text-blue-700">
              <p className="mb-2"><strong>"Don't Forget" Page Includes:</strong></p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Direct link to FareHarbor waiver system</li>
                <li>Instructions for all participants to complete</li>
                <li>Deadline: 24 hours before event</li>
                <li>Contact details for waiver support</li>
              </ul>
              <div className="mt-3 p-2 bg-white rounded border">
                <p className="font-medium">Waiver Link:</p>
                <p className="text-xs font-mono text-blue-600">https://fareharbor.com/embeds/book/newforestactivities/items/123456/waiver/</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      {activities.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium mb-3">Live Activity</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 text-sm">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPhaseColor(activity.phase)}`}>
                  <div className="flex items-center space-x-1">
                    {getPhaseIcon(activity.phase)}
                    <span>{activity.phase}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {activity.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {activity.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    {activity.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                    {activity.type === 'info' && <Clock className="w-4 h-4 text-blue-500" />}
                    
                    <span className={`${
                      activity.type === 'success' ? 'text-green-700' :
                      activity.type === 'error' ? 'text-red-700' :
                      activity.type === 'warning' ? 'text-yellow-700' :
                      'text-gray-700'
                    }`}>
                      {activity.message}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {activity.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Rate */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>97.2% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default JoiningInstructions; 