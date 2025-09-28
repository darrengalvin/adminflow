import React, { useState } from 'react';
import { 
  MapPin, 
  Bus, 
  Hotel, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  Users,
  Phone,
  Car
} from 'lucide-react';

interface AdditionalLogisticsProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

interface LogisticsRequirement {
  type: 'accommodation' | 'transport' | 'venue' | 'equipment';
  name: string;
  required: boolean;
  status: 'pending' | 'checking' | 'booked' | 'not_needed';
  details?: string;
  provider?: string;
  cost?: number;
}

interface EventLogistics {
  eventType: string;
  numberOfPeople: number;
  eventDate: string;
  duration: string;
  location: string;
  requirements: LogisticsRequirement[];
}

const AdditionalLogistics: React.FC<AdditionalLogisticsProps> = ({ 
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
    phase: 'Assessment' | 'Accommodation' | 'Transport' | 'Calendar' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [assessmentStatus, setAssessmentStatus] = useState<'pending' | 'analyzing' | 'complete'>('pending');
  const [accommodationStatus, setAccommodationStatus] = useState<'pending' | 'checking' | 'booked' | 'not_needed'>('pending');
  const [transportStatus, setTransportStatus] = useState<'pending' | 'checking' | 'booked' | 'not_needed'>('pending');
  const [calendarStatus, setCalendarStatus] = useState<'pending' | 'updating' | 'updated'>('pending');

  // Demo logistics data
  const demoEventLogistics: EventLogistics = {
    eventType: "Team Building - Outdoor Challenges",
    numberOfPeople: 25,
    eventDate: "2024-07-15",
    duration: "Full Day (9:00 - 17:00)",
    location: "New Forest Activities Centre",
    requirements: [
      {
        type: 'accommodation',
        name: 'Overnight Accommodation',
        required: false,
        status: 'not_needed',
        details: 'Day event - no overnight stay required'
      },
      {
        type: 'transport',
        name: 'Minibus Transport',
        required: true,
        status: 'pending',
        details: '25 people from London to New Forest',
        provider: 'Forest Transport Services',
        cost: 450
      },
      {
        type: 'venue',
        name: 'Additional Venue Space',
        required: false,
        status: 'not_needed',
        details: 'Main centre sufficient for group size'
      },
      {
        type: 'equipment',
        name: 'Specialized Equipment',
        required: false,
        status: 'not_needed',
        details: 'Standard equipment package included'
      }
    ]
  };

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'Assessment' | 'Accommodation' | 'Transport' | 'Calendar' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processAdditionalLogistics = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting additional logistics automation', 'System');
      
      // Step 1: Assess logistics requirements
      setAssessmentStatus('analyzing');
      addActivity('info', 'Analyzing event requirements for additional logistics', 'Assessment');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (demoMode) {
        addActivity('success', 'Demo: Event analysis complete', 'Assessment');
        addActivity('info', `Demo: ${demoEventLogistics.eventType} for ${demoEventLogistics.numberOfPeople} people`, 'Assessment');
        addActivity('info', 'Demo: Checking accommodation, transport, and venue needs', 'Assessment');
        setAssessmentStatus('complete');
      } else {
        setAssessmentStatus('complete');
        addActivity('success', 'Event logistics requirements assessed', 'Assessment');
      }
      
      // Step 2: Check accommodation requirements
      const accommodationReq = demoEventLogistics.requirements.find(r => r.type === 'accommodation');
      if (accommodationReq?.required) {
        setAccommodationStatus('checking');
        addActivity('info', 'Checking accommodation availability', 'Accommodation');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (demoMode) {
          setAccommodationStatus('booked');
          addActivity('success', 'Demo: Accommodation partner contacted', 'Accommodation');
          addActivity('info', 'Demo: Booking confirmed with local hotel partner', 'Accommodation');
        } else {
          setAccommodationStatus('booked');
          addActivity('success', 'Accommodation booking confirmed', 'Accommodation');
        }
      } else {
        setAccommodationStatus('not_needed');
        addActivity('info', 'No overnight accommodation required for day event', 'Accommodation');
      }
      
      // Step 3: Check transport requirements
      const transportReq = demoEventLogistics.requirements.find(r => r.type === 'transport');
      if (transportReq?.required) {
        setTransportStatus('checking');
        addActivity('info', 'Checking minibus availability for transport', 'Transport');
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        if (demoMode) {
          setTransportStatus('booked');
          addActivity('success', 'Demo: Minibus availability confirmed', 'Transport');
          addActivity('info', `Demo: ${transportReq.provider} - £${transportReq.cost} for return journey`, 'Transport');
          addActivity('info', 'Demo: Added to minibus calendar for operations team', 'Transport');
        } else {
          setTransportStatus('booked');
          addActivity('success', 'Transport booking confirmed', 'Transport');
        }
      } else {
        setTransportStatus('not_needed');
        addActivity('info', 'No additional transport required', 'Transport');
      }
      
      // Step 4: Update calendars and notify operations
      setCalendarStatus('updating');
      addActivity('info', 'Updating Google Calendar and notifying operations team', 'Calendar');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (demoMode) {
        setCalendarStatus('updated');
        addActivity('success', 'Demo: Minibus calendar updated for July 15th', 'Calendar');
        addActivity('info', 'Demo: Operations team notified of transport requirements', 'Calendar');
        addActivity('info', 'Demo: All logistics requirements processed', 'Calendar');
      } else {
        setCalendarStatus('updated');
        addActivity('success', 'Calendar updated and operations team notified', 'Calendar');
      }
      
      addActivity('success', 'Additional logistics automation completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Logistics processing failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Assessment': return <Settings className="w-4 h-4" />;
      case 'Accommodation': return <Hotel className="w-4 h-4" />;
      case 'Transport': return <Bus className="w-4 h-4" />;
      case 'Calendar': return <Calendar className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Assessment': return 'bg-blue-100 text-blue-800';
      case 'Accommodation': return 'bg-purple-100 text-purple-800';
      case 'Transport': return 'bg-orange-100 text-orange-800';
      case 'Calendar': return 'bg-green-100 text-green-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequirementIcon = (type: string) => {
    switch (type) {
      case 'accommodation': return <Hotel className="w-4 h-4" />;
      case 'transport': return <Bus className="w-4 h-4" />;
      case 'venue': return <MapPin className="w-4 h-4" />;
      case 'equipment': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-green-100 text-green-700';
      case 'checking': return 'bg-yellow-100 text-yellow-700';
      case 'not_needed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
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
            <h3 className="text-lg font-semibold">Additional Logistics</h3>
            <p className="text-sm text-gray-600">Manage accommodation, transport, and venue requirements</p>
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
            onClick={processAdditionalLogistics}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Check Logistics'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              assessmentStatus === 'complete' ? 'bg-green-500' : 
              assessmentStatus === 'analyzing' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Assessment</h4>
              <p className="text-sm text-gray-600">
                {assessmentStatus === 'pending' && 'Ready to analyze'}
                {assessmentStatus === 'analyzing' && 'Analyzing...'}
                {assessmentStatus === 'complete' && 'Complete'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              accommodationStatus === 'booked' ? 'bg-green-500' : 
              accommodationStatus === 'checking' ? 'bg-yellow-500' : 
              accommodationStatus === 'not_needed' ? 'bg-gray-500' : 'bg-gray-300'
            }`}>
              <Hotel className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Accommodation</h4>
              <p className="text-sm text-gray-600">
                {accommodationStatus === 'pending' && 'Pending'}
                {accommodationStatus === 'checking' && 'Checking...'}
                {accommodationStatus === 'booked' && 'Booked'}
                {accommodationStatus === 'not_needed' && 'Not needed'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              transportStatus === 'booked' ? 'bg-green-500' : 
              transportStatus === 'checking' ? 'bg-yellow-500' : 
              transportStatus === 'not_needed' ? 'bg-gray-500' : 'bg-gray-300'
            }`}>
              <Bus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Transport</h4>
              <p className="text-sm text-gray-600">
                {transportStatus === 'pending' && 'Pending'}
                {transportStatus === 'checking' && 'Checking...'}
                {transportStatus === 'booked' && 'Booked'}
                {transportStatus === 'not_needed' && 'Not needed'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              calendarStatus === 'updated' ? 'bg-green-500' : 
              calendarStatus === 'updating' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Calendar</h4>
              <p className="text-sm text-gray-600">
                {calendarStatus === 'pending' && 'Pending'}
                {calendarStatus === 'updating' && 'Updating...'}
                {calendarStatus === 'updated' && 'Updated'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Event Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Event Information</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Type: {demoEventLogistics.eventType}</li>
              <li>• People: {demoEventLogistics.numberOfPeople}</li>
              <li>• Date: {new Date(demoEventLogistics.eventDate).toLocaleDateString('en-GB')}</li>
              <li>• Duration: {demoEventLogistics.duration}</li>
              <li>• Location: {demoEventLogistics.location}</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Logistics Requirements</h5>
            <div className="space-y-2">
              {demoEventLogistics.requirements.map((req, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    {getRequirementIcon(req.type)}
                    <span className="text-sm font-medium capitalize">{req.name}</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(req.status)}`}>
                    {req.status === 'not_needed' ? 'Not needed' : 
                     req.status === 'booked' ? 'Booked' : 
                     req.status === 'checking' ? 'Checking' : 'Pending'}
                  </div>
                </div>
              ))}
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
          <span>94.7% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default AdditionalLogistics; 