import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2,
  Activity,
  ArrowLeft,
  Plus,
  Clock,
  Users,
  Target
} from 'lucide-react';
import { WorkflowStepComponent } from './WorkflowStep';
import { automationSteps } from '../data/automationSteps';
import { PhaseHeader } from './PhaseHeader';
import { AutomationStep } from '../types';

interface AutomationMonitorProps {
  onClose?: () => void;
}

// Processing Banner Component
const ProcessingBanner: React.FC<{ 
  isVisible: boolean; 
  clientName: string; 
  currentStep: number; 
  totalSteps: number;
  currentStepName: string;
}> = ({ isVisible, clientName, currentStep, totalSteps, currentStepName }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 text-gray-800 py-4 px-6 shadow-sm z-40 animate-slideDown">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 animate-pulse text-blue-600" />
            <span className="font-semibold text-lg text-gray-800">PROCESSING</span>
          </div>
          <div className="text-gray-600">
            <span className="font-medium">{clientName}</span>
            <span className="mx-2">•</span>
            <span>Step {currentStep} of {totalSteps}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-800">{currentStepName}</div>
            <div className="text-xs text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </div>
          </div>
          <div className="w-32 bg-blue-100 rounded-full h-2">
            <div 
              className="bg-blue-600 rounded-full h-2 transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Trigger notification component
const TriggerNotification: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Auto-close after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
      <div className="bg-white rounded-xl shadow-lg p-4 max-w-md mx-4 border border-blue-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mr-3 border border-blue-200">
              <span className="text-lg">🔔</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Automation Triggered!</h3>
              <p className="text-xs text-gray-600">New corporate event enquiry detected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 mt-3 border border-blue-100">
          <p className="text-xs text-gray-700">
            <strong>From:</strong> sarah.johnson@techcorp.com<br/>
            <strong>Subject:</strong> Corporate Team Building Event - 47 People<br/>
            <strong>Trigger:</strong> Keywords detected + corporate domain
          </p>
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center">
          Auto-closing in 3 seconds...
        </div>
      </div>
    </div>
  );
};

