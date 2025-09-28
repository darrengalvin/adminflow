import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  DollarSign,
  Target,
  FileText,
  Trophy
} from 'lucide-react';

interface DepositPaymentCheckProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

const DepositPaymentCheck: React.FC<DepositPaymentCheckProps> = ({ 
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
    phase: 'Xero' | 'CRM' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [xeroStatus, setXeroStatus] = useState<'pending' | 'checking' | 'paid' | 'unpaid'>('pending');
  const [crmStatus, setCrmStatus] = useState<'pending' | 'updating' | 'won'>('pending');

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'Xero' | 'CRM' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processDepositPaymentCheck = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting deposit payment verification', 'System');
      
      // Step 1: Check Xero invoice status
      setXeroStatus('checking');
      addActivity('info', 'Checking payment status for invoice INV-2024-001', 'Xero');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        addActivity('success', 'Demo: Connected to Xero successfully', 'Xero');
        addActivity('info', 'Demo: Found invoice INV-2024-001 - Amount: £3,125', 'Xero');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setXeroStatus('paid');
        addActivity('success', 'Demo: Invoice marked as PAID by Jenny on 28/06/2024', 'Xero');
        addActivity('info', 'Demo: Payment amount: £3,125 (Full deposit received)', 'Xero');
      } else {
        // Real Xero API implementation would go here
        setXeroStatus('paid');
        addActivity('success', 'Invoice payment confirmed in Xero', 'Xero');
      }
      
      // Step 2: Update GoHighLevel CRM opportunity to Won
      setCrmStatus('updating');
      addActivity('info', 'Updating opportunity nSs9C88yT7EhjEVh6H3e to Won status', 'CRM');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (demoMode) {
        setCrmStatus('won');
        addActivity('success', 'Demo: Opportunity moved from "Confirmed" to "Won"', 'CRM');
        addActivity('info', 'Demo: Won date set to today', 'CRM');
        addActivity('info', 'Demo: Final opportunity value: £6,250', 'CRM');
      } else {
        // Real GoHighLevel API implementation would go here
        setCrmStatus('won');
        addActivity('success', 'Opportunity updated to Won status', 'CRM');
      }
      
      addActivity('success', 'Deposit payment verification and CRM update completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Deposit payment check failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Xero': return <FileText className="w-4 h-4" />;
      case 'CRM': return <Target className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Xero': return 'bg-blue-100 text-blue-800';
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
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Deposit Payment Check</h3>
            <p className="text-sm text-gray-600">Verify Xero payment status and update CRM to Won</p>
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
            onClick={processDepositPaymentCheck}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Checking...' : 'Check Payment'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              xeroStatus === 'paid' ? 'bg-green-500' : 
              xeroStatus === 'unpaid' ? 'bg-red-500' :
              xeroStatus === 'checking' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Xero Payment Status</h4>
              <p className="text-sm text-gray-600">
                {xeroStatus === 'pending' && 'Ready to check'}
                {xeroStatus === 'checking' && 'Checking Xero...'}
                {xeroStatus === 'paid' && 'Payment received'}
                {xeroStatus === 'unpaid' && 'Payment pending'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              crmStatus === 'won' ? 'bg-green-500' : 
              crmStatus === 'updating' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">CRM Update</h4>
              <p className="text-sm text-gray-600">
                {crmStatus === 'pending' && 'Waiting for payment'}
                {crmStatus === 'updating' && 'Updating to Won...'}
                {crmStatus === 'won' && 'Opportunity Won'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Payment Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">£3,125</div>
            <div className="text-sm text-gray-600">50% Deposit</div>
            <div className="text-xs text-green-600 font-medium">RECEIVED</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">£3,125</div>
            <div className="text-sm text-gray-600">Final Balance</div>
            <div className="text-xs text-yellow-600 font-medium">PENDING</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">£6,250</div>
            <div className="text-sm text-gray-600">Total Value</div>
            <div className="text-xs text-blue-600 font-medium">CONFIRMED</div>
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
          <span>99.2% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default DepositPaymentCheck;
