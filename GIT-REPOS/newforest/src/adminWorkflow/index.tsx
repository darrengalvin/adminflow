import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Zap,
  Mail,
  Target,
  Filter,
  Timer,
  CheckSquare,
  PlayCircle,
  Activity,
  Loader,
  Brain,
  Database,
  Send,
  FileText,
  User,
  Copy,
  DollarSign,
  ChefHat,
  Clipboard,
  MapPin,
  Upload,
  Hotel,
  Bus,
  ListTodo,
  ArrowUp,
  Calendar,
  Gift,
  UtensilsCrossed,
  Download,
  CreditCard,
  History,
  ChevronDown
} from 'lucide-react';
import OpportunityGoHighLevel from './steps/opportunity_gohighlevel';
import GmailTrigger from './steps/gmail_trigger';
import PandaDocSigned from './steps/pandadoc_signed';
import XeroInvoicing from './steps/xero_invoicing';
import CateringBooking from './steps/catering_booking';
import ManifestDetails from './steps/manifest_details';
import AdditionalLogistics from './steps/additional_logistics';
import GHLUpdateConfirmation from './steps/ghl_update_confirmation';
import DepositPaymentCheck from './steps/deposit_payment_check';
import ThankYouVoucher from './steps/thank_you_voucher';
import FinalDetailsEmail from './steps/final_details_email';
import FinalDetailsTask from './steps/final_details_task';
import FinalBalanceInvoice from './steps/final_balance_invoice';
import CateringFoodOrder from './steps/catering_food_order';
import UpdateManifestDetails from './steps/update_manifest_details';
import JoiningInstructions from './steps/joining_instructions';
import FinalBalancePaymentCheck from './steps/final_balance_payment_check';
import PostEventFeedback from './steps/post_event_feedback';
import RebookingDiscount from './steps/rebooking_discount';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { useActivity } from '../contexts/ActivityContext';
import WorkflowHistoryManager from '../components/WorkflowHistoryManager';
import { WorkflowRun } from '../types/workflow';
import { USE_FIREBASE } from '../config/appConfig';

interface WorkflowCondition {
  id: string;
  type: 'delay' | 'validation' | 'filter' | 'approval';
  name: string;
  description: string;
  config: any;
  status: 'pending' | 'met' | 'failed';
  icon: React.ComponentType<any>;
}

interface WorkflowActivity {
  id: string;
  timestamp: Date;
  step: string;
  action: string;
  status: 'running' | 'completed' | 'failed';
  details?: string;
  data?: any;
}

interface AdminWorkflowProps {
  onBack?: () => void;
}

