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
  DollarSign,
  Paperclip
} from 'lucide-react';

interface FinalBalanceInvoiceProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

const FinalBalanceInvoice: React.FC<FinalBalanceInvoiceProps> = ({ 
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
    phase: 'Xero' | 'Download' | 'Email' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [xeroStatus, setXeroStatus] = useState<'pending' | 'connecting' | 'found'>('pending');
  const [downloadStatus, setDownloadStatus] = useState<'pending' | 'downloading' | 'downloaded'>('pending');
  const [emailStatus, setEmailStatus] = useState<'pending' | 'sending' | 'sent'>('pending');

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'Xero' | 'Download' | 'Email' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processFinalBalanceInvoice = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting final balance invoice automation', 'System');
      
      // Step 1: Connect to Xero and find final balance invoice
      setXeroStatus('connecting');
      addActivity('info', 'Connecting to Xero to locate final balance invoice', 'Xero');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        addActivity('success', 'Demo: Connected to Xero successfully', 'Xero');
        addActivity('info', 'Demo: Searching for final balance invoice (INV-2024-002)', 'Xero');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setXeroStatus('found');
        addActivity('success', 'Demo: Final balance invoice located - INV-2024-002', 'Xero');
        addActivity('info', 'Demo: Invoice amount: £3,125 (50% final balance)', 'Xero');
        addActivity('info', 'Demo: Invoice status: AUTHORISED', 'Xero');
        addActivity('info', 'Demo: Due date: 01/08/2024', 'Xero');
      } else {
        // Real Xero API implementation would go here
        setXeroStatus('found');
        addActivity('success', 'Final balance invoice located in Xero', 'Xero');
      }
      
      // Step 2: Download invoice PDF from Xero
      setDownloadStatus('downloading');
      addActivity('info', 'Downloading invoice PDF from Xero', 'Download');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (demoMode) {
        setDownloadStatus('downloaded');
        addActivity('success', 'Demo: Invoice PDF downloaded successfully', 'Download');
        addActivity('info', 'Demo: File size: 247 KB', 'Download');
        addActivity('info', 'Demo: File name: INV-2024-002_TechCorp_FinalBalance.pdf', 'Download');
        addActivity('success', 'Demo: PDF ready for email attachment', 'Download');
      } else {
        setDownloadStatus('downloaded');
        addActivity('success', 'Invoice PDF downloaded successfully', 'Download');
      }
      
      // Step 3: Send email with invoice attachment
      setEmailStatus('sending');
      addActivity('info', 'Composing and sending final balance invoice email', 'Email');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        setEmailStatus('sent');
        addActivity('success', 'Demo: Email sent to sarah.johnson@techcorp.com', 'Email');
        addActivity('info', 'Demo: Subject: "Final Balance Invoice - Team Building Event"', 'Email');
        addActivity('info', 'Demo: Invoice PDF attached (INV-2024-002_TechCorp_FinalBalance.pdf)', 'Email');
        addActivity('success', 'Demo: Payment instructions included in email', 'Email');
        addActivity('info', 'Demo: Payment due date: 01/08/2024', 'Email');
      } else {
        setEmailStatus('sent');
        addActivity('success', 'Final balance invoice email sent successfully', 'Email');
      }
      
      addActivity('success', 'Final balance invoice automation completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Final balance invoice automation failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Xero': return <FileText className="w-4 h-4" />;
      case 'Download': return <Download className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Xero': return 'bg-blue-100 text-blue-800';
      case 'Download': return 'bg-purple-100 text-purple-800';
      case 'Email': return 'bg-green-100 text-green-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Send Final Balance Invoice</h3>
            <p className="text-sm text-gray-600">Download from Xero and email to customer</p>
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
            onClick={processFinalBalanceInvoice}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Send Invoice'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              xeroStatus === 'found' ? 'bg-green-500' : 
              xeroStatus === 'connecting' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Xero Invoice</h4>
              <p className="text-sm text-gray-600">
                {xeroStatus === 'pending' && 'Ready to search'}
                {xeroStatus === 'connecting' && 'Searching Xero...'}
                {xeroStatus === 'found' && 'Invoice located'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              downloadStatus === 'downloaded' ? 'bg-green-500' : 
              downloadStatus === 'downloading' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">PDF Download</h4>
              <p className="text-sm text-gray-600">
                {downloadStatus === 'pending' && 'Waiting for invoice'}
                {downloadStatus === 'downloading' && 'Downloading PDF...'}
                {downloadStatus === 'downloaded' && 'PDF ready'}
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
                {emailStatus === 'pending' && 'Waiting for PDF'}
                {emailStatus === 'sending' && 'Sending email...'}
                {emailStatus === 'sent' && 'Email sent'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Invoice Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Invoice Information</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Invoice Number: INV-2024-002</li>
              <li>• Invoice Type: Final Balance</li>
              <li>• Amount: £3,125.00 (50% remaining)</li>
              <li>• Due Date: 01/08/2024</li>
              <li>• Status: AUTHORISED</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Customer Details</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Company: TechCorp Solutions Ltd</li>
              <li>• Contact: Sarah Johnson</li>
              <li>• Email: sarah.johnson@techcorp.com</li>
              <li>• Total Event Value: £6,250.00</li>
              <li>• Deposit Paid: £3,125.00</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Payment Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">£3,125</div>
            <div className="text-sm text-gray-600">Deposit Paid</div>
            <div className="text-xs text-green-600 font-medium">RECEIVED</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">£3,125</div>
            <div className="text-sm text-gray-600">Final Balance</div>
            <div className="text-xs text-orange-600 font-medium">DUE</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">£6,250</div>
            <div className="text-sm text-gray-600">Total Value</div>
            <div className="text-xs text-blue-600 font-medium">CONFIRMED</div>
          </div>
        </div>
      </div>

      {/* Email Template Preview */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Email Template Preview</h4>
        <div className="bg-gray-50 p-4 rounded border text-sm">
          <div className="mb-3">
            <strong>Subject:</strong> Final Balance Invoice - Team Building Event (Due 01/08/2024)
          </div>
          <div className="space-y-2 text-gray-700">
            <p>Dear Sarah,</p>
            <p>Please find attached the final balance invoice for your team building event scheduled for 15th August 2024.</p>
            
            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400 my-3">
              <p><strong>Invoice Details:</strong></p>
              <p>• Invoice Number: INV-2024-002</p>
              <p>• Amount Due: £3,125.00</p>
              <p>• Due Date: 1st August 2024</p>
              <p>• Event Date: 15th August 2024</p>
            </div>
            
            <div className="flex items-center space-x-2 mt-3 p-2 bg-gray-100 rounded">
              <Paperclip className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Attachment: INV-2024-002_TechCorp_FinalBalance.pdf</span>
            </div>
            
            <p className="mt-3">We look forward to providing an excellent team building experience for your group!</p>
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
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>98.1% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default FinalBalanceInvoice; 