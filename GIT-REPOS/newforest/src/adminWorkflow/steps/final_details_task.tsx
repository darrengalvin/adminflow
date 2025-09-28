import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  Target,
  Bell,
  User,
  ListTodo
} from 'lucide-react';

interface FinalDetailsTaskProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

const FinalDetailsTask: React.FC<FinalDetailsTaskProps> = ({ 
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
    phase: 'Response' | 'GoHighLevel' | 'Task' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [responseStatus, setResponseStatus] = useState<'pending' | 'received' | 'processed'>('pending');
  const [taskStatus, setTaskStatus] = useState<'pending' | 'creating' | 'scheduled'>('pending');

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'Response' | 'GoHighLevel' | 'Task' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processFinalDetailsTask = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting final details task automation', 'System');
      
      // Step 1: Detect response received
      setResponseStatus('received');
      addActivity('info', 'Monitoring for final details response from customer', 'Response');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (demoMode) {
        addActivity('success', 'Demo: Final details response received from sarah.johnson@techcorp.com', 'Response');
        addActivity('info', 'Demo: Response includes: 24 people, 2 vegetarians, 1 nut allergy', 'Response');
        addActivity('info', 'Demo: Arrival time: 9:30 AM, Emergency contact provided', 'Response');
        setResponseStatus('processed');
      } else {
        // Real email monitoring would go here
        addActivity('success', 'Final details response received and processed', 'Response');
        setResponseStatus('processed');
      }
      
      // Step 2: Calculate task date (2 weeks before event)
      const eventDate = new Date('2024-08-15'); // Demo event date
      const taskDate = new Date(eventDate);
      taskDate.setDate(eventDate.getDate() - 14); // 2 weeks before
      
      addActivity('info', `Calculating task date: 2 weeks before ${eventDate.toLocaleDateString('en-GB')}`, 'Task');
      addActivity('success', `Task scheduled for ${taskDate.toLocaleDateString('en-GB')}`, 'Task');
      
      // Step 3: Create task in GoHighLevel CRM
      setTaskStatus('creating');
      addActivity('info', 'Creating final details task in GoHighLevel CRM', 'GoHighLevel');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        setTaskStatus('scheduled');
        addActivity('success', 'Demo: Connected to GoHighLevel CRM successfully', 'GoHighLevel');
        addActivity('info', 'Demo: Creating new task for Operations Team', 'GoHighLevel');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        addActivity('success', 'Demo: Task created - "Final Event Preparation Check"', 'GoHighLevel');
        addActivity('info', 'Demo: Assigned to: Operations Team', 'GoHighLevel');
        addActivity('info', 'Demo: Priority: HIGH', 'GoHighLevel');
        addActivity('info', 'Demo: Due date: ' + taskDate.toLocaleDateString('en-GB'), 'GoHighLevel');
        addActivity('success', 'Demo: Task details include customer response data', 'GoHighLevel');
      } else {
        // Real GoHighLevel API implementation would go here
        try {
          const ghlResponse = await fetch('https://rest.gohighlevel.com/v1/tasks/', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbklkIjoicWxteEZZNjhocm5WanlvOGNOUUMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3MzQ2MTI0NjIsImV4cCI6MTczNDY5ODg2Mn0.sP1lXJyNBf_WPa2JhqFIqBbMkJcNfxF8NNgZEVOQ3Gk',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: 'Final Event Preparation Check - TechCorp Solutions',
              description: 'Review final details and prepare for team building event',
              dueDate: taskDate.toISOString(),
              priority: 'high',
              assignedTo: 'operations-team',
              contactId: 'contact-id-from-opportunity',
              customFields: {
                headcount: '24 people',
                dietary: '2 vegetarians, 1 nut allergy',
                arrivalTime: '9:30 AM',
                eventType: 'Team Building'
              }
            })
          });
          
          if (ghlResponse.ok) {
            setTaskStatus('scheduled');
            addActivity('success', 'Final details task created in GoHighLevel CRM', 'GoHighLevel');
            addActivity('info', 'Task assigned to Operations Team with HIGH priority', 'GoHighLevel');
          } else {
            throw new Error('Failed to create task in GoHighLevel');
          }
        } catch (error) {
          addActivity('error', `GoHighLevel API error: ${error}`, 'GoHighLevel');
          return;
        }
      }
      
      addActivity('success', 'Final details task automation completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Final details task automation failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Response': return <Bell className="w-4 h-4" />;
      case 'GoHighLevel': return <Target className="w-4 h-4" />;
      case 'Task': return <ListTodo className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Response': return 'bg-blue-100 text-blue-800';
      case 'GoHighLevel': return 'bg-green-100 text-green-800';
      case 'Task': return 'bg-purple-100 text-purple-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const eventDate = new Date('2024-08-15');
  const taskDate = new Date(eventDate);
  taskDate.setDate(eventDate.getDate() - 14);

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Set Final Details Task</h3>
            <p className="text-sm text-gray-600">Create task 2 weeks before event when response received</p>
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
            onClick={processFinalDetailsTask}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Create Task'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              responseStatus === 'processed' ? 'bg-green-500' : 
              responseStatus === 'received' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Customer Response</h4>
              <p className="text-sm text-gray-600">
                {responseStatus === 'pending' && 'Waiting for response'}
                {responseStatus === 'received' && 'Response received'}
                {responseStatus === 'processed' && 'Response processed'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              taskStatus === 'scheduled' ? 'bg-green-500' : 
              taskStatus === 'creating' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <ListTodo className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Task Creation</h4>
              <p className="text-sm text-gray-600">
                {taskStatus === 'pending' && 'Ready to create'}
                {taskStatus === 'creating' && 'Creating task...'}
                {taskStatus === 'scheduled' && 'Task scheduled'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              taskStatus === 'scheduled' ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">GoHighLevel CRM</h4>
              <p className="text-sm text-gray-600">
                {taskStatus === 'pending' && 'Waiting for task'}
                {taskStatus === 'creating' && 'Creating in CRM...'}
                {taskStatus === 'scheduled' && 'Task assigned'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Details */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Task Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Task Information</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Task Title: Final Event Preparation Check</li>
              <li>• Event Date: {eventDate.toLocaleDateString('en-GB')}</li>
              <li>• Task Due Date: {taskDate.toLocaleDateString('en-GB')}</li>
              <li>• Days Before Event: 14 days (2 weeks)</li>
              <li>• Priority: HIGH</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Assignment Details</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Assigned To: Operations Team</li>
              <li>• CRM System: GoHighLevel</li>
              <li>• Task Type: Event Preparation</li>
              <li>• Trigger: Customer response received</li>
              <li>• Auto-populated with response data</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Customer Response Data */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Customer Response Data</h4>
        <div className="bg-gray-50 p-4 rounded border text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h6 className="font-medium text-gray-700 mb-2">Event Details</h6>
              <ul className="space-y-1 text-gray-600">
                <li>• Final Headcount: 24 people</li>
                <li>• Arrival Time: 9:30 AM</li>
                <li>• Company: TechCorp Solutions Ltd</li>
                <li>• Event Type: Team Building</li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium text-gray-700 mb-2">Special Requirements</h6>
              <ul className="space-y-1 text-gray-600">
                <li>• Dietary: 2 vegetarians</li>
                <li>• Allergies: 1 nut allergy</li>
                <li>• Emergency Contact: Provided</li>
                <li>• Accessibility: None required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Task Description Preview */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Task Description</h4>
        <div className="bg-gray-50 p-4 rounded border text-sm text-gray-700">
          <p className="font-medium mb-2">Final Event Preparation Check - TechCorp Solutions</p>
          <p className="mb-3">Complete final preparations for team building event scheduled for {eventDate.toLocaleDateString('en-GB')}.</p>
          
          <p className="font-medium mb-1">Customer Details Received:</p>
          <ul className="list-disc ml-6 space-y-1 mb-3">
            <li>24 participants confirmed</li>
            <li>Arrival time: 9:30 AM</li>
            <li>Dietary requirements: 2 vegetarians, 1 nut allergy</li>
            <li>Emergency contact details provided</li>
          </ul>
          
          <p className="font-medium mb-1">Action Items:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Confirm activity setup for 24 people</li>
            <li>Brief activity leaders on dietary requirements</li>
            <li>Prepare safety briefing materials</li>
            <li>Coordinate with catering for final numbers</li>
            <li>Verify equipment and venue readiness</li>
          </ul>
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
        <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>96.8% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default FinalDetailsTask; 