import React, { useState, useEffect } from 'react';
import { Task, Workflow, WorkflowStep } from '../types';
import { generateTaskAnalysisPDF } from '../utils/pdfGenerator';
import claudeApi from '../services/claudeApi';
import { useNotifications, NotificationManager } from './CustomNotification';
import { APITester } from './APITester';
import { PostmanAPITester } from './PostmanAPITester';
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
  Globe,
  Search,
  ExternalLink,
  TestTube
} from 'lucide-react';

interface TaskAnalysisProps {
  onBack?: () => void;
  onAddWorkflow?: (workflow: Workflow) => void;
  onNavigate?: (section: string) => void;
}

const TaskAnalysis: React.FC<TaskAnalysisProps> = ({ onBack, onAddWorkflow, onNavigate }) => {
  // Data migration function to handle old task data format
  const migrateTaskDataFormat = (oldData: any) => {
    if (!oldData) return oldData;
    
    // If it already has the new format, return as-is
    if (oldData.completeSolution || oldData.researchFindings) {
      return oldData;
    }
    
    // If it has the old format, migrate it
    if (oldData.automationSolution) {
      console.log('🔄 Migrating old data format to new format');
      
      return {
        ...oldData,
        // Migrate automationSolution to completeSolution
        completeSolution: {
          automationArchitecture: {
            triggerSource: oldData.automationSolution.architecture?.dataSource || '📨 Email monitoring or form submission',
            aiDataExtraction: oldData.automationSolution.architecture?.aiProcessing || '🤖 AI extracts structured data',
            realTimeAPIs: oldData.automationSolution.architecture?.apiIntegration || '🔗 Direct API integration',
            smartErrorHandling: oldData.automationSolution.architecture?.errorHandling || '🛡️ Automatic error handling'
          },
          liveImplementation: {
            workingCode: oldData.automationSolution.sampleImplementation?.codeExample || '// Code example not available in legacy format',
            verifiedAPIs: oldData.automationSolution.sampleImplementation?.apiEndpoints || []
          }
        },
        // Add research findings if missing
        researchFindings: {
          apiAvailability: 'Legacy data - API availability not verified',
          authenticationMethod: 'Legacy data - Authentication method not specified',
          rateLimits: 'Legacy data - Rate limits not specified',
          pricing: 'Legacy data - Pricing not specified',
          documentationUrl: null
        },
        // Keep manual process breakdown if it exists
        manualProcessBreakdown: oldData.manualProcessBreakdown || {
          exactStepsNow: oldData.automationSolution.automationFlow || []
        }
      };
    }
    
    // Return original data if no migration needed
    return oldData;
  };

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

  // Generate API test requests from automation analysis
  const generateAPITestRequests = (taskData: any) => {
    const requests = [];
    
    console.log('🔍 Generating API requests from taskData:', taskData);
    
    // Look for APIs in multiple places from Claude's response
    const apiSources = [
      taskData.completeSolution?.liveImplementation?.verifiedAPIs || [],
      taskData.liveAPITesting?.testableEndpoints || [],
      taskData.apiEndpoints || []
    ];
    
    let foundAPIs = false;
    
    // Process APIs from all sources
    apiSources.forEach((apiList, sourceIndex) => {
      if (Array.isArray(apiList) && apiList.length > 0) {
        console.log(`✅ Found ${apiList.length} APIs in source ${sourceIndex + 1}:`, apiList);
        foundAPIs = true;
        
                 apiList.forEach((api: any, index: number) => {
           const method = api.method || 'GET';
           const endpoint = api.endpoint || api.url || 'https://api.example.com/endpoint';
           
           // Use AI-provided sample data or create intelligent fallbacks
           let requestBody = '';
           if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
             if (api.sampleRequestBody) {
               // Use the AI-provided sample request body
               requestBody = JSON.stringify(api.sampleRequestBody, null, 2);
             } else if (api.sampleData) {
               requestBody = typeof api.sampleData === 'string' ? api.sampleData : JSON.stringify(api.sampleData, null, 2);
             } else {
               // Intelligent fallback based on endpoint and task
               if (endpoint.includes('opportunities') || endpoint.includes('deals')) {
                 requestBody = JSON.stringify({
                   "contactId": "contact_6707c4c4e7b4f3001a8b4567",
                   "name": `${new Date().toLocaleDateString()} | ${taskData.taskName || 'Demo Opportunity'} | 3 people`,
                   "pipelineId": "pipeline_6707c4c4e7b4f3001a8b4568",
                   "pipelineStageId": "stage_6707c4c4e7b4f3001a8b4569", 
                   "status": "open",
                   "monetaryValue": 5000,
                   "source": "api-test",
                   "notes": `Created via ${taskData.taskName || 'automation'} - ${taskData.description || 'API testing'}`
                 }, null, 2);
               } else if (endpoint.includes('contacts')) {
                 requestBody = JSON.stringify({
                   "firstName": "Demo",
                   "lastName": "Customer",
                   "email": "demo@example.com",
                   "phone": "+1234567890",
                   "source": "api-test",
                   "customFields": {
                     "task_source": taskData.taskName || "API Test"
                   }
                 }, null, 2);
               } else {
                 requestBody = JSON.stringify({
                   "name": taskData.taskName || "Test Request",
                   "description": taskData.description || "API test request",
                   "automated": true,
                   "timestamp": new Date().toISOString(),
                   "source": "api-testing-lab"
                 }, null, 2);
               }
             }
           }
           
           // Use AI-provided headers or intelligent defaults
           let headers = [];
           if (api.requiredHeaders) {
             // Use AI-provided required headers
             headers = Object.entries(api.requiredHeaders).map(([key, value]) => ({
               key,
               value: value as string,
               enabled: true
             }));
           } else {
             // Default headers
             headers = [
               { key: 'Authorization', value: 'Bearer YOUR_GHL_API_KEY', enabled: true },
               { key: 'Content-Type', value: 'application/json', enabled: true }
             ];
             
             // Add version header for GoHighLevel
             if (endpoint.includes('gohighlevel.com') || endpoint.includes('rest.gohighlevel')) {
               headers.push({ key: 'Version', value: '2021-07-28', enabled: true });
             }
           }
           
           // Use AI-provided params or intelligent defaults  
           let params = [];
           if (method === 'GET') {
             if (api.sampleParams) {
               params = Object.entries(api.sampleParams).map(([key, value]) => ({
                 key,
                 value: value as string,
                 enabled: true
               }));
             } else {
               params = [
                 { key: 'limit', value: '20', enabled: true },
                 { key: 'locationId', value: 'location_6707c4c4e7b4f3001a8b456b', enabled: true }
               ];
             }
           }
           
           requests.push({
             id: `api-${sourceIndex}-${index}`,
             name: api.name || `${method} ${endpoint.split('/').pop()}`,
             method: method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
             url: endpoint,
             headers,
             params,
             body: requestBody,
             bodyType: method === 'GET' ? 'none' : 'json'
           });
        });
      }
    });

    // Add intelligent fallback requests if no APIs found from Claude
    if (!foundAPIs) {
      console.log('⚠️ No APIs found from Claude response, generating intelligent fallbacks');
    }
    
    // Detect software from multiple sources
    const software = taskData.researchFindings?.apiAvailability?.includes('GoHighLevel') ? 'GoHighLevel' : 
                    taskData.currentProcess?.software || 
                    taskData.software || 
                    taskData.taskName?.includes('GHL') ? 'GoHighLevel' :
                    taskData.description?.toLowerCase().includes('gohighlevel') ? 'GoHighLevel' :
                    'API';
    
    console.log('🎯 Detected software:', software);
    
    // GoHighLevel specific requests (always add these for GHL tasks)
    if (software.includes('GoHighLevel') || software.includes('GHL') || !foundAPIs) {
      requests.push({
        id: 'ghl-opportunities',
        name: 'GoHighLevel - Create Opportunity (API 2.0)',
        method: 'POST',
        url: 'https://services.leadconnectorhq.com/opportunities/',
        headers: [
          { key: 'Authorization', value: 'Bearer YOUR_GHL_JWT_TOKEN', enabled: true },
          { key: 'Content-Type', value: 'application/json', enabled: true },
          { key: 'Version', value: '2021-07-28', enabled: true }
        ],
        params: [
          { key: 'locationId', value: 'qlmxFY68hrnVjyo8cNQC', enabled: true }
        ],
        body: JSON.stringify({
          "title": `${new Date().toLocaleDateString()} | ${taskData.taskName || 'Automation Test'} | 1 person`,
          "pipelineId": "pipeline_6707c4c4e7b4f3001a8b4567",
          "pipelineStageId": "stage_6707c4c4e7b4f3001a8b4568",
          "status": "open",
          "monetaryValue": 5000,
          "contactId": "contact_6707c4c4e7b4f3001a8b4569",
          "source": "automation",
          "notes": `Created via ${taskData.taskName || 'automation'} - API testing with correct API 2.0 format`
        }, null, 2),
        bodyType: 'json'
      });
      
      requests.push({
        id: 'ghl-contacts',
        name: 'GoHighLevel - Get Contacts (API 2.0)',
        method: 'GET',
        url: 'https://services.leadconnectorhq.com/contacts/',
        headers: [
          { key: 'Authorization', value: 'Bearer YOUR_GHL_JWT_TOKEN', enabled: true },
          { key: 'Version', value: '2021-07-28', enabled: true }
        ],
        params: [
          { key: 'limit', value: '20', enabled: true },
          { key: 'locationId', value: 'qlmxFY68hrnVjyo8cNQC', enabled: true }
        ],
        body: '',
        bodyType: 'none'
      });
      
      // Add alternative endpoint tests
      requests.push({
        id: 'ghl-test-locations',
        name: 'GoHighLevel - Test Locations Endpoint',
        method: 'GET',
        url: 'https://services.leadconnectorhq.com/locations/',
        headers: [
          { key: 'Authorization', value: 'Bearer YOUR_GHL_JWT_TOKEN', enabled: true },
          { key: 'Version', value: '2021-07-28', enabled: true }
        ],
        params: [],
        body: '',
        bodyType: 'none'
      });
      
      requests.push({
        id: 'ghl-test-pipelines',
        name: 'GoHighLevel - Test Pipelines Endpoint',
        method: 'GET',
        url: 'https://services.leadconnectorhq.com/opportunities/pipelines',
        headers: [
          { key: 'Authorization', value: 'Bearer YOUR_GHL_JWT_TOKEN', enabled: true },
          { key: 'Version', value: '2021-07-28', enabled: true }
        ],
        params: [
          { key: 'locationId', value: 'qlmxFY68hrnVjyo8cNQC', enabled: true }
        ],
        body: '',
        bodyType: 'none'
      });
    } else {
      // Generic API requests
      requests.push({
        id: 'sample-1',
        name: `${software} API Test`,
        method: 'GET',
        url: `https://api.${software.toLowerCase().replace(/\s+/g, '')}.com/v1/data`,
        headers: [
          { key: 'Authorization', value: 'Bearer YOUR_API_KEY', enabled: true },
          { key: 'Content-Type', value: 'application/json', enabled: true }
        ],
        params: [
          { key: 'limit', value: '10', enabled: true },
          { key: 'format', value: 'json', enabled: true }
        ],
        body: '',
        bodyType: 'none'
      });
      
      requests.push({
        id: 'sample-2',
        name: `Create ${taskData.taskName || 'Item'}`,
        method: 'POST',
        url: `https://api.${software.toLowerCase().replace(/\s+/g, '')}.com/v1/create`,
        headers: [
          { key: 'Authorization', value: 'Bearer YOUR_API_KEY', enabled: true },
          { key: 'Content-Type', value: 'application/json', enabled: true }
        ],
        params: [],
        body: JSON.stringify({
          "name": taskData.taskName || "New Item",
          "description": taskData.description || "Created via automation",
          "automated": true,
          "timestamp": new Date().toISOString()
        }, null, 2),
        bodyType: 'json'
      });
    }

    console.log('🚀 Generated API requests:', requests);
    return requests;
  };

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
                
                // Migrate old data structure to new format
                const migratedTaskData = migrateTaskDataFormat(sessionData.taskData);
                
                setTaskData(migratedTaskData);
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
              console.log('🧹 Clearing problematic session data');
              localStorage.removeItem('currentTaskSession');
              localStorage.removeItem('taskAnalysisHistory'); // Clear history too if it's causing issues
              showError('❌ Cleared corrupted session data. Please try your analysis again.');
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
    // Safely extract values and ensure correct types
    const timeSpent = taskData.currentProcess?.timePerWeek;
    const software = taskData.currentProcess?.software;
    const annualValue = taskData.impact?.valuePerYear;
    const monthlyHours = taskData.impact?.monthlyHoursSaved;
    
    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      taskName: taskData.taskName || 'Unnamed Task',
      description: taskData.description || '',
      analysis: taskData,
      summary: {
        timeSpent: typeof timeSpent === 'string' ? timeSpent : 'Unknown',
        software: typeof software === 'string' ? software : 'Unknown',
        annualValue: typeof annualValue === 'number' ? annualValue : (typeof annualValue === 'string' ? parseFloat(annualValue.replace(/[^0-9.-]/g, '')) || 0 : 0),
        monthlyHours: typeof monthlyHours === 'number' ? monthlyHours : (typeof monthlyHours === 'string' ? parseFloat(monthlyHours.replace(/[^0-9.-]/g, '')) || 0 : 0)
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

      // Migrate old data format to new format
      const migratedAnalysis = migrateTaskDataFormat(historyItem.analysis);
      
      setTaskData(migratedAnalysis);
      setTaskName(historyItem.taskName || 'Unnamed Task');
      setTaskDescription(historyItem.description || '');
      
      const finalTask = {
        name: historyItem.taskName || 'Unnamed Task',
        description: historyItem.description || '',
        software: migratedAnalysis?.currentProcess?.software || 'Unknown',
        timeSpent: migratedAnalysis?.currentProcess?.timePerWeek || 'Unknown',
        aiSuggestion: migratedAnalysis
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
      // Load existing workflows using the same key as WorkflowDesigner
      const workflowsData = JSON.parse(localStorage.getItem('automationWorkflows') || '{}');
      const workflows = Object.values(workflowsData) as Workflow[];
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

      // Save to workflows in localStorage using the same key as WorkflowDesigner
      const existingWorkflows = JSON.parse(localStorage.getItem('automationWorkflows') || '{}');
      existingWorkflows[workflow.id] = workflow;
      localStorage.setItem('automationWorkflows', JSON.stringify(existingWorkflows));

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

      // Update workflows in localStorage using the same key as WorkflowDesigner
      const allWorkflows = JSON.parse(localStorage.getItem('automationWorkflows') || '{}');
      allWorkflows[updatedWorkflow.id] = updatedWorkflow;
      localStorage.setItem('automationWorkflows', JSON.stringify(allWorkflows));

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
                {/* AI Research Results Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Search className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">🔍 AI Research Complete!</h3>
                      <p className="text-slate-600">Found working automation solution with real APIs</p>
                    </div>
                  </div>
                  
                  {taskData.researchFindings && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-green-900 mb-3 flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Verified API Research</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-green-800">API Status:</span>
                          <p className="text-green-700">{taskData.researchFindings.apiAvailability}</p>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Authentication:</span>
                          <p className="text-green-700">{taskData.researchFindings.authenticationMethod}</p>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Rate Limits:</span>
                          <p className="text-green-700">{taskData.researchFindings.rateLimits}</p>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Pricing:</span>
                          <p className="text-green-700">{taskData.researchFindings.pricing}</p>
                        </div>
                      </div>
                      {taskData.researchFindings.documentationUrl && (
                        <div className="mt-3">
                          <a 
                            href={taskData.researchFindings.documentationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View Official API Documentation</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {taskData.manualProcessBreakdown && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-3">📋 Current Manual Process Breakdown</h4>
                      <div className="space-y-3">
                        <p><strong>System:</strong> {taskData.manualProcessBreakdown.currentSystem}</p>
                        <p><strong>Time Wasted:</strong> {taskData.manualProcessBreakdown.timeWasted}</p>
                        {taskData.manualProcessBreakdown.exactStepsNow && (
                          <div>
                            <p className="font-medium text-slate-700 mb-2">What you do manually now:</p>
                            <ul className="space-y-1 text-sm text-slate-600">
                              {taskData.manualProcessBreakdown.exactStepsNow.map((step: string, index: number) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Research Findings Section */}
                {taskData.researchFindings && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      <span className="flex items-center space-x-2">
                        <Search className="h-5 w-5 text-blue-600" />
                        <span>🔍 API Research Results</span>
                      </span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">API Availability</h4>
                        <p className="text-slate-700 text-sm">{taskData.researchFindings.apiAvailability}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Authentication</h4>
                        <p className="text-slate-700 text-sm">{taskData.researchFindings.authenticationMethod}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Rate Limits</h4>
                        <p className="text-slate-700 text-sm">{taskData.researchFindings.rateLimits}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Pricing</h4>
                        <p className="text-slate-700 text-sm">{taskData.researchFindings.pricing}</p>
                      </div>
                    </div>
                    
                    {taskData.researchFindings.documentationUrl && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <a href={taskData.researchFindings.documentationUrl} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Official API Documentation
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Working Code Solution Section */}
                {taskData.completeSolution && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      <span className="flex items-center space-x-2">
                        <Code className="h-5 w-5 text-purple-600" />
                        <span>🚀 Production-Ready Code Solution</span>
                      </span>
                    </h3>
                    
                    {taskData.completeSolution?.automationArchitecture && (
                      <div className="mb-6">
                        <h4 className="font-medium text-slate-900 mb-3">Architecture Overview</h4>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-slate-700">Trigger Source:</span>
                              <p className="text-slate-600">{taskData.completeSolution.automationArchitecture.triggerSource}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">AI Processing:</span>
                              <p className="text-slate-600">{taskData.completeSolution.automationArchitecture.aiDataExtraction}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">API Integration:</span>
                              <p className="text-slate-600">{taskData.completeSolution.automationArchitecture.realTimeAPIs}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Error Handling:</span>
                              <p className="text-slate-600">{taskData.completeSolution.automationArchitecture.smartErrorHandling}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {taskData.manualProcessBreakdown?.exactStepsNow && Array.isArray(taskData.manualProcessBreakdown.exactStepsNow) && (
                      <div className="mb-6">
                        <h4 className="font-medium text-slate-900 mb-3">Current Manual Process</h4>
                        <ol className="list-decimal list-inside space-y-2">
                          {taskData.manualProcessBreakdown.exactStepsNow.map((step: string, index: number) => (
                            <li key={index} className="text-slate-700">{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {taskData.completeSolution?.liveImplementation && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-slate-900">Working Code Implementation</h4>
                        {taskData.completeSolution.liveImplementation.workingCode && (
                          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-sm">
                              <code>{taskData.completeSolution.liveImplementation.workingCode}</code>
                            </pre>
                          </div>
                        )}
                        
                        {taskData.completeSolution.liveImplementation.verifiedAPIs && Array.isArray(taskData.completeSolution.liveImplementation.verifiedAPIs) && (
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Verified API Endpoints</h5>
                            <div className="space-y-3">
                              {taskData.completeSolution.liveImplementation.verifiedAPIs.map((endpoint: any, index: number) => (
                                <div key={index} className="border border-slate-200 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-medium text-slate-900">{endpoint.name || 'API Endpoint'}</h6>
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                      {endpoint.method || 'GET'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600 mb-2">{endpoint.purpose}</p>
                                  <code className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded block">
                                    {endpoint.endpoint}
                                  </code>
                                  {endpoint.documentation && (
                                    <a href={endpoint.documentation} target="_blank" rel="noopener noreferrer" 
                                       className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-2">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Documentation
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Business Impact Section */}
                {taskData.businessImpact && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      <span className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-green-600" />
                        <span>Business Impact Analysis</span>
                      </span>
                    </h3>
                    
                    {taskData.businessImpact.timeAnalysis && (
                      <div className="mb-6">
                        <h4 className="font-medium text-slate-900 mb-3">Time Savings</h4>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-green-700">
                                {taskData.businessImpact.timeAnalysis.timeSavingsPercent || '95%'}
                              </p>
                              <p className="text-sm text-green-600">Time Reduction</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-700">
                                {taskData.businessImpact.timeAnalysis.monthlyHoursSaved || 0}
                              </p>
                              <p className="text-sm text-green-600">Hours/Month</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-700">
                                {taskData.businessImpact.timeAnalysis.annualHoursSaved || 0}
                              </p>
                              <p className="text-sm text-green-600">Hours/Year</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-700">
                                {taskData.businessImpact.timeAnalysis.automatedTime || '15 sec'}
                              </p>
                              <p className="text-sm text-green-600">New Process Time</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {taskData.businessImpact.financialImpact && (
                      <div className="mb-6">
                        <h4 className="font-medium text-slate-900 mb-3">Financial Impact</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-700">
                                £{taskData.businessImpact.financialImpact.annualValue?.toLocaleString() || '0'}
                              </p>
                              <p className="text-sm text-blue-600">Annual Savings</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-700">
                                £{taskData.businessImpact.financialImpact.implementationCost?.toLocaleString() || '2,500'}
                              </p>
                              <p className="text-sm text-blue-600">Implementation Cost</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-700">
                                {taskData.businessImpact.financialImpact.roiTimeline || '6 months'}
                              </p>
                              <p className="text-sm text-blue-600">ROI Timeline</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Implementation Roadmap */}
                {taskData.implementationRoadmap && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      <span className="flex items-center space-x-2">
                        <Code className="h-5 w-5 text-purple-600" />
                        <span>Implementation Roadmap</span>
                      </span>
                    </h3>
                    
                    <div className="space-y-6">
                      {taskData.implementationRoadmap.phase1 && (
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">{taskData.implementationRoadmap.phase1.title}</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 ml-4">
                            {taskData.implementationRoadmap.phase1.tasks?.map((task: string, index: number) => (
                              <li key={index}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {taskData.implementationRoadmap.phase2 && (
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">{taskData.implementationRoadmap.phase2.title}</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 ml-4">
                            {taskData.implementationRoadmap.phase2.tasks?.map((task: string, index: number) => (
                              <li key={index}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {taskData.implementationRoadmap.phase3 && (
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">{taskData.implementationRoadmap.phase3.title}</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 ml-4">
                            {taskData.implementationRoadmap.phase3.tasks?.map((task: string, index: number) => (
                              <li key={index}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {taskData.implementationRoadmap.requiredResources && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                          <h4 className="font-medium text-slate-900 mb-2">Required Resources</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-slate-700">Technical:</span>
                              <p className="text-slate-600">{taskData.implementationRoadmap.requiredResources.technical}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Access:</span>
                              <p className="text-slate-600">{taskData.implementationRoadmap.requiredResources.access}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Time:</span>
                              <p className="text-slate-600">{taskData.implementationRoadmap.requiredResources.timeEstimate}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Budget:</span>
                              <p className="text-slate-600">{taskData.implementationRoadmap.requiredResources.budget}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* API Testing Lab - Always Show */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    <span className="flex items-center space-x-2">
                      <TestTube className="h-5 w-5 text-purple-600" />
                      <span>🧪 API Testing Lab</span>
                    </span>
                  </h3>
                  <p className="text-slate-600 mb-6">Test the APIs from your automation solution with this Postman-like interface.</p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-700">
                      🔍 Debug: Generated {generateAPITestRequests(taskData).length} API requests
                    </p>
                  </div>
                  
                  <PostmanAPITester 
                    initialRequests={generateAPITestRequests(taskData)}
                  />
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
                              <span>• {typeof item.summary.timeSpent === 'string' ? item.summary.timeSpent : 'Unknown'}</span>
                              <span>• {formatCurrency(typeof item.summary.annualValue === 'number' ? item.summary.annualValue : 0)}</span>
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
                              <span>• {typeof item.summary.timeSpent === 'string' ? item.summary.timeSpent : 'Unknown'}</span>
                              <span>• {formatCurrency(typeof item.summary.annualValue === 'number' ? item.summary.annualValue : 0)}</span>
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