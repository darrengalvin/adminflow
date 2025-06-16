import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, Square, Clock, User, Tag, CheckCircle, AlertCircle, Loader, Zap, Info, Code, ExternalLink, Copy, Send, Eye, EyeOff } from 'lucide-react';
import { Workflow } from '../types';

interface WorkflowDetailsProps {
  workflow: Workflow;
  onBack: () => void;
  onExecute: () => void;
}

export function WorkflowDetails({ workflow, onBack, onExecute }: WorkflowDetailsProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [testingApi, setTestingApi] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});

  // Safe date formatting function
  const formatDate = (dateValue: any): string => {
    try {
      if (!dateValue) return 'Unknown';
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error, 'for value:', dateValue);
      return 'Invalid Date';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'running':
        return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <div className="h-5 w-5 border-2 border-gray-400 rounded-full" />;
    }
  };

  const getStepTypeDisplay = (type: string) => {
    switch (type) {
      case 'api':
        return { label: 'Automation', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🤖' };
      case 'ai':
        return { label: 'AI Processing', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '🧠' };
      case 'decision':
        return { label: 'Decision Point', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🤔' };
      case 'notification':
        return { label: 'Send Message', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '📧' };
      case 'document':
        return { label: 'Create Document', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '📄' };
      default:
        return { label: 'Task', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '⚙️' };
    }
  };

  const getSimpleStepDescription = (stepName: string, stepType: string) => {
    // Extract the main task from the step name
    const taskName = stepName.replace('Automate: ', '').toLowerCase();
    
    if (taskName.includes('insurance') && taskName.includes('claim')) {
      return 'Automatically processes insurance claims from start to finish - reads documents, extracts information, and updates your system.';
    }
    if (taskName.includes('email') && taskName.includes('template')) {
      return 'Creates and manages email templates automatically - updates content, personalises messages, and keeps everything organised.';
    }
    if (taskName.includes('invoice')) {
      return 'Handles invoice processing automatically - reads invoices, extracts data, and updates your accounting system.';
    }
    if (taskName.includes('customer') || taskName.includes('client')) {
      return 'Manages customer information automatically - updates records, sends communications, and tracks interactions.';
    }
    if (taskName.includes('document')) {
      return 'Processes documents automatically - reads content, extracts important information, and files everything properly.';
    }
    if (taskName.includes('appointment') || taskName.includes('scheduling')) {
      return 'Handles appointment scheduling automatically - checks availability, books slots, and sends confirmations.';
    }
    if (taskName.includes('payment') || taskName.includes('billing')) {
      return 'Manages payments and billing automatically - processes transactions, sends invoices, and tracks payments.';
    }
    
    // Default description
    return 'This automation handles the task automatically, saving you time and reducing manual work.';
  };

  const getRealisticDuration = (stepName: string) => {
    const taskName = stepName.replace('Automate: ', '').toLowerCase();
    
    if (taskName.includes('insurance') && taskName.includes('claim')) {
      return '2-3 weeks to set up';
    }
    if (taskName.includes('email') && taskName.includes('template')) {
      return '3-5 days to set up';
    }
    if (taskName.includes('invoice')) {
      return '1-2 weeks to set up';
    }
    if (taskName.includes('customer') || taskName.includes('client')) {
      return '1-2 weeks to set up';
    }
    if (taskName.includes('document')) {
      return '1-2 weeks to set up';
    }
    if (taskName.includes('appointment') || taskName.includes('scheduling')) {
      return '3-5 days to set up';
    }
    if (taskName.includes('payment') || taskName.includes('billing')) {
      return '1-2 weeks to set up';
    }
    
    return '1-2 weeks to set up';
  };

  const getWhenItRuns = (trigger: string) => {
    if (trigger === 'manual') return 'When you click the start button';
    if (trigger.includes('email')) return 'When an email arrives';
    if (trigger.includes('form')) return 'When someone submits a form';
    if (trigger.includes('schedule')) return 'At scheduled times';
    if (trigger.includes('file')) return 'When a file is uploaded';
    return 'When the trigger event happens';
  };

  // Get technical details from the step's AI suggestion
  const getStepTechnicalDetails = (step: any) => {
    // This would come from the AI analysis stored in the step
    // For now, we'll simulate realistic API data based on the step name
    const stepName = step.name.toLowerCase();
    
    if (stepName.includes('insurance') && stepName.includes('claim')) {
      return {
        apiEndpoints: [
          {
            name: "Submit Claim",
            url: "https://api.insuranceportal.com/v1/claims",
            method: "POST",
            purpose: "Submit new insurance claim with documents",
            authentication: "Bearer Token (OAuth 2.0)",
            requiredFields: ["policyNumber", "claimAmount", "incidentDate", "description", "documents"],
            samplePayload: {
              policyNumber: "POL-123456789",
              claimAmount: 2500.00,
              incidentDate: "2024-01-15",
              description: "Vehicle collision damage",
              documents: ["claim_form.pdf", "photos.zip"]
            }
          },
          {
            name: "Check Claim Status",
            url: "https://api.insuranceportal.com/v1/claims/{claimId}/status",
            method: "GET",
            purpose: "Get current status of submitted claim",
            authentication: "Bearer Token (OAuth 2.0)",
            requiredFields: ["claimId"],
            samplePayload: {
              claimId: "CLM-987654321"
            }
          }
        ],
        implementation: {
          steps: [
            "1. Register for API access at insurance portal developer console",
            "2. Obtain OAuth 2.0 credentials (client_id, client_secret)",
            "3. Implement authentication flow to get access token",
            "4. Set up document upload endpoint for claim attachments",
            "5. Create claim submission workflow with validation",
            "6. Add status checking and notification system"
          ],
          codeExample: `// Example: Submit Insurance Claim
const submitClaim = async (claimData) => {
  const response = await fetch('https://api.insuranceportal.com/v1/claims', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(claimData)
  });
  return response.json();
};`,
          documentation: "https://docs.insuranceportal.com/api/claims",
          estimatedTime: "2-3 weeks",
          difficulty: "Medium"
        }
      };
    }
    
    if (stepName.includes('email') && stepName.includes('template')) {
      return {
        apiEndpoints: [
          {
            name: "Create Email Template",
            url: "https://api.emailservice.com/v1/templates",
            method: "POST",
            purpose: "Create new email template with dynamic content",
            authentication: "API Key",
            requiredFields: ["name", "subject", "htmlContent", "variables"],
            samplePayload: {
              name: "Welcome Email",
              subject: "Welcome {{firstName}}!",
              htmlContent: "<h1>Welcome {{firstName}}!</h1><p>Thanks for joining {{companyName}}</p>",
              variables: ["firstName", "companyName"]
            }
          },
          {
            name: "Send Templated Email",
            url: "https://api.emailservice.com/v1/send",
            method: "POST",
            purpose: "Send email using template with personalized data",
            authentication: "API Key",
            requiredFields: ["templateId", "to", "variables"],
            samplePayload: {
              templateId: "tpl_123456",
              to: "customer@example.com",
              variables: {
                firstName: "John",
                companyName: "Acme Corp"
              }
            }
          }
        ],
        implementation: {
          steps: [
            "1. Sign up for email service API (SendGrid, Mailgun, etc.)",
            "2. Get API key from dashboard",
            "3. Create email templates with variable placeholders",
            "4. Set up trigger system (form submission, user action, etc.)",
            "5. Implement personalization logic",
            "6. Add delivery tracking and analytics"
          ],
          codeExample: `// Example: Send Personalized Email
const sendEmail = async (templateData) => {
  const response = await fetch('https://api.emailservice.com/v1/send', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(templateData)
  });
  return response.json();
};`,
          documentation: "https://docs.emailservice.com/templates",
          estimatedTime: "3-5 days",
          difficulty: "Easy"
        }
      };
    }
    
    // Default technical details
    return {
      apiEndpoints: [
        {
          name: "Main API Endpoint",
          url: "https://api.example.com/v1/automation",
          method: "POST",
          purpose: "Primary automation endpoint for this task",
          authentication: "API Key or OAuth 2.0",
          requiredFields: ["taskId", "data"],
          samplePayload: {
            taskId: "task_123",
            data: "Sample data for automation"
          }
        }
      ],
      implementation: {
        steps: [
          "1. Research specific API documentation for your software",
          "2. Obtain API credentials",
          "3. Set up authentication",
          "4. Implement automation logic",
          "5. Test with sample data",
          "6. Deploy and monitor"
        ],
        codeExample: `// Example API call
const automateTask = async (data) => {
  const response = await fetch('https://api.example.com/v1/automation', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};`,
        documentation: "Contact software provider for API documentation",
        estimatedTime: "1-2 weeks",
        difficulty: "Medium"
      }
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const testApiCall = async (endpoint: any) => {
    setTestingApi(endpoint.name);
    setApiResponse(null);
    
    // Simulate API call (in real implementation, this would make actual calls)
    setTimeout(() => {
      setApiResponse({
        status: 200,
        data: {
          success: true,
          message: "API call successful",
          id: "test_" + Date.now(),
          timestamp: new Date().toISOString()
        }
      });
      setTestingApi(null);
    }, 2000);
  };

  const toggleApiKeyVisibility = (endpointName: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [endpointName]: !prev[endpointName]
    }));
  };

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{workflow.name}</h1>
            <p className="text-gray-600 mt-1">{workflow.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onExecute}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg flex items-center space-x-3 transition-colors text-xl font-bold shadow-lg"
          >
            <Play className="h-6 w-6" />
            <span>TEST THIS WORKFLOW</span>
          </button>
        </div>
      </div>

      {/* What This Does - Big Clear Explanation */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Info className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">What This Workflow Does</h3>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">
          This workflow contains <strong>{workflow.steps.length} automated tasks</strong> that will run one after another. 
          Once you start it, everything happens automatically - no more manual work needed! 
          Click <strong>"TEST THIS WORKFLOW"</strong> above to see exactly how it works.
        </p>
      </div>

      {/* Simplified Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 font-bold mb-4 text-lg">Current Status</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`inline-flex px-4 py-2 rounded-full text-lg font-bold border-2 ${
                workflow.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                workflow.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                workflow.status === 'failed' ? 'bg-red-100 text-red-700 border-red-300' :
                'bg-gray-100 text-gray-700 border-gray-300'
              }`}>
                {workflow.status === 'draft' ? 'Ready to Start' : 
                 workflow.status === 'active' ? 'Currently Running' :
                 workflow.status === 'completed' ? 'Finished' :
                 workflow.status === 'failed' ? 'Had a Problem' : workflow.status}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{Math.round(workflow.progress)}%</div>
              <div className="text-gray-600">Complete</div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 font-bold mb-4 text-lg">Setup Time</h3>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.floor(workflow.estimatedDuration / 60)} hours
              </div>
              <div className="text-gray-600">to set up completely</div>
            </div>
            <div className="text-sm text-gray-600 text-center">
              Created on {formatDate(workflow.createdAt)}
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 font-bold mb-4 text-lg">How It Starts</h3>
          <div className="space-y-3">
            {workflow.triggers.map((trigger, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-blue-700 font-medium text-center">
                  {getWhenItRuns(trigger)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-bold mb-4 text-lg">Overall Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-6 mb-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center"
            style={{ width: `${workflow.progress}%` }}
          >
            <span className="text-white text-sm font-bold">{Math.round(workflow.progress)}%</span>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Not Started</span>
          <span>Half Done</span>
          <span>Completed</span>
        </div>
      </div>

      {/* Workflow Steps - Much Clearer with Technical Details */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-bold mb-4 text-xl">The Automated Tasks</h3>
        <p className="text-gray-600 text-lg mb-6">
          Here's what happens automatically when this workflow runs:
        </p>
        <div className="space-y-6">
          {workflow.steps.map((step, index) => {
            const stepDisplay = getStepTypeDisplay(step.type);
            const technicalDetails = getStepTechnicalDetails(step);
            const isExpanded = expandedStep === step.id;
            
            return (
              <div key={step.id} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-900">{step.name}</h4>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${stepDisplay.color} flex items-center space-x-1`}>
                          <span>{stepDisplay.icon}</span>
                          <span>{stepDisplay.label}</span>
                        </span>
                        {getStepStatusIcon(step.status)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                      {getSimpleStepDescription(step.name, step.type)}
                    </p>
                    
                    {/* What Happens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                        <div className="text-blue-600 font-bold mb-2 flex items-center space-x-2">
                          <span>⏱️</span>
                          <span>Setup Time</span>
                        </div>
                        <div className="text-gray-700 font-medium">{getRealisticDuration(step.name)}</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border-2 border-emerald-200">
                        <div className="text-emerald-600 font-bold mb-2 flex items-center space-x-2">
                          <span>🚀</span>
                          <span>When It Runs</span>
                        </div>
                        <div className="text-gray-700 font-medium">
                          {index === 0 ? getWhenItRuns(workflow.triggers[0] || 'manual') : 'After the previous task finishes'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Technical Implementation Button */}
                    <div className="mb-4">
                      <button
                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Code className="h-4 w-4" />
                        <span>{isExpanded ? 'Hide' : 'Show'} Technical Implementation</span>
                      </button>
                    </div>

                    {/* Technical Details - Expanded */}
                    {isExpanded && (
                      <div className="bg-gray-900 rounded-lg p-6 text-white space-y-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Code className="h-5 w-5 text-emerald-400" />
                          <h5 className="text-lg font-bold text-emerald-400">API Implementation Details</h5>
                        </div>

                        {/* API Endpoints */}
                        <div className="space-y-4">
                          <h6 className="text-emerald-400 font-bold">API Endpoints:</h6>
                          {technicalDetails.apiEndpoints.map((endpoint, idx) => (
                            <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <span className="text-emerald-400 font-bold">{endpoint.name}</span>
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    endpoint.method === 'POST' ? 'bg-blue-600' :
                                    endpoint.method === 'GET' ? 'bg-emerald-600' :
                                    endpoint.method === 'PUT' ? 'bg-amber-600' :
                                    'bg-gray-600'
                                  }`}>
                                    {endpoint.method}
                                  </span>
                                </div>
                                <button
                                  onClick={() => testApiCall(endpoint)}
                                  disabled={testingApi === endpoint.name}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 disabled:opacity-50"
                                >
                                  {testingApi === endpoint.name ? (
                                    <Loader className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Send className="h-3 w-3" />
                                  )}
                                  <span>Test</span>
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <span className="text-gray-400 text-sm">URL:</span>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <code className="bg-gray-700 px-2 py-1 rounded text-sm flex-1">{endpoint.url}</code>
                                    <button
                                      onClick={() => copyToClipboard(endpoint.url)}
                                      className="text-gray-400 hover:text-white"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div>
                                  <span className="text-gray-400 text-sm">Purpose:</span>
                                  <p className="text-gray-300 text-sm mt-1">{endpoint.purpose}</p>
                                </div>
                                
                                <div>
                                  <span className="text-gray-400 text-sm">Authentication:</span>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <code className="bg-gray-700 px-2 py-1 rounded text-sm">{endpoint.authentication}</code>
                                    <button
                                      onClick={() => toggleApiKeyVisibility(endpoint.name)}
                                      className="text-gray-400 hover:text-white"
                                    >
                                      {showApiKey[endpoint.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                  </div>
                                  {showApiKey[endpoint.name] && (
                                    <div className="mt-2 p-2 bg-yellow-900 border border-yellow-700 rounded">
                                      <p className="text-yellow-200 text-xs">
                                        🔑 <strong>API Key Example:</strong> sk-1234567890abcdef...
                                        <br />
                                        💡 Get your real API key from your software's developer console
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                <div>
                                  <span className="text-gray-400 text-sm">Required Fields:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {endpoint.requiredFields.map((field, fieldIdx) => (
                                      <span key={fieldIdx} className="bg-blue-600 px-2 py-1 rounded text-xs">{field}</span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <span className="text-gray-400 text-sm">Sample Payload:</span>
                                  <div className="flex items-start space-x-2 mt-1">
                                    <pre className="bg-gray-700 p-2 rounded text-xs overflow-x-auto flex-1">
                                      {JSON.stringify(endpoint.samplePayload, null, 2)}
                                    </pre>
                                    <button
                                      onClick={() => copyToClipboard(JSON.stringify(endpoint.samplePayload, null, 2))}
                                      className="text-gray-400 hover:text-white mt-2"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* API Test Response */}
                              {apiResponse && testingApi === null && (
                                <div className="mt-4 p-3 bg-emerald-900 border border-emerald-700 rounded">
                                  <div className="text-emerald-400 font-bold text-sm mb-2">✅ Test Response:</div>
                                  <pre className="text-emerald-200 text-xs overflow-x-auto">
                                    {JSON.stringify(apiResponse, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Implementation Steps */}
                        <div>
                          <h6 className="text-emerald-400 font-bold mb-3">Implementation Steps:</h6>
                          <div className="space-y-2">
                            {technicalDetails.implementation.steps.map((step, idx) => (
                              <div key={idx} className="flex items-start space-x-2">
                                <span className="text-emerald-400 text-sm mt-1">•</span>
                                <span className="text-gray-300 text-sm">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Code Example */}
                        <div>
                          <h6 className="text-emerald-400 font-bold mb-3">Code Example:</h6>
                          <div className="flex items-start space-x-2">
                            <pre className="bg-gray-800 p-4 rounded text-sm overflow-x-auto flex-1 border border-gray-700">
                              <code>{technicalDetails.implementation.codeExample}</code>
                            </pre>
                            <button
                              onClick={() => copyToClipboard(technicalDetails.implementation.codeExample)}
                              className="text-gray-400 hover:text-white mt-4"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Documentation Link */}
                        <div className="flex items-center justify-between p-3 bg-blue-900 border border-blue-700 rounded">
                          <div>
                            <span className="text-blue-400 font-bold text-sm">📚 Documentation:</span>
                            <p className="text-blue-200 text-sm">{technicalDetails.implementation.documentation}</p>
                          </div>
                          <a
                            href={technicalDetails.implementation.documentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>

                        {/* Implementation Info */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-amber-900 border border-amber-700 rounded">
                            <span className="text-amber-400 font-bold text-sm">⏱️ Estimated Time:</span>
                            <p className="text-amber-200 text-sm">{technicalDetails.implementation.estimatedTime}</p>
                          </div>
                          <div className="p-3 bg-purple-900 border border-purple-700 rounded">
                            <span className="text-purple-400 font-bold text-sm">📊 Difficulty:</span>
                            <p className="text-purple-200 text-sm">{technicalDetails.implementation.difficulty}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* What You Get */}
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <div className="text-emerald-700 font-bold mb-2 flex items-center space-x-2">
                        <span>✅</span>
                        <span>What You Get</span>
                      </div>
                      <div className="text-emerald-700">
                        No more manual work for this task - it all happens automatically!
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Connection arrow to next step */}
                {index < workflow.steps.length - 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex flex-col items-center">
                      <div className="w-px h-6 bg-gray-300"></div>
                      <div className="text-gray-400 text-sm">then</div>
                      <div className="w-px h-6 bg-gray-300"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-emerald-700 text-lg font-bold mb-2">
              Ready to see this in action?
            </p>
            <p className="text-gray-700 mb-4">
              Click the big green button at the top to test this workflow and see exactly how it works!
            </p>
            <button
              onClick={onExecute}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              TEST THIS WORKFLOW
            </button>
          </div>
        </div>
      </div>

      {/* Tags - Simplified */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-bold mb-4 text-lg">Related To</h3>
        <div className="flex flex-wrap gap-3">
          {workflow.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border-2 border-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}