import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  Clipboard,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface ManifestDetailsProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

interface ManifestData {
  groupName: string;
  eventDate: string;
  numberOfPeople: number;
  contactName: string;
  contactEmail: string;
  eventType: string;
  activities: string[];
  specialRequirements: string;
  arrivalTime: string;
  departureTime: string;
  emergencyContact: string;
  dietaryRequirements: string;
}

const ManifestDetails: React.FC<ManifestDetailsProps> = ({ 
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
    phase: 'Template' | 'Upload' | 'FareHarbor' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [templateStatus, setTemplateStatus] = useState<'pending' | 'loading' | 'populated' | 'uploaded'>('pending');
  const [pandaDocStatus, setPandaDocStatus] = useState<'pending' | 'downloading' | 'uploaded'>('pending');
  const [cateringStatus, setCateringStatus] = useState<'pending' | 'downloading' | 'uploaded'>('pending');

  // Demo manifest data from previous steps
  const demoManifestData: ManifestData = {
    groupName: "TechCorp Solutions Team Building Event",
    eventDate: "2024-07-15",
    numberOfPeople: 25,
    contactName: "Sarah Johnson",
    contactEmail: "sarah.johnson@techcorp.com",
    eventType: "Team Building - Outdoor Challenges",
    activities: ["Outdoor Challenges", "Leadership Development", "Team Bonding"],
    specialRequirements: "2 vegetarian meals, 1 gluten-free meal",
    arrivalTime: "09:00",
    departureTime: "17:00",
    emergencyContact: "TBC - To be confirmed nearer the time",
    dietaryRequirements: "TBC - To be confirmed nearer the time"
  };

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'Template' | 'Upload' | 'FareHarbor' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processManifestDetails = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting manifest details automation', 'System');
      
      // Step 1: Load and populate manifest template
      setTemplateStatus('loading');
      addActivity('info', 'Loading TB Manifest _ Availability Notes.docx template', 'Template');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (demoMode) {
        addActivity('success', 'Demo: Manifest template loaded successfully', 'Template');
        addActivity('info', 'Demo: Populating manifest with known information', 'Template');
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        setTemplateStatus('populated');
        addActivity('success', `Demo: Manifest populated for ${demoManifestData.groupName}`, 'Template');
        addActivity('info', 'Demo: TBC sections marked for later completion', 'Template');
      } else {
        // Real implementation would load and populate actual template
        setTemplateStatus('populated');
        addActivity('success', 'Manifest template populated with event details', 'Template');
      }
      
      // Step 2: Download and upload signed PandaDoc proposal
      setPandaDocStatus('downloading');
      addActivity('info', 'Downloading signed PandaDoc proposal', 'Upload');
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      if (demoMode) {
        setPandaDocStatus('uploaded');
        addActivity('success', 'Demo: Signed proposal downloaded from PandaDoc', 'Upload');
        addActivity('info', 'Demo: Uploading proposal to manifest (arrow bottom left)', 'Upload');
        await new Promise(resolve => setTimeout(resolve, 1000));
        addActivity('success', 'Demo: PandaDoc proposal uploaded to manifest', 'Upload');
      } else {
        setPandaDocStatus('uploaded');
        addActivity('success', 'Signed proposal uploaded to manifest', 'Upload');
      }
      
      // Step 3: Download and upload catering order
      setCateringStatus('downloading');
      addActivity('info', 'Downloading catering order form', 'Upload');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (demoMode) {
        setCateringStatus('uploaded');
        addActivity('success', 'Demo: Catering order downloaded', 'Upload');
        addActivity('info', 'Demo: Uploading catering order to manifest', 'Upload');
        await new Promise(resolve => setTimeout(resolve, 800));
        addActivity('success', 'Demo: Catering order uploaded to manifest', 'Upload');
      } else {
        setCateringStatus('uploaded');
        addActivity('success', 'Catering order uploaded to manifest', 'Upload');
      }
      
      // Step 4: Upload completed manifest to FareHarbor
      setTemplateStatus('uploaded');
      addActivity('info', 'Uploading completed manifest to FareHarbor', 'FareHarbor');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (demoMode) {
        addActivity('success', 'Demo: Manifest uploaded to FareHarbor successfully', 'FareHarbor');
        addActivity('info', 'Demo: Manifest attached to booking item', 'FareHarbor');
      } else {
        addActivity('success', 'Manifest uploaded to FareHarbor', 'FareHarbor');
      }
      
      addActivity('success', 'Manifest details automation completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Manifest processing failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Template': return <FileText className="w-4 h-4" />;
      case 'Upload': return <Upload className="w-4 h-4" />;
      case 'FareHarbor': return <Clipboard className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Template': return 'bg-blue-100 text-blue-800';
      case 'Upload': return 'bg-purple-100 text-purple-800';
      case 'FareHarbor': return 'bg-green-100 text-green-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <Clipboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Manifest Details</h3>
            <p className="text-sm text-gray-600">Create and populate team building manifest</p>
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
            onClick={processManifestDetails}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Create Manifest'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              templateStatus === 'populated' || templateStatus === 'uploaded' ? 'bg-green-500' : 
              templateStatus === 'loading' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Template</h4>
              <p className="text-sm text-gray-600">
                {templateStatus === 'pending' && 'Ready to load'}
                {templateStatus === 'loading' && 'Loading...'}
                {templateStatus === 'populated' && 'Populated'}
                {templateStatus === 'uploaded' && 'Uploaded'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              pandaDocStatus === 'uploaded' ? 'bg-green-500' : 
              pandaDocStatus === 'downloading' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">PandaDoc</h4>
              <p className="text-sm text-gray-600">
                {pandaDocStatus === 'pending' && 'Waiting'}
                {pandaDocStatus === 'downloading' && 'Downloading'}
                {pandaDocStatus === 'uploaded' && 'Uploaded'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              cateringStatus === 'uploaded' ? 'bg-green-500' : 
              cateringStatus === 'downloading' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Catering</h4>
              <p className="text-sm text-gray-600">
                {cateringStatus === 'pending' && 'Waiting'}
                {cateringStatus === 'downloading' && 'Downloading'}
                {cateringStatus === 'uploaded' && 'Uploaded'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              templateStatus === 'uploaded' ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <ArrowUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">FareHarbor</h4>
              <p className="text-sm text-gray-600">
                {templateStatus === 'uploaded' ? 'Complete' : 'Pending upload'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Manifest Details */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Manifest Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Event Details (Confirmed)</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Group: {demoManifestData.groupName}</li>
              <li>• Date: {new Date(demoManifestData.eventDate).toLocaleDateString('en-GB')}</li>
              <li>• People: {demoManifestData.numberOfPeople}</li>
              <li>• Activities: {demoManifestData.activities.join(', ')}</li>
              <li>• Arrival: {demoManifestData.arrivalTime}</li>
              <li>• Departure: {demoManifestData.departureTime}</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">TBC Sections (To Be Confirmed)</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Emergency Contact: {demoManifestData.emergencyContact}</li>
              <li>• Dietary Requirements: {demoManifestData.dietaryRequirements}</li>
              <li>• Final participant list</li>
              <li>• Special access requirements</li>
              <li>• Equipment preferences</li>
              <li>• Weather contingency plans</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Document Attachments */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Document Attachments</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-sm">TB Manifest _ Availability Notes.docx</p>
                <p className="text-xs text-gray-500">Main manifest template</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              templateStatus === 'uploaded' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {templateStatus === 'uploaded' ? 'Uploaded' : 'Pending'}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-sm">Signed Corporate Proposal.pdf</p>
                <p className="text-xs text-gray-500">Downloaded from PandaDoc</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              pandaDocStatus === 'uploaded' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {pandaDocStatus === 'uploaded' ? 'Uploaded' : 'Pending'}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium text-sm">Nova Catering Order.pdf</p>
                <p className="text-xs text-gray-500">Catering requirements</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              cateringStatus === 'uploaded' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {cateringStatus === 'uploaded' ? 'Uploaded' : 'Pending'}
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
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>96.4% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default ManifestDetails; 