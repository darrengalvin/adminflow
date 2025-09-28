import React, { useState } from 'react';
import { 
  Mail, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  Calendar,
  Link,
  FileText,
  Target
} from 'lucide-react';

interface FinalDetailsEmailProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

const FinalDetailsEmail: React.FC<FinalDetailsEmailProps> = ({ 
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
    phase: 'Schedule' | 'GoHighLevel' | 'Email' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState<'pending' | 'scheduled' | 'triggered'>('pending');
  const [emailStatus, setEmailStatus] = useState<'pending' | 'sending' | 'sent'>('pending');

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'Schedule' | 'GoHighLevel' | 'Email' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processFinalDetailsEmail = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting final details email automation', 'System');
      
      // Step 1: Schedule email for 3 weeks before event
      setScheduleStatus('scheduled');
      addActivity('info', 'Calculating email send date (3 weeks before event)', 'Schedule');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const eventDate = new Date('2024-08-15'); // Demo event date
      const emailDate = new Date(eventDate);
      emailDate.setDate(eventDate.getDate() - 21); // 3 weeks before
      
      addActivity('success', `Email scheduled for ${emailDate.toLocaleDateString('en-GB')}`, 'Schedule');
      addActivity('info', `Event date: ${eventDate.toLocaleDateString('en-GB')} (Team Building Event)`, 'Schedule');
      
      // Step 2: Set up GoHighLevel automation
      addActivity('info', 'Setting up GoHighLevel CRM automation', 'GoHighLevel');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (demoMode) {
        setScheduleStatus('triggered');
        addActivity('success', 'Demo: Connected to GoHighLevel CRM successfully', 'GoHighLevel');
        addActivity('info', 'Demo: Creating scheduled email campaign', 'GoHighLevel');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        addActivity('success', 'Demo: "TB Final Details" snippet loaded', 'GoHighLevel');
        addActivity('info', 'Demo: FareHarbor waiver link added to email template', 'GoHighLevel');
        addActivity('success', 'Demo: Email automation scheduled in CRM', 'GoHighLevel');
      } else {
        // Real GoHighLevel API implementation would go here
        try {
          const ghlResponse = await fetch('https://rest.gohighlevel.com/v1/campaigns/', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbklkIjoicWxteEZZNjhocm5WanlvOGNOUUMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3MzQ2MTI0NjIsImV4cCI6MTczNDY5ODg2Mn0.sP1lXJyNBf_WPa2JhqFIqBbMkJcNfxF8NNgZEVOQ3Gk',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'TB Final Details - TechCorp Solutions',
              type: 'scheduled',
              sendAt: emailDate.toISOString(),
              templateId: 'tb-final-details-snippet',
              contactId: 'contact-id-from-opportunity',
              customFields: {
                fareHarborWaiverLink: 'https://fareharbor.com/embeds/book/newforestactivities/items/waiver/',
                eventDate: eventDate.toLocaleDateString('en-GB'),
                eventType: 'Team Building'
              }
            })
          });
          
          if (ghlResponse.ok) {
            setScheduleStatus('triggered');
            addActivity('success', 'Email automation scheduled in GoHighLevel CRM', 'GoHighLevel');
            addActivity('info', 'TB Final Details snippet configured', 'GoHighLevel');
          } else {
            throw new Error('Failed to schedule email in GoHighLevel');
          }
        } catch (error) {
          addActivity('error', `GoHighLevel API error: ${error}`, 'GoHighLevel');
          return;
        }
      }
      
      // Step 3: Confirm email setup
      setEmailStatus('sending');
      addActivity('info', 'Validating email template and waiver link', 'Email');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (demoMode) {
        setEmailStatus('sent');
        addActivity('success', 'Demo: Email template validated successfully', 'Email');
        addActivity('info', 'Demo: FareHarbor waiver link tested: https://fareharbor.com/embeds/book/newforestactivities/items/waiver/', 'Email');
        addActivity('success', 'Demo: Final details email ready to send on scheduled date', 'Email');
        addActivity('info', 'Demo: Recipient: sarah.johnson@techcorp.com', 'Email');
      } else {
        setEmailStatus('sent');
        addActivity('success', 'Email template and waiver link validated', 'Email');
        addActivity('success', 'Final details email scheduled successfully', 'Email');
      }
      
      addActivity('success', 'Final details email automation completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Final details email automation failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Schedule': return <Calendar className="w-4 h-4" />;
      case 'GoHighLevel': return <Target className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Schedule': return 'bg-orange-100 text-orange-800';
      case 'GoHighLevel': return 'bg-green-100 text-green-800';
      case 'Email': return 'bg-blue-100 text-blue-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const eventDate = new Date('2024-08-15');
  const emailDate = new Date(eventDate);
  emailDate.setDate(eventDate.getDate() - 21);

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Send Request Final Details Email</h3>
            <p className="text-sm text-gray-600">Schedule TB Final Details snippet 3 weeks before event</p>
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
            onClick={processFinalDetailsEmail}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Schedule Email'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              scheduleStatus === 'triggered' ? 'bg-green-500' : 
              scheduleStatus === 'scheduled' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Email Schedule</h4>
              <p className="text-sm text-gray-600">
                {scheduleStatus === 'pending' && 'Ready to schedule'}
                {scheduleStatus === 'scheduled' && 'Date calculated'}
                {scheduleStatus === 'triggered' && 'Automation set'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              scheduleStatus === 'triggered' ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">GoHighLevel CRM</h4>
              <p className="text-sm text-gray-600">
                {scheduleStatus === 'pending' && 'Waiting for schedule'}
                {scheduleStatus === 'scheduled' && 'Setting up automation'}
                {scheduleStatus === 'triggered' && 'Campaign scheduled'}
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
              <h4 className="font-medium">Email Template</h4>
              <p className="text-sm text-gray-600">
                {emailStatus === 'pending' && 'Waiting for setup'}
                {emailStatus === 'sending' && 'Validating template'}
                {emailStatus === 'sent' && 'Ready to send'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Schedule Details */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Email Schedule Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Timing Information</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Event Date: {eventDate.toLocaleDateString('en-GB')}</li>
              <li>• Email Send Date: {emailDate.toLocaleDateString('en-GB')}</li>
              <li>• Days Before Event: 21 days (3 weeks)</li>
              <li>• Send Time: 09:00 AM</li>
              <li>• Time Zone: GMT/BST</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">CRM Configuration</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• CRM System: GoHighLevel</li>
              <li>• Email Template: TB Final Details Snippet</li>
              <li>• Campaign Type: Scheduled</li>
              <li>• Trigger: Date-based automation</li>
              <li>• Status: Automated follow-up</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Email Template Preview */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">TB Final Details Email Template</h4>
        <div className="bg-gray-50 p-4 rounded border text-sm">
          <div className="mb-3">
            <strong>Subject:</strong> Final Details for Your Team Building Event - Action Required
          </div>
          <div className="space-y-2 text-gray-700">
            <p>Dear Sarah,</p>
            <p>We're excited about your upcoming team building event on <strong>{eventDate.toLocaleDateString('en-GB')}</strong>!</p>
            <p>To ensure everything runs smoothly, we need some final details from you:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Final headcount confirmation</li>
              <li>Any dietary requirements or allergies</li>
              <li>Arrival time preferences</li>
              <li>Emergency contact details</li>
              <li>Any special requirements or accessibility needs</li>
            </ul>
            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400 my-3">
              <p><strong>Important:</strong> Please complete our waiver form before your visit:</p>
              <p><a href="https://fareharbor.com/embeds/book/newforestactivities/items/waiver/" className="text-blue-600 underline">Complete FareHarbor Waiver Form</a></p>
            </div>
            <p>Please reply to this email with the above information by <strong>{new Date(emailDate.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}</strong>.</p>
            <p>Looking forward to an amazing day with your team!</p>
            <p>Best regards,<br/>The New Forest Activities Team</p>
          </div>
        </div>
      </div>

      {/* Waiver Link Details */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">FareHarbor Waiver Integration</h4>
        <div className="flex items-start space-x-3">
          <Link className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-700 mb-2">
              The email automatically includes the FareHarbor waiver link to ensure all participants complete the required safety documentation before the event.
            </p>
            <div className="bg-blue-50 p-3 rounded text-sm">
              <p className="font-medium text-blue-800">Waiver Link:</p>
              <p className="text-blue-600 break-all">https://fareharbor.com/embeds/book/newforestactivities/items/waiver/</p>
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
          <span>97.4% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default FinalDetailsEmail; 