// Email trigger data component
const TriggerEmailData: React.FC = () => {
  return (
    <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
        <span className="mr-2">📧</span>
        Triggering Email Content
      </h4>
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <div className="text-sm space-y-2 mb-4">
          <div><strong>From:</strong> sarah.johnson@techcorp.com</div>
          <div><strong>To:</strong> events@adminflow.co.uk</div>
          <div><strong>Subject:</strong> Corporate Team Building Event - 47 People</div>
          <div><strong>Received:</strong> Today, 10:23 AM</div>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="mb-3">Hi there,</p>
            <p className="mb-3">
              We're looking to organise a corporate team building event for our London office. 
              We have 47 employees who would like to participate in outdoor activities followed 
              by a networking lunch.
            </p>
            <p className="mb-3">
              <strong>Details:</strong><br/>
              • Date: March 15th, 2024<br/>
              • Participants: 47 people<br/>
              • Budget: £8,000-£10,000<br/>
              • Location: Preferably within 1 hour of London<br/>
              • Activities: Team challenges, outdoor pursuits<br/>
              • Catering: Lunch and refreshments required
            </p>
            <p className="mb-3">
              Could you please send us a proposal with available options and pricing?
            </p>
            <p>
              Best regards,<br/>
              Sarah Johnson<br/>
              HR Director, TechCorp Solutions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AutomationMonitor: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start fresh - ready to run
  const [showNotification, setShowNotification] = useState(false); // Don't show on load
  const [isRunning, setIsRunning] = useState(false);
  const [showTips, setShowTips] = useState<{[key: string]: boolean}>({});
  const [isDemoMode, setIsDemoMode] = useState(true); // Track if we're in demo mode

  // Group steps by phase
  const phases = automationSteps.reduce((acc, step) => {
    if (!acc[step.phase]) {
      acc[step.phase] = [];
    }
    acc[step.phase].push(step);
    return acc;
  }, {} as Record<string, AutomationStep[]>);

  const phaseOrder = [
    'Trigger Detection',
    'Immediate Response', 
    'Proposal Phase',
    'Booking Confirmation',
    'Logistics Setup',
    'Pre-Event Management',
    'Event Delivery',
    'Post-Event Follow-up'
  ];

  const startWorkflow = () => {
    // Reset to beginning and start workflow
    setCurrentStep(0);
    setIsRunning(false);
    
    // Show trigger notification (it will auto-close)
    setShowNotification(true);
    
    // Start the workflow immediately - don't wait for notification to close
    setIsRunning(true);
    setCurrentStep(0); // Start with the first step (trigger)
    
    // Simulate step progression with auto-scroll
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        
        // Check if we've completed all steps
        if (nextStep >= automationSteps.length) {
          clearInterval(interval);
          setIsRunning(false);
          return automationSteps.length; // Show all steps as completed
        }
        
        // Auto-scroll to current step
        setTimeout(() => {
          const element = document.getElementById(`step-${nextStep}`);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
        
        return nextStep;
      });
    }, 1500); // 1.5 seconds per step for better demo flow
  };

  const resetWorkflow = () => {
    setCurrentStep(0);
    setIsRunning(false);
    setShowNotification(false);
  };

  const showCompletedDemo = () => {
    setCurrentStep(automationSteps.length);
    setIsRunning(false);
    setShowNotification(false);
  };

  const getPhaseProgress = (phaseName: string) => {
    const phaseSteps = phases[phaseName] || [];
    const completedSteps = phaseSteps.filter((step, index) => {
      const stepIndex = automationSteps.findIndex(s => s.id === step.id);
      return stepIndex < currentStep;
    }).length;
    return phaseSteps.length > 0 ? (completedSteps / phaseSteps.length) * 100 : 0;
  };

  const getPhaseIcon = (phaseName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Trigger Detection': '🔍',
      'Immediate Response': '⚡',
      'Proposal Phase': '📋',
      'Booking Confirmation': '✅',
      'Logistics Setup': '🎯',
      'Pre-Event Management': '📅',
      'Event Delivery': '🎉',
      'Post-Event Follow-up': '📊'
    };
    return iconMap[phaseName] || '📝';
  };

  const getPhaseDescription = (phaseName: string) => {
    const descriptions: Record<string, string> = {
      'Trigger Detection': 'Automatically detect and categorize incoming enquiries',
      'Immediate Response': 'Send instant acknowledgment and gather initial requirements',
      'Proposal Phase': 'Generate customized proposals and pricing',
      'Booking Confirmation': 'Process payments and confirm bookings',
      'Logistics Setup': 'Coordinate venues, suppliers, and resources',
      'Pre-Event Management': 'Handle final preparations and communications',
      'Event Delivery': 'Monitor and support during the event',
      'Post-Event Follow-up': 'Collect feedback and process final billing'
    };
    return descriptions[phaseName] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Processing Banner */}
      <ProcessingBanner
        isVisible={isRunning}
        clientName="TechCorp Solutions"
        currentStep={currentStep + 1}
        totalSteps={automationSteps.length}
        currentStepName={automationSteps[currentStep]?.name || automationSteps[currentStep]?.title || 'Starting...'}
      />

      {/* Trigger Notification */}
      {showNotification && (
        <TriggerNotification onClose={() => setShowNotification(false)} />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Corporate Event Automation</h1>
              <p className="text-gray-600 mt-1">Automated workflow for processing corporate event enquiries</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Demo Mode</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>47 Participants</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Target className="h-4 w-4" />
                  <span>£8-10K Budget</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={resetWorkflow}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={showCompletedDemo}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Show Complete</span>
              </button>
              <button
                onClick={startWorkflow}
                disabled={isRunning}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>{isRunning ? 'Running...' : 'Start Workflow'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Overview */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Automation Rate */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Automation Rate</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-800">94.2%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                +5.7%
              </span>
              <span className="text-gray-500">vs last week</span>
            </div>
          </div>

          {/* Time Saved */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Time Saved</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-800">127</span>
                    <span className="text-sm text-gray-500">hours/week</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                +23%
              </span>
              <span className="text-gray-500">vs last week</span>
            </div>
          </div>

          {/* Error Rate */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Error Rate</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-800">2.1%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                -1.3%
              </span>
              <span className="text-gray-500">vs last week</span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Workflow Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {phaseOrder.map((phaseName) => {
              const progress = getPhaseProgress(phaseName);
              const isActive = phases[phaseName]?.some(step => {
                const stepIndex = automationSteps.findIndex(s => s.id === step.id);
                return stepIndex === currentStep;
              });
              
              return (
                <div key={phaseName} className={`p-4 rounded-lg border transition-all ${
                  isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-100 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getPhaseIcon(phaseName)}</span>
                    <span className="text-sm font-medium text-gray-800">{phaseName}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isActive ? 'bg-blue-600' : 'bg-gray-400'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">{Math.round(progress)}% complete</div>
                </div>
              );
            })}
          </div>
          
          {/* Overall Progress */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round((currentStep / automationSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / automationSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-8">
          {phaseOrder.map((phaseName) => {
            const phaseSteps = phases[phaseName] || [];
            if (phaseSteps.length === 0) return null;

            return (
              <div key={phaseName} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                 <PhaseHeader
                   title={phaseName}
                   description={getPhaseDescription(phaseName)}
                   icon={getPhaseIcon(phaseName)}
                   progress={getPhaseProgress(phaseName)}
                   isActive={phaseSteps.some(step => {
                     const stepIndex = automationSteps.findIndex(s => s.id === step.id);
                     return stepIndex === currentStep;
                   })}
                 />
                
                <div className="p-6 space-y-4">
                                     {phaseSteps.map((step) => {
                     const stepIndex = automationSteps.findIndex(s => s.id === step.id);
                     return (
                       <div key={step.id} id={`step-${stepIndex}`}>
                         <WorkflowStepComponent
                           step={step}
                           isActive={stepIndex === currentStep}
                           isCompleted={stepIndex < currentStep}
                           showTip={showTips[step.id]}
                           onToggleTip={() => setShowTips(prev => ({
                             ...prev,
                             [step.id]: !prev[step.id]
                           }))}
                         />
                         
                         {/* Show email data for trigger step */}
                         {step.id === 'email-trigger' && (stepIndex <= currentStep || showTips[step.id]) && (
                           <TriggerEmailData />
                         )}
                       </div>
                     );
                   })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow Metadata */}
        <div className="mt-8 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Workflow Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Created:</span>
                <span className="text-sm text-gray-800">15 Jan 2024, 09:15 AM</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Added by:</span>
                <span className="text-sm text-gray-800">James Mitchell (Sales Manager)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Last Modified:</span>
                <span className="text-sm text-gray-800">15 Jan 2024, 02:30 PM</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active & Running
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Total Steps:</span>
                <span className="text-sm text-gray-800">{automationSteps.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Avg. Completion:</span>
                <span className="text-sm text-gray-800">4.2 hours</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Success Rate:</span>
                <span className="text-sm text-gray-800">94.7%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-600">Triggers Today:</span>
                <span className="text-sm text-gray-800">3 enquiries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Build History */}
        <div className="mt-6 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Workflow Build History</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Initial workflow created</span>
                  <p className="text-xs text-gray-500">Core email trigger and response steps</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">15 Jan 2024, 09:15 AM</div>
                <div className="text-xs text-gray-600">by James Mitchell</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Added CRM integration steps</span>
                  <p className="text-xs text-gray-500">Contact creation and deal pipeline setup</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">15 Jan 2024, 11:30 AM</div>
                <div className="text-xs text-gray-600">by Sarah Chen</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Enhanced with AI proposal generation</span>
                  <p className="text-xs text-gray-500">Programme design and PandaDoc integration</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">15 Jan 2024, 02:30 PM</div>
                <div className="text-xs text-gray-600">by Alex Thompson</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Added post-event follow-up automation</span>
                  <p className="text-xs text-gray-500">Feedback collection and future opportunities</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">15 Jan 2024, 04:45 PM</div>
                <div className="text-xs text-gray-600">by James Mitchell</div>
              </div>
            </div>
          </div>
        </div>

        {/* Add to Workflow Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Add This Workflow to Your System</h3>
              <p className="text-gray-600">
                This corporate event automation workflow can be customized and added to your workflow library.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Added workflows will appear in your main workflow manager with full editing capabilities.
              </p>
            </div>
            <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add to Workflow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 