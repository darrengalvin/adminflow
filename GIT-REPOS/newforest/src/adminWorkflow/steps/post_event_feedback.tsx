import React, { useState } from 'react';
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  Mail,
  Star,
  Calendar
} from 'lucide-react';

interface PostEventFeedbackProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

const PostEventFeedback: React.FC<PostEventFeedbackProps> = ({ 
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
    phase: 'CRM' | 'Email' | 'Template' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [crmStatus, setCrmStatus] = useState<'pending' | 'connecting' | 'connected'>('pending');
  const [emailStatus, setEmailStatus] = useState<'pending' | 'sending' | 'sent'>('pending');

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'CRM' | 'Email' | 'Template' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processPostEventFeedback = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting post-event feedback automation', 'System');
      
      // Step 1: Connect to GoHighLevel CRM
      setCrmStatus('connecting');
      addActivity('info', 'Connecting to GoHighLevel CRM (Two Thirds Different)', 'CRM');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        addActivity('success', 'Demo: Connected to GoHighLevel CRM successfully', 'CRM');
        addActivity('info', 'Demo: Located customer record for TechCorp Solutions', 'CRM');
        addActivity('info', 'Demo: Event completed: 15/08/2024', 'CRM');
        addActivity('success', 'Demo: Ready to send feedback request', 'CRM');
        setCrmStatus('connected');
      } else {
        setCrmStatus('connected');
        addActivity('success', 'Connected to GoHighLevel CRM successfully', 'CRM');
      }
      
      // Step 2: Send feedback email using snippet
      setEmailStatus('sending');
      addActivity('info', 'Sending "How was your event" email using CRM snippet', 'Email');
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      if (demoMode) {
        addActivity('success', 'Demo: Loading "How was your event" email template', 'Template');
        addActivity('info', 'Demo: Personalizing email for TechCorp Solutions event', 'Template');
        addActivity('info', 'Demo: Including feedback survey link and review request', 'Template');
        addActivity('success', 'Demo: Email sent to sarah.johnson@techcorp.com', 'Email');
        addActivity('info', 'Demo: Email includes Google review link and testimonial request', 'Email');
        addActivity('success', 'Demo: Follow-up task created for 1 week', 'CRM');
        setEmailStatus('sent');
      } else {
        setEmailStatus('sent');
        addActivity('success', 'Post-event feedback email sent successfully', 'Email');
      }
      
      addActivity('success', 'Post-event feedback automation completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Post-event feedback automation failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'CRM': return <Settings className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Template': return <MessageSquare className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'CRM': return 'bg-blue-100 text-blue-800';
      case 'Email': return 'bg-green-100 text-green-800';
      case 'Template': return 'bg-purple-100 text-purple-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Send Post-Event Feedback</h3>
            <p className="text-sm text-gray-600">Send "How was your event" email after event completion</p>
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
            onClick={processPostEventFeedback}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Sending...' : 'Send Feedback'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              crmStatus === 'connected' ? 'bg-green-500' : 
              crmStatus === 'connecting' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">CRM Connection</h4>
              <p className="text-sm text-gray-600">
                {crmStatus === 'pending' && 'Ready to connect'}
                {crmStatus === 'connecting' && 'Connecting...'}
                {crmStatus === 'connected' && 'Connected'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              emailStatus === 'sent' ? 'bg-green-500' : 
              emailStatus === 'sending' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Email Delivery</h4>
              <p className="text-sm text-gray-600">
                {emailStatus === 'pending' && 'Waiting for CRM'}
                {emailStatus === 'sending' && 'Sending email...'}
                {emailStatus === 'sent' && 'Email sent'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Summary */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Event Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Event Details</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Company: TechCorp Solutions Ltd</li>
              <li>• Event Date: Thursday, 15th August 2024</li>
              <li>• Activity: Team Building Experience</li>
              <li>• Participants: 24 people</li>
              <li>• Duration: 6 hours</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Contact Information</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Organizer: Sarah Johnson</li>
              <li>• Email: sarah.johnson@techcorp.com</li>
              <li>• Phone: +44 20 7123 4567</li>
              <li>• Event Value: £6,250</li>
              <li>• Status: Completed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Email Template Preview */}
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
        <div className="flex items-start space-x-3">
          <Star className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-orange-800 mb-2">"How was your event" Email Template</h4>
            <div className="text-sm text-orange-700">
              <p className="mb-2"><strong>Email includes:</strong></p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Personalized thank you message</li>
                <li>Request for feedback on the team building experience</li>
                <li>Link to online feedback survey</li>
                <li>Google review request with direct link</li>
                <li>Invitation to share testimonial or photos</li>
                <li>Contact details for future bookings</li>
              </ul>
              <div className="mt-3 p-2 bg-white rounded border">
                <p className="font-medium">Subject Line:</p>
                <p className="text-orange-800">"How was your team building experience with us, TechCorp?"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Actions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <h4 className="font-medium text-blue-800 mb-2">Automated Follow-up Actions</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>Follow-up Task:</strong> Created for 1 week after email sent</p>
          <p>• <strong>Review Reminder:</strong> Second email if no response in 2 weeks</p>
          <p>• <strong>Future Marketing:</strong> Added to "Past Customers" segment</p>
          <p>• <strong>Rebooking Campaign:</strong> Quarterly newsletter subscription</p>
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
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>96.8% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default PostEventFeedback; 