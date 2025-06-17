import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Sparkles, 
  Factory, 
  ShoppingCart, 
  Stethoscope, 
  Building2,
  MapPin,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { PDFReportGenerator } from './pdf/PDFReportGenerator';
import { ClaudeService, WorkflowAnalysisRequest, AIGeneratedContent } from '../services/claudeService';

// Sample industry data for robust reports
const sampleIndustries = [
  {
    id: 'healthcare',
    name: 'Healthcare - Patient Management',
    icon: Stethoscope,
    color: 'emerald',
    workflow: {
      workflowName: 'Automated Patient Intake & Triage System',
      workflowDescription: 'Comprehensive patient management system that automates intake, triage, appointment scheduling, and follow-up communications for healthcare facilities.',
      steps: [
        {
          name: 'Patient Registration & Data Collection',
          description: 'Automated collection of patient demographics, insurance information, medical history, and current symptoms through digital forms',
          type: 'automation'
        },
        {
          name: 'AI-Powered Symptom Triage',
          description: 'AI analysis of patient symptoms to determine urgency level and route to appropriate department or healthcare provider',
          type: 'ai'
        },
        {
          name: 'Smart Appointment Scheduling',
          description: 'Intelligent scheduling system that considers provider availability, patient preferences, urgency level, and treatment requirements',
          type: 'automation'
        },
        {
          name: 'Insurance Verification & Pre-Authorization',
          description: 'Automated verification of insurance coverage and pre-authorization for treatments and procedures',
          type: 'api'
        },
        {
          name: 'Automated Reminder & Follow-up System',
          description: 'Multi-channel reminder system for appointments, medication refills, and follow-up care coordination',
          type: 'notification'
        }
      ]
    },
    benefits: [
      'Reduce patient wait times by 60%',
      'Improve staff efficiency by 40%',
      'Decrease administrative errors by 85%',
      'Enhance patient satisfaction scores'
    ]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing - Quality Control',
    icon: Factory,
    color: 'blue',
    workflow: {
      workflowName: 'AI-Enhanced Quality Control & Production Optimization',
      workflowDescription: 'Advanced manufacturing workflow that uses AI and IoT sensors to monitor production quality, predict maintenance needs, and optimize supply chain management.',
      steps: [
        {
          name: 'Real-time Production Monitoring',
          description: 'IoT sensors and computer vision systems monitor production line performance, product quality, and equipment status in real-time',
          type: 'automation'
        },
        {
          name: 'AI Quality Inspection & Defect Detection',
          description: 'Machine learning algorithms analyze product images and sensor data to identify defects and quality issues automatically',
          type: 'ai'
        },
        {
          name: 'Predictive Maintenance Scheduling',
          description: 'AI-powered analysis of equipment performance data to predict maintenance needs and schedule repairs before failures occur',
          type: 'ai'
        },
        {
          name: 'Automated Inventory & Supply Chain Management',
          description: 'Dynamic inventory management system that automatically orders materials, tracks shipments, and optimizes stock levels',
          type: 'automation'
        },
        {
          name: 'Quality Reports & Compliance Documentation',
          description: 'Automated generation of quality reports, compliance documentation, and performance analytics for stakeholders',
          type: 'document'
        }
      ]
    },
    benefits: [
      'Reduce defect rates by 75%',
      'Decrease downtime by 50%',
      'Optimize inventory costs by 30%',
      'Improve regulatory compliance'
    ]
  },
  {
    id: 'retail',
    name: 'E-commerce - Customer Experience',
    icon: ShoppingCart,
    color: 'purple',
    workflow: {
      workflowName: 'Intelligent E-commerce Customer Journey Optimization',
      workflowDescription: 'End-to-end e-commerce automation that personalizes customer experiences, optimizes pricing, manages inventory, and automates customer service.',
      steps: [
        {
          name: 'Personalized Product Recommendations',
          description: 'AI-powered recommendation engine that analyzes customer behavior, purchase history, and preferences to suggest relevant products',
          type: 'ai'
        },
        {
          name: 'Dynamic Pricing Optimization',
          description: 'Machine learning algorithms that adjust pricing in real-time based on demand, competition, inventory levels, and market conditions',
          type: 'ai'
        },
        {
          name: 'Automated Customer Service Chatbot',
          description: 'Intelligent chatbot that handles customer inquiries, processes returns, tracks orders, and escalates complex issues to human agents',
          type: 'ai'
        },
        {
          name: 'Smart Inventory Management',
          description: 'Predictive inventory system that forecasts demand, automates reordering, and optimizes warehouse operations',
          type: 'automation'
        },
        {
          name: 'Personalized Marketing Campaign Automation',
          description: 'AI-driven marketing automation that creates personalized email campaigns, social media ads, and promotional offers',
          type: 'automation'
        }
      ]
    },
    benefits: [
      'Increase conversion rates by 45%',
      'Reduce customer service costs by 60%',
      'Improve inventory turnover by 35%',
      'Enhance customer lifetime value'
    ]
  },
  {
    id: 'finance',
    name: 'Financial Services - Risk Management',
    icon: Building2,
    color: 'indigo',
    workflow: {
      workflowName: 'Automated Financial Risk Assessment & Compliance',
      workflowDescription: 'Comprehensive financial risk management system that automates credit assessments, fraud detection, regulatory compliance, and investment analysis.',
      steps: [
        {
          name: 'Automated Credit Risk Assessment',
          description: 'AI-powered analysis of credit applications using alternative data sources, financial history, and behavioral patterns',
          type: 'ai'
        },
        {
          name: 'Real-time Fraud Detection',
          description: 'Machine learning algorithms that monitor transactions in real-time to identify and prevent fraudulent activities',
          type: 'ai'
        },
        {
          name: 'Regulatory Compliance Monitoring',
          description: 'Automated system that monitors transactions and activities for compliance with financial regulations and reporting requirements',
          type: 'automation'
        },
        {
          name: 'Investment Portfolio Optimization',
          description: 'AI-driven portfolio management that automatically rebalances investments based on risk profiles and market conditions',
          type: 'ai'
        },
        {
          name: 'Automated Financial Reporting',
          description: 'System that generates comprehensive financial reports, regulatory filings, and performance analytics automatically',
          type: 'document'
        }
      ]
    },
    benefits: [
      'Reduce loan default rates by 40%',
      'Detect fraud 90% faster',
      'Improve compliance efficiency by 70%',
      'Optimize investment returns'
    ]
  }
];

