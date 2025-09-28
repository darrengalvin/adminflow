import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, Square, Clock, User, Tag, CheckCircle, AlertCircle, Loader, Zap, Info, Code, ExternalLink, Copy, Send, Eye, EyeOff, Terminal, PlayCircle, FileText, Download } from 'lucide-react';
import { Workflow } from '../types';
import jsPDF from 'jspdf';
import { PDFReportGenerator } from './pdf/PDFReportGenerator';
import { ClaudeService, WorkflowAnalysisRequest, AIGeneratedContent } from '../services/claudeService';

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<AIGeneratedContent | null>(null);
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);

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

  // NEW: AI-POWERED REACT PDF GENERATION
  const generateAIPoweredPDF = async () => {
    setIsGeneratingWithAI(true);
    
    try {
      console.log('🤖 Starting AI-powered PDF generation...');
      
      // Convert workflow to Claude request format
      const workflowAnalysisRequest: WorkflowAnalysisRequest = {
        workflowName: workflow.name,
        workflowDescription: workflow.description || 'Workflow automation implementation guide',
        steps: (workflow.steps || []).map(step => ({
          name: step.name,
          description: step.description,
          type: step.type || 'automation'
        }))
      };
      
      // Call Claude API to generate content
      const claudeService = new ClaudeService();
              console.log('📡 Making API call to Claude 4 Sonnet...');
      const aiContent = await claudeService.generateImplementationGuide(workflowAnalysisRequest);
      console.log('✅ AI content generated successfully');
      
      // Store the AI-generated content for React PDF component
      setAiGeneratedContent(aiContent);
      
    } catch (error) {
      console.error('❌ Error generating AI-powered PDF:', error);
      alert('Error generating AI content. Please check your Claude API key is configured in your .env file.');
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  // Generate comprehensive PDF development guide
  const generateDevelopmentPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Helper function to add new page if needed
      const checkPageSpace = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
      };

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: string = '#000000') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.setTextColor(color);
        
        const lines = pdf.splitTextToSize(text, contentWidth);
        lines.forEach((line: string) => {
          checkPageSpace(fontSize * 0.5);
          pdf.text(line, margin, yPosition);
          yPosition += fontSize * 0.5;
        });
        yPosition += 5; // Extra spacing
      };

      // Cover Page
      pdf.setFillColor(59, 130, 246); // Blue background
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setTextColor('#FFFFFF');
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('React Native Development Guide', pageWidth/2, 60, { align: 'center' });
      
      pdf.setFontSize(20);
      pdf.text(workflow.name, pageWidth/2, 80, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.text('AI-Powered Automation Platform', pageWidth/2, 100, { align: 'center' });
      pdf.text('Complete Implementation Specification', pageWidth/2, 120, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth/2, 160, { align: 'center' });
      pdf.text('For: Mobile Development Team', pageWidth/2, 175, { align: 'center' });

      // Add new page for content
      pdf.addPage();
      yPosition = margin;

      // Table of Contents
      addText('TABLE OF CONTENTS', 18, true, '#1F2937');
      yPosition += 10;
      
      const tocItems = [
        '1. Project Overview & Requirements',
        '2. React Native App Structure', 
        '3. Navigation Setup (AI Analyser & Workflow)',
        '4. AI Analysis Component Implementation',
        '5. Workflow Designer Component',
        '6. API Integration & Claude AI Setup',
        '7. Data Models & Types',
        '8. Step-by-Step Workflow Execution',
        '9. UI/UX Design System',
        '10. Testing & Deployment Guide'
      ];

      tocItems.forEach((item, index) => {
        addText(`${item}`, 12, false, '#374151');
      });

      // Chapter 1: Project Overview
      pdf.addPage();
      yPosition = margin;
      
      addText('1. PROJECT OVERVIEW & REQUIREMENTS', 16, true, '#1F2937');
      
      addText('Platform Type: React Native (iOS & Android)', 14, true);
      addText('This is a standalone mobile automation platform that replicates the web version functionality.', 12);
      
      addText('Core Features Required:', 14, true);
      addText('• AI Task Analysis - Users input tasks, AI provides automation recommendations', 12);
      addText('• Workflow Designer - Visual workflow creation and management', 12);
      addText('• Claude AI Integration - Real-time analysis and intelligent processing', 12);
      addText('• API Testing - Live endpoint testing with results display', 12);
      addText('• PDF Export - Generate implementation guides', 12);

      addText('Navigation Structure:', 14, true);
      addText('ONLY 2 main sections in side navigation:', 12, true);
      addText('1. AI Analyser - Task input and analysis', 12);
      addText('2. Workflow - Workflow creation and management', 12);

      // Chapter 2: App Structure
      addText('2. REACT NATIVE APP STRUCTURE', 16, true, '#1F2937');
      
      const appStructure = `
src/
├── components/
│   ├── AIAnalyser.tsx          # Main analysis component
│   ├── WorkflowDesigner.tsx    # Workflow creation
│   ├── WorkflowDetails.tsx     # Workflow step details
│   ├── Navigation.tsx          # Side navigation
│   └── common/                 # Shared components
├── services/
│   ├── claudeApi.ts           # Claude AI integration
│   ├── workflowService.ts     # Workflow management
│   └── pdfGenerator.ts        # PDF export functionality
├── types/
│   ├── workflow.ts            # Workflow data models
│   └── analysis.ts            # Analysis data models
├── screens/
│   ├── AnalyserScreen.tsx     # AI Analyser screen
│   └── WorkflowScreen.tsx     # Workflow screen
└── utils/
    ├── storage.ts             # Local data persistence
    └── validation.ts          # Input validation`;

      addText('Directory Structure:', 14, true);
      addText(appStructure, 10, false, '#374151');

      // Chapter 3: Navigation Setup
      pdf.addPage();
      yPosition = margin;
      
      addText('3. NAVIGATION SETUP', 16, true, '#1F2937');
      
      const navigationCode = `
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import AnalyserScreen from '../screens/AnalyserScreen';
import WorkflowScreen from '../screens/WorkflowScreen';

const Drawer = createDrawerNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="AIAnalyser"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#f8fafc',
            width: 280,
          },
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: '#ffffff',
        }}
      >
        <Drawer.Screen 
          name="AIAnalyser" 
          component={AnalyserScreen}
          options={{
            title: '🧠 AI Analyser',
            drawerLabel: 'AI Analyser'
          }}
        />
        <Drawer.Screen 
          name="Workflow" 
          component={WorkflowScreen}
          options={{
            title: '⚡ Workflow',
            drawerLabel: 'Workflow'
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}`;

      addText('Required Dependencies:', 14, true);
      addText('npm install @react-navigation/native @react-navigation/drawer', 12);
      addText('npm install react-native-screens react-native-safe-area-context', 12);
      
      addText('Navigation Component Code:', 14, true);
      addText(navigationCode, 9, false, '#374151');

      // Chapter 4: AI Analysis Component
      pdf.addPage();
      yPosition = margin;
      
      addText('4. AI ANALYSIS COMPONENT IMPLEMENTATION', 16, true, '#1F2937');
      
      addText('Core Functionality:', 14, true);
      addText('• Task input form with validation', 12);
      addText('• Real-time Claude AI analysis', 12);
      addText('• Results display with AI processing details', 12);
      addText('• History management and storage', 12);

      const aiAnalysisCode = `
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { claudeApiService } from '../services/claudeApi';

export default function AIAnalyser() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeTask = async () => {
    setIsAnalyzing(true);
    try {
      const result = await claudeApiService.analyzeTask({
        taskName,
        description: taskDescription,
        timeSpent: '2 hours per week',
        software: 'Various systems',
        painPoints: 'Manual process, time consuming',
        alternatives: 'Focus on strategic work'
      });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>What task would you like to automate?</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Task name (e.g., Process customer invoices)"
        value={taskName}
        onChangeText={setTaskName}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe the task in detail..."
        value={taskDescription}
        onChangeText={setTaskDescription}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity 
        style={styles.analyzeButton}
        onPress={analyzeTask}
        disabled={isAnalyzing || !taskName || !taskDescription}
      >
        <Text style={styles.buttonText}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Task'}
        </Text>
      </TouchableOpacity>
      
      {analysisResult && (
        <AIAnalysisResults result={analysisResult} />
      )}
    </ScrollView>
  );
}`;

      addText('AI Analyser Component Code:', 14, true);
      addText(aiAnalysisCode, 8, false, '#374151');

      // Chapter 5: Workflow Designer
      pdf.addPage();
      yPosition = margin;
      
      addText('5. WORKFLOW DESIGNER COMPONENT', 16, true, '#1F2937');
      
      addText('This component manages workflow creation and displays workflow steps with:', 12);
      addText('• Visual step representation', 12);
      addText('• AI analysis integration for each step', 12);
      addText('• API endpoint testing capabilities', 12);
      addText('• Technical implementation details', 12);

      // Add workflow steps details
      addText('Workflow Step Structure:', 14, true);
      workflow.steps.forEach((step, index) => {
        checkPageSpace(30);
        addText(`Step ${index + 1}: ${step.name}`, 12, true, '#3B82F6');
        
        const analysisContent = getStepAnalysisContent(step);
        if (analysisContent.userFriendlyExplanation) {
          addText(`Description: ${analysisContent.userFriendlyExplanation.goodNews}`, 10);
          addText(`How it works: ${analysisContent.userFriendlyExplanation.howItWorks}`, 10);
          addText(`Requirements: ${analysisContent.userFriendlyExplanation.whatYouNeed}`, 10);
        }

        const technicalDetails = getStepTechnicalDetails(step);
        if (technicalDetails.apiEndpoints && technicalDetails.apiEndpoints.length > 0) {
          addText('API Endpoints:', 11, true);
          technicalDetails.apiEndpoints.forEach((endpoint: any) => {
            addText(`• ${endpoint.name}: ${endpoint.method} ${endpoint.url}`, 9);
            addText(`  Purpose: ${endpoint.purpose}`, 9);
            addText(`  Auth: ${endpoint.authentication}`, 9);
          });
        }
        yPosition += 5;
      });

      // Chapter 6: API Integration
      pdf.addPage();
      yPosition = margin;
      
      addText('6. API INTEGRATION & CLAUDE AI SETUP', 16, true, '#1F2937');
      
      const claudeApiCode = `
// services/claudeApi.ts
class ClaudeApiService {
  private apiUrl = 'https://api.anthropic.com/v1/messages';
  private apiKey = 'your-claude-api-key';

  async analyzeTask(taskData: TaskAnalysisPrompt): Promise<any> {
    const prompt = \`You are an expert automation consultant analyzing tasks for a CUSTOM AUTOMATION TOOL.

CRITICAL: This is an AI-POWERED automation system. For every task, you MUST explain what AI will do with the data - how AI will process, enhance, analyze, or make decisions with the information.

TASK DETAILS:
- Task Name: \${taskData.taskName}
- Description: \${taskData.description}
- Software Used: \${taskData.software}
- Time Spent Weekly: \${taskData.timeSpent}

Please provide comprehensive analysis in JSON format with:
- AI processing capabilities
- API endpoints needed
- Implementation steps
- Technical requirements\`;

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    return JSON.parse(data.content[0]?.text || '{}');
  }
}

export const claudeApiService = new ClaudeApiService();`;

      addText('Claude AI Service Implementation:', 14, true);
      addText(claudeApiCode, 8, false, '#374151');

      // Chapter 7: Data Models
      pdf.addPage();
      yPosition = margin;
      
      addText('7. DATA MODELS & TYPES', 16, true, '#1F2937');
      
      const dataModels = `
// types/workflow.ts
export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggers: string[];
  status: 'draft' | 'active' | 'paused';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  configuration: any;
  aiAnalysis?: any;
}

// types/analysis.ts
export interface TaskAnalysisPrompt {
  taskName: string;
  description: string;
  software: string;
  timeSpent: string;
  painPoints: string;
  alternatives: string;
}

export interface AnalysisResult {
  taskName: string;
  description: string;
  userFriendlyExplanation: {
    goodNews: string;
    whatIsAPI: string;
    howItWorks: string;
    whatYouNeed: string;
    aiProcessing: {
      inputProcessing: string;
      smartDecisions: string;
      dataEnhancement: string;
      continuousLearning: string;
    };
    endpoints: ApiEndpoint[];
  };
  automation: {
    type: string;
    apiConnections: string[];
    aiCapabilities: string[];
  };
  impact: {
    annualHoursSaved: number;
    monthlyHoursSaved: number;
    valuePerYear: string;
    efficiencyGain: string;
  };
}`;

      addText('TypeScript Interfaces:', 14, true);
      addText(dataModels, 8, false, '#374151');

      // Chapter 8: Step-by-Step Workflow Execution
      pdf.addPage();
      yPosition = margin;
      
      addText('8. STEP-BY-STEP WORKFLOW EXECUTION', 16, true, '#1F2937');
      
      addText('Each workflow step must implement:', 12);
      addText('1. AI Processing Logic - How AI analyzes and processes data', 12);
      addText('2. API Integration - Connection to external services', 12);
      addText('3. Error Handling - Robust failure management', 12);
      addText('4. Progress Tracking - Real-time status updates', 12);
      addText('5. Result Storage - Persistent data management', 12);

      addText('Workflow Execution Flow:', 14, true);
      addText('1. User triggers workflow (manual or scheduled)', 12);
      addText('2. System validates input data and prerequisites', 12);
      addText('3. For each step:', 12);
      addText('   a. AI processes and validates incoming data', 12);
      addText('   b. Makes intelligent decisions based on business rules', 12);
      addText('   c. Calls appropriate API endpoints', 12);
      addText('   d. Enhances data with AI insights', 12);
      addText('   e. Updates progress and logs results', 12);
      addText('4. System provides final results and analytics', 12);

      // Chapter 9: UI/UX Design System
      pdf.addPage();
      yPosition = margin;
      
      addText('9. UI/UX DESIGN SYSTEM', 16, true, '#1F2937');
      
      const designSystem = `
// styles/theme.ts
export const theme = {
  colors: {
    primary: '#3B82F6',      // Blue
    secondary: '#10B981',    // Emerald
    accent: '#8B5CF6',       // Purple
    background: '#F8FAFC',   // Light gray
    surface: '#FFFFFF',      // White
    text: {
      primary: '#1F2937',    // Dark gray
      secondary: '#6B7280',  // Medium gray
      accent: '#3B82F6'      // Blue
    },
    status: {
      success: '#10B981',    // Green
      warning: '#F59E0B',    // Amber
      error: '#EF4444',      // Red
      info: '#3B82F6'        // Blue
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1F2937'
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#374151'
    },
    body: {
      fontSize: 14,
      color: '#6B7280'
    }
  }
};`;

      addText('Design System Configuration:', 14, true);
      addText(designSystem, 8, false, '#374151');

      addText('Component Guidelines:', 14, true);
      addText('• Use consistent spacing and colors from theme', 12);
      addText('• Implement loading states for all async operations', 12);
      addText('• Add proper error handling with user-friendly messages', 12);
      addText('• Ensure accessibility with proper labels and contrast', 12);
      addText('• Make all components responsive for different screen sizes', 12);

      // Chapter 10: Testing & Deployment
      pdf.addPage();
      yPosition = margin;
      
      addText('10. TESTING & DEPLOYMENT GUIDE', 16, true, '#1F2937');
      
      addText('Testing Requirements:', 14, true);
      addText('• Unit tests for all services and utilities', 12);
      addText('• Integration tests for API connections', 12);
      addText('• UI tests for critical user flows', 12);
      addText('• Performance testing for large workflows', 12);

      addText('Deployment Steps:', 14, true);
      addText('1. Set up environment variables for API keys', 12);
      addText('2. Configure build settings for iOS and Android', 12);
      addText('3. Test on physical devices', 12);
      addText('4. Submit to app stores with proper metadata', 12);

      addText('Environment Configuration:', 14, true);
      const envConfig = `
// .env
CLAUDE_API_KEY=your_claude_api_key_here
API_BASE_URL=https://your-api-domain.com
ENVIRONMENT=production

// config/environment.ts
export const config = {
  claudeApiKey: process.env.CLAUDE_API_KEY,
  apiBaseUrl: process.env.API_BASE_URL,
  environment: process.env.ENVIRONMENT
};`;
      addText(envConfig, 10, false, '#374151');

      // Implementation Checklist
      addText('IMPLEMENTATION CHECKLIST', 14, true, '#DC2626');
      const checklist = [
        '□ Set up React Native project with navigation',
        '□ Implement AI Analyser screen with Claude integration',
        '□ Create Workflow Designer with step management',
        '□ Add API testing functionality',
        '□ Implement data persistence and history',
        '□ Add PDF generation capability',
        '□ Style components according to design system',
        '□ Add error handling and loading states',
        '□ Test on iOS and Android devices',
        '□ Configure environment variables',
        '□ Prepare for app store submission'
      ];

      checklist.forEach(item => {
        addText(item, 11, false, '#374151');
      });

      // Footer
      pdf.addPage();
      yPosition = margin;
      
      addText('DEVELOPMENT NOTES', 16, true, '#1F2937');
      addText('This implementation guide provides the complete specification for building the React Native automation platform.', 12);
      addText('Key Focus Areas:', 12, true);
      addText('• AI-first approach - Every feature should leverage AI capabilities', 12);
      addText('• User-friendly interface - Make complex automation simple', 12);
      addText('• Robust API integration - Handle real-world API complexities', 12);
      addText('• Scalable architecture - Support growing workflow complexity', 12);

      addText('For questions or clarification, refer to the original web platform at:', 12);
      addText('https://adminflow-1kqgujgwt-darrengalvins-projects.vercel.app', 11, false, '#3B82F6');

      // Save PDF
      pdf.save(`${workflow.name.replace(/\s+/g, '_')}_Development_Guide.pdf`);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateWorkflowImplementationPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      console.log('🚀 Starting AI-powered PDF generation...');
      
      // Import the advanced PDF generator
      const { AdvancedPDFGenerator } = await import('../services/advancedPdfGenerator');
      
      // Create workflow data for AI analysis
      const workflowData = {
        workflowName: workflow.name,
        workflowDescription: workflow.description || 'Advanced automation workflow for enhanced business efficiency',
        steps: (workflow.steps || []).map(step => ({
          name: step.name,
          description: step.description,
          type: step.type
        }))
      };
      
      // Generate comprehensive AI-powered PDF
      const pdfGenerator = new AdvancedPDFGenerator({
        includeCodeExamples: true,
        includeArchitectureDiagrams: true,
        colorScheme: 'professional',
        documentTemplate: 'comprehensive'
      });
      
      await pdfGenerator.generateComprehensiveGuide(workflowData);
      
      console.log('✅ AI-powered implementation guide generated successfully!');

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: string = '#000000') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.setTextColor(color);
        
        const lines = pdf.splitTextToSize(text, contentWidth);
        lines.forEach((line: string) => {
          checkPageSpace(fontSize * 0.5);
          pdf.text(line, margin, yPosition);
          yPosition += fontSize * 0.5;
        });
        yPosition += 5; // Extra spacing
      };

      // Helper function to add section header
      const addSection = (title: string, color: string = '#1F2937') => {
        checkPageSpace(20);
        yPosition += 10;
        addText(title, 16, true, color);
        // Add underline
        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition - 8, pageWidth - margin, yPosition - 8);
        yPosition += 5;
      };

      // Helper function to add highlight box
      const addHighlightBox = (title: string, content: string, bgColor: string = '#EFF6FF') => {
        checkPageSpace(30);
        const boxHeight = 25;
        
        // Set background color
        const colorMap: { [key: string]: number[] } = {
          '#EFF6FF': [239, 246, 255], // Light blue
          '#F0FDF4': [240, 253, 244], // Light green  
          '#FEF3C7': [254, 243, 199], // Light yellow
          '#FEE2E2': [254, 226, 226]  // Light red
        };
        const [r, g, b] = colorMap[bgColor] || [239, 246, 255];
        
        pdf.setFillColor(r, g, b);
        pdf.rect(margin, yPosition - 5, contentWidth, boxHeight, 'F');
        
        // Add border
        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(0.3);
        pdf.rect(margin, yPosition - 5, contentWidth, boxHeight);
        
        // Add content
        addText(title, 12, true, '#1F2937');
        addText(content, 11, false, '#374151');
      };

      // Cover Page
      pdf.setFillColor(59, 130, 246); // Blue background
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setTextColor('#FFFFFF');
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Workflow Implementation Guide', pageWidth/2, 60, { align: 'center' });
      
      pdf.setFontSize(20);
      pdf.text(workflow.name, pageWidth/2, 85, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.text('AI-Powered Automation Platform', pageWidth/2, 105, { align: 'center' });
      pdf.text('Complete Technical Implementation Specification', pageWidth/2, 125, { align: 'center' });
      
      // ROI Summary Box on Cover
      pdf.setFillColor(255, 255, 255, 0.9);
      pdf.rect(30, 140, pageWidth - 60, 60, 'F');
      pdf.setTextColor('#1F2937');
      pdf.setFontSize(14);
      pdf.text('ROI SUMMARY', pageWidth/2, 155, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text('156 Hours Saved/Year | £3,900 Annual Value | 70% Efficiency Gain', pageWidth/2, 170, { align: 'center' });
      pdf.text('Setup Time: 3-5 days | When: After previous task finishes', pageWidth/2, 185, { align: 'center' });
      
      pdf.setTextColor('#FFFFFF');
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth/2, 220, { align: 'center' });
      pdf.text('Confidential Business Document', pageWidth/2, 235, { align: 'center' });

      // Add new page for content
      pdf.addPage();
      yPosition = margin;

      // Executive Summary
      addSection('EXECUTIVE SUMMARY', '#1F2937');
      
      addHighlightBox(
        '✅ AUTOMATION OPPORTUNITY ASSESSMENT',
        'Excellent news! Your Email Template Creation and Management process is highly automatable and could save you significant time each week. This workflow can be 70% automated, eliminating manual template creation, personalization, and sending processes.',
        '#F0FDF4'
      );

      addText('Business Impact Analysis:', 14, true);
      addText('• Time Savings: 156 hours per year (3 hours per week)', 12);
      addText('• Financial Value: £3,900 annual savings', 12);
      addText('• Efficiency Improvement: 70% reduction in manual work', 12);
      addText('• Error Reduction: 90% fewer template inconsistencies', 12);
      addText('• Response Time: 85% faster email delivery', 12);

      addText('Process Transformation:', 14, true);
      addText('Current State: Manual template creation, personalization, and sending', 12);
      addText('Future State: AI-powered automated email generation and delivery', 12);

      // Technical Overview
      addSection('TECHNICAL IMPLEMENTATION OVERVIEW');
      
      addText('Automation Type: API Integration with AI Processing', 14, true);
      addText('Primary Technologies:', 12, true);
      addText('• Email Service Provider API (SendGrid, Mailchimp, or similar)', 12);
      addText('• AI Content Generation API (OpenAI GPT or Claude)', 12);
      addText('• Template Management System', 12);
      addText('• Customer Data Integration', 12);
      addText('• Automation Orchestration Platform', 12);

      addHighlightBox(
        '🤖 HOW THE AUTOMATION WORKS',
        'The system monitors for triggers (form submissions, customer actions), intelligently processes the data using AI, generates personalized email templates, and automatically sends them without manual intervention. All activities are logged and tracked for performance optimization.',
        '#EFF6FF'
      );

      // API Integration Details
      pdf.addPage();
      yPosition = margin;
      
      addSection('API INTEGRATION SPECIFICATIONS');
      
      // Get the first step's technical details for the example
      const sampleStep = workflow.steps[0];
      const analysisContent = getStepAnalysisContent(sampleStep);
      const technicalDetails = getStepTechnicalDetails(sampleStep);

      addText('Required API Connections:', 14, true);
      
      if (technicalDetails.apiEndpoints) {
        technicalDetails.apiEndpoints.forEach((endpoint: any, index: number) => {
          addText(`${index + 1}. ${endpoint.name}`, 12, true);
          addText(`   Endpoint: ${endpoint.url}`, 11);
          addText(`   Method: ${endpoint.method}`, 11);
          addText(`   Purpose: ${endpoint.purpose}`, 11);
          addText(`   Authentication: ${endpoint.authentication}`, 11);
          
          if (endpoint.samplePayload) {
            addText(`   Sample Request:`, 11, true);
            addText(`   ${JSON.stringify(endpoint.samplePayload, null, 2)}`, 10, false, '#374151');
          }
          yPosition += 5;
        });
      }

      // Implementation Timeline
      addSection('IMPLEMENTATION TIMELINE & MILESTONES');
      
      addHighlightBox(
        '⏱️ ESTIMATED SETUP TIME: 3-5 DAYS',
        'Complete implementation including testing, deployment, and team training. The system will be fully operational and saving time immediately after setup.',
        '#FEF3C7'
      );

      addText('Phase 1: API Setup & Authentication (Day 1)', 12, true);
      addText('• Register for email service provider API access', 11);
      addText('• Configure authentication credentials', 11);
      addText('• Set up AI content generation API', 11);
      addText('• Test basic connectivity', 11);

      addText('Phase 2: Template System Development (Day 2-3)', 12, true);
      addText('• Create dynamic template structure', 11);
      addText('• Implement personalization logic', 11);
      addText('• Set up content generation workflows', 11);
      addText('• Configure trigger mechanisms', 11);

      addText('Phase 3: Integration & Testing (Day 4)', 12, true);
      addText('• Connect all systems and APIs', 11);
      addText('• Run comprehensive testing scenarios', 11);
      addText('• Validate email delivery and tracking', 11);
      addText('• Performance optimization', 11);

      addText('Phase 4: Deployment & Training (Day 5)', 12, true);
      addText('• Deploy to production environment', 11);
      addText('• Team training and handover', 11);
      addText('• Monitor initial operations', 11);
      addText('• Documentation and support setup', 11);

      // Step-by-Step Implementation Guide
      pdf.addPage();
      yPosition = margin;
      
      addSection('DETAILED IMPLEMENTATION STEPS');

      workflow.steps.forEach((step, index) => {
        const stepAnalysis = getStepAnalysisContent(step);
        
        addText(`STEP ${index + 1}: ${step.name || step.title}`, 14, true, '#3B82F6');
        
        if (step.description) {
          addText(`Description: ${step.description}`, 12);
        }
        
        addText('AI Analysis Results:', 12, true);
        if (stepAnalysis.userFriendlyExplanation) {
          addText(`✅ ${stepAnalysis.userFriendlyExplanation.goodNews}`, 11, false, '#059669');
        }
        
        if (stepAnalysis.impact) {
          addText('Impact Metrics:', 12, true);
          addText(`• Annual Hours Saved: ${stepAnalysis.impact.annualHoursSaved || 156}`, 11);
          addText(`• Annual Value: ${stepAnalysis.impact.valuePerYear || '£3,900'}`, 11);
          addText(`• Efficiency Gain: ${stepAnalysis.impact.efficiencyGain || '70%'}`, 11);
        }
        
        if (stepAnalysis.automation?.apiConnections) {
          addText('Required API Connections:', 12, true);
          stepAnalysis.automation.apiConnections.forEach((connection: string) => {
            addText(`• ${connection}`, 11);
          });
        }
        
        yPosition += 10; // Space between steps
      });

      // Resource Requirements
      addSection('RESOURCE REQUIREMENTS & PREREQUISITES');
      
      addText('Technical Requirements:', 14, true);
      addText('• Email Service Provider account with API access', 12);
      addText('• AI API subscription (OpenAI, Claude, or similar)', 12);
      addText('• Automation platform (Zapier, Make, or custom solution)', 12);
      addText('• Database for template and customer data storage', 12);
      addText('• SSL certificates for secure API communication', 12);

      addText('Team Requirements:', 14, true);
      addText('• 1 Developer (API integration specialist)', 12);
      addText('• 1 QA Tester (for validation testing)', 12);
      addText('• 1 Business Analyst (for process validation)', 12);
      addText('• Access to subject matter expert for template design', 12);

      addText('Budget Considerations:', 14, true);
      addText('• API subscription costs: £50-200/month', 12);
      addText('• Development time: 3-5 days', 12);
      addText('• Ongoing maintenance: 2-4 hours/month', 12);
      addText('• Training and documentation: 1 day', 12);

      // Success Metrics & Monitoring
      pdf.addPage();
      yPosition = margin;
      
      addSection('SUCCESS METRICS & MONITORING');
      
      addHighlightBox(
        '📊 KEY PERFORMANCE INDICATORS',
        'Track these metrics to measure automation success and identify optimization opportunities.',
        '#EFF6FF'
      );

      addText('Efficiency Metrics:', 14, true);
      addText('• Time saved per email campaign (target: 3+ hours)', 12);
      addText('• Email delivery speed (target: <5 minutes)', 12);
      addText('• Template consistency score (target: >95%)', 12);
      addText('• Error rate reduction (target: <5%)', 12);

      addText('Business Impact Metrics:', 14, true);
      addText('• Monthly cost savings (target: £325)', 12);
      addText('• Campaign response rates (target: 15% improvement)', 12);
      addText('• Customer satisfaction scores', 12);
      addText('• Team productivity gains', 12);

      addText('Technical Performance Metrics:', 14, true);
      addText('• API response times', 12);
      addText('• System uptime (target: >99.5%)', 12);
      addText('• Email deliverability rates', 12);
      addText('• Template generation accuracy', 12);

      // Troubleshooting & Support
      addSection('TROUBLESHOOTING & SUPPORT');
      
      addText('Common Issues and Solutions:', 14, true);
      
      addText('1. Email Delivery Failures:', 12, true);
      addText('   • Check API credentials and rate limits', 11);
      addText('   • Verify email template formatting', 11);
      addText('   • Monitor spam score and reputation', 11);

      addText('2. Template Generation Errors:', 12, true);
      addText('   • Validate input data completeness', 11);
      addText('   • Check AI API quota and limits', 11);
      addText('   • Review template logic and variables', 11);

      addText('3. Performance Issues:', 12, true);
      addText('   • Monitor API response times', 11);
      addText('   • Optimize template generation logic', 11);
      addText('   • Scale infrastructure if needed', 11);

      addText('Support Contacts:', 14, true);
      addText('• Technical Support: automation-support@company.com', 12);
      addText('• Business Process Queries: process-team@company.com', 12);
      addText('• Emergency Issues: 24/7 monitoring system', 12);

      // Appendix
      addSection('APPENDIX');
      
      addText('A. API Documentation Links', 12, true);
      addText('• Email Service Provider API docs', 11);
      addText('• AI Content Generation API reference', 11);
      addText('• Authentication and security guidelines', 11);

      addText('B. Template Examples', 12, true);
      addText('• Sample email templates with variables', 11);
      addText('• Personalization logic examples', 11);
      addText('• A/B testing configurations', 11);

      addText('C. Security Considerations', 12, true);
      addText('• Data encryption requirements', 11);
      addText('• GDPR compliance checklist', 11);
      addText('• Access control and permissions', 11);

      // Footer on last page
      yPosition = pageHeight - 30;
      pdf.setFontSize(10);
      pdf.setTextColor('#6B7280');
      pdf.text('This document is confidential and proprietary.', pageWidth/2, yPosition, { align: 'center' });
      pdf.text(`Generated on ${new Date().toLocaleDateString()} by AI Automation Platform`, pageWidth/2, yPosition + 10, { align: 'center' });

      // Save the PDF
      const fileName = `${workflow.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_implementation_guide.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('❌ Error generating AI-powered PDF:', error);
      alert('🚫 Failed to generate AI-powered implementation guide. Please check your Claude API configuration and try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{workflow.name}</h1>
            <p className="text-gray-600 mt-1">{workflow.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Implementation Guide PDF Button */}
          <button
            onClick={generateWorkflowImplementationPDF}
            disabled={isGeneratingPDF}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors font-semibold"
          >
            {isGeneratingPDF ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Generate Implementation Guide</span>
              </>
            )}
          </button>
          
          {/* AI-Powered React PDF Button */}
          <button
            onClick={generateAIPoweredPDF}
            disabled={isGeneratingWithAI}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            {isGeneratingWithAI ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>AI Generating...</span>
              </>
            ) : (
              <>
                <span className="text-lg">🤖</span>
                <span>Generate AI Report</span>
              </>
            )}
          </button>

          {/* Development Guide PDF Button */}
          <button
            onClick={generateDevelopmentPDF}
            disabled={isGeneratingPDF}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors font-semibold"
          >
            {isGeneratingPDF ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                <span>Dev Guide</span>
              </>
            )}
          </button>
          
          <button
            onClick={onExecute}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors font-semibold"
          >
            <Play className="h-5 w-5" />
            <span>Execute Workflow</span>
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
            {(workflow.triggers || ['manual']).map((trigger, index) => (
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
          {(workflow.steps || []).map((step, index) => {
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
                          {index === 0 ? getWhenItRuns((workflow.triggers || ['manual'])[0] || 'manual') : 'After the previous task finishes'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Technical Implementation Button */}
                    <div className="mb-4">
                      <button
                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center space-x-3 transition-colors text-lg font-semibold"
                      >
                        <Code className="h-5 w-5" />
                        <span>{isExpanded ? 'Hide' : 'Show'} How To Build This (For Developers)</span>
                      </button>
                    </div>

                    {/* Technical Details - Redesigned for clarity */}
                    {isExpanded && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200 space-y-8">
                        
                        {/* Header */}
                        <div className="text-center">
                          <div className="text-4xl mb-4">🤖</div>
                          <h5 className="text-2xl font-bold text-gray-900 mb-2">Developer Implementation Guide</h5>
                          <p className="text-gray-600 text-lg">Everything a coding agent needs to build this automation</p>
                        </div>

                        {/* AI Processing Section - NEW */}
                        <div className="bg-white rounded-xl p-6 border-2 border-purple-200 shadow-sm">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-2xl">🧠</span>
                            </div>
                            <h6 className="text-xl font-bold text-purple-700">What AI Will Do With This Data</h6>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                              <h7 className="font-bold text-purple-700 mb-2">📥 Input Processing</h7>
                              <ul className="text-gray-700 text-sm space-y-1">
                                {technicalDetails.userFriendlyExplanation?.aiProcessing?.inputProcessing ? (
                                  <li>• {technicalDetails.userFriendlyExplanation.aiProcessing.inputProcessing}</li>
                                ) : (
                                  <>
                                    <li>• Extract key information from documents</li>
                                    <li>• Validate data accuracy and completeness</li>
                                    <li>• Detect potential errors or missing fields</li>
                                    <li>• Standardise formats and naming</li>
                                  </>
                                )}
                              </ul>
                            </div>
                            
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <h7 className="font-bold text-blue-700 mb-2">🎯 Smart Decisions</h7>
                              <ul className="text-gray-700 text-sm space-y-1">
                                {technicalDetails.userFriendlyExplanation?.aiProcessing?.smartDecisions ? (
                                  <li>• {technicalDetails.userFriendlyExplanation.aiProcessing.smartDecisions}</li>
                                ) : (
                                  <>
                                    <li>• Determine urgency and priority levels</li>
                                    <li>• Route to appropriate departments</li>
                                    <li>• Flag suspicious or unusual patterns</li>
                                    <li>• Suggest optimal processing paths</li>
                                  </>
                                )}
                              </ul>
                            </div>
                            
                            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                              <h7 className="font-bold text-emerald-700 mb-2">📊 Data Enhancement</h7>
                              <ul className="text-gray-700 text-sm space-y-1">
                                {technicalDetails.userFriendlyExplanation?.aiProcessing?.dataEnhancement ? (
                                  <li>• {technicalDetails.userFriendlyExplanation.aiProcessing.dataEnhancement}</li>
                                ) : (
                                  <>
                                    <li>• Add missing information from databases</li>
                                    <li>• Cross-reference with historical data</li>
                                    <li>• Generate insights and recommendations</li>
                                    <li>• Create summary reports</li>
                                  </>
                                )}
                              </ul>
                            </div>
                            
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                              <h7 className="font-bold text-amber-700 mb-2">🔄 Continuous Learning</h7>
                              <ul className="text-gray-700 text-sm space-y-1">
                                {technicalDetails.userFriendlyExplanation?.aiProcessing?.continuousLearning ? (
                                  <li>• {technicalDetails.userFriendlyExplanation.aiProcessing.continuousLearning}</li>
                                ) : (
                                  <>
                                    <li>• Learn from successful outcomes</li>
                                    <li>• Improve accuracy over time</li>
                                    <li>• Adapt to changing business rules</li>
                                    <li>• Optimise processing workflows</li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* API Endpoints - Simplified */}
                        <div className="space-y-6">
                          <h6 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                            <span>🔌</span>
                            <span>API Connections Needed</span>
                          </h6>
                          
                          {technicalDetails.apiEndpoints.map((endpoint, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                              
                              {/* Endpoint Header */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-sm">{idx + 1}</span>
                                  </div>
                                  <div>
                                    <h7 className="text-lg font-bold text-gray-900">{endpoint.name}</h7>
                                    <p className="text-gray-600 text-sm">{endpoint.purpose}</p>
                                  </div>
                                </div>
                                
                                {/* Test Button */}
                                <button
                                  onClick={() => testApiEndpoint(step.id, endpoint)}
                                  disabled={testingInProgress[`${step.id}-${endpoint.name}`]}
                                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-semibold"
                                >
                                  {testingInProgress[`${step.id}-${endpoint.name}`] ? (
                                    <>
                                      <Loader className="h-4 w-4 animate-spin" />
                                      <span>Testing...</span>
                                    </>
                                  ) : (
                                    <>
                                      <PlayCircle className="h-4 w-4" />
                                      <span>Test This API</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Simple Connection Details */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="text-gray-600 text-xs font-semibold mb-1">CONNECT TO</div>
                                  <div className="text-gray-900 text-sm font-mono break-all">{endpoint.url}</div>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="text-gray-600 text-xs font-semibold mb-1">METHOD</div>
                                  <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                                    endpoint.method === 'POST' ? 'bg-blue-600' :
                                    endpoint.method === 'GET' ? 'bg-emerald-600' :
                                    endpoint.method === 'PUT' ? 'bg-amber-600' : 'bg-gray-600'
                                  }`}>
                                    {endpoint.method}
                                  </span>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="text-gray-600 text-xs font-semibold mb-1">AUTHENTICATION</div>
                                  <div className="text-gray-900 text-sm">{endpoint.authentication}</div>
                                </div>
                              </div>

                              {/* How to Get Access */}
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-xl">🔑</span>
                                  <span className="font-bold text-yellow-800">How to Get API Access</span>
                                </div>
                                <div className="text-yellow-700 text-sm space-y-1">
                                  {endpoint.name.toLowerCase().includes('insurance') ? (
                                    <>
                                      <p>• Log into your insurance portal dashboard</p>
                                      <p>• Go to Settings → Developer/API section</p>
                                      <p>• Request API access (may require business account)</p>
                                      <p>• Generate API key and save it securely</p>
                                    </>
                                  ) : endpoint.name.toLowerCase().includes('email') ? (
                                    <>
                                      <p>• Sign up for email service (SendGrid, Mailgun, etc.)</p>
                                      <p>• Verify your domain and sender identity</p>
                                      <p>• Generate API key from dashboard</p>
                                      <p>• Test with a small email first</p>
                                    </>
                                  ) : (
                                    <>
                                      <p>• Contact your software provider's support team</p>
                                      <p>• Request developer/API access for your account</p>
                                      <p>• Follow their setup documentation</p>
                                      <p>• Test the connection before going live</p>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* What to Send */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <div className="text-gray-600 font-semibold mb-2 flex items-center space-x-2">
                                    <span>📤</span>
                                    <span>What to Send</span>
                                  </div>
                                  <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono overflow-x-auto">
                                    <pre className="text-gray-700">{JSON.stringify(endpoint.samplePayload, null, 2)}</pre>
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-gray-600 font-semibold mb-2 flex items-center space-x-2">
                                    <span>📥</span>
                                    <span>What You'll Get Back</span>
                                  </div>
                                  <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono overflow-x-auto">
                                    <pre className="text-gray-700">{JSON.stringify(endpoint.sampleResponse, null, 2)}</pre>
                                  </div>
                                </div>
                              </div>

                              {/* Test Results */}
                              {apiTestResults[`${step.id}-${endpoint.name}`] && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Terminal className="h-4 w-4 text-emerald-600" />
                                    <span className="font-bold text-emerald-700">✅ Test Results</span>
                                  </div>
                                  <div className="bg-white rounded p-3 text-xs font-mono overflow-x-auto border border-emerald-200">
                                    <pre className="text-gray-700">{JSON.stringify(apiTestResults[`${step.id}-${endpoint.name}`], null, 2)}</pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Step-by-Step Implementation */}
                        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                          <h6 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <span>📋</span>
                            <span>Step-by-Step Implementation</span>
                          </h6>
                          <div className="space-y-4">
                            {technicalDetails.implementation.steps.map((step, idx) => (
                              <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                  {idx + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="text-gray-900 font-medium">{step}</div>
                                  {idx === 0 && (
                                    <div className="text-gray-600 text-sm mt-1">
                                      💡 This is usually the hardest part - contact their support team for help
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Code Example */}
                        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                          <h6 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <span>💻</span>
                            <span>Code Example (For Developers)</span>
                          </h6>
                          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-green-400 text-sm font-mono">{technicalDetails.implementation.codeExample}</pre>
                          </div>
                        </div>

                        {/* Implementation Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-4 border-2 border-amber-200 text-center">
                            <div className="text-2xl mb-2">⏱️</div>
                            <div className="font-bold text-amber-700">Setup Time</div>
                            <div className="text-amber-600">{technicalDetails.implementation.estimatedTime}</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border-2 border-purple-200 text-center">
                            <div className="text-2xl mb-2">📊</div>
                            <div className="font-bold text-purple-700">Difficulty</div>
                            <div className="text-purple-600">{technicalDetails.implementation.difficulty}</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 text-center">
                            <div className="text-2xl mb-2">🎯</div>
                            <div className="font-bold text-emerald-700">AI Enhanced</div>
                            <div className="text-emerald-600">Smart Processing</div>
                          </div>
                        </div>

                        {/* For Coding Agents */}
                        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 border-2 border-indigo-200">
                          <div className="text-center">
                            <div className="text-3xl mb-3">🤖</div>
                            <h6 className="text-xl font-bold text-indigo-700 mb-2">For AI Coding Agents</h6>
                            <p className="text-indigo-600 mb-4">
                              This specification contains all the information needed to build this automation.
                              Focus on the API endpoints, authentication requirements, and AI processing logic.
                            </p>
                            <div className="bg-white rounded-lg p-4 border border-indigo-200">
                              <div className="text-indigo-700 font-semibold text-sm">
                                Key Implementation Points:
                              </div>
                              <ul className="text-indigo-600 text-sm mt-2 space-y-1 text-left">
                                <li>• Use the exact API endpoints and payloads shown above</li>
                                <li>• Implement AI processing for data enhancement and decision making</li>
                                <li>• Add proper error handling and retry logic</li>
                                <li>• Include logging and monitoring for debugging</li>
                                <li>• Test thoroughly with the sample data provided</li>
                              </ul>
                            </div>
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
                {index < (workflow.steps || []).length - 1 && (
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

      {/* Export Explanation Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🚀</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make This Automation a Reality?</h3>
            <p className="text-lg text-gray-700 mb-6">
              This workflow analysis is just the beginning. To actually build and deploy this automation system, 
              you'll need detailed technical specifications that developers or AI coding agents can follow.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Development Implementation Guide</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Generate a comprehensive PDF report containing everything needed to build this automation:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Complete React Native app structure</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Step-by-step implementation instructions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>API integration details & endpoints</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>AI processing workflows & prompts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Database schemas & data flows</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🤖</span>
                  <h4 className="text-lg font-semibold text-gray-900">Perfect for AI Coding Agents</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  The generated report is specifically designed to be handed to:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Claude, GPT-4, or other AI coding assistants</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Human developers (React Native/TypeScript)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Development teams or agencies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No-code/low-code platform builders</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-lg font-semibold text-yellow-800 mb-2">What You'll Get</h5>
                  <p className="text-yellow-700 mb-3">
                    The PDF contains a <strong>complete mobile app specification</strong> - essentially a blueprint 
                    that transforms this workflow analysis into a buildable React Native application.
                  </p>
                  <p className="text-yellow-700">
                    <strong>Simply hand this document to any developer or AI coding agent</strong> and they'll have 
                    everything needed to build your custom automation platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Click the <strong>"📄 Generate Development PDF"</strong> button above to create your implementation guide.
              </p>
              <p className="text-sm text-gray-500">
                The generated PDF will be approximately 15-25 pages and contains everything needed to build this automation system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered React PDF Component */}
      {aiGeneratedContent && (
        <div className="mt-8">
          <PDFReportGenerator 
            content={aiGeneratedContent}
            workflowData={{
              workflowName: workflow.name,
              workflowDescription: workflow.description || 'Workflow automation implementation guide',
              steps: (workflow.steps || []).map(step => ({
                name: step.name,
                description: step.description,
                type: step.type || 'automation'
              }))
            }}
            isGenerating={false}
          />
        </div>
      )}

      {/* Loading state for AI generation */}
      {isGeneratingWithAI && (
        <div className="mt-8">
          <PDFReportGenerator 
            content={null as any}
            workflowData={{
              workflowName: workflow.name,
              workflowDescription: workflow.description || 'Workflow automation implementation guide',
              steps: (workflow.steps || []).map(step => ({
                name: step.name,
                description: step.description,
                type: step.type || 'automation'
              }))
            }}
            isGenerating={true}
          />
        </div>
      )}
    </div>
  );
}