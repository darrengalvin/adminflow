import React, { useState, useEffect } from 'react';
import { Task, Workflow, WorkflowStep } from '../types';
import { generateTaskAnalysisPDF } from '../utils/pdfGenerator';
import claudeApi from '../services/claudeApi';
import { useNotifications, NotificationManager } from './CustomNotification';
import { 
  ArrowLeft, 
  ArrowRight,
  Sparkles, 
  Clock, 
  Zap, 
  CheckCircle, 
  Download,
  Plus,
  Target,
  Lightbulb,
  History,
  FileText,
  Upload,
  Clipboard,
  X
} from 'lucide-react';

interface TaskAnalysisProps {
  onBack?: () => void;
  onAddWorkflow?: (workflow: Workflow) => void;
  onNavigate?: (section: string) => void;
}

const TaskAnalysis: React.FC<TaskAnalysisProps> = ({ onBack, onAddWorkflow, onNavigate }) => {
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [software, setSoftware] = useState('');
  const [finalTask, setFinalTask] = useState<Task | null>(null);
  const [taskData, setTaskData] = useState<any>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [taskHistory, setTaskHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [showWorkflowChooser, setShowWorkflowChooser] = useState(false);
  const [pendingWorkflowTask, setPendingWorkflowTask] = useState<{ task: Task, analysisData: any } | null>(null);
  const [existingWorkflows, setExistingWorkflows] = useState<Workflow[]>([]);
  const [newWorkflowName, setNewWorkflowName] = useState('');

  // Custom notifications
  const { notifications, removeNotification, showSuccess, showError, showAI } = useNotifications();

  // Load task history on component mount
  useEffect(() => {
    const loadTaskHistory = () => {
      const savedHistory = localStorage.getItem('taskAnalysisHistory');
      if (savedHistory) {
        try {
          const history = JSON.parse(savedHistory);
          setTaskHistory(history);
          
          // Auto-restore last analysis if user just navigated back and no current task
          const lastSession = localStorage.getItem('currentTaskSession');
          if (lastSession && !finalTask && step === 'input') {
            try {
              const sessionData = JSON.parse(lastSession);
              const sessionAge = Date.now() - sessionData.timestamp;
              
              // If session is less than 30 minutes old, restore it
              if (sessionAge < 30 * 60 * 1000) {
                console.log('🔄 Restoring previous session...');
                setTaskData(sessionData.taskData);
                setTaskName(sessionData.taskName);
                setTaskDescription(sessionData.taskDescription);
                setTimeSpent(sessionData.timeSpent || '');
                setSoftware(sessionData.software || '');
                setFinalTask(sessionData.finalTask);
                setStep('results');
                showSuccess('✨ Restored your previous analysis!');
              } else {
                // Clear old session
                localStorage.removeItem('currentTaskSession');
              }
            } catch (error) {
              console.error('Error restoring session:', error);
              localStorage.removeItem('currentTaskSession');
            }
          }
        } catch (error) {
          console.error('Error loading task history:', error);
        }
      }
    };
    
    loadTaskHistory();
  }, []);

  // Save task analysis to history
  const saveTaskToHistory = (taskData: any) => {
    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      taskName: taskData.taskName || 'Unnamed Task',
      description: taskData.description || '',
      analysis: taskData,
      summary: {
        timeSpent: taskData.currentProcess?.timePerWeek || 'Unknown',
        software: taskData.currentProcess?.software || 'Unknown',
        annualValue: taskData.impact?.valuePerYear || 0,
        monthlyHours: taskData.impact?.monthlyHoursSaved || 0
      }
    };

    const currentHistory = JSON.parse(localStorage.getItem('taskAnalysisHistory') || '[]');
    const updatedHistory = [historyItem, ...currentHistory].slice(0, 20); // Keep last 20 analyses
    
    localStorage.setItem('taskAnalysisHistory', JSON.stringify(updatedHistory));
    setTaskHistory(updatedHistory);
  };

  // Load task from history
  const loadTaskFromHistory = (historyItem: any) => {
    try {
      if (!historyItem || !historyItem.analysis) {
        showError('❌ Error loading analysis from history');
        return;
      }

      setTaskData(historyItem.analysis);
      setTaskName(historyItem.taskName || 'Unnamed Task');
      setTaskDescription(historyItem.description || '');
      
      const finalTask = {
        name: historyItem.taskName || 'Unnamed Task',
        description: historyItem.description || '',
        software: historyItem.analysis?.currentProcess?.software || 'Unknown',
        timeSpent: historyItem.analysis?.currentProcess?.timePerWeek || 'Unknown',
        aiSuggestion: historyItem.analysis
      };
      
      setFinalTask(finalTask);
      setStep('results');
      setShowHistory(false);
    } catch (error) {
      console.error('Error loading task from history:', error);
      showError('❌ Error loading analysis from history');
    }
  };

  // Handle batch import
  const handleBatchImport = async () => {
    console.log('🚀 Batch import started');
    console.log('📝 Import text length:', importText.length);
    
    if (!importText.trim()) {
      showError('Please paste some content to import');
      return;
    }

    // Keep modal open initially to show processing state
    setIsAnalyzing(true);
    setStep('analyzing');
    setAnalysisProgress(0);
    
    console.log('✅ State updated, starting processing...');
    
    // Add timeout to prevent getting stuck
    const timeoutId = setTimeout(() => {
      console.error('⏰ Batch import timeout - resetting to input state');
      setIsAnalyzing(false);
      setStep('input');
      showError('❌ Processing timed out. Please try again.');
    }, 30000); // 30 second timeout
    
    try {
      // Close the modal and show processing
      setShowBatchImport(false);
      
      // Show progress for batch processing
      const progressSteps = [
        'Processing your pasted content...',
        'Identifying individual tasks...',
        'Extracting task details...',
        'Preparing analysis...',
        'Finalising batch import...'
      ];

      for (let i = 0; i < progressSteps.length; i++) {
        setAnalysisStep(progressSteps[i]);
        setAnalysisProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Call Claude API to process the batch content
      console.log('🔄 Calling Claude API for batch processing...');
      const analysisData = await claudeApi.analyzeTask({
        taskName: 'Batch Import Processing',
        description: `Please process this batch of tasks and extract the first task for analysis:\n\n${importText.trim()}`,
        timeSpent: 'Multiple tasks',
        software: 'Various systems',
        painPoints: 'Complex multi-step process, manual coordination required',
        alternatives: 'Streamlined workflow automation, integrated systems'
      });
      console.log('✅ Claude API response received:', analysisData);

      // Clear timeout since we succeeded
      clearTimeout(timeoutId);

      // For now, let's extract the first meaningful task from the raw text
      // This is a simple fallback until we enhance the API to handle batch processing
      const lines = importText.split('\n').filter(line => line.trim() && line.length > 10);
      let firstTask = lines[0]?.trim() || 'Imported Task';
      
      // Try to find a task that looks like a process name
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && 
            !trimmed.toLowerCase().includes('process') &&
            !trimmed.toLowerCase().includes('time frame') &&
            !trimmed.toLowerCase().includes('system') &&
            !trimmed.toLowerCase().includes('how to') &&
            trimmed.length > 5 && trimmed.length < 100) {
          firstTask = trimmed;
          break;
        }
      }

      // Clean up the task name
      firstTask = firstTask.replace(/^\d+\s*[-.]?\s*/, ''); // Remove leading numbers
      firstTask = firstTask.split('\t')[0]; // Take first column if tab-separated
      
      // Set up the form with the processed data
      setTaskName(firstTask.length > 80 ? firstTask.substring(0, 80) + '...' : firstTask);
      setTaskDescription(`${firstTask}\n\nOriginal batch content:\n${importText.trim()}`);
      setTimeSpent('Not specified');
      setSoftware('Multiple systems');
      
      // Process the analysis data
      const processedData = {
        taskName: firstTask,
        description: `${firstTask}\n\nBatch import content:\n${importText.trim()}`,
        currentProcess: {
          timePerWeek: 'Multiple tasks',
          software: 'Various systems'
        },
        ...analysisData
      };

      setTaskData(processedData);
      
      const finalTask = {
        name: firstTask,
        description: `${firstTask}\n\nBatch content:\n${importText.trim()}`,
        software: 'Various systems',
        timeSpent: 'Multiple tasks',
        aiSuggestion: processedData
      };
      
      setFinalTask(finalTask);
      
      // Save to history
      saveTaskToHistory(processedData);
      
      // Save current session for restoration
      const sessionData = {
        timestamp: Date.now(),
        taskData: processedData,
        taskName: firstTask,
        taskDescription: `${firstTask}\n\nBatch content:\n${importText.trim()}`,
        timeSpent: 'Multiple tasks',
        software: 'Various systems',
        finalTask: finalTask
      };
      localStorage.setItem('currentTaskSession', JSON.stringify(sessionData));
      
      setStep('results');
      setImportText('');
      console.log('🎉 Batch import completed successfully!');
      showSuccess('✨ Batch content processed and analysed!');
      
    } catch (error) {
      console.error('Batch import error:', error);
      clearTimeout(timeoutId);
      showError('❌ Batch processing failed. Please try again.');
      setStep('input');
      setIsAnalyzing(false);
      // Don't clear importText so user can try again
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateDirectAnalysis = async () => {
    if (!taskName.trim() || !taskDescription.trim()) {
      showError('Please fill in both task name and description');
      return;
    }

    setIsAnalyzing(true);
    setStep('analyzing');
    setAnalysisProgress(0);
    
    // Add timeout protection - reset after 45 seconds
    const timeoutId = setTimeout(() => {
      if (step === 'analyzing') {
        console.log('Analysis timeout - resetting to input');
        showError('⏰ Analysis timed out. Please try again.');
        setStep('input');
        setIsAnalyzing(false);
      }
    }, 45000);
    
    try {
      // Simulate analysis progress
      const progressSteps = [
        'Analysing task description...',
        'Identifying automation opportunities...',
        'Calculating time savings...',
        'Generating implementation plan...',
        'Finalising recommendations...'
      ];

      for (let i = 0; i < progressSteps.length; i++) {
        setAnalysisStep(progressSteps[i]);
        setAnalysisProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Call Claude API for analysis
      const analysisData = await claudeApi.analyzeTask({
        taskName: taskName.trim(),
        description: taskDescription.trim(),
        timeSpent: timeSpent || 'Not specified',
        software: software || 'Not specified',
        painPoints: 'Manual process, time consuming, repetitive work',
        alternatives: 'Focus on strategic work, customer relationships, business growth'
      });

      // Process the analysis data
      const processedData = {
        taskName: taskName.trim(),
        description: taskDescription.trim(),
        currentProcess: {
          timePerWeek: timeSpent || 'Not specified',
          software: software || 'Not specified'
        },
        ...analysisData
      };

      setTaskData(processedData);
      
      const finalTask = {
        name: taskName.trim(),
        description: taskDescription.trim(),
        software: software || 'Not specified',
        timeSpent: timeSpent || 'Not specified',
        aiSuggestion: processedData
      };
      
      setFinalTask(finalTask);
      
      // Save to history
      saveTaskToHistory(processedData);
      
      // Save current session for restoration
      const sessionData = {
        timestamp: Date.now(),
        taskData: processedData,
        taskName: taskName.trim(),
        taskDescription: taskDescription.trim(),
        timeSpent: timeSpent || '',
        software: software || '',
        finalTask: finalTask
      };
      localStorage.setItem('currentTaskSession', JSON.stringify(sessionData));
      
      clearTimeout(timeoutId); // Clear timeout on success
      setStep('results');
      showSuccess('✨ Analysis complete!');
      
    } catch (error) {
      console.error('Analysis error:', error);
      clearTimeout(timeoutId); // Clear timeout on error
      showError('❌ Analysis failed. Please try again.');
      setStep('input');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setTaskName('');
    setTaskDescription('');
    setTimeSpent('');
    setSoftware('');
    setStep('input');
    setFinalTask(null);
    setTaskData({});
    
    // Clear current session when explicitly resetting
    localStorage.removeItem('currentTaskSession');
  };

  // Utility function to format currency properly (avoid double £)
  const formatCurrency = (value: any): string => {
    if (!value) return '£0';
    
    const stringValue = value.toString().trim();
    
    // If already has £ symbol, clean it up and return properly formatted
    if (stringValue.includes('£')) {
      // Remove all £ symbols and extract just the number
      const cleanValue = stringValue.replace(/£/g, '').replace(/[^0-9.-]/g, '');
      const numValue = parseFloat(cleanValue);
      if (!isNaN(numValue)) {
        return `£${numValue.toLocaleString()}`;
      }
      // If we can't parse it, return the original but with only one £
      return stringValue.replace(/£+/g, '£');
    }
    
    // If it's a number, format with £
    const numValue = parseFloat(stringValue.replace(/[^0-9.-]/g, ''));
    if (!isNaN(numValue)) {
      return `£${numValue.toLocaleString()}`;
    }
    
    // Fallback: add £ if not present
    return `£${stringValue}`;
  };

  // Add to workflow function
  const openWorkflowChooser = (task: Task, analysisData: any) => {
    // Load existing workflows
    const workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    setExistingWorkflows(workflows);
    
    // Set pending task data
    setPendingWorkflowTask({ task, analysisData });
    
    // Set default new workflow name
    setNewWorkflowName(`Automate: ${task.name}`);
    
    // Show the chooser modal
    setShowWorkflowChooser(true);
  };

  const addToNewWorkflow = () => {
    if (!pendingWorkflowTask || !newWorkflowName.trim()) {
      showError('Please enter a workflow name');
      return;
    }

    try {
      const { task, analysisData } = pendingWorkflowTask;
      
      // Create workflow steps from the analysis data
      const workflowSteps: WorkflowStep[] = [];
      
      // Add implementation steps if available
      if (analysisData.implementationSteps && Array.isArray(analysisData.implementationSteps)) {
        analysisData.implementationSteps.forEach((step: string, index: number) => {
          workflowSteps.push({
            id: `step-${index + 1}`,
            name: `Step ${index + 1}`,
            description: step,
            type: 'manual',
            estimatedDuration: 30, // Default 30 minutes
            status: 'pending',
            dependencies: index > 0 ? [`step-${index}`] : [],
            apiEndpoint: analysisData.apiEndpoints?.[index]?.url || undefined,
            parameters: analysisData.apiEndpoints?.[index]?.parameters || {}
          });
        });
      }

      // If no implementation steps, create steps from the automation plan
      if (workflowSteps.length === 0 && analysisData.automation) {
        // Create basic workflow steps
        workflowSteps.push(
          {
            id: 'setup',
            name: 'Setup & Configuration',
            description: 'Initial setup and configuration for automation',
            type: 'manual',
            estimatedDuration: 60,
            status: 'pending',
            dependencies: []
          },
          {
            id: 'integrate',
            name: 'API Integration',
            description: 'Connect and configure API endpoints',
            type: 'api',
            estimatedDuration: 45,
            status: 'pending',
            dependencies: ['setup'],
            apiEndpoint: analysisData.apiEndpoints?.[0]?.url,
            parameters: analysisData.apiEndpoints?.[0]?.parameters || {}
          },
          {
            id: 'test',
            name: 'Testing & Validation',
            description: 'Test the automation and validate results',
            type: 'manual',
            estimatedDuration: 30,
            status: 'pending',
            dependencies: ['integrate']
          }
        );
      }

      // Create the workflow
      const workflow: Workflow = {
        id: `workflow-${Date.now()}`,
        name: newWorkflowName,
        description: task.description,
        steps: workflowSteps,
        status: 'draft',
        createdAt: new Date(),
        estimatedDuration: workflowSteps.reduce((total, step) => total + step.estimatedDuration, 0),
        progress: 0,
        tags: [
          'automation',
          analysisData.automation?.type || 'general',
          analysisData.currentProcess?.software || 'software'
        ].filter(Boolean)
      };

      // Save to workflows in localStorage
      const existingWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      const updatedWorkflows = [workflow, ...existingWorkflows];
      localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));

      // Close modal and reset state
      setShowWorkflowChooser(false);
      setPendingWorkflowTask(null);
      setNewWorkflowName('');

      // Call the onAddWorkflow callback if provided
      if (onAddWorkflow) {
        onAddWorkflow(workflow);
      }

      // Show success message with navigation option
      const message = `✅ Created new workflow "${newWorkflowName}"!`;
      showSuccess(message);
      
      // Offer navigation to workflows if available
      if (onNavigate) {
        setTimeout(() => {
          if (window.confirm(`${message}\n\nWould you like to go to the Workflow Manager to execute it?`)) {
            onNavigate('workflows');
          }
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error creating new workflow:', error);
      showError('❌ Failed to create workflow. Please try again.');
    }
  };

  const addToExistingWorkflow = (existingWorkflow: Workflow) => {
    if (!pendingWorkflowTask) return;

    try {
      const { task, analysisData } = pendingWorkflowTask;
      
      // Create new steps from the analysis data
      const newSteps: WorkflowStep[] = [];
      
      if (analysisData.implementationSteps && Array.isArray(analysisData.implementationSteps)) {
        analysisData.implementationSteps.forEach((step: string, index: number) => {
          newSteps.push({
            id: `${existingWorkflow.id}-step-${existingWorkflow.steps.length + index + 1}`,
            name: `${task.name} - Step ${index + 1}`,
            description: step,
            type: 'manual',
            estimatedDuration: 30,
            status: 'pending',
            dependencies: index === 0 ? [] : [`${existingWorkflow.id}-step-${existingWorkflow.steps.length + index}`],
            apiEndpoint: analysisData.apiEndpoints?.[index]?.url || undefined,
            parameters: analysisData.apiEndpoints?.[index]?.parameters || {}
          });
        });
      }

      // Update the existing workflow
      const updatedWorkflow = {
        ...existingWorkflow,
        steps: [...existingWorkflow.steps, ...newSteps],
        estimatedDuration: existingWorkflow.estimatedDuration + newSteps.reduce((total, step) => total + step.estimatedDuration, 0),
        tags: [...new Set([...existingWorkflow.tags, 'automation', analysisData.automation?.type || 'general'])]
      };

      // Update workflows in localStorage
      const allWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      const updatedWorkflows = allWorkflows.map((w: Workflow) => 
        w.id === existingWorkflow.id ? updatedWorkflow : w
      );
      localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));

      // Close modal and reset state
      setShowWorkflowChooser(false);
      setPendingWorkflowTask(null);
      setNewWorkflowName('');

      // Show success message
      const message = `✅ Added "${task.name}" to workflow "${existingWorkflow.name}"!`;
      showSuccess(message);
      
      // Offer navigation to workflows if available
      if (onNavigate) {
        setTimeout(() => {
          if (window.confirm(`${message}\n\nWould you like to go to the Workflow Manager to execute it?`)) {
            onNavigate('workflows');
          }
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error adding to existing workflow:', error);
      showError('❌ Failed to add to workflow. Please try again.');
    }
  };

  // Sample tasks for different industries
  const sampleTasks = [
    {
      industry: 'Property/Real Estate',
      taskName: 'Create CRM deal from property enquiry',
      description: 'When someone enquires about a property, I manually go into the CRM, create a new deal record, add their contact details, property interest, budget, and timeline. Then I send them a welcome email with property details and schedule a viewing.',
      timeSpent: '15 minutes per enquiry',
      software: 'CRM, Email, Property management system'
    },
    {
      industry: 'Events/Hospitality',
      taskName: 'Process corporate event booking',
      description: 'When a corporate client confirms an event, I create the booking in our system, generate the contract in PandaDoc, send it for signature, create invoices in Xero, add the event to FareHarbor, coordinate with catering, and update the manifest with all details.',
      timeSpent: '45 minutes per booking',
      software: 'PandaDoc, Xero, FareHarbor, Email, CRM'
    },
    {
      industry: 'Professional Services',
      taskName: 'Client billing compilation',
      description: 'At month-end, I gather time entries from different team members, compile them into a billing summary, create invoices in our accounting system, attach supporting documents, and send to clients with payment instructions.',
      timeSpent: '3 hours monthly',
      software: 'Time tracking, Accounting software, Email'
    },
    {
      industry: 'Healthcare',
      taskName: 'Patient appointment scheduling',
      description: 'When patients call to book appointments, I check doctor availability, find suitable time slots, create the appointment in our system, send confirmation SMS, update patient records, and send reminder emails 24 hours before.',
      timeSpent: '10 minutes per appointment',
      software: 'Practice management system, SMS service, Email'
    },
    {
      industry: 'E-commerce/Retail',
      taskName: 'Process customer refunds',
      description: 'When customers request refunds, I verify the order details, check return eligibility, process the refund through payment gateway, update inventory levels, send confirmation email to customer, and log the transaction for accounting.',
      timeSpent: '20 minutes per refund',
      software: 'E-commerce platform, Payment gateway, Inventory system, Email'
    },
    {
      industry: 'Manufacturing',
      taskName: 'Update inventory after production',
      description: 'After each production run, I manually update inventory levels in our ERP system, calculate material usage, update cost records, generate production reports, and notify sales team of available stock levels.',
      timeSpent: '30 minutes per production run',
      software: 'ERP system, Excel, Email'
    }
  ];

  const [showSamples, setShowSamples] = useState(false);

  const loadSampleTask = (sample: typeof sampleTasks[0]) => {
    setTaskName(sample.taskName);
    setTaskDescription(sample.description);
    setTimeSpent(sample.timeSpent);
    setSoftware(sample.software);
    setShowSamples(false);
    
    // Scroll to form
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  if (step === 'input') {
    return (
      <div className="min-h-screen bg-slate-50">
        <NotificationManager notifications={notifications} onRemove={removeNotification} />
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack || (() => {})}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colours"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </button>
                <div className="h-6 w-px bg-slate-300" />
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  <h1 className="text-xl font-semibold text-slate-900">AI Task Analyser</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSamples(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colours"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Try a Sample</span>
                </button>
                
                <button
                  onClick={() => setShowBatchImport(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colours"
                >
                  <Upload className="h-4 w-4" />
                  <span>Batch Import</span>
                </button>
                
                {taskHistory.length > 0 && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colours"
                  >
                    <History className="h-4 w-4" />
                    <span>History ({taskHistory.length})</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  Discover Your Automation Potential
                </h2>
                <p className="text-slate-600 text-lg">
                  Tell us about a task you do regularly, and we'll show you how to automate it
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="space-y-6">
                  {/* Task Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      What do you call this task? *
                    </label>
                    <input
                      type="text"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="e.g., Create deal when offer is made"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Task Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      What exactly do you do? *
                    </label>
                    <textarea
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="e.g., When someone accepts an offer, I go into the CRM and create a new deal with their info, then send a welcome email"
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Optional Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Time per week (optional)
                      </label>
                      <input
                        type="text"
                        value={timeSpent}
                        onChange={(e) => setTimeSpent(e.target.value)}
                        placeholder="e.g., 2 hours"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Software/tools used (optional)
                      </label>
                      <input
                        type="text"
                        value={software}
                        onChange={(e) => setSoftware(e.target.value)}
                        placeholder="e.g., Salesforce, Gmail"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <button
                      onClick={generateDirectAnalysis}
                      disabled={!taskName.trim() || !taskDescription.trim()}
                      className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colours flex items-center justify-center space-x-2"
                    >
                      <Zap className="h-5 w-5" />
                      <span>Analyse Task</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Tips and Features */}
            <div className="space-y-6">
              
              {/* Try a Sample */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-3">Not sure where to start?</h3>
                    <p className="text-sm text-blue-800 mb-4">
                      Try one of our sample tasks from different industries to see how the AI analysis works.
                    </p>
                    <button
                      onClick={() => setShowSamples(true)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colours"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Browse Sample Tasks</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-3">Get better results</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>• Be specific about the steps you take</li>
                      <li>• Mention what triggers you to do this task</li>
                      <li>• Include any copy-paste between systems</li>
                      <li>• The more detail, the better the AI plan!</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Batch Import Feature */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-medium text-slate-900 mb-3">Batch Analysis</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Have multiple tasks? Upload a spreadsheet or paste a list to analyse multiple tasks at once.
                </p>
                <button
                  onClick={() => setShowBatchImport(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colours"
                >
                  <Clipboard className="h-4 w-4" />
                  <span>Paste Task List</span>
                </button>
              </div>

              {/* Perfect Automation Targets */}
              <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                <h3 className="font-medium text-green-900 mb-3">Perfect Automation Targets</h3>
                <ul className="text-sm text-green-800 space-y-2">
                  <li>• Done the same way every time</li>
                  <li>• Takes 15+ minutes each time</li>
                  <li>• Involves multiple systems</li>
                  <li>• Happens weekly or more</li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Batch Import Modal */}
        {showBatchImport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Batch Import Tasks</h3>
                  <button
                    onClick={() => {
                      setShowBatchImport(false);
                      setImportText('');
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-2">
                    Paste your tasks in any format - our AI will figure it out and process them for you.
                  </p>
                  <p className="text-xs text-slate-500">
                    Works with spreadsheet data, simple lists, bullet points, or any text format. Just paste what you have!
                  </p>
                </div>
                
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste your tasks in any format here:&#10;&#10;From spreadsheets, documents, lists, bullet points...&#10;&#10;Examples:&#10;• Process customer refunds&#10;• Update inventory spreadsheet&#10;• Send weekly reports&#10;&#10;Or paste your structured data directly!"
                  rows={12}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                
                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowBatchImport(false);
                      setImportText('');
                    }}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBatchImport}
                    disabled={!importText.trim() || isAnalyzing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colours flex items-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Import Tasks</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Tasks Modal */}
        {showSamples && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Try a Sample Task</h3>
                  <button
                    onClick={() => setShowSamples(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-slate-600 mt-2">
                  Choose a sample task from different industries to see how our AI analysis works
                </p>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleTasks.map((sample, index) => (
                    <div
                      key={index}
                      onClick={() => loadSampleTask(sample)}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colours"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-2">
                            {sample.industry}
                          </span>
                          <h4 className="font-medium text-slate-900">{sample.taskName}</h4>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 mt-1" />
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                        {sample.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>⏱️ {sample.timeSpent}</span>
                        <span>🔧 {sample.software.split(',').length} tools</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <p className="text-sm text-slate-600 text-center">
                  Click any sample to load it into the form and see a live AI analysis
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Analysis History</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {taskHistory.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No previous analyses found</p>
                ) : (
                  <div className="space-y-3">
                    {taskHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadTaskFromHistory(item)}
                        className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colours"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{item.taskName}</h4>
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                              <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                              {item.summary?.timeSpent && (
                                <span>• {item.summary.timeSpent}</span>
                              )}
                            </div>
                          </div>
                          <FileText className="h-4 w-4 text-slate-400 ml-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Workflow Chooser Modal */}
        {showWorkflowChooser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Add to Workflow</h3>
                  <button
                    onClick={() => {
                      setShowWorkflowChooser(false);
                      setPendingWorkflowTask(null);
                      setNewWorkflowName('');
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-slate-600 mt-2">
                  Choose an existing workflow or create a new one for this task
                </p>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Create New Workflow Section */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Create New Workflow</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newWorkflowName}
                      onChange={(e) => setNewWorkflowName(e.target.value)}
                      placeholder="Enter workflow name..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={addToNewWorkflow}
                      disabled={!newWorkflowName.trim()}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colours"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create New Workflow</span>
                    </button>
                  </div>
                </div>

                {/* Existing Workflows Section */}
                {existingWorkflows.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Add to Existing Workflow</h4>
                    <div className="space-y-3">
                      {existingWorkflows.map((workflow) => (
                        <div
                          key={workflow.id}
                          onClick={() => addToExistingWorkflow(workflow)}
                          className="p-4 border border-slate-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colours"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-slate-900">{workflow.name}</h5>
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">{workflow.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                                <span>{workflow.steps.length} steps</span>
                                <span>• {workflow.status}</span>
                                <span>• {Math.round(workflow.estimatedDuration / 60)}h estimated</span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-400 ml-3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {existingWorkflows.length === 0 && (
                  <div className="text-center py-6 text-slate-500">
                    <p>No existing workflows found</p>
                    <p className="text-sm mt-1">Create your first workflow above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div className="min-h-screen bg-slate-50">
        <NotificationManager notifications={notifications} onRemove={removeNotification} />
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={resetForm}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colours"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Cancel Analysis</span>
                </button>
                <div className="h-6 w-px bg-slate-300" />
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
                  <h1 className="text-xl font-semibold text-slate-900">AI Task Analyser</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-sm text-slate-600">
                  {analysisProgress}% complete
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Task Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Task</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">{taskName}</h4>
                    <p className="text-sm text-slate-600 line-clamp-3">{taskDescription}</p>
                  </div>
                  
                  {timeSpent && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>{timeSpent}</span>
                    </div>
                  )}
                  
                  {software && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Target className="h-4 w-4" />
                      <span>{software}</span>
                    </div>
                  )}
                </div>
                
                {/* Progress Section */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Analysis Progress</span>
                    <span className="text-sm text-slate-500">{analysisProgress}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  
                  <p className="text-sm text-slate-600">{analysisStep}</p>
                </div>
                
                {/* Emergency Cancel */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <button
                    onClick={resetForm}
                    className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colours text-sm font-medium"
                  >
                    Cancel and Start Over
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Column - Analysis Animation */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="text-center">
                  <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="h-12 w-12 text-blue-600 animate-pulse" />
                  </div>
                  
                  <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                    Analysing Your Task
                  </h2>
                  
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Our AI is reviewing your task and creating a comprehensive automation strategy. This usually takes 10-30 seconds.
                  </p>
                  
                  {/* Status Steps */}
                  <div className="space-y-3 max-w-sm mx-auto">
                    <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                      analysisProgress >= 25 ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        analysisProgress >= 25 ? 'bg-green-500' : 'bg-slate-300'
                      }`} />
                      <span className="text-sm">Understanding your workflow</span>
                    </div>
                    
                    <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                      analysisProgress >= 50 ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        analysisProgress >= 50 ? 'bg-green-500' : 'bg-slate-300'
                      }`} />
                      <span className="text-sm">Identifying automation opportunities</span>
                    </div>
                    
                    <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                      analysisProgress >= 75 ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        analysisProgress >= 75 ? 'bg-green-500' : 'bg-slate-300'
                      }`} />
                      <span className="text-sm">Creating implementation plan</span>
                    </div>
                    
                    <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                      analysisProgress >= 100 ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        analysisProgress >= 100 ? 'bg-green-500' : 'bg-slate-300'
                      }`} />
                      <span className="text-sm">Finalising recommendations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results' && finalTask && taskData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NotificationManager notifications={notifications} onRemove={removeNotification} />
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={resetForm}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colours"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>New Analysis</span>
                </button>
                <div className="h-6 w-px bg-slate-300" />
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h1 className="text-xl font-semibold text-slate-900">Analysis Complete</h1>
                </div>
              </div>
              
              <button
                onClick={() => generateTaskAnalysisPDF(finalTask)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colours"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Content - Full Width */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Analysis */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Task Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">{finalTask.name}</h2>
                <p className="text-slate-600 mb-4">{finalTask.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">Time Spent</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{finalTask.timeSpent}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">Software</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{finalTask.software}</p>
                  </div>
                </div>
              </div>

              {/* AI Analysis Results */}
              {taskData.userFriendlyExplanation && (
                <>
                  {/* Good News Section */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-900 mb-2">✨ Great News!</h3>
                        <p className="text-green-800 leading-relaxed">{taskData.userFriendlyExplanation.goodNews}</p>
                      </div>
                    </div>
                  </div>

                  {/* What is an API */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">🔌 What is an API?</h3>
                    <p className="text-slate-700 leading-relaxed">{taskData.userFriendlyExplanation.whatIsAPI}</p>
                  </div>

                  {/* How It Works */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">⚡ How the Automation Works</h3>
                    <p className="text-slate-700 leading-relaxed mb-6">{taskData.userFriendlyExplanation.howItWorks}</p>
                    
                    {/* Technical Requirements */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">📋 What You'll Need</h4>
                      <p className="text-blue-800 text-sm">{taskData.userFriendlyExplanation.whatYouNeed}</p>
                    </div>
                  </div>

                  {/* API Endpoints */}
                  {taskData.userFriendlyExplanation.endpoints && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">🔗 API Endpoints & Integration</h3>
                      <div className="space-y-4">
                        {taskData.userFriendlyExplanation.endpoints.map((endpoint: any, index: number) => (
                          <div key={index} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-slate-900">{endpoint.name}</h4>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">API</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{endpoint.purpose}</p>
                            <p className="text-sm text-slate-700">{endpoint.whatItDoes}</p>
                            {endpoint.endpoint !== "Available through your software's developer documentation" && (
                              <div className="mt-2 p-2 bg-slate-50 rounded text-xs font-mono text-slate-600">
                                {endpoint.endpoint}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Automation Details */}
                  {taskData.automation && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">🤖 Automation Strategy</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-3">Automation Type</h4>
                          <p className="text-slate-700 text-sm mb-4">{taskData.automation.type}</p>
                          
                          <h4 className="font-medium text-slate-900 mb-3">API Connections</h4>
                          <div className="space-y-2">
                            {taskData.automation.apiConnections?.map((api: string, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-slate-700">{api}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-slate-900 mb-3">AI Capabilities</h4>
                          <div className="space-y-2">
                            {taskData.automation.aiCapabilities?.slice(0, 3).map((capability: string, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-slate-700">{capability}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Impact & Savings */}
                  {taskData.impact && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">📊 Expected Impact</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{taskData.impact.monthlyHoursSaved}</div>
                          <div className="text-sm text-green-700">Hours Saved Monthly</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{taskData.impact.annualHoursSaved}</div>
                          <div className="text-sm text-blue-700">Hours Saved Yearly</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{taskData.impact.valuePerYear}</div>
                          <div className="text-sm text-purple-700">Value Per Year</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{taskData.impact.efficiencyGain}</div>
                          <div className="text-sm text-orange-700">Efficiency Gain</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Implementation Plan */}
                  {taskData.implementation && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">🚀 Implementation Plan</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <div className="font-semibold text-slate-900">{taskData.implementation.setupTime}</div>
                          <div className="text-sm text-slate-600">Setup Time</div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <div className={`font-semibold ${
                            taskData.implementation.difficulty === 'Easy' ? 'text-green-600' :
                            taskData.implementation.difficulty === 'Medium' ? 'text-orange-600' : 'text-red-600'
                          }`}>{taskData.implementation.difficulty}</div>
                          <div className="text-sm text-slate-600">Difficulty</div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <div className="font-semibold text-slate-900">{taskData.implementation.steps?.length || 0} Steps</div>
                          <div className="text-sm text-slate-600">Implementation</div>
                        </div>
                      </div>
                      
                      {/* Implementation Steps */}
                      <h4 className="font-medium text-slate-900 mb-3">📝 Step-by-Step Implementation</h4>
                      <div className="space-y-3">
                        {taskData.implementation.steps?.map((step: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="text-slate-700 text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Next Actions */}
                      {taskData.implementation.nextActions && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-3">🎯 Immediate Next Actions</h4>
                          <div className="space-y-2">
                            {taskData.implementation.nextActions.map((action: string, index: number) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-blue-800 text-sm">{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Next Steps Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 What To Do Next</h3>
                    <p className="text-blue-800 leading-relaxed">{taskData.userFriendlyExplanation.nextSteps}</p>
                  </div>
                </>
              )}

              {/* Workflow Breakdown - if this is batch imported content */}
              {finalTask.description && (finalTask.description.includes('Batch content:') || finalTask.description.includes('Respond to enquiry')) && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Corporate Events Workflow</h3>
                  <div className="space-y-4">
                    {(() => {
                      let batchContent = finalTask.description.includes('Batch content:') 
                        ? finalTask.description.split('Batch content:')[1]
                        : finalTask.description;
                      if (!batchContent) return null;
                      
                      // Parse the corporate events workflow text with multiple approaches
                      const text = batchContent.replace(/\s+/g, ' ').trim();
                      let processes = [];
                      
                      // Method 1: Try to identify key processes by looking for system names
                      const knownProcesses = [
                        { name: 'Respond to enquiry', trigger: 'Respond to enquiry', system: 'CRM' },
                        { name: 'Create deal (offer made)', trigger: 'Create deal', system: 'CRM' },
                        { name: 'Create programme', trigger: 'Create programme', system: 'Pandadoc' },
                        { name: 'Put on Fareharbor', trigger: 'Put on Fareharbor', system: 'Fareharbor' },
                        { name: 'Create 50% deposit invoice', trigger: 'Create 50% deposit invoice', system: 'Xero' },
                        { name: 'Create final balance invoice', trigger: 'Create final balance invoice', system: 'Xero' },
                        { name: 'Book in with catering', trigger: 'Book in with catering', system: 'Gmail' },
                        { name: 'Manifest details', trigger: 'Manifest details', system: 'Fareharbor' },
                        { name: 'Update CRM', trigger: 'Update CRM', system: 'CRM' },
                        { name: 'Send £100 thank you voucher', trigger: 'Send £100 thank you voucher', system: 'Fareharbor' },
                        { name: 'Send request final details email', trigger: 'Send request final details email', system: 'CRM' },
                        { name: 'Send final balance invoice', trigger: 'Send final balance invoice', system: 'Xero' },
                        { name: 'Send joining instructions', trigger: 'Send Joining instructions', system: 'Panda and CRM' },
                        { name: 'Buy milk', trigger: 'Buy milk', system: 'Manual' },
                        { name: 'Get refreshments ready', trigger: 'Get refreshments ready', system: 'Manual' },
                        { name: 'Get cabin ready', trigger: 'Get cabin ready', system: 'Manual' }
                      ];
                      
                      for (const process of knownProcesses) {
                        const processIndex = text.toLowerCase().indexOf(process.trigger.toLowerCase());
                        if (processIndex !== -1) {
                          // Extract the section for this process
                          const nextProcessIndex = knownProcesses
                            .map(p => text.toLowerCase().indexOf(p.trigger.toLowerCase(), processIndex + 1))
                            .filter(idx => idx > processIndex)
                            .sort((a, b) => a - b)[0] || text.length;
                          
                          const processText = text.substring(processIndex, nextProcessIndex).trim();
                          
                          // Extract timing
                          let timeFrame = 'When required';
                          const timingPatterns = [
                            { pattern: /3 attempts within 48 hours/, text: '3 attempts within 48 hours' },
                            { pattern: /Once you have the details/, text: 'Once you have the details' },
                            { pattern: /When corporate confirms/, text: 'When corporate confirms' },
                            { pattern: /When email comes in/, text: 'When email comes in' },
                            { pattern: /Set for the [^A-Z]+ due date/, text: 'Set for due date' },
                            { pattern: /Send on signed confirmed/, text: 'Send on signed confirmed' },
                            { pattern: /Set 3 weeks before event/, text: 'Set 3 weeks before event' },
                            { pattern: /Set 2 weeks before event/, text: 'Set 2 weeks before event' },
                            { pattern: /Set after the event/, text: 'Set after the event' },
                            { pattern: /Set 2 days before event/, text: 'Set 2 days before event' },
                            { pattern: /Set day before event/, text: 'Set day before event' }
                          ];
                          
                          for (const timing of timingPatterns) {
                            if (timing.pattern.test(processText)) {
                              timeFrame = timing.text;
                              break;
                            }
                          }
                          
                          // Extract numbered steps
                          const steps = processText.match(/\d+\s*-[^0-9]+/g) || [];
                          const howTo = steps.length > 0 ? steps.join(' ') : processText.replace(process.trigger, '').trim();
                          
                          processes.push({
                            name: process.name,
                            timeFrame,
                            system: process.system,
                            howTo: howTo.substring(0, 250) + (howTo.length > 250 ? '...' : '')
                          });
                        }
                      }
                      
                      return processes.slice(0, 15).map((process, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 mb-2">{process.name}</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    ⏰ WHEN
                                  </span>
                                  <span className="text-sm text-slate-600">{process.timeFrame}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                    🔧 SYSTEM
                                  </span>
                                  <span className="text-sm text-slate-600">{process.system}</span>
                                </div>
                              </div>
                              
                              {process.howTo && (
                                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">How To:</span>
                                  <p className="text-sm text-slate-700 mt-1 leading-relaxed">{process.howTo}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {/* Implementation Steps */}
              {taskData.implementationSteps && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Implementation Steps</h3>
                  <div className="space-y-3">
                    {taskData.implementationSteps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-slate-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Impact Summary */}
              {taskData.impact && (
                <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Potential Impact</h3>
                  <div className="space-y-4">
                    {taskData.impact.monthlyHoursSaved && (
                      <div>
                        <p className="text-sm text-green-700">Monthly Hours Saved</p>
                        <p className="text-2xl font-bold text-green-900">{taskData.impact.monthlyHoursSaved}</p>
                      </div>
                    )}
                    {taskData.impact.valuePerYear && (
                      <div>
                        <p className="text-sm text-green-700">Annual Value</p>
                        <p className="text-2xl font-bold text-green-900">{formatCurrency(taskData.impact.valuePerYear)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Next Steps</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => openWorkflowChooser(finalTask, taskData)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colours"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Workflow</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colours"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Analyse Another Task</span>
                  </button>
                  <button
                    onClick={() => generateTaskAnalysisPDF(finalTask)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colours"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TaskAnalysis; 