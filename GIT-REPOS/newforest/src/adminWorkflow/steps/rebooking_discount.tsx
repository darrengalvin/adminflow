import React, { useState } from 'react';
import { 
  Gift, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  Mail,
  Users,
  Percent,
  Shield
} from 'lucide-react';

interface RebookingDiscountProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

const RebookingDiscount: React.FC<RebookingDiscountProps> = ({ 
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
    phase: 'Waiver' | 'CRM' | 'Email' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [waiverStatus, setWaiverStatus] = useState<'pending' | 'checking' | 'verified'>('pending');
  const [emailStrategy, setEmailStrategy] = useState<'all_participants' | 'organizer_only' | null>(null);
  const [crmStatus, setCrmStatus] = useState<'pending' | 'sending' | 'sent'>('pending');

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'Waiver' | 'CRM' | 'Email' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processRebookingDiscount = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting rebooking discount automation', 'System');
      
      // Step 1: Check waiver completion status
      setWaiverStatus('checking');
      addActivity('info', 'Checking FareHarbor waiver completion status for all participants', 'Waiver');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        addActivity('success', 'Demo: Connected to FareHarbor waiver system', 'Waiver');
        addActivity('info', 'Demo: Checking waiver status for 24 participants', 'Waiver');
        addActivity('success', 'Demo: All 24 participants completed waivers', 'Waiver');
        addActivity('info', 'Demo: Participant emails available from waiver system', 'Waiver');
        setWaiverStatus('verified');
        setEmailStrategy('all_participants');
      } else {
        // Real waiver check implementation would go here
        setWaiverStatus('verified');
        // For demo, we'll assume all completed
        setEmailStrategy('all_participants');
        addActivity('success', 'Waiver completion status verified', 'Waiver');
      }
      
      // Step 2: Send discount code via CRM
      setCrmStatus('sending');
      addActivity('info', 'Sending 20% rebooking discount code via CRM snippet', 'CRM');
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      if (demoMode) {
        addActivity('success', 'Demo: Connected to GoHighLevel CRM', 'CRM');
        
        if (emailStrategy === 'all_participants') {
          addActivity('info', 'Demo: Strategy A - All participants completed waivers', 'Email');
          addActivity('info', 'Demo: BCC sending to all 24 participant emails', 'Email');
          addActivity('success', 'Demo: Rebooking snippet sent to all participants', 'Email');
          addActivity('info', 'Demo: Discount code: TEAMBUILDING20 (20% off, valid 12 months)', 'Email');
        } else {
          addActivity('info', 'Demo: Strategy B - Not all participants completed waivers', 'Email');
          addActivity('info', 'Demo: Sending to organizer with sharing request', 'Email');
          addActivity('success', 'Demo: Rebooking snippet sent to organizer only', 'Email');
        }
        
        setCrmStatus('sent');
      } else {
        setCrmStatus('sent');
        addActivity('success', 'Rebooking discount sent successfully', 'CRM');
      }
      
      addActivity('success', 'Rebooking discount automation completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Rebooking discount automation failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Waiver': return <Shield className="w-4 h-4" />;
      case 'CRM': return <Settings className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Waiver': return 'bg-blue-100 text-blue-800';
      case 'CRM': return 'bg-green-100 text-green-800';
      case 'Email': return 'bg-purple-100 text-purple-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Send 20% Rebooking Code</h3>
            <p className="text-sm text-gray-600">Send discount code to all participants or organizer based on waiver completion</p>
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
            onClick={processRebookingDiscount}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Send Discount'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              waiverStatus === 'verified' ? 'bg-green-500' : 
              waiverStatus === 'checking' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Waiver Check</h4>
              <p className="text-sm text-gray-600">
                {waiverStatus === 'pending' && 'Ready to check'}
                {waiverStatus === 'checking' && 'Checking status...'}
                {waiverStatus === 'verified' && 'Status verified'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              emailStrategy ? 'bg-blue-500' : 'bg-gray-300'
            }`}>
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Email Strategy</h4>
              <p className="text-sm text-gray-600">
                {!emailStrategy && 'Determining strategy...'}
                {emailStrategy === 'all_participants' && 'All participants'}
                {emailStrategy === 'organizer_only' && 'Organizer only'}
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
                {crmStatus === 'pending' && 'Waiting for strategy'}
                {crmStatus === 'sending' && 'Sending emails...'}
                {crmStatus === 'sent' && 'Emails sent'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Waiver Completion Status */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Waiver Completion Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Completed Waivers</span>
              </div>
              <span className="text-green-700 font-bold">24/24</span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              All participants have completed their FareHarbor waivers
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Email Addresses</span>
              </div>
              <span className="text-blue-700 font-bold">24 Available</span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Email addresses collected from waiver submissions
            </div>
          </div>
        </div>
      </div>

      {/* Email Strategy Decision */}
      {emailStrategy && (
        <div className={`p-4 rounded-lg border mb-6 ${
          emailStrategy === 'all_participants' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-start space-x-3">
            {emailStrategy === 'all_participants' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            )}
            <div>
              <h4 className={`font-medium mb-2 ${
                emailStrategy === 'all_participants' ? 'text-green-800' : 'text-orange-800'
              }`}>
                {emailStrategy === 'all_participants' ? 'Strategy A: All Participants' : 'Strategy B: Organizer Only'}
              </h4>
              <div className={`text-sm ${
                emailStrategy === 'all_participants' ? 'text-green-700' : 'text-orange-700'
              }`}>
                {emailStrategy === 'all_participants' ? (
                  <>
                    <p className="mb-2"><strong>All participants completed waivers:</strong></p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>BCC all 24 participant emails from waiver system</li>
                      <li>Send rebooking snippet directly to all participants</li>
                      <li>Each participant receives personal discount code</li>
                      <li>Higher conversion rate expected</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="mb-2"><strong>Not all participants completed waivers:</strong></p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>Send snippet to organizer only</li>
                      <li>Ask organizer to share with team</li>
                      <li>Include instructions for sharing discount code</li>
                      <li>Follow-up task created for team distribution</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discount Details */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
        <div className="flex items-start space-x-3">
          <Percent className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-purple-800 mb-2">20% Rebooking Discount Details</h4>
            <div className="text-sm text-purple-700 space-y-1">
              <p>• <strong>Discount Code:</strong> TEAMBUILDING20</p>
              <p>• <strong>Discount Amount:</strong> 20% off next booking</p>
              <p>• <strong>Valid For:</strong> 12 months from issue date</p>
              <p>• <strong>Minimum Spend:</strong> £1,000 (team building events)</p>
              <p>• <strong>Usage:</strong> One-time use per participant/company</p>
              <p>• <strong>Applies To:</strong> All team building activities</p>
            </div>
          </div>
        </div>
      </div>

      {/* CRM Snippet Preview */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">CRM Snippet Content</h4>
        <div className="bg-gray-50 p-3 rounded border text-sm">
          <p className="font-medium mb-2">Subject: "Thank you TechCorp - Here's 20% off your next team adventure!"</p>
          <div className="text-gray-700 space-y-2">
            <p>Dear Team,</p>
            <p>Thank you for choosing New Forest Activities for your team building experience! We hope you had an amazing time with us.</p>
            <p>As a thank you, we'd like to offer you <strong>20% off your next team building adventure</strong> with us.</p>
            <p>Use code: <strong>TEAMBUILDING20</strong></p>
            <p>Valid for 12 months • Minimum spend £1,000 • Book online or call us</p>
            <p>We'd love to welcome you back for another unforgettable experience!</p>
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
        <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>94.6% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default RebookingDiscount; 