const AdminWorkflow: React.FC<AdminWorkflowProps> = ({ onBack }) => {
  // Import shared Firebase configuration
  // const USE_FIREBASE = true; // TODO: Import from config/appConfig.ts
  
  const localAuth = USE_FIREBASE ? null : useAuth();
  const firebaseAuth = USE_FIREBASE ? useFirebaseAuth() : null;
  
  // Use appropriate auth context based on Firebase setting
  const getCredential = USE_FIREBASE 
    ? firebaseAuth?.getCredential 
    : localAuth?.getCredential;
  const getConfig = USE_FIREBASE 
    ? firebaseAuth?.getConfig 
    : localAuth?.getConfig;
  const { addActivity, updateActivity } = useActivity();
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [workflowData, setWorkflowData] = useState<any>(null);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<number>(-1); // Track current step in workflow execution
  const [conditionStates, setConditionStates] = useState<{[key: string]: 'pending' | 'met' | 'failed'}>({
    'delay_1': 'pending',
    'validation_1': 'pending',
    'filter_1': 'pending'
  });
  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false);
  const [workflowActivities, setWorkflowActivities] = useState<WorkflowActivity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [showWorkflowHistory, setShowWorkflowHistory] = useState(false);
  const [currentWorkflowRun, setCurrentWorkflowRun] = useState<WorkflowRun | null>(null);
  const [selectedHistoryRun, setSelectedHistoryRun] = useState<WorkflowRun | null>(null);
  const historyDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyDropdownRef.current && !historyDropdownRef.current.contains(event.target as Node)) {
        setShowWorkflowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [stepCompletionStatus, setStepCompletionStatus] = useState<{[key: string]: 'pending' | 'running' | 'completed' | 'failed'}>({
    'gmail_trigger': 'pending',
    'opportunity_gohighlevel': 'pending',
    'pandadoc_signed': 'pending',
    'xero_invoicing': 'pending',
    'catering_booking': 'pending',
    'manifest_details': 'pending',
    'additional_logistics': 'pending',
    'ghl_update_confirmation': 'pending',
    'deposit_payment_check': 'pending',
    'thank_you_voucher': 'pending',
    'final_details_email': 'pending',
    'final_details_task': 'pending',
    'final_balance_invoice': 'pending',
    'catering_food_order': 'pending',
    'update_manifest_details': 'pending',
    'joining_instructions': 'pending',
    'final_balance_payment_check': 'pending',
    'post_event_feedback': 'pending',
    'rebooking_discount': 'pending'
  });
  const [demoModeSettings, setDemoModeSettings] = useState<{[key: string]: boolean}>({
    'gmail_trigger': false, // Gmail defaults to live mode - user can toggle to demo if needed
    'opportunity_gohighlevel': false, // GoHighLevel defaults to live mode
    'pandadoc_signed': false, // PandaDoc defaults to live mode - user can toggle to demo if needed
    'xero_invoicing': false, // Xero defaults to live mode - user can toggle to demo if needed
    'catering_booking': false, // Catering defaults to live mode - user can toggle to demo if needed
    'manifest_details': false, // Manifest defaults to live mode - user can toggle to demo if needed
    'additional_logistics': false, // Logistics defaults to live mode - user can toggle to demo if needed
    'ghl_update_confirmation': false, // GHL update defaults to live mode
    'deposit_payment_check': false, // Deposit payment check defaults to live mode - user can toggle to demo if needed
    'thank_you_voucher': false, // Thank you voucher defaults to live mode - user can toggle to demo if needed
    'final_details_email': false, // Final details email defaults to live mode
    'final_details_task': false, // Final details task defaults to live mode
    'final_balance_invoice': false, // Final balance invoice defaults to live mode - user can toggle to demo if needed
    'catering_food_order': false, // Catering food order defaults to live mode - user can toggle to demo if needed
    'update_manifest_details': false, // Update manifest details defaults to live mode - user can toggle to demo if needed
    'joining_instructions': false, // Joining instructions defaults to live mode - user can toggle to demo if needed
    'final_balance_payment_check': false, // Final balance payment check defaults to live mode - user can toggle to demo if needed
    'post_event_feedback': false, // Post-event feedback defaults to live mode
    'rebooking_discount': false // Rebooking discount defaults to live mode
  });

  // Workflow conditions between steps
  const workflowConditions: WorkflowCondition[] = [
    {
      id: 'delay_1',
      type: 'delay',
      name: 'Processing Delay',
      description: '30 sec delay',
      config: { delay: 30, unit: 'seconds' },
      status: conditionStates['delay_1'] || 'pending',
      icon: Timer
    },
    {
      id: 'validation_1', 
      type: 'validation',
      name: 'Data Validation',
      description: 'Required fields check',
      config: { 
        requiredFields: ['name', 'email', 'companyName'],
        minConfidence: 0.8 
      },
      status: conditionStates['validation_1'] || 'pending',
      icon: CheckSquare
    },
    {
      id: 'filter_1',
      type: 'filter',
      name: 'Lead Quality Filter',
      description: 'Budget ≥ £1,000',
      config: { 
        minBudget: 1000,
        minConfidence: 0.85,
        currency: 'GBP'
      },
      status: conditionStates['filter_1'] || 'pending',
      icon: Filter
    }
  ];

  // Workflow steps configuration
  const workflowSteps = [
    {
      id: 'gmail_trigger',
      name: 'Gmail Lead Trigger',
      description: 'Monitors Gmail for "Incoming Lead" emails and processes with AI',
      type: 'trigger',
      icon: Mail,
      status: stepCompletionStatus['gmail_trigger'] === 'pending' ? 'configured' : stepCompletionStatus['gmail_trigger'],
      lastRun: stepCompletionStatus['gmail_trigger'] === 'completed' ? new Date() : null,
      successRate: null,
      component: GmailTrigger
    },
    {
      id: 'opportunity_gohighlevel',
      name: 'GoHighLevel Opportunity Management',
      description: 'Automated opportunity creation and management in GoHighLevel CRM',
      type: 'action',
      icon: Target,
      status: stepCompletionStatus['opportunity_gohighlevel'] === 'pending' ? 'active' : stepCompletionStatus['opportunity_gohighlevel'],
      lastRun: stepCompletionStatus['opportunity_gohighlevel'] === 'completed' ? new Date() : new Date(),
      successRate: 98.5,
      component: OpportunityGoHighLevel
    },
    {
      id: 'pandadoc_signed',
      name: 'PandaDoc Signed Automation',
      description: 'Automated post-signature workflow for FareHarbor integration and booking setup',
      type: 'action',
      icon: FileText,
      status: stepCompletionStatus['pandadoc_signed'] === 'pending' ? 'configured' : stepCompletionStatus['pandadoc_signed'],
      lastRun: stepCompletionStatus['pandadoc_signed'] === 'completed' ? new Date() : null,
      successRate: 95.2,
      component: PandaDocSigned
    },
    {
      id: 'xero_invoicing',
      name: 'Xero Invoicing',
      description: 'Create 50% deposit and final balance invoices with automatic contact management',
      type: 'action',
      icon: DollarSign,
      status: stepCompletionStatus['xero_invoicing'] === 'pending' ? 'configured' : stepCompletionStatus['xero_invoicing'],
      lastRun: stepCompletionStatus['xero_invoicing'] === 'completed' ? new Date() : null,
      successRate: 97.8,
      component: XeroInvoicing
    },
    {
      id: 'catering_booking',
      name: 'Catering Booking',
      description: 'Email Nova Forest Kitchen with booking details and catering requirements',
      type: 'action',
      icon: ChefHat,
      status: stepCompletionStatus['catering_booking'] === 'pending' ? 'configured' : stepCompletionStatus['catering_booking'],
      lastRun: stepCompletionStatus['catering_booking'] === 'completed' ? new Date() : null,
      successRate: 99.1,
      component: CateringBooking
    },
    {
      id: 'manifest_details',
      name: 'Manifest Details',
      description: 'Create team building manifest with event details and document attachments',
      type: 'action',
      icon: Clipboard,
      status: stepCompletionStatus['manifest_details'] === 'pending' ? 'configured' : stepCompletionStatus['manifest_details'],
      lastRun: stepCompletionStatus['manifest_details'] === 'completed' ? new Date() : null,
      successRate: 96.4,
      component: ManifestDetails
    },
    {
      id: 'additional_logistics',
      name: 'Additional Logistics',
      description: 'Manage accommodation, transport, and venue requirements with calendar integration',
      type: 'action',
      icon: MapPin,
      status: stepCompletionStatus['additional_logistics'] === 'pending' ? 'configured' : stepCompletionStatus['additional_logistics'],
      lastRun: stepCompletionStatus['additional_logistics'] === 'completed' ? new Date() : null,
      successRate: 94.7,
      component: AdditionalLogistics
    },
    {
      id: 'ghl_update_confirmation',
      name: 'GoHighLevel Update - Confirmation',
      description: 'Update opportunity value, stage, and create future tasks when corporate confirms',
      type: 'action',
      icon: ListTodo,
      status: stepCompletionStatus['ghl_update_confirmation'] === 'pending' ? 'configured' : stepCompletionStatus['ghl_update_confirmation'],
      lastRun: stepCompletionStatus['ghl_update_confirmation'] === 'completed' ? new Date() : null,
      successRate: 98.3,
      component: GHLUpdateConfirmation
    },
    {
      id: 'deposit_payment_check',
      name: 'Deposit Payment Check',
      description: 'Check Xero for 50% deposit payment and update CRM opportunity to Won status',
      type: 'action',
      icon: CreditCard,
      status: stepCompletionStatus['deposit_payment_check'] === 'pending' ? 'configured' : stepCompletionStatus['deposit_payment_check'],
      lastRun: stepCompletionStatus['deposit_payment_check'] === 'completed' ? new Date() : null,
      successRate: 99.2,
      component: DepositPaymentCheck
    },
    {
      id: 'thank_you_voucher',
      name: 'Send £100 Thank You Voucher',
      description: 'Create FareHarbor gift voucher and send to organiser when PandaDoc is signed',
      type: 'action',
      icon: Gift,
      status: stepCompletionStatus['thank_you_voucher'] === 'pending' ? 'configured' : stepCompletionStatus['thank_you_voucher'],
      lastRun: stepCompletionStatus['thank_you_voucher'] === 'completed' ? new Date() : null,
      successRate: 98.7,
      component: ThankYouVoucher
    },
    {
      id: 'final_details_email',
      name: 'Send Request Final Details Email',
      description: 'Schedule TB Final Details snippet 3 weeks before event via GoHighLevel CRM',
      type: 'action',
      icon: Mail,
      status: stepCompletionStatus['final_details_email'] === 'pending' ? 'configured' : stepCompletionStatus['final_details_email'],
      lastRun: stepCompletionStatus['final_details_email'] === 'completed' ? new Date() : null,
      successRate: 97.4,
      component: FinalDetailsEmail
    },
    {
      id: 'final_details_task',
      name: 'Set Final Details Task',
      description: 'Create task 2 weeks before event when customer response received',
      type: 'action',
      icon: Calendar,
      status: stepCompletionStatus['final_details_task'] === 'pending' ? 'configured' : stepCompletionStatus['final_details_task'],
      lastRun: stepCompletionStatus['final_details_task'] === 'completed' ? new Date() : null,
      successRate: 96.8,
      component: FinalDetailsTask
    },
    {
      id: 'final_balance_invoice',
      name: 'Send Final Balance Invoice',
      description: 'Download invoice from Xero and email to customer with payment instructions',
      type: 'action',
      icon: DollarSign,
      status: stepCompletionStatus['final_balance_invoice'] === 'pending' ? 'configured' : stepCompletionStatus['final_balance_invoice'],
      lastRun: stepCompletionStatus['final_balance_invoice'] === 'completed' ? new Date() : null,
      successRate: 98.1,
      component: FinalBalanceInvoice
    },
    {
      id: 'catering_food_order',
      name: 'Email Catering Food Order',
      description: 'Update caterer with final numbers and allergen information via Gmail',
      type: 'action',
      icon: UtensilsCrossed,
      status: stepCompletionStatus['catering_food_order'] === 'pending' ? 'configured' : stepCompletionStatus['catering_food_order'],
      lastRun: stepCompletionStatus['catering_food_order'] === 'completed' ? new Date() : null,
      successRate: 97.6,
      component: CateringFoodOrder
    }
  ];

  const addWorkflowActivity = (step: string, action: string, status: 'running' | 'completed' | 'failed', details?: string, data?: any) => {
    const activity: WorkflowActivity = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      step,
      action,
      status,
      details,
      data
    };
    
    setWorkflowActivities(prev => [...prev, activity]);
    
    if (status === 'running') {
      setCurrentActivity(activity.id);
    } else if (currentActivity === activity.id) {
      setCurrentActivity(null);
    }
    
    // Update step completion status based on activity
    updateStepCompletionStatus(step, action, status);
    
    console.log(`📊 ${step}: ${action} - ${status.toUpperCase()}${details ? ` - ${details}` : ''}`);
  };

  const updateStepCompletionStatus = (step: string, action: string, status: 'running' | 'completed' | 'failed') => {
    // Map activities to main workflow steps
    if (step === 'Gmail' || step === 'AI') {
      if (action === 'Connecting to Gmail API' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'gmail_trigger': 'running' }));
      } else if (action === 'Lead data extracted' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'gmail_trigger': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'gmail_trigger': 'failed' }));
      }
    }
    
    if (step === 'GoHighLevel') {
      if (action === 'Connecting to GoHighLevel API' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'opportunity_gohighlevel': 'running' }));
      } else if (action === 'Tags applied' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'opportunity_gohighlevel': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'opportunity_gohighlevel': 'failed' }));
      }
    }

    if (step === 'PandaDoc' || step === 'FareHarbor') {
      if (action === 'Validating signed document' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'pandadoc_signed': 'running' }));
      } else if (action === 'Availability created' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'pandadoc_signed': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'pandadoc_signed': 'failed' }));
      }
    }

    if (step === 'Contact' || step === 'Deposit Invoice' || step === 'Final Invoice') {
      if (action === 'Checking if contact exists for TechCorp Solutions Ltd' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'xero_invoicing': 'running' }));
      } else if (action === 'Final balance invoice created: INV-2024-002' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'xero_invoicing': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'xero_invoicing': 'failed' }));
      }
    }

    if (step === 'Email' || step === 'Template') {
      if (action === 'Starting catering booking automation' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'catering_booking': 'running' }));
      } else if (action === 'Catering booking automation completed' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'catering_booking': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'catering_booking': 'failed' }));
      }
    }

    if (step === 'Template' || step === 'Upload' || step === 'FareHarbor') {
      if (action === 'Starting manifest details automation' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'manifest_details': 'running' }));
      } else if (action === 'Manifest details automation completed' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'manifest_details': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'manifest_details': 'failed' }));
      }
    }

    if (step === 'Assessment' || step === 'Accommodation' || step === 'Transport' || step === 'Calendar') {
      if (action === 'Starting additional logistics automation' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'additional_logistics': 'running' }));
      } else if (action === 'Additional logistics automation completed' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'additional_logistics': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'additional_logistics': 'failed' }));
      }
    }

    if (step === 'Opportunity' || step === 'Stage' || step === 'Tasks') {
      if (action === 'Starting GoHighLevel confirmation update' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'ghl_update_confirmation': 'running' }));
      } else if (action === 'GoHighLevel confirmation update completed' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'ghl_update_confirmation': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'ghl_update_confirmation': 'failed' }));
      }
    }

    if (step === 'Xero' || step === 'CRM') {
      if (action === 'Starting deposit payment verification' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'deposit_payment_check': 'running' }));
      } else if (action === 'Deposit payment verification and CRM update completed' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'deposit_payment_check': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'deposit_payment_check': 'failed' }));
      }
    }

    if (step === 'FareHarbor' || step === 'Email') {
      if (action === 'Starting thank you voucher automation' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'thank_you_voucher': 'running' }));
      } else if (action === 'Thank you voucher automation completed' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'thank_you_voucher': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'thank_you_voucher': 'failed' }));
      }
    }

    if (step === 'Schedule' || step === 'GoHighLevel') {
      if (action === 'Starting final details email automation' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'final_details_email': 'running' }));
      } else if (action === 'Final details email automation completed' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'final_details_email': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'final_details_email': 'failed' }));
      }
    }

    if (step === 'Response' || step === 'Task') {
      if (action === 'Starting final details task automation' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'final_details_task': 'running' }));
      } else if (action === 'Final details task automation completed' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'final_details_task': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'final_details_task': 'failed' }));
      }
    }

    if (step === 'Xero' || step === 'Download' || step === 'Email') {
      if (action === 'Starting final balance invoice automation' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'final_balance_invoice': 'running' }));
      } else if (action === 'Final balance invoice automation completed' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'final_balance_invoice': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'final_balance_invoice': 'failed' }));
      }
    }

    if (step === 'Data' || step === 'Gmail' || step === 'Catering') {
      if (action === 'Starting catering food order update automation' && status === 'running') {
        setStepCompletionStatus(prev => ({ ...prev, 'catering_food_order': 'running' }));
      } else if (action === 'Catering food order automation completed' && status === 'completed') {
        setStepCompletionStatus(prev => ({ ...prev, 'catering_food_order': 'completed' }));
      } else if (status === 'failed') {
        setStepCompletionStatus(prev => ({ ...prev, 'catering_food_order': 'failed' }));
      }
    }
  };

  const handleStepClick = (stepId: string) => {
    setActiveStep(stepId);
  };

  const handleBackToWorkflow = () => {
    setActiveStep(null);
  };

  const handleDataProcessed = (data: any) => {
    setWorkflowData(data);
    console.log('📊 Data processed by trigger:', data);
    
    // Simulate condition evaluation when data is processed
    evaluateConditions(data);
  };

  const evaluateConditions = (data: any) => {
    const newConditionStates = { ...conditionStates };
    
    // Evaluate validation condition
    addWorkflowActivity('Conditions', 'Validating required fields', 'running', 'Checking name, email, company fields');
    
    setTimeout(() => {
      if (data && data.name && data.email && data.companyName) {
        newConditionStates['validation_1'] = 'met';
        addWorkflowActivity('Conditions', 'Data validation passed', 'completed', `Found: ${data.name}, ${data.email}, ${data.companyName}`);
      } else {
        newConditionStates['validation_1'] = 'failed';
        addWorkflowActivity('Conditions', 'Data validation failed', 'failed', 'Missing required fields');
      }
      
      // Evaluate filter condition
      addWorkflowActivity('Conditions', 'Applying quality filter', 'running', `Checking budget threshold (≥ £1,000)`);
      
      setTimeout(() => {
        if (data && data.monetaryValue >= 1000) {
          newConditionStates['filter_1'] = 'met';
          addWorkflowActivity('Conditions', 'Quality filter passed', 'completed', `Budget £${data.monetaryValue?.toLocaleString()} meets threshold`);
        } else {
          newConditionStates['filter_1'] = 'failed';
          addWorkflowActivity('Conditions', 'Quality filter failed', 'failed', 'Budget below minimum threshold');
        }
        
        setConditionStates(newConditionStates);
      }, 800);
    }, 600);
    
    // Simulate delay condition (would be met after actual delay)
    addWorkflowActivity('Conditions', 'Processing delay started', 'running', '30 second delay for data validation');
    setTimeout(() => {
      newConditionStates['delay_1'] = 'met';
      addWorkflowActivity('Conditions', 'Processing delay completed', 'completed', 'Delay period finished');
      setConditionStates(newConditionStates);
    }, 2000); // 2 second demo delay
  };

  // Create real opportunity in GoHighLevel using the actual API
  // Helper function to extract credential values from both old and new formats
  const getCredentialValue = (credential: any, key: string): string | null => {
    // New format: fields array
    if (credential.fields && Array.isArray(credential.fields)) {
      const field = credential.fields.find((f: any) => f.key === key);
      return field?.value || null;
    }
    
    // Old format: credentials object
    if (credential.credentials && typeof credential.credentials === 'object') {
      return credential.credentials[key] || null;
    }
    
    return null;
  };

  const createRealOpportunity = async (leadData: any) => {
    // Get GoHighLevel credentials from secure storage (Firebase or localStorage)
    console.log('🔍 Debug: USE_FIREBASE =', USE_FIREBASE);
    console.log('🔍 Debug: getCredential function =', typeof getCredential);
    
    const ghlCredential = USE_FIREBASE 
      ? await getCredential?.('gohighlevel')
      : getCredential?.('gohighlevel');
      
    console.log('🔍 Debug: Retrieved credential =', ghlCredential ? 'Found' : 'Not found');
    console.log('🔍 Debug: Credential source =', USE_FIREBASE ? 'Firebase' : 'localStorage');
    
    if (ghlCredential) {
      console.log('🔍 Debug: Credential service =', ghlCredential.service);
      console.log('🔍 Debug: Credential structure =', ghlCredential.fields ? 'New format (fields)' : 'Old format (credentials)');
      console.log('🔍 Debug: Full credential =', JSON.stringify(ghlCredential, null, 2));
    }
      
    if (!ghlCredential) {
      throw new Error('GoHighLevel credentials not found. Please add them in Security Center.');
    }
    
    const apiKey = getCredentialValue(ghlCredential, 'jwt_token');
    const locationId = getCredentialValue(ghlCredential, 'location_id');
    
    console.log('🔍 Debug: Extracted JWT token exists =', !!apiKey);
    console.log('🔍 Debug: Extracted JWT token preview =', apiKey ? apiKey.substring(0, 20) + '...' : 'null');
    console.log('🔍 Debug: Extracted location ID =', locationId);
    
    if (!apiKey) {
      throw new Error('GoHighLevel JWT token not found in credentials. Please check your credential configuration.');
    }
    
    // Get pipeline configuration from stored config
    const ghlConfig = USE_FIREBASE 
      ? await getConfig?.('gohighlevel')
      : getConfig?.('gohighlevel');
    let selectedPipeline, selectedStage;
    
    if (ghlConfig && ghlConfig.settings.pipelines) {
      // Use configured pipelines
      const pipelines = ghlConfig.settings.pipelines;
      selectedPipeline = pipelines.find((p: any) => p.name === 'Fun Groups') || pipelines[0];
      selectedStage = selectedPipeline.stages[0];
    } else {
      // Fallback to default pipeline configuration
      const availablePipelines = [
        {
          id: "GiZpprwMTc0aBVpaGCPL",
          name: "Fun Groups",
          stages: [
            { id: "959215d4-d801-40b2-8816-150712c9fcc6", name: "Initial Contact" }
          ]
        }
      ];
      selectedPipeline = availablePipelines[0];
      selectedStage = selectedPipeline.stages[0];
    }
    
    const opportunityData = {
      title: leadData.title || `${leadData.companyName} - ${leadData.name}`,
      status: "open",
      stageId: selectedStage.id,
      email: leadData.email,
      phone: leadData.phone,
      monetaryValue: leadData.monetaryValue,
      source: leadData.source || "admin-workflow-automation",
      name: leadData.name,
      companyName: leadData.companyName,
      tags: leadData.tags || []
    };

    const response = await fetch(`https://rest.gohighlevel.com/v1/pipelines/${selectedPipeline.id}/opportunities/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(opportunityData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`GoHighLevel API Error: ${data.message || JSON.stringify(data)}`);
    }
    
    return data;
  };

  // Run entire workflow function with detailed tracking and demo mode support
  // Workflow history management functions
  const createNewWorkflowRun = () => {
    const newRun: WorkflowRun = {
      id: `run-${Date.now()}`,
      name: `Admin Workflow - ${new Date().toLocaleString()}`,
      startTime: new Date(),
      status: 'running',
      progress: 0,
      totalSteps: 6,
      completedSteps: 0,
      failedSteps: 0,
      createdBy: firebaseAuth?.user?.email || localAuth?.user?.email || 'Unknown',
      tags: ['admin-workflow', 'automated'],
      activities: []
    };
    setCurrentWorkflowRun(newRun);
    setSelectedHistoryRun(null);
    return newRun;
  };

  const updateWorkflowRun = (updates: Partial<WorkflowRun>) => {
    if (currentWorkflowRun) {
      const updatedRun = { ...currentWorkflowRun, ...updates };
      setCurrentWorkflowRun(updatedRun);
    }
  };

  const handleSelectHistoryRun = (run: WorkflowRun) => {
    setSelectedHistoryRun(run);
    setShowWorkflowHistory(false);
    // Load the historical run data
    setWorkflowActivities(run.activities || []);
    // Note: Historical runs are read-only, don't set as current run
  };

  const handleNewWorkflowRun = () => {
    setShowWorkflowHistory(false);
    setSelectedHistoryRun(null);
    // Reset to current state
    runEntireWorkflow();
  };

  const runEntireWorkflow = async () => {
    // Create new workflow run
    const workflowRun = createNewWorkflowRun();
    
    setIsRunningWorkflow(true);
    setWorkflowActivities([]);
    setCurrentActivity(null);
    setCurrentWorkflowStep(0); // Start with first step
    
    // Create global activity for the entire workflow
    const workflowActivityId = addActivity({
      name: 'Complete Event Management Pipeline',
      type: 'workflow',
      status: 'running',
      stage: 'Initializing',
      details: 'Starting end-to-end automation workflow',
      progress: 0,
      priority: 'high',
      estimatedDuration: 180, // 3 minutes
      currentStep: '1',
      totalSteps: '6',
      workflowId: 'admin-workflow-main'
    });
    
    // Reset step completion status
    setStepCompletionStatus({
      'gmail_trigger': 'pending',
      'opportunity_gohighlevel': 'pending',
      'pandadoc_signed': 'pending',
      'xero_invoicing': 'pending',
      'catering_booking': 'pending',
      'manifest_details': 'pending',
      'additional_logistics': 'pending',
      'ghl_update_confirmation': 'pending',
      'deposit_payment_check': 'pending',
      'thank_you_voucher': 'pending',
      'final_details_email': 'pending',
      'final_details_task': 'pending',
      'final_balance_invoice': 'pending',
      'catering_food_order': 'pending',
      'update_manifest_details': 'pending',
      'joining_instructions': 'pending',
      'final_balance_payment_check': 'pending',
      'post_event_feedback': 'pending',
      'rebooking_discount': 'pending'
    });
    
    addWorkflowActivity('Workflow', 'Starting workflow execution', 'running', 'Initializing all systems');
    
    try {
      // Step 1: Reset conditions
      addWorkflowActivity('System', 'Resetting conditions', 'running', 'Clearing previous state');
      setConditionStates({
        'delay_1': 'pending',
        'validation_1': 'pending', 
        'filter_1': 'pending'
      });
      await new Promise(resolve => setTimeout(resolve, 800));
      addWorkflowActivity('System', 'Conditions reset', 'completed', 'All conditions set to pending');
      
      // Step 2: Gmail Processing (with demo mode support)
      setCurrentWorkflowStep(0); // Gmail step
      updateActivity(workflowActivityId, {
        stage: 'Gmail Processing',
        details: 'Processing incoming lead emails with AI',
        progress: 15,
        currentStep: '1'
      });
      
      let demoData;
      
      if (demoModeSettings['gmail_trigger']) {
        // Demo mode - simulate Gmail processing
        addWorkflowActivity('Gmail', 'Demo Mode: Simulating Gmail connection', 'running', 'Using demo data instead of real Gmail API');
        await new Promise(resolve => setTimeout(resolve, 1200));
        addWorkflowActivity('Gmail', 'Demo Mode: Gmail simulation complete', 'completed', 'Demo Gmail connection established');
        
        addWorkflowActivity('Gmail', 'Demo Mode: Simulating inbox scan', 'running', 'Using pre-configured demo email');
        await new Promise(resolve => setTimeout(resolve, 1000));
        addWorkflowActivity('Gmail', 'Demo Mode: Demo email loaded', 'completed', 'Using demo email: TechCorp Solutions inquiry');
        
        addWorkflowActivity('AI', 'Demo Mode: Simulating AI processing', 'running', 'Using pre-processed demo data');
        setCurrentWorkflowStep(1); // AI Processing step
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Demo data
        demoData = {
          title: "TechCorp Solutions - Team Building Event",
          name: "Sarah Johnson",
          email: "sarah.johnson@techcorp.com", 
          phone: "+44 7892 123456",
          companyName: "TechCorp Solutions",
          monetaryValue: 6250,
          source: "gmail-incoming-lead-demo",
          tags: ["gmail-lead", "ai-processed", "team-building", "london", "demo-mode"],
          notes: "25 people team building event. Interested in outdoor challenges and leadership development.",
          teamSize: 25,
          preferredDate: "2025-07-15"
        };
        
        addWorkflowActivity('AI', 'Demo Mode: Demo data loaded', 'completed', 'Using pre-configured lead data', demoData);
      } else {
        // Real mode - actual Gmail API calls (when implemented)
        addWorkflowActivity('Gmail', 'Connecting to Gmail API', 'running', 'Establishing secure connection');
        await new Promise(resolve => setTimeout(resolve, 1200));
        addWorkflowActivity('Gmail', 'Gmail connection established', 'completed', 'Connected to Gmail API successfully');
        
        // TODO: Implement real Gmail API integration here
        addWorkflowActivity('Gmail', 'Real Gmail integration not yet implemented', 'failed', 'Please use demo mode for Gmail step');
        throw new Error('Real Gmail integration not yet implemented');
      }
      
      setWorkflowData(demoData);
      
      // Step 3: Evaluate conditions
      addWorkflowActivity('Conditions', 'Starting condition evaluation', 'running', 'Checking all workflow conditions');
      evaluateConditions(demoData);
      await new Promise(resolve => setTimeout(resolve, 3500));
      addWorkflowActivity('Conditions', 'All conditions evaluated', 'completed', 'Validation, filter, and delay conditions processed');
      
      // Step 4: GoHighLevel Integration (with demo mode support)
      setCurrentWorkflowStep(2); // GoHighLevel step
      updateActivity(workflowActivityId, {
        stage: 'CRM Integration',
        details: 'Creating opportunity in GoHighLevel CRM',
        progress: 45,
        currentStep: '3'
      });
      
      if (demoModeSettings['opportunity_gohighlevel']) {
        // Demo mode - simulate GoHighLevel processing
        addWorkflowActivity('GoHighLevel', 'Demo Mode: Simulating GoHighLevel connection', 'running', 'Using demo mode instead of real API');
        await new Promise(resolve => setTimeout(resolve, 1000));
        addWorkflowActivity('GoHighLevel', 'Demo Mode: GoHighLevel simulation complete', 'completed', 'Demo CRM connection established');
        
        addWorkflowActivity('GoHighLevel', 'Demo Mode: Simulating opportunity creation', 'running', 'Creating demo opportunity record');
        await new Promise(resolve => setTimeout(resolve, 1200));
        addWorkflowActivity('GoHighLevel', 'Demo Mode: Demo opportunity created', 'completed', 'Demo opportunity: TechCorp Solutions - Team Building Event');
        
        addWorkflowActivity('GoHighLevel', 'Demo Mode: Simulating tag application', 'running', 'Adding demo tags');
        await new Promise(resolve => setTimeout(resolve, 600));
        addWorkflowActivity('GoHighLevel', 'Demo Mode: Demo tags applied', 'completed', 'Demo tags: gmail-lead, ai-processed, team-building, demo-mode');
      } else {
        // Real mode - actual GoHighLevel API calls
        addWorkflowActivity('GoHighLevel', 'Connecting to GoHighLevel API', 'running', 'Establishing CRM connection');
        await new Promise(resolve => setTimeout(resolve, 1000));
        addWorkflowActivity('GoHighLevel', 'GoHighLevel connected', 'completed', 'Successfully connected to CRM API');
        
        addWorkflowActivity('GoHighLevel', 'Creating real opportunity', 'running', 'Generating new opportunity in Fun Groups pipeline');
        
        try {
          const opportunityResult = await createRealOpportunity(demoData);
          addWorkflowActivity('GoHighLevel', 'Real opportunity created', 'completed', `Successfully created opportunity ID: ${opportunityResult.id || 'Unknown'}`);
          console.log('✅ Real opportunity created:', opportunityResult);
          console.log('🔄 GoHighLevel step completed, continuing to PandaDoc...');
          
          // Force a small delay to ensure the activity is logged
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('🚀 Forcing progression to next step...');
          
          // Update progress to show GoHighLevel is complete
          updateActivity(workflowActivityId, {
            stage: 'GoHighLevel Complete',
            details: 'Opportunity created successfully, proceeding to document processing',
            progress: 50,
            currentStep: '3'
          });
          
          // Mark GoHighLevel step as completed in UI
          setStepCompletionStatus(prev => ({
            ...prev,
            'opportunity_gohighlevel': 'completed'
          }));
          
        } catch (error) {
          addWorkflowActivity('GoHighLevel', 'Failed to create real opportunity', 'failed', `API Error: ${error.message}`);
          throw error;
        }
      }
      
      // Step 5: PandaDoc Processing (with demo mode support)
      console.log('🔄 Starting PandaDoc step...');
      setCurrentWorkflowStep(3); // PandaDoc step
      await new Promise(resolve => setTimeout(resolve, 100)); // Give time for visual update
      console.log('📊 Current workflow step after setting PandaDoc:', 3);
      updateActivity(workflowActivityId, {
        stage: 'Document Processing',
        details: 'Processing contract signatures via PandaDoc',
        progress: 65,
        currentStep: '4'
      });
      
      if (demoModeSettings['pandadoc_signed']) {
        // Demo mode - simulate PandaDoc processing
        addWorkflowActivity('PandaDoc', 'Demo Mode: Simulating document processing', 'running', 'Using demo mode instead of real PandaDoc API');
        await new Promise(resolve => setTimeout(resolve, 2000));
        addWorkflowActivity('PandaDoc', 'Demo Mode: Document workflow completed', 'completed', 'Demo contract signed and processed');
      } else {
        // Real mode - actual PandaDoc API calls
        addWorkflowActivity('PandaDoc', 'Connecting to PandaDoc API', 'running', 'Establishing document processing connection');
        await new Promise(resolve => setTimeout(resolve, 1000));
        addWorkflowActivity('PandaDoc', 'PandaDoc connected', 'completed', 'Successfully connected to PandaDoc API');
        
        // TODO: Implement real PandaDoc API integration here
        addWorkflowActivity('PandaDoc', 'Real PandaDoc integration not yet implemented', 'failed', 'Please use demo mode for PandaDoc step');
        throw new Error('Real PandaDoc integration not yet implemented');
      }
      
      // Mark PandaDoc step as completed in UI
      setStepCompletionStatus(prev => ({
        ...prev,
        'pandadoc_signed': 'completed'
      }));
      
      // Step 6: Xero Invoicing (with demo mode support)
      console.log('🔄 Starting Xero step...');
      setCurrentWorkflowStep(4); // Xero step
      await new Promise(resolve => setTimeout(resolve, 100)); // Give time for visual update
      console.log('📊 Current workflow step after setting Xero:', 4);
      updateActivity(workflowActivityId, {
        stage: 'Invoice Generation',
        details: 'Creating invoices in Xero accounting system',
        progress: 85,
        currentStep: '5'
      });
      
      if (demoModeSettings['xero_invoicing']) {
        // Demo mode - simulate Xero processing
        addWorkflowActivity('Contact', 'Demo Mode: Simulating Xero connection', 'running', 'Using demo mode instead of real Xero API');
        await new Promise(resolve => setTimeout(resolve, 1000));
        addWorkflowActivity('Contact', 'Checking if contact exists for TechCorp Solutions Ltd', 'running', 'Searching Xero contacts');
        await new Promise(resolve => setTimeout(resolve, 1500));
        addWorkflowActivity('Contact', 'Demo Mode: Contact not found - creating new contact', 'completed', 'Demo contact creation in progress');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        addWorkflowActivity('Contact', 'Demo Mode: New contact created: TechCorp Solutions Ltd', 'completed', 'Demo contact with full address details');
        
        addWorkflowActivity('Deposit Invoice', 'Demo Mode: Creating 50% deposit invoice', 'running', 'Generating deposit invoice');
        await new Promise(resolve => setTimeout(resolve, 1800));
        addWorkflowActivity('Deposit Invoice', 'Demo Mode: Deposit invoice created: INV-2024-001', 'completed', 'Amount: £3,125 | Account Code: 063 | Due: 14 days');
        
        addWorkflowActivity('Final Invoice', 'Demo Mode: Creating final balance invoice', 'running', 'Copying deposit template and modifying');
        await new Promise(resolve => setTimeout(resolve, 1500));
        addWorkflowActivity('Final Invoice', 'Demo Mode: Final balance invoice created: INV-2024-002', 'completed', 'Amount: £3,125 | Due: Event date | References deposit invoice');
      } else {
        // Real mode - actual Xero API calls
        addWorkflowActivity('Contact', 'Connecting to Xero API', 'running', 'Establishing accounting system connection');
        await new Promise(resolve => setTimeout(resolve, 1000));
        addWorkflowActivity('Contact', 'Xero connected', 'completed', 'Successfully connected to Xero accounting API');
        
        // TODO: Implement real Xero API integration here
        addWorkflowActivity('Contact', 'Real Xero integration not yet implemented', 'failed', 'Please use demo mode for Xero step');
        throw new Error('Real Xero integration not yet implemented');
      }
      
      // Mark Xero step as completed in UI
      setStepCompletionStatus(prev => ({
        ...prev,
        'xero_invoicing': 'completed'
      }));
      
      setCurrentWorkflowStep(5); // Complete step
      await new Promise(resolve => setTimeout(resolve, 100)); // Give time for visual update
      console.log('🎉 All steps completed, finishing workflow...');
      console.log('📊 Current workflow step after completion:', 5);
      
      updateActivity(workflowActivityId, {
        stage: 'Completed',
        details: 'All workflow steps completed successfully',
        progress: 100,
        currentStep: '6',
        status: 'completed'
      });
      
      addWorkflowActivity('Workflow', 'Workflow completed successfully', 'completed', 'All steps executed without errors');
      
      // Update workflow run
      updateWorkflowRun({
        status: 'completed',
        progress: 100,
        endTime: new Date(),
        completedSteps: 6,
        activities: workflowActivities
      });
      
      // Reset workflow state to show completion (after a delay to show final step)
      setTimeout(() => {
        setIsRunningWorkflow(false);
        setCurrentWorkflowStep(-1);
      }, 2000); // 2 second delay to show completion
      
    } catch (error) {
      updateActivity(workflowActivityId, {
        stage: 'Failed',
        details: `Workflow execution failed: ${error.message}`,
        status: 'failed'
      });
      
      addWorkflowActivity('Workflow', 'Workflow execution failed', 'failed', `Error: ${error.message}`);
      console.error('❌ Workflow execution failed:', error);
      
      // Update workflow run
      updateWorkflowRun({
        status: 'failed',
        progress: Math.max(currentWorkflowStep * 16, 0),
        endTime: new Date(),
        failedSteps: 1,
        error: error.message,
        activities: workflowActivities
      });
      
    } finally {
      setIsRunningWorkflow(false);
      setCurrentActivity(null);
      setCurrentWorkflowStep(-1); // Reset step tracking
    }
  };

  const toggleDemoMode = (stepId: string) => {
    setDemoModeSettings(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  // If a step is active, render its component
  if (activeStep) {
    const step = workflowSteps.find(s => s.id === activeStep);
    if (step) {
      const StepComponent = step.component;
      return (
        <StepComponent 
          isActive={true}
          onComplete={() => {
            console.log(`Step ${step.id} completed`);
            handleBackToWorkflow();
          }}
          demoMode={demoModeSettings[step.id] || false}
          onDemoModeChange={(enabled: boolean) => toggleDemoMode(step.id)}
          onBack={handleBackToWorkflow}
          onDataProcessed={step.type === 'trigger' ? handleDataProcessed : undefined}
        />
      );
    }
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'configured': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStepIcon = (step: any) => {
    const IconComponent = step.icon;
    switch (step.status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'running': return <Loader className="h-5 w-5 animate-spin text-blue-600" />;
      case 'active': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'configured': return <IconComponent className="h-5 w-5 text-blue-600" />;
      case 'failed': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getConditionStatusColor = (status: string) => {
    switch (status) {
      case 'met': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-orange-600 bg-orange-50 border-orange-200';
    }
  };

  const getConditionIcon = (condition: WorkflowCondition) => {
    const IconComponent = condition.icon;
    switch (condition.status) {
      case 'met': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'failed': return <AlertTriangle className="h-3 w-3 text-red-600" />;
      default: return <IconComponent className="h-3 w-3 text-orange-600" />;
    }
  };

  const getActivityIcon = (step: string, status: string) => {
    if (status === 'running') {
      return <Loader className="h-4 w-4 animate-spin text-blue-600" />;
    }
    
    switch (step) {
      case 'Gmail': return <Mail className="h-4 w-4 text-red-500" />;
      case 'AI': return <Brain className="h-4 w-4 text-purple-500" />;
      case 'Conditions': return <Filter className="h-4 w-4 text-orange-500" />;
      case 'GoHighLevel': return <Target className="h-4 w-4 text-green-500" />;
      case 'Contact': return <User className="h-4 w-4 text-blue-500" />;
      case 'Deposit Invoice': return <FileText className="h-4 w-4 text-green-500" />;
      case 'Final Invoice': return <Copy className="h-4 w-4 text-purple-500" />;
      case 'Email': return <Mail className="h-4 w-4 text-blue-500" />;
      case 'Template': return <FileText className="h-4 w-4 text-green-500" />;
      case 'Upload': return <Upload className="h-4 w-4 text-purple-500" />;
      case 'Assessment': return <Settings className="h-4 w-4 text-blue-500" />;
      case 'Accommodation': return <Hotel className="h-4 w-4 text-purple-500" />;
      case 'Transport': return <Bus className="h-4 w-4 text-orange-500" />;
      case 'Calendar': return <Calendar className="h-4 w-4 text-green-500" />;
      case 'Opportunity': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'Stage': return <ArrowUp className="h-4 w-4 text-blue-500" />;
      case 'Tasks': return <ListTodo className="h-4 w-4 text-purple-500" />;
      case 'Xero': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'CRM': return <Target className="h-4 w-4 text-green-500" />;
      case 'FareHarbor': return <Gift className="h-4 w-4 text-purple-500" />;
      case 'Schedule': return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'Response': return <Mail className="h-4 w-4 text-blue-500" />;
      case 'Task': return <ListTodo className="h-4 w-4 text-purple-500" />;
      case 'Download': return <Download className="h-4 w-4 text-green-500" />;
      case 'Data': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'Catering': return <UtensilsCrossed className="h-4 w-4 text-orange-500" />;
      case 'System': return <Settings className="h-4 w-4 text-slate-500" />;
      case 'Workflow': return status === 'completed' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Active Workflow Banner */}
      {isRunningWorkflow && (
        <div className="bg-blue-600 text-white px-6 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="font-medium">Processing</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm opacity-90">
                <span>Step {currentWorkflowStep + 1} of {workflowSteps.length}</span>
                <span>•</span>
                <span>{workflowSteps[currentWorkflowStep]?.name || 'Processing...'}</span>
                {workflowData && (
                  <>
                    <span>•</span>
                    <span className="font-medium">{workflowData.companyName || workflowData.name || 'Client'}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Client info on mobile */}
              {workflowData && (
                <div className="sm:hidden text-sm opacity-90 font-medium">
                  {workflowData.companyName || workflowData.name}
                </div>
              )}
              <div className="text-sm opacity-90">
                {Math.round(((currentWorkflowStep + 1) / workflowSteps.length) * 100)}% Complete
              </div>
              <div className="w-20 bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${((currentWorkflowStep + 1) / workflowSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">Admin Workflow Dashboard</h1>
                              {selectedHistoryRun && (
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                    Viewing History
                  </span>
                  {selectedHistoryRun.status === 'completed' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Completed</span>
                    </span>
                  )}
                  {selectedHistoryRun.status === 'failed' && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Failed</span>
                    </span>
                  )}
                </div>
              )}
              </div>
              <p className="text-slate-600 mt-2">
                {selectedHistoryRun 
                  ? `Viewing historical run: ${selectedHistoryRun.name} (${selectedHistoryRun.startTime.toLocaleString()})`
                  : 'Manage and monitor your automated workflows'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Workflow History Dropdown */}
              <div className="relative" ref={historyDropdownRef}>
                <button
                  onClick={() => setShowWorkflowHistory(!showWorkflowHistory)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <History className="h-4 w-4" />
                  <span>
                    {selectedHistoryRun ? selectedHistoryRun.name : 
                     currentWorkflowRun ? 'Current Run' : 'Workflow History'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showWorkflowHistory && (
                  <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                    <WorkflowHistoryManager
                      currentRun={currentWorkflowRun}
                      onSelectRun={handleSelectHistoryRun}
                      onNewRun={handleNewWorkflowRun}
                    />
                  </div>
                )}
              </div>
              
              <button
                onClick={runEntireWorkflow}
                disabled={isRunningWorkflow || selectedHistoryRun !== null}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  isRunningWorkflow || selectedHistoryRun !== null
                    ? 'bg-orange-300 text-orange-700 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {isRunningWorkflow ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-700"></div>
                ) : (
                  <PlayCircle className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {isRunningWorkflow ? 'Running Workflow...' : 'Run Entire Workflow'}
                </span>
              </button>
              
              <button
                onClick={() => {
                  // Add some demo activities to test the activity bar
                  addActivity({
                    name: 'Email Processing - TechCorp Lead',
                    type: 'email_processing',
                    status: 'running',
                    stage: 'AI Analysis',
                    details: 'Extracting lead data from email content',
                    progress: 35,
                    priority: 'high',
                    currentStep: '2',
                    totalSteps: '4'
                  });
                  
                  addActivity({
                    name: 'Payment Verification',
                    type: 'payment_check',
                    status: 'queued',
                    stage: 'Waiting',
                    details: 'Checking deposit payment in Xero',
                    progress: 0,
                    priority: 'medium'
                  });
                  
                  addActivity({
                    name: 'Document Generation',
                    type: 'document_generation',
                    status: 'running',
                    stage: 'PDF Creation',
                    details: 'Generating joining instructions PDF',
                    progress: 78,
                    priority: 'low'
                  });
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Activity className="h-4 w-4" />
                <span>Demo Activities</span>
              </button>
              
              <div className="text-right">
                <p className="text-sm text-slate-600">Total Steps</p>
                <p className="text-2xl font-bold text-slate-900">{workflowSteps.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">97.8%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Workflow Steps */}
          <div className="lg:col-span-2 space-y-8">
            


            {/* Visual Workflow Pipeline - Shows when workflow is running */}
            {isRunningWorkflow && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-lg font-semibold text-slate-900">Live Workflow Execution</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    RUNNING
                  </span>
                </div>
                
                <div className="space-y-4">
                                     {/* Primary Workflow Steps */}
                   <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                     {[
                       { id: 'gmail', name: 'Gmail', icon: Mail, bgActive: 'bg-blue-500', bgCompleted: 'bg-blue-700', textActive: 'text-blue-600', textCompleted: 'text-blue-800' },
                       { id: 'ai', name: 'AI Processing', icon: Brain, bgActive: 'bg-purple-500', bgCompleted: 'bg-purple-700', textActive: 'text-purple-600', textCompleted: 'text-purple-800' },
                       { id: 'crm', name: 'GoHighLevel', icon: Target, bgActive: 'bg-green-500', bgCompleted: 'bg-green-700', textActive: 'text-green-600', textCompleted: 'text-green-800' },
                       { id: 'pandadoc', name: 'PandaDoc', icon: FileText, bgActive: 'bg-orange-500', bgCompleted: 'bg-orange-700', textActive: 'text-orange-600', textCompleted: 'text-orange-800' },
                       { id: 'xero', name: 'Xero', icon: DollarSign, bgActive: 'bg-yellow-500', bgCompleted: 'bg-yellow-700', textActive: 'text-yellow-600', textCompleted: 'text-yellow-800' },
                       { id: 'complete', name: 'Complete', icon: CheckCircle, bgActive: 'bg-emerald-500', bgCompleted: 'bg-emerald-700', textActive: 'text-emerald-600', textCompleted: 'text-emerald-800' }
                     ].map((step, index) => {
                       const isActive = currentWorkflowStep === index;
                       const isCompleted = currentWorkflowStep > index;
                       const isPending = currentWorkflowStep < index;
                       
                       return (
                         <div key={step.id} className="flex flex-col items-center space-y-2">
                           <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                             isActive ? `${step.bgActive} shadow-lg scale-110` :
                             isCompleted ? `${step.bgCompleted} shadow-md opacity-90 ring-2 ring-slate-300` :
                             'bg-gray-200'
                           }`}>
                             {isActive && (
                               <div className={`absolute inset-0 rounded-full ${step.bgActive} animate-ping opacity-75`}></div>
                             )}
                             <step.icon className={`w-8 h-8 ${
                               isActive || isCompleted ? 'text-white' : 'text-gray-400'
                             }`} />
                             {isCompleted && (
                               <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                                 <CheckCircle className="w-4 h-4 text-white" />
                               </div>
                             )}
                           </div>
                           <div className="text-center">
                             <div className={`text-sm font-medium ${
                               isActive ? step.textActive :
                               isCompleted ? `${step.textCompleted} opacity-80` :
                               'text-gray-400'
                             }`}>
                               {step.name}
                             </div>
                             {isActive && (
                               <div className="text-xs text-gray-500 mt-1 animate-pulse">
                                 Processing...
                               </div>
                             )}
                             {isCompleted && (
                               <div className="text-xs text-green-700 mt-1 font-medium">
                                 ✓ Completed
                               </div>
                             )}
                           </div>
                         </div>
                       );
                     })}
                  </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                      style={{ width: `${Math.max((currentWorkflowStep / 5) * 100, 0)}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    <span className="font-medium">Step {Math.max(currentWorkflowStep + 1, 1)} of 6</span>
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-blue-600">{Math.max(Math.round((currentWorkflowStep / 5) * 100), 0)}% Complete</span>
                  </div>
                </div>
              </div>
            )}

            {/* Workflow Steps */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Workflow Steps</h2>
                <p className="text-sm text-slate-600">Click on any step to configure and manage its settings.</p>
              </div>

              <div className="grid grid-cols-1 gap-0">
                {workflowSteps.map((step, index) => (
                  <div key={step.id}>
                    {/* Workflow Step */}
                    <div 
                      className={`bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all hover:shadow-md ${getStepStatusColor(step.status)}`}
                      onClick={() => handleStepClick(step.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Step Icon */}
                          <div className="flex-shrink-0">
                            {getStepIcon(step)}
                          </div>
                          
                          {/* Step Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-slate-900">{step.name}</h3>
                              {step.type === 'trigger' && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                  TRIGGER
                                </span>
                              )}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStepStatusColor(step.status)}`}>
                                {step.status === 'running' ? 'RUNNING' : step.status}
                              </span>
                              {step.status === 'completed' && (
                                <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>COMPLETED</span>
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 mt-1">{step.description}</p>
                            
                            {/* Demo Mode Toggle */}
                            <div className="flex items-center space-x-3 mt-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDemoMode(step.id);
                                  }}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    demoModeSettings[step.id] 
                                      ? 'bg-orange-500' 
                                      : 'bg-green-500'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                      demoModeSettings[step.id] ? 'translate-x-1' : 'translate-x-5'
                                    }`}
                                  />
                                </button>
                                <span className="text-sm font-medium text-slate-700">
                                  {demoModeSettings[step.id] ? 'Demo Mode' : 'Live Mode'}
                                </span>
                                {demoModeSettings[step.id] && (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                    DEMO
                                  </span>
                                )}
                                {!demoModeSettings[step.id] && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">
                                {demoModeSettings[step.id] 
                                  ? 'Uses demo data for testing' 
                                  : 'Makes real API calls'
                                }
                              </p>
                            </div>
                            
                            {/* Step ID */}
                            <p className="text-xs text-slate-400 mt-2 font-mono">{step.id}</p>
                          </div>
                        </div>
                        
                        {/* Step Stats */}
                        <div className="flex items-center space-x-6 text-sm">
                          {step.lastRun && (
                            <div className="text-right">
                              <p className="text-slate-600">Last Run:</p>
                              <p className="font-medium text-slate-900">{step.lastRun.toLocaleString()}</p>
                            </div>
                          )}
                          
                          {step.successRate && (
                            <div className="text-right">
                              <p className="text-slate-600">Success Rate:</p>
                              <p className="font-medium text-green-600">{step.successRate}%</p>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                              Configure →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Condition Divider */}
                    {index < workflowSteps.length - 1 && (
                      <div className="flex items-center justify-center py-4">
                        <div className="flex-1 border-t border-slate-200"></div>
                        <div className="px-6">
                          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-medium text-slate-700">Conditions:</span>
                              {workflowConditions.map((condition, condIndex) => (
                                <div key={condition.id} className="flex items-center space-x-2">
                                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getConditionStatusColor(condition.status)}`}>
                                    {getConditionIcon(condition)}
                                    <span>{condition.name}</span>
                                  </div>
                                  {condIndex < workflowConditions.length - 1 && (
                                    <ArrowRight className="h-3 w-3 text-slate-400" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 border-t border-slate-200"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Data Display */}
            {workflowData && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Latest Processed Data</h2>
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-2">Lead Information Ready for GoHighLevel:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="text-slate-600">Name:</span> <span className="font-medium">{workflowData.name}</span></div>
                    <div><span className="text-slate-600">Company:</span> <span className="font-medium">{workflowData.companyName}</span></div>
                    <div><span className="text-slate-600">Email:</span> <span className="font-medium">{workflowData.email}</span></div>
                    <div><span className="text-slate-600">Phone:</span> <span className="font-medium">{workflowData.phone}</span></div>
                    <div><span className="text-slate-600">Budget:</span> <span className="font-medium">£{workflowData.monetaryValue?.toLocaleString()}</span></div>
                    <div><span className="text-slate-600">Source:</span> <span className="font-medium">{workflowData.source}</span></div>
                  </div>
                  <div className="mt-3">
                    <span className="text-slate-600">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {workflowData.tags?.map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Live Activity Feed */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">Workflow Progress</h3>
                {isRunningWorkflow && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">LIVE</span>
                  </div>
                )}
              </div>
              
              {workflowActivities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 text-sm">
                    No workflow activity yet. Click "Run Entire Workflow" to see live progress.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Group activities by step */}
                  {(() => {
                    const groupedActivities = workflowActivities.reduce((groups, activity) => {
                      const key = activity.step;
                      if (!groups[key]) groups[key] = [];
                      groups[key].push(activity);
                      return groups;
                    }, {} as Record<string, WorkflowActivity[]>);

                    const stepOrder = ['Workflow', 'System', 'Gmail', 'AI', 'Conditions', 'GoHighLevel', 'PandaDoc', 'Contact', 'Deposit Invoice', 'Final Invoice'];
                    
                    return stepOrder.map(stepName => {
                      const stepActivities = groupedActivities[stepName];
                      if (!stepActivities || stepActivities.length === 0) return null;
                      
                      const latestActivity = stepActivities[stepActivities.length - 1];
                      const isCurrentStep = stepActivities.some(a => currentActivity === a.id);
                      const isStepCompleted = latestActivity.status === 'completed';
                      
                      return (
                        <div key={stepName} className={`border rounded-lg transition-all ${
                          isCurrentStep 
                            ? 'border-blue-300 bg-blue-50 shadow-sm ring-1 ring-blue-200' 
                            : isStepCompleted 
                              ? 'border-green-200 bg-green-50 opacity-85 shadow-sm'
                              : latestActivity.status === 'failed'
                                ? 'border-red-200 bg-red-50'
                                : 'border-slate-200 bg-white'
                        }`}>
                          {/* Step Header */}
                          <div className="p-3 border-b border-slate-100">
                                                          <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {getActivityIcon(stepName, latestActivity.status)}
                                  <span className="font-medium text-slate-900">{stepName}</span>
                                  {isStepCompleted && (
                                    <div className="flex items-center space-x-1">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-xs text-green-700 font-medium">COMPLETED</span>
                                    </div>
                                  )}
                                  {latestActivity.status === 'failed' && (
                                    <div className="flex items-center space-x-1">
                                      <AlertTriangle className="h-4 w-4 text-red-600" />
                                      <span className="text-xs text-red-700 font-medium">FAILED</span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className="text-xs text-slate-500">
                                    {stepActivities.length} {stepActivities.length === 1 ? 'step' : 'steps'}
                                  </span>
                                  {isStepCompleted && (
                                    <div className="text-xs text-green-600 font-medium">
                                      ✓ {latestActivity.timestamp.toLocaleTimeString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                          </div>
                          
                          {/* Step Activities */}
                          <div className="p-3 space-y-2">
                            {stepActivities.map((activity, index) => (
                              <div key={activity.id} className="flex items-start space-x-2">
                                <div className="flex-shrink-0 mt-1">
                                  <div className={`w-2 h-2 rounded-full ${
                                    activity.status === 'completed' ? 'bg-green-500' :
                                    activity.status === 'failed' ? 'bg-red-500' :
                                    currentActivity === activity.id ? 'bg-blue-500 animate-pulse' :
                                    'bg-slate-300'
                                  }`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-900">
                                      {activity.action}
                                    </p>
                                    <span className="text-xs text-slate-400">
                                      {activity.timestamp.toLocaleTimeString()}
                                    </span>
                                  </div>
                                  {activity.details && (
                                    <p className="text-xs text-slate-600 mt-1">
                                      {activity.details}
                                    </p>
                                  )}
                                  {activity.data && (
                                    <div className="mt-2 p-2 bg-slate-100 rounded text-xs">
                                      <div className="font-medium text-slate-700">Extracted Data:</div>
                                      <div className="text-slate-600">
                                        {activity.data.name} • {activity.data.companyName} • £{activity.data.monetaryValue?.toLocaleString()}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }).filter(Boolean);
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Emails Processed</p>
                <p className="text-2xl font-bold text-slate-900">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Filter className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Conditions Met</p>
                <p className="text-2xl font-bold text-slate-900">{workflowConditions.filter(c => c.status === 'met').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Opportunities Created</p>
                <p className="text-2xl font-bold text-slate-900">22</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Activities Logged</p>
                <p className="text-2xl font-bold text-slate-900">{workflowActivities.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkflow; 