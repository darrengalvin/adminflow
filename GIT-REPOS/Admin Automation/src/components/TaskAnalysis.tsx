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
  X,
  Code,
  Globe
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
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [navigationMessage, setNavigationMessage] = useState('');

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
    console.log('🔄 openWorkflowChooser called with:', { task, analysisData });
    
    try {
      // Load existing workflows
      const workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      console.log('📋 Loaded workflows:', workflows);
      setExistingWorkflows(workflows);
      
      // Set pending task data
      setPendingWorkflowTask({ task, analysisData });
      console.log('📝 Set pending task data');
      
      // Set default new workflow name
      const workflowName = `Automate: ${task.name}`;
      setNewWorkflowName(workflowName);
      console.log('📛 Set workflow name:', workflowName);
      
      // Show the chooser modal
      setShowWorkflowChooser(true);
      console.log('✅ Workflow chooser modal should now be visible');
    } catch (error) {
      console.error('❌ Error in openWorkflowChooser:', error);
    }
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
          setNavigationMessage(`${message}\n\nWould you like to go to the Workflow Manager to execute it?`);
          setShowNavigationModal(true);
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
          setNavigationMessage(`${message}\n\nWould you like to go to the Workflow Manager to execute it?`);
          setShowNavigationModal(true);
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

  return (
    <>
      {/* Main Component Content */}
      {renderMainContent()}

      {/* Workflow Chooser Modal - Available from all pages */}
      {showWorkflowChooser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          {console.log('🎯 Workflow Chooser Modal is rendering!')}
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

      {/* Navigation Confirmation Modal */}
      {showNavigationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Success!</h3>
                  <p className="text-slate-600 whitespace-pre-line">{navigationMessage}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowNavigationModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colours"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowNavigationModal(false);
                    if (onNavigate) {
                      onNavigate('workflows');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colours"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Main content renderer
  function renderMainContent() {
    if (step === 'results') {
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
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowHistory(true)}
                    className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colours"
                  >
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">History</span>
                  </button>
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
                      <h4 className="font-medium text-slate-900 mb-1">{finalTask?.name}</h4>
                      <p className="text-sm text-slate-600 line-clamp-3">{finalTask?.description}</p>
                    </div>
                    
                    {finalTask?.timeSpent && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>{finalTask.timeSpent}</span>
                      </div>
                    )}
                    
                    {finalTask?.software && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Target className="h-4 w-4" />
                        <span>{finalTask.software}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Impact Summary */}
                  {taskData.impact && (
                    <div className="bg-green-50 rounded-xl border border-green-200 p-6 mt-6">
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
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Next Steps</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          console.log('🖱️ Add to Workflow button clicked!');
                          openWorkflowChooser(finalTask, taskData);
                        }}
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
              
              {/* Right Column - Analysis Results */}
              <div className="lg:col-span-2 space-y-8">
                {/* Great News Section */}
                {taskData.userFriendlyExplanation && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Great News!</h3>
                        <p className="text-slate-600">Your task can definitely be automated</p>
                      </div>
                    </div>
                    <div className="prose prose-slate max-w-none">
                      {typeof taskData.userFriendlyExplanation === 'string' ? (
                        <p className="text-slate-700 leading-relaxed">{taskData.userFriendlyExplanation}</p>
                      ) : (
                        <div className="space-y-4">
                          {taskData.userFriendlyExplanation.goodNews && (
                            <p className="text-slate-700 leading-relaxed">{taskData.userFriendlyExplanation.goodNews}</p>
                          )}
                          {taskData.userFriendlyExplanation.whatIsAPI && (
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">What is an API?</h4>
                              <p className="text-slate-700 leading-relaxed">{taskData.userFriendlyExplanation.whatIsAPI}</p>
                            </div>
                          )}
                          {taskData.userFriendlyExplanation.howItWorks && (
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">How It Works</h4>
                              <p className="text-slate-700 leading-relaxed">{taskData.userFriendlyExplanation.howItWorks}</p>
                            </div>
                          )}
                          {taskData.userFriendlyExplanation.whatYouNeed && (
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">What You Need</h4>
                              <p className="text-slate-700 leading-relaxed">{taskData.userFriendlyExplanation.whatYouNeed}</p>
                            </div>
                          )}
                          {taskData.userFriendlyExplanation.endpoints && Array.isArray(taskData.userFriendlyExplanation.endpoints) && (
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">Key Endpoints</h4>
                              <div className="space-y-3">
                                {taskData.userFriendlyExplanation.endpoints.map((endpoint: any, index: number) => (
                                  <div key={index} className="border border-slate-200 rounded-lg p-3">
                                    <h5 className="font-medium text-slate-900 mb-1">{endpoint.name}</h5>
                                    <p className="text-sm text-slate-600 mb-1">{endpoint.purpose}</p>
                                    <p className="text-xs text-slate-500">{endpoint.whatItDoes}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {taskData.userFriendlyExplanation.nextSteps && (
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">Next Steps</h4>
                              <p className="text-slate-700 leading-relaxed">{taskData.userFriendlyExplanation.nextSteps}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* API Education Section */}
                {taskData.automation && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      <span className="flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5 text-blue-600" />
                        <span>Automation Strategy</span>
                      </span>
                    </h3>
                    <div className="prose prose-slate max-w-none">
                      {typeof taskData.automation === 'string' ? (
                        <p className="text-slate-700 leading-relaxed">{taskData.automation}</p>
                      ) : (
                        <div className="space-y-4">
                          {taskData.automation.overview && (
                            <p className="text-slate-700 leading-relaxed">{taskData.automation.overview}</p>
                          )}
                          {taskData.automation.steps && Array.isArray(taskData.automation.steps) && (
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">Automation Steps:</h4>
                              <ol className="list-decimal list-inside space-y-2">
                                {taskData.automation.steps.map((step: string, index: number) => (
                                  <li key={index} className="text-slate-700">{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Implementation Section */}
                {taskData.implementation && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      <span className="flex items-center space-x-2">
                        <Code className="h-5 w-5 text-purple-600" />
                        <span>Implementation Plan</span>
                      </span>
                    </h3>
                    <div className="prose prose-slate max-w-none">
                      {typeof taskData.implementation === 'string' ? (
                        <p className="text-slate-700 leading-relaxed">{taskData.implementation}</p>
                      ) : (
                        <div className="space-y-4">
                          {taskData.implementation.overview && (
                            <p className="text-slate-700 leading-relaxed">{taskData.implementation.overview}</p>
                          )}
                          {taskData.implementation.steps && Array.isArray(taskData.implementation.steps) && (
                            <div>
                              <h4 className="font-medium text-slate-900 mb-2">Implementation Steps:</h4>
                              <ol className="list-decimal list-inside space-y-2">
                                {taskData.implementation.steps.map((step: string, index: number) => (
                                  <li key={index} className="text-slate-700">{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* API Endpoints Section */}
                {taskData.apiEndpoints && Array.isArray(taskData.apiEndpoints) && taskData.apiEndpoints.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      <span className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-green-600" />
                        <span>API Endpoints</span>
                      </span>
                    </h3>
                    <div className="space-y-4">
                      {taskData.apiEndpoints.map((endpoint: any, index: number) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900">{endpoint.name}</h4>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              {endpoint.method || 'GET'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{endpoint.description}</p>
                          <code className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded block">
                            {endpoint.url}
                          </code>
                          {endpoint.parameters && Object.keys(endpoint.parameters).length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-slate-700 mb-1">Parameters:</p>
                              <div className="text-xs text-slate-600">
                                {Object.entries(endpoint.parameters).map(([key, value]: [string, any]) => (
                                  <div key={key} className="flex justify-between">
                                    <span>{key}:</span>
                                    <span>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

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
                    <div className="space-y-4">
                      {taskHistory.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => loadTaskFromHistory(item)}
                          className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colours"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 mb-1">{item.taskName}</h4>
                              <p className="text-sm text-slate-600 mb-2 line-clamp-2">{item.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-slate-500">
                                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                <span>• {item.summary.timeSpent}</span>
                                <span>• {formatCurrency(item.summary.annualValue)}</span>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default input step
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
                  onClick={() => setShowHistory(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colours"
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              What task would you like to automate?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Describe any repetitive task and our AI will analyse it for automation opportunities, 
              suggest tools, and create a step-by-step implementation plan.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={(e) => {
              e.preventDefault();
              generateDirectAnalysis();
            }} className="space-y-6">
              
              <div>
                <label htmlFor="taskName" className="block text-sm font-medium text-slate-700 mb-2">
                  Task Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="taskName"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="e.g., Process customer invoices"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="taskDescription" className="block text-sm font-medium text-slate-700 mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="taskDescription"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Describe the step-by-step process, what systems you use, how long it takes, and any pain points..."
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="timeSpent" className="block text-sm font-medium text-slate-700 mb-2">
                    Time Spent (per occurrence)
                  </label>
                  <input
                    type="text"
                    id="timeSpent"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    placeholder="e.g., 30 minutes, 2 hours"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="software" className="block text-sm font-medium text-slate-700 mb-2">
                    Current Software/Tools
                  </label>
                  <input
                    type="text"
                    id="software"
                    value={software}
                    onChange={(e) => setSoftware(e.target.value)}
                    placeholder="e.g., Excel, Salesforce, Gmail"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={!taskName.trim() || !taskDescription.trim() || isAnalyzing}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colours"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Analysing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Analyse Task</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowBatchImport(true)}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colours"
                >
                  <Upload className="h-4 w-4" />
                  <span>Batch Import</span>
                </button>
              </div>
            </form>

            {/* Sample Tasks */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Or try a sample task:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleTasks.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => loadSampleTask(sample)}
                    className="p-4 text-left border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colours"
                  >
                    <h4 className="font-medium text-slate-900 mb-2">{sample.name}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">{sample.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

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
                  <div className="space-y-4">
                    {taskHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadTaskFromHistory(item)}
                        className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colours"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 mb-1">{item.taskName}</h4>
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{item.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                              <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                              <span>• {item.summary.timeSpent}</span>
                              <span>• {formatCurrency(item.summary.annualValue)}</span>
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

        {/* Batch Import Modal */}
        {showBatchImport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Batch Import Tasks</h3>
                  <button
                    onClick={() => setShowBatchImport(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-slate-600 mt-2">
                  Paste a list of tasks, processes, or workflow data. Our AI will extract and analyse the first task.
                </p>
              </div>
              <div className="p-6">
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste your task list, workflow data, or process documentation here..."
                  rows={10}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowBatchImport(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colours"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBatchImport}
                    disabled={!importText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colours"
                  >
                    Import & Analyse
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default TaskAnalysis; 