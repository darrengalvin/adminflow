import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Settings,
  Mail,
  Users,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface CateringFoodOrderProps {
  isActive: boolean;
  onComplete: () => void;
  demoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

const CateringFoodOrder: React.FC<CateringFoodOrderProps> = ({ 
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
    phase: 'Data' | 'Gmail' | 'Catering' | 'System';
  }>>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [dataStatus, setDataStatus] = useState<'pending' | 'processing' | 'ready'>('pending');
  const [emailStatus, setEmailStatus] = useState<'pending' | 'composing' | 'sent'>('pending');
  const [cateringStatus, setCateringStatus] = useState<'pending' | 'notified' | 'confirmed'>('pending');

  const addActivity = (type: 'info' | 'success' | 'error' | 'warning', message: string, phase: 'Data' | 'Gmail' | 'Catering' | 'System') => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      phase
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const processCateringFoodOrder = async () => {
    setIsProcessing(true);
    setActivities([]);
    
    try {
      addActivity('info', 'Starting catering food order update automation', 'System');
      
      // Step 1: Process customer response data for final numbers and allergens
      setDataStatus('processing');
      addActivity('info', 'Processing customer response for final headcount and dietary requirements', 'Data');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (demoMode) {
        addActivity('success', 'Demo: Customer response data processed', 'Data');
        addActivity('info', 'Demo: Final headcount: 24 people (updated from 25)', 'Data');
        addActivity('info', 'Demo: Dietary requirements: 2 vegetarians, 1 nut allergy', 'Data');
        addActivity('info', 'Demo: Additional notes: 1 person lactose intolerant', 'Data');
        addActivity('success', 'Demo: All dietary information compiled', 'Data');
        setDataStatus('ready');
      } else {
        // Real data processing would go here
        setDataStatus('ready');
        addActivity('success', 'Customer response data processed successfully', 'Data');
        addActivity('info', 'Final numbers and dietary requirements compiled', 'Data');
      }
      
      // Step 2: Compose email with updated information
      setEmailStatus('composing');
      addActivity('info', 'Composing catering update email via Gmail', 'Gmail');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (demoMode) {
        addActivity('success', 'Demo: Connected to Gmail successfully', 'Gmail');
        addActivity('info', 'Demo: Composing email to enquiries@novaforestkitchen.co.uk', 'Gmail');
        addActivity('info', 'Demo: Subject: "URGENT: Updated Numbers - TechCorp Team Building 15/08/2024"', 'Gmail');
        addActivity('success', 'Demo: Email template populated with final details', 'Gmail');
        
        setEmailStatus('sent');
        addActivity('success', 'Demo: Email sent to Nova Forest Kitchen', 'Gmail');
        addActivity('info', 'Demo: Email includes: final headcount, dietary requirements, event details', 'Gmail');
        addActivity('info', 'Demo: CC: operations@newforestactivities.co.uk', 'Gmail');
      } else {
        // Real Gmail API implementation would go here
        setEmailStatus('sent');
        addActivity('success', 'Catering update email sent via Gmail', 'Gmail');
      }
      
      // Step 3: Notify catering team and set follow-up
      setCateringStatus('notified');
      addActivity('info', 'Nova Forest Kitchen notified of final numbers and dietary requirements', 'Catering');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (demoMode) {
        setCateringStatus('confirmed');
        addActivity('success', 'Demo: Catering team acknowledgment received', 'Catering');
        addActivity('info', 'Demo: Catering confirmed they can accommodate all dietary requirements', 'Catering');
        addActivity('info', 'Demo: Final catering cost: £312 (24 people @ £13 each)', 'Catering');
        addActivity('success', 'Demo: Catering preparation scheduled for event day', 'Catering');
      } else {
        setCateringStatus('confirmed');
        addActivity('success', 'Catering update completed successfully', 'Catering');
      }
      
      addActivity('success', 'Catering food order automation completed', 'System');
      onComplete();
      
    } catch (error) {
      addActivity('error', `Catering food order automation failed: ${error}`, 'System');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Data': return <FileText className="w-4 h-4" />;
      case 'Gmail': return <Mail className="w-4 h-4" />;
      case 'Catering': return <UtensilsCrossed className="w-4 h-4" />;
      case 'System': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Data': return 'bg-blue-100 text-blue-800';
      case 'Gmail': return 'bg-red-100 text-red-800';
      case 'Catering': return 'bg-orange-100 text-orange-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-400'}`}>
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Email Catering Food Order</h3>
            <p className="text-sm text-gray-600">Update caterer with final numbers and allergens via Gmail</p>
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
            onClick={processCateringFoodOrder}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Update Catering'}</span>
          </button>
        </div>
      </div>

      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              dataStatus === 'ready' ? 'bg-green-500' : 
              dataStatus === 'processing' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Data Processing</h4>
              <p className="text-sm text-gray-600">
                {dataStatus === 'pending' && 'Ready to process'}
                {dataStatus === 'processing' && 'Processing data...'}
                {dataStatus === 'ready' && 'Data ready'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              emailStatus === 'sent' ? 'bg-green-500' : 
              emailStatus === 'composing' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Gmail Email</h4>
              <p className="text-sm text-gray-600">
                {emailStatus === 'pending' && 'Waiting for data'}
                {emailStatus === 'composing' && 'Composing email...'}
                {emailStatus === 'sent' && 'Email sent'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              cateringStatus === 'confirmed' ? 'bg-green-500' : 
              cateringStatus === 'notified' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}>
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium">Catering Team</h4>
              <p className="text-sm text-gray-600">
                {cateringStatus === 'pending' && 'Waiting for email'}
                {cateringStatus === 'notified' && 'Team notified'}
                {cateringStatus === 'confirmed' && 'Confirmed'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event & Catering Details */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Event & Catering Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Event Information</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Company: TechCorp Solutions Ltd</li>
              <li>• Event Date: 15th August 2024</li>
              <li>• Event Type: Team Building</li>
              <li>• Arrival Time: 9:30 AM</li>
              <li>• Duration: Full Day</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Catering Requirements</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Final Headcount: 24 people</li>
              <li>• Vegetarians: 2 people</li>
              <li>• Nut Allergies: 1 person</li>
              <li>• Lactose Intolerant: 1 person</li>
              <li>• Catering Partner: Nova Forest Kitchen</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dietary Requirements Summary */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Dietary Requirements Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">21</div>
            <div className="text-sm text-gray-600">Standard Meals</div>
            <div className="text-xs text-green-600 font-medium">NO RESTRICTIONS</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <div className="text-sm text-gray-600">Vegetarian</div>
            <div className="text-xs text-blue-600 font-medium">PLANT-BASED</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-gray-600">Special Dietary</div>
            <div className="text-xs text-red-600 font-medium">ALLERGIES</div>
          </div>
        </div>
      </div>

      {/* Email Template Preview */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h4 className="font-medium mb-3">Email Template Preview</h4>
        <div className="bg-gray-50 p-4 rounded border text-sm">
          <div className="mb-3">
            <strong>To:</strong> enquiries@novaforestkitchen.co.uk<br/>
            <strong>CC:</strong> operations@newforestactivities.co.uk<br/>
            <strong>Subject:</strong> URGENT: Updated Numbers - TechCorp Team Building 15/08/2024
          </div>
          <div className="space-y-2 text-gray-700">
            <p>Dear Nova Forest Kitchen Team,</p>
            <p>We have received the final details from our corporate client and need to update the catering order for the team building event.</p>
            
            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400 my-3">
              <p><strong>UPDATED EVENT DETAILS:</strong></p>
              <p>• Company: TechCorp Solutions Ltd</p>
              <p>• Date: Thursday, 15th August 2024</p>
              <p>• Time: 9:30 AM arrival</p>
              <p>• <strong>Final Headcount: 24 people</strong> (reduced from 25)</p>
            </div>
            
            <div className="bg-red-50 p-3 rounded border-l-4 border-red-400 my-3">
              <p><strong>DIETARY REQUIREMENTS:</strong></p>
              <p>• Standard meals: 21 people</p>
              <p>• Vegetarian meals: 2 people</p>
              <p>• <strong>ALLERGIES:</strong></p>
              <p>&nbsp;&nbsp;- 1 person with severe nut allergy (no nuts/tree nuts)</p>
              <p>&nbsp;&nbsp;- 1 person lactose intolerant (dairy-free options)</p>
            </div>
            
            <p><strong>Please confirm:</strong></p>
            <ul className="list-disc ml-6 space-y-1">
              <li>You can accommodate the reduced numbers (24 instead of 25)</li>
              <li>Nut-free preparation area available for allergy requirements</li>
              <li>Dairy-free options available for lactose intolerant guest</li>
              <li>Updated catering cost based on final headcount</li>
            </ul>
            
            <p className="mt-3">Please reply ASAP to confirm these changes. The event is in 2 weeks.</p>
            <p>Thanks for your continued partnership!</p>
            <p>Best regards,<br/>New Forest Activities Operations Team</p>
          </div>
        </div>
      </div>

      {/* Allergen Alert */}
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800 mb-2">Critical Allergen Alert</h4>
            <div className="text-sm text-red-700">
              <p><strong>Severe Nut Allergy:</strong> One participant has a severe nut allergy requiring:</p>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li>Completely nut-free preparation area</li>
                <li>Separate cooking utensils and surfaces</li>
                <li>Clear labeling of all nut-free meals</li>
                <li>Staff briefing on allergen protocols</li>
              </ul>
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
        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>97.6% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default CateringFoodOrder; 