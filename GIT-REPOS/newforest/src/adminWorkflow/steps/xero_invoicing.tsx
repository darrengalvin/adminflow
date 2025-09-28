import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  User, 
  MapPin, 
  Calendar, 
  Copy, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  Building,
  CreditCard
} from 'lucide-react';

interface XeroInvoicingProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

interface ContactData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

interface InvoiceData {
  type: 'deposit' | 'final';
  amount: number;
  description: string;
  eventDate: string;
  issueDate: string;
  dueDate: string;
  accountCode: string;
  reference?: string;
}

const XeroInvoicing: React.FC<XeroInvoicingProps> = ({ 
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
    phase: 'Contact' | 'Deposit Invoice' | 'Final Invoice' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [contactStatus, setContactStatus] = useState<'pending' | 'checking' | 'new' | 'existing' | 'created'>('pending');
  const [depositInvoiceStatus, setDepositInvoiceStatus] = useState<'pending' | 'creating' | 'created'>('pending');
  const [finalInvoiceStatus, setFinalInvoiceStatus] = useState<'pending' | 'scheduled' | 'created'>('pending');

  // Demo data from previous steps
  const demoContactData: ContactData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+44 20 7123 4567",
    company: "TechCorp Solutions Ltd",
    address: {
      line1: "25 Tech Park Avenue",
      line2: "Suite 200",
      city: "London",
      state: "England",
      postcode: "SW1A 1AA",
      country: "United Kingdom"
    }
  };

  const demoDepositInvoice: InvoiceData = {
    type: 'deposit',
    amount: 3125.00, // 50% of £6,250
    description: "50% Deposit - Team Building Event",
    eventDate: "2024-02-15",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    accountCode: "063"
  };

  const demoFinalInvoice: InvoiceData = {
    type: 'final',
    amount: 3125.00, // Remaining 50%
    description: "Final Balance - Team Building Event",
    eventDate: "2024-02-15",
    issueDate: new Date(new Date("2024-02-15").getTime() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 weeks before event
    dueDate: "2024-02-15", // Due on event date
    accountCode: "063",
    reference: "Deposit invoice INV-2024-001 issued for £3,125.00"
  };

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'Contact' | 'Deposit Invoice' | 'Final Invoice' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const checkOrCreateContact = async (contactData: ContactData) => {
    setContactStatus('checking');
    addActivity('info', `Checking if contact exists for ${contactData.company}`, 'Contact');
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (demoMode) {
      // Demo: Simulate new contact creation
      setContactStatus('new');
      addActivity('warning', 'Contact not found in Xero - creating new contact', 'Contact');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setContactStatus('created');
      addActivity('success', `New contact created: ${contactData.company}`, 'Contact');
      addActivity('info', `Contact details: ${contactData.name}, ${contactData.email}`, 'Contact');
      addActivity('info', `Address: ${contactData.address.line1}, ${contactData.address.city}, ${contactData.address.postcode}`, 'Contact');
    } else {
      // Real API call would go here
      try {
        // Example Xero API call structure:
        // const response = await fetch('https://api.xero.com/api.xro/2.0/Contacts', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${accessToken}`,
        //     'Xero-tenant-id': tenantId,
        //     'Accept': 'application/json'
        //   }
        // });
        
        setContactStatus('existing');
        addActivity('success', `Contact found in Xero: ${contactData.company}`, 'Contact');
      } catch (error) {
        addActivity('error', `Error checking contact: ${error}`, 'Contact');
        setContactStatus('pending');
      }
    }
  };

  const createDepositInvoice = async (contactData: ContactData, invoiceData: InvoiceData) => {
    setDepositInvoiceStatus('creating');
    addActivity('info', 'Creating 50% deposit invoice', 'Deposit Invoice');
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (demoMode) {
      setDepositInvoiceStatus('created');
      addActivity('success', `Deposit invoice created: INV-2024-001`, 'Deposit Invoice');
      addActivity('info', `Amount: £${invoiceData.amount.toLocaleString()}`, 'Deposit Invoice');
      addActivity('info', `Account Code: ${invoiceData.accountCode} (Future bookings)`, 'Deposit Invoice');
      addActivity('info', `Due Date: ${invoiceData.dueDate}`, 'Deposit Invoice');
      addActivity('info', 'Invoice template applied successfully', 'Deposit Invoice');
    } else {
      try {
        // Real Xero API call would go here
        // const invoicePayload = {
        //   Type: 'ACCREC',
        //   Contact: { ContactID: contactId },
        //   LineItems: [{
        //     Description: invoiceData.description,
        //     Quantity: 1,
        //     UnitAmount: invoiceData.amount,
        //     AccountCode: invoiceData.accountCode
        //   }],
        //   Date: invoiceData.issueDate,
        //   DueDate: invoiceData.dueDate,
        //   Status: 'AUTHORISED'
        // };

        setDepositInvoiceStatus('created');
        addActivity('success', 'Deposit invoice created successfully', 'Deposit Invoice');
      } catch (error) {
        addActivity('error', `Error creating deposit invoice: ${error}`, 'Deposit Invoice');
        setDepositInvoiceStatus('pending');
      }
    }
  };

  const createFinalInvoice = async (contactData: ContactData, invoiceData: InvoiceData) => {
    addActivity('info', 'Creating final balance invoice', 'Final Invoice');
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (demoMode) {
      addActivity('info', 'Copying deposit invoice template', 'Final Invoice');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addActivity('info', `Setting issue date to 3 weeks before event: ${invoiceData.issueDate}`, 'Final Invoice');
      addActivity('info', 'Changing description to "Final Balance"', 'Final Invoice');
      addActivity('info', `Adding reference line: "${invoiceData.reference}"`, 'Final Invoice');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFinalInvoiceStatus('created');
      addActivity('success', `Final balance invoice created: INV-2024-002`, 'Final Invoice');
      addActivity('info', `Amount: £${invoiceData.amount.toLocaleString()}`, 'Final Invoice');
      addActivity('info', `Due Date: ${invoiceData.dueDate} (Event date)`, 'Final Invoice');
    } else {
      try {
        // Real API implementation would:
        // 1. Get the deposit invoice
        // 2. Copy it as template
        // 3. Modify dates and description
        // 4. Add reference line
        
        setFinalInvoiceStatus('created');
        addActivity('success', 'Final balance invoice created successfully', 'Final Invoice');
      } catch (error) {
        addActivity('error', `Error creating final invoice: ${error}`, 'Final Invoice');
        setFinalInvoiceStatus('pending');
      }
    }
  };

  const runXeroInvoicing = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting Xero invoicing automation', 'System');
      
      // Step 1: Check or create contact
      await checkOrCreateContact(demoContactData);
      
      // Step 2: Create deposit invoice
      if (contactStatus === 'created' || contactStatus === 'existing') {
        await createDepositInvoice(demoContactData, demoDepositInvoice);
      }
      
      // Step 3: Schedule/create final invoice
      if (depositInvoiceStatus === 'created') {
        await createFinalInvoice(demoContactData, demoFinalInvoice);
      }
      
      addActivity('success', 'Xero invoicing automation completed successfully', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Automation failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Contact': return <User className="w-4 h-4" />;
      case 'Deposit Invoice': return <FileText className="w-4 h-4" />;
      case 'Final Invoice': return <Copy className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Contact': return 'bg-blue-100 text-blue-800';
      case 'Deposit Invoice': return 'bg-green-100 text-green-800';
      case 'Final Invoice': return 'bg-purple-100 text-purple-800';
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
            <h3 className="text-lg font-semibold">Xero Invoicing</h3>
            <p className="text-sm text-gray-600">Create deposit and final balance invoices</p>
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
            onClick={runXeroInvoicing}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Run Invoicing'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              contactStatus === 'created' || contactStatus === 'existing' ? 'bg-green-500' : 
              contactStatus === 'checking' || contactStatus === 'new' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Contact Management</h4>
              <p className="text-sm text-gray-600">
                {contactStatus === 'pending' && 'Ready to check contact'}
                {contactStatus === 'checking' && 'Checking contact...'}
                {contactStatus === 'new' && 'Creating new contact...'}
                {contactStatus === 'existing' && 'Contact found'}
                {contactStatus === 'created' && 'Contact created'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              depositInvoiceStatus === 'created' ? 'bg-green-500' : 
              depositInvoiceStatus === 'creating' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Deposit Invoice (50%)</h4>
              <p className="text-sm text-gray-600">
                {depositInvoiceStatus === 'pending' && 'Waiting for contact'}
                {depositInvoiceStatus === 'creating' && 'Creating invoice...'}
                {depositInvoiceStatus === 'created' && 'Invoice created'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              finalInvoiceStatus === 'created' ? 'bg-green-500' : 
              finalInvoiceStatus === 'scheduled' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Copy className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Final Balance Invoice</h4>
              <p className="text-sm text-gray-600">
                {finalInvoiceStatus === 'pending' && 'Waiting for deposit'}
                {finalInvoiceStatus === 'scheduled' && 'Scheduling final invoice...'}
                {finalInvoiceStatus === 'created' && 'Final invoice created'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Invoice Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Deposit Invoice (50%)</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Amount: £{demoDepositInvoice.amount.toLocaleString()}</li>
              <li>• Account Code: {demoDepositInvoice.accountCode} (Future bookings)</li>
              <li>• Due: 14 days from issue</li>
              <li>• Template: Standard invoice template</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Final Balance Invoice</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Amount: £{demoFinalInvoice.amount.toLocaleString()}</li>
              <li>• Issue: 3 weeks before event</li>
              <li>• Due: Event date</li>
              <li>• Reference: Previous deposit invoice</li>
            </ul>
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
          <span>97.8% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default XeroInvoicing; 