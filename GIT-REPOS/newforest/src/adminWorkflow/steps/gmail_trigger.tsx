import React, { useState } from 'react';
import { 
  Mail, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Edit,
  Brain,
  Zap,
  Clock,
  TestTube
} from 'lucide-react';

interface GmailTriggerProps {
  onBack?: () => void;
  onDataProcessed?: (data: any) => void;
}

const GmailTrigger: React.FC<GmailTriggerProps> = ({ onBack, onDataProcessed }) => {
  const [isActive, setIsActive] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error'>('idle');
  const [gmailConnected, setGmailConnected] = useState(false);
  const [claudeConnected, setClaudeConnected] = useState(false);
  const [emailsFound, setEmailsFound] = useState(0);
  const [processedData, setProcessedData] = useState<any>(null);
  const [aiResponse, setAiResponse] = useState<any>(null);

  // Demo email data to simulate incoming lead
  const demoEmailData = {
    subject: "Incoming Lead",
    from: "contact@newforestadventures.com",
    body: `
Hi there,

I hope this email finds you well. I'm reaching out regarding a potential team building event for our company.

Company: TechCorp Solutions
Contact Person: Sarah Johnson  
Email: sarah.johnson@techcorp.com
Phone: +44 7892 123456
Team Size: 25 people
Budget: £5,000 - £7,500
Preferred Date: July 15th, 2025
Activity Interest: Outdoor team challenges and problem-solving activities

We're looking for a full-day team building experience that combines outdoor activities with leadership development. Our team is based in London but willing to travel within 2 hours for the right experience.

Could you please send us more information about your programs and availability?

Best regards,
Sarah Johnson
HR Manager
TechCorp Solutions
`,
    timestamp: new Date().toISOString(),
    labels: ["INBOX", "UNREAD"]
  };

  // Simulate Gmail connection test
  const testGmailConnection = async () => {
    setStatus('processing');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGmailConnected(true);
    setStatus('idle');
    console.log('✅ Gmail connection established');
  };

  // Simulate Claude AI connection test
  const testClaudeConnection = async () => {
    setStatus('processing');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setClaudeConnected(true);
    setStatus('idle');
    console.log('✅ Claude Sonnet connection established');
  };

  // Demo function to simulate email processing
  const runDemoProcessing = async () => {
    setStatus('listening');
    setEmailsFound(0);
    setProcessedData(null);
    setAiResponse(null);
    
    console.log('🔄 Starting demo email processing...');
    
    // Step 1: Simulate finding email
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEmailsFound(1);
    console.log('📧 Found 1 email with subject "Incoming Lead"');
    
    // Step 2: Simulate AI processing
    setStatus('processing');
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Simulate Claude Sonnet extracting structured data
    const extractedData = {
      title: "TechCorp Solutions - Team Building Event",
      name: "Sarah Johnson",
      email: "sarah.johnson@techcorp.com", 
      phone: "+44 7892 123456",
      companyName: "TechCorp Solutions",
      monetaryValue: 6250, // Average of £5,000-£7,500 budget
      source: "gmail-incoming-lead",
      tags: ["gmail-lead", "ai-processed", "team-building", "london"],
      notes: "25 people team building event. Interested in outdoor challenges and leadership development. Preferred date: July 15th, 2025. Budget: £5,000-£7,500.",
      teamSize: 25,
      preferredDate: "2025-07-15",
      activityInterest: "Outdoor team challenges and problem-solving activities",
      location: "London (willing to travel 2 hours)"
    };

    const aiProcessingResponse = {
      success: true,
      extractedFields: extractedData,
      confidence: 0.95,
      processingTime: "2.3s",
      emailAnalysis: {
        sentiment: "positive",
        urgency: "medium",
        leadQuality: "high",
        keyTopics: ["team building", "outdoor activities", "leadership development", "budget confirmed"]
      },
      rawEmail: demoEmailData
    };

    setProcessedData(extractedData);
    setAiResponse(aiProcessingResponse);
    setStatus('success');
    setLastRun(new Date());
    
    console.log('✅ AI processing complete:', extractedData);
    
    // Pass data to next step if callback provided
    if (onDataProcessed) {
      onDataProcessed(extractedData);
    }
  };

  // Start/stop listening
  const handleToggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setStatus('listening');
      console.log('👂 Started listening for "Incoming Lead" emails...');
    } else {
      setStatus('idle');
      console.log('⏹️ Stopped email monitoring');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'listening': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-orange-600 bg-orange-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'listening': return <div className="animate-pulse rounded-full h-4 w-4 bg-blue-600"></div>;
      case 'processing': return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Back to Admin Workflow</span>
                </button>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-orange-500" />
                  <h1 className="text-2xl font-bold text-slate-900">Gmail Lead Trigger</h1>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">TRIGGER</span>
                </div>
                <p className="text-slate-600 mt-1">Monitors Gmail for "Incoming Lead" emails and processes with AI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="text-sm font-medium capitalize">{status}</span>
              </div>

              <button
                onClick={runDemoProcessing}
                disabled={status === 'processing' || status === 'listening'}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300"
              >
                <TestTube className="h-4 w-4" />
                <span>Run Demo</span>
              </button>
              
              <button
                onClick={handleToggle}
                disabled={!gmailConnected || !claudeConnected}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  !gmailConnected || !claudeConnected
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : isActive 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isActive ? 'Stop' : 'Start'} Monitoring</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Configuration */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Trigger Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Trigger Overview</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Purpose</h4>
                  <p className="text-slate-600">
                    Automatically monitors your Gmail inbox for emails with the subject "Incoming Lead", 
                    processes the content with Claude Sonnet AI to extract structured lead data, and 
                    triggers the GoHighLevel opportunity creation workflow.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Workflow Integration</h4>
                  <ul className="text-slate-600 space-y-1">
                    <li>• <strong>Trigger:</strong> Gmail email with subject "Incoming Lead"</li>
                    <li>• <strong>Processing:</strong> Claude Sonnet AI extracts lead information</li>
                    <li>• <strong>Output:</strong> Structured data for GoHighLevel opportunity</li>
                    <li>• <strong>Next Step:</strong> Automatically creates opportunity in GoHighLevel</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* API Connections */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">API Connections</h3>
              
              <div className="space-y-6">
                {/* Gmail Connection */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-red-500" />
                      <h4 className="font-medium text-slate-900">Gmail API</h4>
                    </div>
                    <button
                      onClick={testGmailConnection}
                      disabled={status === 'processing'}
                      className="px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm disabled:bg-red-25"
                    >
                      {gmailConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>Monitor inbox for emails with subject: <code className="bg-slate-100 px-2 py-1 rounded">"Incoming Lead"</code></p>
                    <p className="mt-1">Status: <span className={gmailConnected ? 'text-green-600' : 'text-slate-500'}>{gmailConnected ? '✅ Connected' : '⏸️ Not Connected'}</span></p>
                  </div>
                </div>

                {/* Claude AI Connection */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium text-slate-900">Claude Sonnet AI</h4>
                    </div>
                    <button
                      onClick={testClaudeConnection}
                      disabled={status === 'processing'}
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm disabled:bg-purple-25"
                    >
                      {claudeConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>AI-powered lead data extraction and field mapping</p>
                    <p className="mt-1">Status: <span className={claudeConnected ? 'text-green-600' : 'text-slate-500'}>{claudeConnected ? '✅ Connected' : '⏸️ Not Connected'}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Processing Steps</h3>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Monitor Gmail Inbox', description: 'Scan for emails with subject "Incoming Lead"', status: gmailConnected ? 'completed' : 'pending' },
                  { step: 2, title: 'Extract Email Content', description: 'Parse email body, sender, and metadata', status: emailsFound > 0 ? 'completed' : 'pending' },
                  { step: 3, title: 'AI Content Analysis', description: 'Send to Claude Sonnet for intelligent processing', status: status === 'processing' ? 'active' : aiResponse ? 'completed' : 'pending' },
                  { step: 4, title: 'Extract Lead Fields', description: 'Map email content to GoHighLevel opportunity fields', status: processedData ? 'completed' : 'pending' },
                  { step: 5, title: 'Trigger Next Step', description: 'Pass structured data to GoHighLevel workflow', status: processedData ? 'completed' : 'pending' }
                ].map((item) => (
                  <div key={item.step} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      item.status === 'completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {item.status === 'active' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        item.step
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Processing Results */}
            {aiResponse && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  🤖 AI Processing Results
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Processing Time:</span>
                      <p className="font-mono text-slate-900">{aiResponse.processingTime}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Confidence:</span>
                      <p className="text-green-600 font-medium">{(aiResponse.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Lead Quality:</span>
                      <p className="text-green-600 font-medium capitalize">{aiResponse.emailAnalysis.leadQuality}</p>
                    </div>
                  </div>
                  
                  {/* Extracted Lead Data */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-3">Extracted Lead Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-green-700">Name:</span> <span className="text-green-900 font-medium">{processedData.name}</span></div>
                      <div><span className="text-green-700">Company:</span> <span className="text-green-900 font-medium">{processedData.companyName}</span></div>
                      <div><span className="text-green-700">Email:</span> <span className="text-green-900 font-medium">{processedData.email}</span></div>
                      <div><span className="text-green-700">Phone:</span> <span className="text-green-900 font-medium">{processedData.phone}</span></div>
                      <div><span className="text-green-700">Budget:</span> <span className="text-green-900 font-medium">£{processedData.monetaryValue.toLocaleString()}</span></div>
                      <div><span className="text-green-700">Team Size:</span> <span className="text-green-900 font-medium">{processedData.teamSize} people</span></div>
                    </div>
                  </div>
                  
                  {/* Raw Data */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">Structured Data for GoHighLevel:</h4>
                    <pre className="text-xs text-slate-600 overflow-x-auto font-mono bg-white p-3 rounded border max-h-64">
                      {JSON.stringify(processedData, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Trigger Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Gmail Connection</span>
                    <span className={`font-medium ${gmailConnected ? 'text-green-600' : 'text-slate-500'}`}>
                      {gmailConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Claude AI</span>
                    <span className={`font-medium ${claudeConnected ? 'text-green-600' : 'text-slate-500'}`}>
                      {claudeConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monitoring Status</span>
                    <span className={`font-medium ${isActive ? 'text-green-600' : 'text-slate-500'}`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Emails Found</span>
                    <span className="text-slate-900 font-medium">{emailsFound}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Last Processed</span>
                    <span className="text-slate-900">
                      {lastRun ? lastRun.toLocaleString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {processedData && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-slate-900">Lead processed: {processedData.name}</p>
                        <p className="text-xs text-slate-500">{lastRun?.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-slate-900">Trigger initialized</p>
                      <p className="text-xs text-slate-500">System startup</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={runDemoProcessing}
                    disabled={status === 'processing'}
                    className="w-full flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors disabled:bg-purple-25 disabled:text-purple-400"
                  >
                    <TestTube className="h-4 w-4" />
                    <span>Run Demo Processing</span>
                  </button>
                  <button 
                    onClick={testGmailConnection}
                    className="w-full flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Test Gmail Connection</span>
                  </button>
                  <button 
                    onClick={testClaudeConnection}
                    className="w-full flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Brain className="h-4 w-4" />
                    <span>Test Claude AI</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                    <Eye className="h-4 w-4" />
                    <span>View Email Logs</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GmailTrigger; 