export function Reports() {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIGeneratedContent | null>(null);
  const [dataImportText, setDataImportText] = useState('');
  const [isGeneratingFromData, setIsGeneratingFromData] = useState(false);
  const [dataGeneratedContent, setDataGeneratedContent] = useState<AIGeneratedContent | null>(null);

  // Generate report from sample industry
  const generateIndustryReport = async (industry: typeof sampleIndustries[0]) => {
    setIsGeneratingReport(true);
    setSelectedIndustry(industry.id);
    
    try {
      const claudeService = new ClaudeService();
      const aiContent = await claudeService.generateImplementationGuide(industry.workflow);
      setGeneratedContent(aiContent);
    } catch (error) {
      console.error('Error generating industry report:', error);
      alert('Error generating report. Please check your Claude API key configuration.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Generate report from user data
  const generateDataReport = async () => {
    if (!dataImportText.trim()) {
      alert('Please enter some data to generate a report from.');
      return;
    }

    setIsGeneratingFromData(true);
    
    try {
      // Parse the data and create a workflow request
      const workflowRequest: WorkflowAnalysisRequest = {
        workflowName: 'Custom Data Analysis & Automation',
        workflowDescription: `Analysis and automation recommendations based on the following data: ${dataImportText.substring(0, 200)}...`,
        steps: [
          {
            name: 'Data Processing & Analysis',
            description: 'Automated processing and analysis of the provided data to identify patterns and opportunities',
            type: 'ai'
          },
          {
            name: 'Automation Opportunity Identification',
            description: 'AI-powered identification of automation opportunities within the data and processes',
            type: 'ai'
          },
          {
            name: 'Implementation & Integration',
            description: 'Automated system integration and implementation of identified improvements',
            type: 'automation'
          }
        ]
      };

      const claudeService = new ClaudeService();
      const aiContent = await claudeService.generateImplementationGuide(workflowRequest);
      setDataGeneratedContent(aiContent);
    } catch (error) {
      console.error('Error generating data report:', error);
      alert('Error generating report. Please check your Claude API key configuration.');
    } finally {
      setIsGeneratingFromData(false);
    }
  };

  const selectedIndustryData = sampleIndustries.find(ind => ind.id === selectedIndustry);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">AI-Powered Reports</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience the power of AI-generated implementation reports. See real-time demonstrations of how our AI analyzes your business processes and creates comprehensive implementation guides.
        </p>
      </div>

      {/* Main Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Option 1: Sample Industry Reports */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Try Sample Industry Reports</h3>
            <p className="text-gray-600">
              See AI reports for different industries. Each report contains comprehensive analysis, ROI calculations, and implementation guides.
            </p>
          </div>
          
          <div className="space-y-3">
            {sampleIndustries.map((industry) => {
              const Icon = industry.icon;
              const colorClasses = {
                emerald: 'from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
                blue: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
                purple: 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
                indigo: 'from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
              };
              
              return (
                <button
                  key={industry.id}
                  onClick={() => generateIndustryReport(industry)}
                  disabled={isGeneratingReport}
                  className={`w-full p-4 rounded-lg bg-gradient-to-r ${colorClasses[industry.color as keyof typeof colorClasses]} text-white hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-left">{industry.name}</span>
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Option 2: Data Import */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Generate from Your Data</h3>
            <p className="text-gray-600">
              Paste your business data, processes, or workflow descriptions. Our AI will analyze it and create a comprehensive automation report.
            </p>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={dataImportText}
              onChange={(e) => setDataImportText(e.target.value)}
              placeholder="Paste your business data, process descriptions, or workflow details here...

Example:
- Customer support tickets and response times
- Sales process workflows
- Financial reporting procedures
- Manufacturing quality control data
- Any business process you want to automate"
              className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <button
              onClick={generateDataReport}
              disabled={isGeneratingFromData || !dataImportText.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGeneratingFromData ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate AI Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Option 3: Workflow Requirement */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Workflow Reports</h3>
            <p className="text-gray-600 mb-4">
              This feature is designed to process reports for workflows.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Current Status:</strong> You currently only have one step in your workflow. Please add 2 more steps and then we can produce your development implementation report.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Step 1: Insurance claim processing ✓</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Step 2: Email template creation ✓</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-400">Step 3: Add one more step needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => window.open('#workflows', '_self')}
            className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowRight className="h-5 w-5" />
            <span>Go to Workflow Designer</span>
          </button>
        </div>
      </div>

      {/* Industry Report Generation */}
      {isGeneratingReport && selectedIndustryData && (
        <div className="bg-white rounded-xl p-8 border-2 border-blue-200 shadow-lg">
          <PDFReportGenerator 
            content={null as any}
            workflowData={selectedIndustryData.workflow}
            isGenerating={true}
          />
        </div>
      )}

      {/* Generated Industry Report */}
      {generatedContent && selectedIndustryData && (
        <div className="bg-white rounded-xl p-8 border-2 border-green-200 shadow-lg">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedIndustryData.name} - Implementation Report Generated! 🎉
            </h3>
            <p className="text-gray-600">
              Your comprehensive AI-generated report is ready. This professional document contains everything needed to implement this automation.
            </p>
          </div>
          
          <PDFReportGenerator 
            content={generatedContent}
            workflowData={selectedIndustryData.workflow}
            isGenerating={false}
          />
        </div>
      )}

      {/* Data Report Generation */}
      {isGeneratingFromData && (
        <div className="bg-white rounded-xl p-8 border-2 border-blue-200 shadow-lg">
          <PDFReportGenerator 
            content={null as any}
            workflowData={{
              workflowName: 'Custom Data Analysis & Automation',
              workflowDescription: 'AI-generated analysis based on your provided data',
              steps: []
            }}
            isGenerating={true}
          />
        </div>
      )}

      {/* Generated Data Report */}
      {dataGeneratedContent && (
        <div className="bg-white rounded-xl p-8 border-2 border-green-200 shadow-lg">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Custom Data Report Generated! 🎉
            </h3>
            <p className="text-gray-600">
              Your AI analysis is complete. This report contains automation recommendations based on your specific data.
            </p>
          </div>
          
          <PDFReportGenerator 
            content={dataGeneratedContent}
            workflowData={{
              workflowName: 'Custom Data Analysis & Automation',
              workflowDescription: 'AI-generated analysis based on your provided data',
              steps: [
                {
                  name: 'Data Processing & Analysis',
                  description: 'Automated processing and analysis of the provided data',
                  type: 'ai'
                }
              ]
            }}
            isGenerating={false}
          />
        </div>
      )}

      {/* Autopilot Reports Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Reports on Autopilot</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Want reports generated automatically? Here's how businesses are using AI to create reports on autopilot with just simple data inputs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Planaroo.ai Example */}
          <div className="bg-white rounded-xl p-6 border border-indigo-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Planaroo.ai</h3>
                <p className="text-sm text-gray-600">Location Intelligence Reports</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              Simply enter an address and get comprehensive location intelligence reports including demographics, competition analysis, foot traffic patterns, and business viability assessments.
            </p>
            
            <div className="bg-indigo-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-indigo-700 font-medium mb-2">Example Input:</p>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-indigo-600" />
                <span className="text-sm text-gray-700">123 High Street, London, UK</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Demographic analysis report</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Competition mapping</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Foot traffic analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Business viability assessment</span>
              </div>
            </div>
            
            <button 
              onClick={() => window.open('https://planaroo.ai', '_blank')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Visit Planaroo.ai</span>
            </button>
          </div>

          {/* Your Custom Solution */}
          <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Your Custom Solution</h3>
                <p className="text-sm text-gray-600">Industry-Specific Automation</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              Build your own autopilot reporting system. Our AI can be configured to generate industry-specific reports from any data input - financial data, customer information, operational metrics, and more.
            </p>
            
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-700 font-medium mb-2">What You Could Build:</p>
              <div className="space-y-1">
                <span className="text-sm text-gray-700 block">• Financial performance reports from transaction data</span>
                <span className="text-sm text-gray-700 block">• Customer insights from CRM data</span>
                <span className="text-sm text-gray-700 block">• Operational efficiency reports from logs</span>
                <span className="text-sm text-gray-700 block">• Compliance reports from audit data</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Custom data processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">AI-powered analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Professional PDF generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Automated delivery</span>
              </div>
            </div>
            
            <button 
              onClick={() => window.open('https://calendly.com/your-caio/strategy-session', '_blank')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowRight className="h-4 w-4" />
              <span>Book Strategy Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 