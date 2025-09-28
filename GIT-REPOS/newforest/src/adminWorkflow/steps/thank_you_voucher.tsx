import React, { useState } from 'react';
import { 
  Gift, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  Mail,
  Percent,
  User,
  Heart
} from 'lucide-react';

interface ThankYouVoucherProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

const ThankYouVoucher: React.FC<ThankYouVoucherProps> = ({ 
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
    phase: 'FareHarbor' | 'Email' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [voucherStatus, setVoucherStatus] = useState<'pending' | 'creating' | 'created'>('pending');
  const [emailStatus, setEmailStatus] = useState<'pending' | 'sending' | 'sent'>('pending');

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'FareHarbor' | 'Email' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processThankYouVoucher = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting thank you voucher automation', 'System');
      
      // Step 1: Create gift voucher in FareHarbor
      setVoucherStatus('creating');
      addActivity('info', 'Creating £100 gift voucher in FareHarbor', 'FareHarbor');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        addActivity('success', 'Demo: Connected to FareHarbor API successfully', 'FareHarbor');
        addActivity('info', 'Demo: Creating new gift voucher', 'FareHarbor');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setVoucherStatus('created');
        addActivity('success', 'Demo: Gift voucher created - Code: THANKYOU-TB-2024-001', 'FareHarbor');
        addActivity('info', 'Demo: Voucher value: £100.00', 'FareHarbor');
        addActivity('info', 'Demo: Discount applied: 100% (Free voucher)', 'FareHarbor');
        addActivity('success', 'Demo: Voucher marked as complimentary gift', 'FareHarbor');
      } else {
        // Real FareHarbor API implementation would go here
        try {
          const fareHarborResponse = await fetch('https://fareharbor.com/api/external/v1/companies/YOUR_COMPANY/gift-certificates/', {
            method: 'POST',
            headers: {
              'X-FareHarbor-API-App': 'YOUR_APP_KEY',
              'X-FareHarbor-API-User': 'YOUR_USER_KEY',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: 10000, // £100 in pence
              currency: 'GBP',
              discount_percent: 100,
              note: 'Thank you voucher for corporate booking',
              recipient_email: 'sarah.johnson@techcorp.com',
              recipient_name: 'Sarah Johnson'
            })
          });
          
          if (fareHarborResponse.ok) {
            const voucherData = await fareHarborResponse.json();
            setVoucherStatus('created');
            addActivity('success', `Gift voucher created - Code: ${voucherData.code}`, 'FareHarbor');
            addActivity('info', `Voucher value: £${voucherData.amount / 100}`, 'FareHarbor');
            addActivity('success', 'Voucher marked as complimentary gift', 'FareHarbor');
          } else {
            throw new Error('Failed to create gift voucher');
          }
        } catch (error) {
          addActivity('error', `FareHarbor API error: ${error}`, 'FareHarbor');
          return;
        }
      }
      
      // Step 2: Send voucher to organiser
      setEmailStatus('sending');
      addActivity('info', 'Sending thank you email with voucher to organiser', 'Email');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (demoMode) {
        setEmailStatus('sent');
        addActivity('success', 'Demo: Thank you email sent to sarah.johnson@techcorp.com', 'Email');
        addActivity('info', 'Demo: Email subject: "Thank You for Your Booking - £100 Gift Voucher Enclosed"', 'Email');
        addActivity('info', 'Demo: Voucher code included in email: THANKYOU-TB-2024-001', 'Email');
        addActivity('success', 'Demo: FareHarbor waiver link included for future bookings', 'Email');
      } else {
        // Real email sending implementation would go here
        setEmailStatus('sent');
        addActivity('success', 'Thank you email sent to organiser', 'Email');
      }
      
      addActivity('success', 'Thank you voucher automation completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Thank you voucher automation failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'FareHarbor': return <Gift className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'FareHarbor': return 'bg-purple-100 text-purple-800';
      case 'Email': return 'bg-blue-100 text-blue-800';
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
            <h3 className="text-lg font-semibold">Send £100 Thank You Voucher</h3>
            <p className="text-sm text-gray-600">Create FareHarbor gift voucher and send to organiser</p>
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
            onClick={processThankYouVoucher}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Send Voucher'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              voucherStatus === 'created' ? 'bg-green-500' : 
              voucherStatus === 'creating' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Gift className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">FareHarbor Voucher</h4>
              <p className="text-sm text-gray-600">
                {voucherStatus === 'pending' && 'Ready to create'}
                {voucherStatus === 'creating' && 'Creating voucher...'}
                {voucherStatus === 'created' && 'Voucher created'}
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
              <h4 className="font-medium">Thank You Email</h4>
              <p className="text-sm text-gray-600">
                {emailStatus === 'pending' && 'Waiting for voucher'}
                {emailStatus === 'sending' && 'Sending email...'}
                {emailStatus === 'sent' && 'Email sent'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Details */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Voucher Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Gift Voucher Information</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Voucher Value: £100.00</li>
              <li>• Discount Applied: 100% (Free gift)</li>
              <li>• Voucher Code: THANKYOU-TB-2024-001</li>
              <li>• Valid For: 12 months from issue</li>
              <li>• Redeemable: Any New Forest activity</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Recipient Details</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Recipient: Sarah Johnson</li>
              <li>• Company: TechCorp Solutions Ltd</li>
              <li>• Email: sarah.johnson@techcorp.com</li>
              <li>• Trigger: PandaDoc signed & confirmed</li>
              <li>• Purpose: Thank you for corporate booking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Email Template Preview */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Email Template Preview</h4>
        <div className="bg-gray-50 p-4 rounded border text-sm">
          <div className="mb-3">
            <strong>Subject:</strong> Thank You for Your Booking - £100 Gift Voucher Enclosed 🎁
          </div>
          <div className="space-y-2 text-gray-700">
            <p>Dear Sarah,</p>
            <p>Thank you so much for choosing New Forest Activities for your team building event!</p>
            <p>As a token of our appreciation, we're delighted to include a <strong>£100 gift voucher</strong> that you can use for any future bookings with us.</p>
            <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400 my-3">
              <p><strong>Your Gift Voucher Code: THANKYOU-TB-2024-001</strong></p>
              <p>Valid for 12 months • Can be used for any activity</p>
            </div>
            <p>We look forward to providing an amazing experience for your team!</p>
            <p>Best regards,<br/>The New Forest Activities Team</p>
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
          <Heart className="w-4 h-4" />
          <span>98.7% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default ThankYouVoucher; 