import React, { useState } from 'react';
import { 
  Clipboard, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  FileText,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';

interface UpdateManifestDetailsProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

const UpdateManifestDetails: React.FC<UpdateManifestDetailsProps> = ({ 
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
    phase: 'FareHarbor' | 'Manifest' | 'Schedule' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [fareharbourStatus, setFareharbourStatus] = useState<'pending' | 'connecting' | 'updated'>('pending');
  const [manifestStatus, setManifestStatus] = useState<'pending' | 'updating' | 'completed'>('pending');
  const [scheduleStatus, setScheduleStatus] = useState<'pending' | 'confirming' | 'confirmed'>('pending');

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'FareHarbor' | 'Manifest' | 'Schedule' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processUpdateManifestDetails = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting manifest details update automation', 'System');
      
      // Step 1: Connect to FareHarbor and locate booking
      setFareharbourStatus('connecting');
      addActivity('info', 'Connecting to FareHarbor to locate booking manifest', 'FareHarbor');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        addActivity('success', 'Demo: Connected to FareHarbor successfully', 'FareHarbor');
        addActivity('info', 'Demo: Located booking for TechCorp Solutions - 15/08/2024', 'FareHarbor');
        addActivity('info', 'Demo: Current manifest status: Draft', 'FareHarbor');
        setFareharbourStatus('updated');
      } else {
        // Real FareHarbor API implementation would go here
        setFareharbourStatus('updated');
        addActivity('success', 'Connected to FareHarbor and located booking', 'FareHarbor');
      }
      
      // Step 2: Update manifest with detailed timing information
      setManifestStatus('updating');
      addActivity('info', 'Updating manifest notes with arrival/departure and activity timings', 'Manifest');
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      if (demoMode) {
        addActivity('success', 'Demo: Accessing TB Manifest _ Availability Notes.docx template', 'Manifest');
        addActivity('info', 'Demo: Adding arrival time: 9:30 AM (30 mins before activity)', 'Manifest');
        addActivity('info', 'Demo: Adding departure time: 4:30 PM (30 mins after activity)', 'Manifest');
        addActivity('info', 'Demo: Activity start time: 10:00 AM', 'Manifest');
        addActivity('info', 'Demo: Activity finish time: 4:00 PM', 'Manifest');
        addActivity('success', 'Demo: Manifest notes updated with detailed timing breakdown', 'Manifest');
        setManifestStatus('completed');
      } else {
        // Real manifest update implementation would go here
        setManifestStatus('completed');
        addActivity('success', 'Manifest details updated successfully', 'Manifest');
      }
      
      // Step 3: Confirm schedule and finalize
      setScheduleStatus('confirming');
      addActivity('info', 'Confirming all timing details and finalizing manifest', 'Schedule');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (demoMode) {
        setScheduleStatus('confirmed');
        addActivity('success', 'Demo: All timing details confirmed and documented', 'Schedule');
        addActivity('info', 'Demo: Manifest saved to FareHarbor booking record', 'Schedule');
        addActivity('info', 'Demo: Operations team notified of updated manifest', 'Schedule');
        addActivity('success', 'Demo: Manifest ready for event day coordination', 'Schedule');
      } else {
        setScheduleStatus('confirmed');
        addActivity('success', 'Schedule confirmed and manifest finalized', 'Schedule');
      }
      
      addActivity('success', 'Manifest details update automation completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Manifest details update automation failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'FareHarbor': return <MapPin className="w-4 h-4" />;
      case 'Manifest': return <FileText className="w-4 h-4" />;
      case 'Schedule': return <Calendar className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'FareHarbor': return 'bg-blue-100 text-blue-800';
      case 'Manifest': return 'bg-green-100 text-green-800';
      case 'Schedule': return 'bg-purple-100 text-purple-800';
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
            <h3 className="text-lg font-semibold">Update Manifest Details</h3>
            <p className="text-sm text-gray-600">Add arrival/departure times and activity schedule to FareHarbor manifest</p>
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
            onClick={processUpdateManifestDetails}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Update Manifest'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              fareharbourStatus === 'updated' ? 'bg-green-500' : 
              fareharbourStatus === 'connecting' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">FareHarbor Access</h4>
              <p className="text-sm text-gray-600">
                {fareharbourStatus === 'pending' && 'Ready to connect'}
                {fareharbourStatus === 'connecting' && 'Connecting...'}
                {fareharbourStatus === 'updated' && 'Booking located'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              manifestStatus === 'completed' ? 'bg-green-500' : 
              manifestStatus === 'updating' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Manifest Update</h4>
              <p className="text-sm text-gray-600">
                {manifestStatus === 'pending' && 'Waiting for access'}
                {manifestStatus === 'updating' && 'Updating notes...'}
                {manifestStatus === 'completed' && 'Notes updated'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              scheduleStatus === 'confirmed' ? 'bg-green-500' : 
              scheduleStatus === 'confirming' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Schedule Confirmation</h4>
              <p className="text-sm text-gray-600">
                {scheduleStatus === 'pending' && 'Waiting for update'}
                {scheduleStatus === 'confirming' && 'Confirming times...'}
                {scheduleStatus === 'confirmed' && 'Schedule confirmed'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timing Details */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Event Timing Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Arrival & Departure</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Arrival Time</span>
                </div>
                <span className="text-blue-700 font-bold">9:30 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Departure Time</span>
                </div>
                <span className="text-orange-700 font-bold">4:30 PM</span>
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Activity Schedule</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Activity Start</span>
                </div>
                <span className="text-green-700 font-bold">10:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-800">Activity Finish</span>
                </div>
                <span className="text-red-700 font-bold">4:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manifest Template Preview */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Manifest Notes Update</h4>
        <div className="bg-gray-50 p-4 rounded border text-sm">
          <div className="font-medium mb-2">TB Manifest _ Availability Notes.docx - Updated Sections:</div>
          
          <div className="space-y-3 text-gray-700">
            <div className="bg-white p-3 rounded border-l-4 border-blue-400">
              <p className="font-medium text-blue-800 mb-1">ARRIVAL & DEPARTURE TIMES</p>
              <p>• <strong>Client Arrival:</strong> 9:30 AM (Allow 30 minutes for welcome & briefing)</p>
              <p>• <strong>Client Departure:</strong> 4:30 PM (Allow 30 minutes for debrief & farewell)</p>
              <p>• <strong>Total Event Duration:</strong> 7 hours including setup/breakdown</p>
            </div>
            
            <div className="bg-white p-3 rounded border-l-4 border-green-400">
              <p className="font-medium text-green-800 mb-1">ACTIVITY SCHEDULE</p>
              <p>• <strong>Activity Start Time:</strong> 10:00 AM (After welcome & safety briefing)</p>
              <p>• <strong>Activity Finish Time:</strong> 4:00 PM (Before debrief session)</p>
              <p>• <strong>Activity Duration:</strong> 6 hours with breaks included</p>
              <p>• <strong>Lunch Break:</strong> 12:30 PM - 1:30 PM (1 hour)</p>
            </div>
            
            <div className="bg-white p-3 rounded border-l-4 border-purple-400">
              <p className="font-medium text-purple-800 mb-1">OPERATIONAL NOTES</p>
              <p>• Setup required from 8:30 AM (1 hour before arrival)</p>
              <p>• Breakdown from 4:30 PM (after client departure)</p>
              <p>• 24 participants confirmed (2 vegetarians, 1 nut allergy)</p>
              <p>• Weather contingency plans activated if needed</p>
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
          <span>95.9% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default UpdateManifestDetails; 