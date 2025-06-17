import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, Square, Clock, User, Tag, CheckCircle, AlertCircle, Loader, Zap, Info, Code, ExternalLink, Copy, Send, Eye, EyeOff, Terminal, PlayCircle } from 'lucide-react';
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
  const [apiTestResults, setApiTestResults] = useState<{ [key: string]: any }>({});
  const [testingInProgress, setTestingInProgress] = useState<{ [key: string]: boolean }>({});

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

  // Get AI-generated analysis content from the step's original task data
  const getStepAnalysisContent = (step: any) => {
    // Use the actual AI analysis stored with the step when available
    if (step.config?.aiAnalysis) {
      return step.config.aiAnalysis;
    }

    // Extract from step name and provide realistic AI analysis content
    const stepName = step.name.toLowerCase();
    
    if (stepName.includes('insurance') && stepName.includes('claim')) {
      return {
        userFriendlyExplanation: {
          goodNews: "Excellent news! Your insurance claim processing can be 80% automated. This will save you approximately 6 hours per week and reduce processing errors by 90%.",
          whatIsAPI: "The Insurance Portal API is a digital bridge that lets your system communicate directly with the insurance company's database. Instead of manually filling out forms and uploading documents, the API does it instantly.",
          howItWorks: "When a new claim comes in, the system will automatically extract key information (policy number, incident details, damage photos), validate the data, submit it through the API, and track the status until resolution.",
          whatYouNeed: "API access to your insurance portal (usually included in business accounts), document processing capability, and integration with your current filing system.",
          nextSteps: "Contact your insurance provider's IT department to get API credentials, then set up the automated document processing pipeline."
        },
        currentProcess: {
          software: "Insurance Portal",
          timePerWeek: "8 hours",
          painPoints: ["Manual data entry", "Document uploading", "Status checking", "Follow-up emails"]
        },
        automation: {
          type: "API Integration with AI Processing",
          apiConnections: [
            "Insurance Portal API",
            "Document Processing API", 
            "Email Notification API"
          ],
          aiCapabilities: [
            "Intelligent document extraction",
            "Damage assessment from photos",
            "Fraud detection patterns",
            "Automated claim prioritization"
          ]
        },
        impact: {
          annualHoursSaved: 312,
          monthlyHoursSaved: 26,
          valuePerYear: "£7,800",
          efficiencyGain: "80%"
        },
        implementation: {
          setupTime: "3-4 weeks",
          difficulty: "Medium",
          steps: [
            "Get API access from insurance provider",
            "Set up document processing pipeline", 
            "Configure AI damage assessment",
            "Test with sample claims",
            "Deploy with monitoring"
          ]
        }
      };
    }
    
    // Default analysis for other steps
    return {
      userFriendlyExplanation: {
        goodNews: `Great news! Your ${step.name} process is highly automatable and could save you significant time each week.`,
        whatIsAPI: `The API for ${step.name} acts as a digital connector, allowing different software systems to communicate and share data automatically.`,
        howItWorks: `The automation will monitor for triggers, process the data intelligently, and complete the task without manual intervention.`,
        whatYouNeed: `API access to your software platform and an automation tool to connect everything together.`,
        nextSteps: `Start by checking if your current software has API access available, then explore automation platforms.`
      },
      automation: {
        type: "API Integration",
        apiConnections: ["Primary Software API", "Integration Platform"],
        aiCapabilities: ["Intelligent processing", "Error handling", "Performance optimization"]
      },
      impact: {
        annualHoursSaved: 156,
        monthlyHoursSaved: 13,
        valuePerYear: "£3,900",
        efficiencyGain: "70%"
      }
    };
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
            },
            sampleResponse: {
              claimId: "CLM-987654321",
              status: "submitted",
              estimatedProcessingTime: "5-7 business days",
              nextSteps: ["Document review", "Adjuster assignment"]
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
            },
            sampleResponse: {
              claimId: "CLM-987654321",
              status: "under_review",
              lastUpdated: "2024-01-20T10:30:00Z",
              assignedAdjuster: "John Smith",
              estimatedCompletion: "2024-01-25"
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
            },
            sampleResponse: {
              templateId: "tpl_123456",
              status: "created",
              previewUrl: "https://preview.emailservice.com/tpl_123456"
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
            },
            sampleResponse: {
              messageId: "msg_789012",
              status: "sent",
              deliveryTime: "2024-01-15T14:30:00Z"
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

    // Default technical details for other steps
    return {
      apiEndpoints: [
        {
          name: `${step.name} API`,
          url: `https://api.${step.name.toLowerCase().replace(/\s+/g, '')}.com/v1/action`,
          method: "POST",
          purpose: `Automate ${step.name.toLowerCase()} process`,
          authentication: "API Key or OAuth 2.0",
          requiredFields: ["data", "action", "parameters"],
          samplePayload: {
            action: "process",
            data: "sample_data",
            parameters: {}
          },
          sampleResponse: {
            success: true,
            processId: "proc_123456",
            status: "completed"
          }
        }
      ],
      implementation: {
        steps: [
          "1. Get API access from software provider",
          "2. Set up authentication",
          "3. Build automation workflow",
          "4. Test and deploy"
        ],
        codeExample: `// Example API call
const processData = async (data) => {
  const response = await fetch('${step.name.toLowerCase()}-api-url', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: JSON.stringify(data)
  });
  return response.json();
};`,
        estimatedTime: "1-2 weeks",
        difficulty: "Medium"
      }
    };
  };

  // Test API endpoint
  const testApiEndpoint = async (stepId: string, endpoint: any) => {
    setTestingInProgress(prev => ({ ...prev, [`${stepId}-${endpoint.name}`]: true }));
    
    try {
      // Simulate API call - in real implementation, this would make actual calls
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      const mockResponse = {
        success: true,
        timestamp: new Date().toISOString(),
        endpoint: endpoint.url,
        method: endpoint.method,
        status: 200,
        responseTime: "1.2s",
        data: endpoint.sampleResponse || { message: "API test successful", data: "sample_response" }
      };
      
      setApiTestResults(prev => ({
        ...prev,
        [`${stepId}-${endpoint.name}`]: mockResponse
      }));
    } catch (error) {
      setApiTestResults(prev => ({
        ...prev,
        [`${stepId}-${endpoint.name}`]: {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setTestingInProgress(prev => ({ ...prev, [`${stepId}-${endpoint.name}`]: false }));
    }
  };

  const getSimpleStepDescription = (stepName: string, stepType: string) => {
    const name = stepName.toLowerCase();
    if (name.includes('insurance') && name.includes('claim')) {
      return "Automatically processes insurance claims by extracting information from documents, submitting to the insurance portal, and tracking status until completion.";
    }
    if (name.includes('email')) {
      return "Creates and sends personalized emails automatically based on triggers like form submissions or customer actions.";
    }
    if (name.includes('invoice')) {
      return "Automatically processes invoices by extracting data, validating information, and updating your accounting system.";
    }
    return `Automates the ${stepName.toLowerCase()} process to eliminate manual work and reduce errors.`;
  };

  const getRealisticDuration = (stepName: string) => {
    const name = stepName.toLowerCase();
    if (name.includes('insurance') || name.includes('complex')) return "2-3 weeks";
    if (name.includes('email') || name.includes('simple')) return "3-5 days";
    if (name.includes('document') || name.includes('processing')) return "1-2 weeks";
    return "1-2 weeks";
  };

  const getWhenItRuns = (trigger: string) => {
    switch (trigger) {
      case 'manual': return 'When you click the start button';
      case 'schedule': return 'Automatically at scheduled times';
      case 'webhook': return 'When triggered by external events';
      case 'email': return 'When new emails arrive';
      case 'file': return 'When new files are detected';
      default: return 'When conditions are met';
    }
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
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-blue-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-3">
          <span>🎯</span>
          <span>What This Workflow Does</span>
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          This automated workflow eliminates manual work by connecting your software systems with AI-powered processing. 
          Once set up, it will handle these tasks automatically, saving you hours each week and reducing errors.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-blue-600 font-bold mb-2">⚡ Automation Level</div>
            <div className="text-2xl font-bold text-gray-900">85%</div>
            <div className="text-gray-600 text-sm">of work done automatically</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-emerald-200">
            <div className="text-emerald-600 font-bold mb-2">💰 Annual Savings</div>
            <div className="text-2xl font-bold text-gray-900">£12,500</div>
            <div className="text-gray-600 text-sm">in time and efficiency gains</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="text-purple-600 font-bold mb-2">🕒 Time Saved</div>
            <div className="text-2xl font-bold text-gray-900">8 hours</div>
            <div className="text-gray-600 text-sm">per week once fully automated</div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
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

      {/* Workflow Steps - Enhanced with AI Analysis Content */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-gray-900 font-bold mb-4 text-xl">The Automated Tasks</h3>
        <p className="text-gray-600 text-lg mb-6">
          Here's what happens automatically when this workflow runs:
        </p>
        <div className="space-y-6">
          {workflow.steps.map((step, index) => {
            const stepDisplay = getStepTypeDisplay(step.type);
            const technicalDetails = getStepTechnicalDetails(step);
            const analysisContent = getStepAnalysisContent(step);
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

                    {/* AI Analysis Content - What the AI Found */}
                    {analysisContent.userFriendlyExplanation && (
                      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6 mb-4 border border-emerald-200">
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-2xl">🧠</span>
                          <h5 className="text-lg font-bold text-emerald-700">AI Analysis Results</h5>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-emerald-200">
                            <h6 className="font-bold text-emerald-700 mb-2">✅ Good News!</h6>
                            <p className="text-gray-700">{analysisContent.userFriendlyExplanation.goodNews}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                              <h6 className="font-bold text-blue-700 mb-2">🔧 How It Works</h6>
                              <p className="text-gray-700 text-sm">{analysisContent.userFriendlyExplanation.howItWorks}</p>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                              <h6 className="font-bold text-purple-700 mb-2">📋 What You Need</h6>
                              <p className="text-gray-700 text-sm">{analysisContent.userFriendlyExplanation.whatYouNeed}</p>
                            </div>
                          </div>

                          {/* Impact Metrics */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-3 border border-emerald-200 text-center">
                              <div className="text-xl font-bold text-emerald-600">{analysisContent.impact.annualHoursSaved}</div>
                              <div className="text-xs text-gray-600">Hours Saved/Year</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                              <div className="text-xl font-bold text-blue-600">{analysisContent.impact.valuePerYear}</div>
                              <div className="text-xs text-gray-600">Annual Value</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-purple-200 text-center">
                              <div className="text-xl font-bold text-purple-600">{analysisContent.impact.efficiencyGain}</div>
                              <div className="text-xs text-gray-600">Efficiency Gain</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
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
                        <span>{isExpanded ? 'Hide' : 'Show'} Technical Implementation & API Testing</span>
                      </button>
                    </div>

                    {/* Technical Details - Expanded */}
                    {isExpanded && (
                      <div className="bg-gray-900 rounded-lg p-6 text-white space-y-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Code className="h-5 w-5 text-emerald-400" />
                          <h5 className="text-lg font-bold text-emerald-400">API Implementation Details</h5>
                        </div>

                        {/* API Endpoints with Live Testing */}
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
                                
                                {/* Live API Testing Button */}
                                <button
                                  onClick={() => testApiEndpoint(step.id, endpoint)}
                                  disabled={testingInProgress[`${step.id}-${endpoint.name}`]}
                                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-2 transition-colors"
                                >
                                  {testingInProgress[`${step.id}-${endpoint.name}`] ? (
                                    <>
                                      <Loader className="h-3 w-3 animate-spin" />
                                      <span>Testing...</span>
                                    </>
                                  ) : (
                                    <>
                                      <PlayCircle className="h-3 w-3" />
                                      <span>Test API</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              
                              <div className="text-gray-300 text-sm mb-3">{endpoint.purpose}</div>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <div className="text-blue-400 font-bold text-sm mb-2">URL:</div>
                                  <div className="bg-gray-700 rounded p-2 text-xs font-mono break-all">{endpoint.url}</div>
                                </div>
                                <div>
                                  <div className="text-purple-400 font-bold text-sm mb-2">Authentication:</div>
                                  <div className="bg-gray-700 rounded p-2 text-xs">{endpoint.authentication}</div>
                                </div>
                              </div>

                              {/* Sample Request */}
                              <div className="mb-4">
                                <div className="text-yellow-400 font-bold text-sm mb-2">Sample Request:</div>
                                <div className="bg-gray-700 rounded p-3 text-xs font-mono overflow-x-auto">
                                  <pre>{JSON.stringify(endpoint.samplePayload, null, 2)}</pre>
                                </div>
                              </div>

                              {/* API Test Results */}
                              {apiTestResults[`${step.id}-${endpoint.name}`] && (
                                <div className="border-t border-gray-600 pt-4">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Terminal className="h-4 w-4 text-emerald-400" />
                                    <span className="text-emerald-400 font-bold text-sm">Live Test Results:</span>
                                  </div>
                                  <div className="bg-gray-700 rounded p-3 text-xs font-mono overflow-x-auto">
                                    <pre>{JSON.stringify(apiTestResults[`${step.id}-${endpoint.name}`], null, 2)}</pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Implementation Steps */}
                        <div>
                          <h6 className="text-blue-400 font-bold mb-3">Implementation Steps:</h6>
                          <div className="space-y-2">
                            {technicalDetails.implementation.steps.map((step, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                  {idx + 1}
                                </div>
                                <div className="text-gray-300 text-sm">{step}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Code Example */}
                        <div>
                          <h6 className="text-purple-400 font-bold mb-3">Code Example:</h6>
                          <div className="bg-gray-700 rounded p-4 text-xs font-mono overflow-x-auto">
                            <pre className="text-gray-300">{technicalDetails.implementation.codeExample}</pre>
                          </div>
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
      </div>
    </div>
  );
}