const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export interface WorkflowAnalysisRequest {
  workflowName: string;
  workflowDescription: string;
  steps: Array<{
    name: string;
    description?: string;
    type: string;
  }>;
}

export interface AIGeneratedReport {
  componentCode: string;
  reportData: any;
  metadata: {
    title: string;
    generatedAt: string;
    isRealAI: boolean;
  };
}

export class ClaudeService {
  private async callClaude(prompt: string): Promise<string> {
    console.log('🔄 Creating dedicated PDF report API call...');
    
    try {
      // Create a new proxy API call specifically for PDF reports
      const response = await fetch('/api/claude-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          reportType: 'react-component'
        })
      });

      console.log('📡 PDF API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ PDF API error:', errorData);
        
        // Handle timeout specifically
        if (response.status === 504) {
          throw new Error(`Report generation timed out. The comprehensive prompt requires significant processing time. Please try again or consider simplifying the workflow.`);
        }
        
        throw new Error(`PDF API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('✅ PDF API response received:', { 
        success: data.success, 
        source: data.source || 'api',
        hasContent: !!data.content 
      });

      if (data.success && data.content) {
        console.log('✅ Using REAL AI-generated React component from Claude 4 Opus');
        return data.content;
      } else {
        throw new Error('Invalid response format from PDF API');
      }
    } catch (error) {
      console.error('❌ Error calling PDF API:', error);
      console.log('⚠️ Falling back to static content (API not available in local dev)');
      throw error;
    }
  }

  async generateReactReport(workflowData: WorkflowAnalysisRequest): Promise<AIGeneratedReport> {
    console.log('🤖 Making REAL API call to Claude 4 Opus for React component generation...');
    console.log('📊 Workflow data:', { 
      name: workflowData.workflowName, 
      steps: workflowData.steps.length,
      hasApiKey: !!CLAUDE_API_KEY
    });
    
    // Revolutionary prompt: Generate complete React component from scratch
    const prompt = `You are a world-class React developer and Fortune 500 business consultant. Generate a COMPLETE, PRODUCTION-READY React component for a comprehensive business implementation report.

**Project Details:**
- Name: ${workflowData.workflowName}
- Description: ${workflowData.workflowDescription}
- Steps: ${workflowData.steps.map((step, index) => `${index + 1}. ${step.name}`).join(', ')}

**CRITICAL REQUIREMENTS:**

1. **Generate COMPLETE React Component Code** - Include everything from imports to export
2. **Modern, Beautiful Design** - Use Tailwind CSS, gradients, shadows, modern UI patterns
3. **Interactive Charts** - Include Recharts (PieChart, AreaChart, BarChart) with realistic data
4. **Professional Layout** - Multi-section report with navigation, headers, footers
5. **Real Business Data** - Generate realistic ROI metrics, timelines, costs, technologies
6. **Responsive Design** - Mobile-friendly with proper spacing and typography
7. **Rich Visualizations** - Charts, progress bars, metric cards, comparison tables

**Design Inspiration:** Create something as beautiful as a Fortune 500 annual report with:
- Hero section with gradient background
- Interactive navigation
- Data visualization charts
- Professional metric cards
- Detailed implementation phases
- Technology stack recommendations
- Financial projections
- Risk assessments

**Technical Requirements:**
- Use React functional components with hooks
- Import Recharts for charts: PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
- Import Lucide React icons: Building2, Globe, Target, Award, Lightbulb, TrendingUp, etc.
- Use Tailwind CSS for all styling
- Include realistic sample data for charts
- Make it fully interactive and professional

**RETURN FORMAT:** Return ONLY the complete React component code, starting with imports and ending with export default. Do NOT include any explanations, markdown formatting, or additional text.

Generate the complete React component now:`;

    try {
      console.log('📡 Sending React component generation prompt to Claude 4 Opus (Vercel Pro extended timeout)...');
      const aiResponse = await this.callClaude(prompt);
      console.log('✅ Got React component from Claude API:', { 
        responseLength: aiResponse.length,
        preview: aiResponse.substring(0, 200) + '...'
      });
      
      // Extract the React component code - improved extraction
      let componentCode = aiResponse;
      
      // Remove any markdown code blocks if present
      if (componentCode.includes('```')) {
        const codeBlockMatch = componentCode.match(/```(?:jsx?|typescript|tsx?)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          componentCode = codeBlockMatch[1];
        }
      }
      
      // Validate that we have a proper React component
      const hasImport = componentCode.includes('import React') || componentCode.includes('import {');
      const hasExport = componentCode.includes('export default') || componentCode.includes('export {');
      const hasComponent = componentCode.includes('function ') || componentCode.includes('const ') || componentCode.includes('=>');
      
      if (!hasImport || !hasComponent) {
        console.error('❌ Invalid React component structure in Claude response');
        console.error('Has import:', hasImport);
        console.error('Has component:', hasComponent);
        console.error('Response preview:', componentCode.substring(0, 1000));
        throw new Error('Invalid React component format from Claude API');
      }
      
      console.log('🎯 Successfully extracted REAL Claude React component for:', workflowData.workflowName);
      return {
        componentCode,
        reportData: {
          workflowName: workflowData.workflowName,
          workflowDescription: workflowData.workflowDescription,
          steps: workflowData.steps
        },
        metadata: {
          title: workflowData.workflowName,
          generatedAt: new Date().toISOString(),
          isRealAI: true
        }
      };
    } catch (error) {
      console.error('❌ FAILED to get real Claude React component, using fallback:', error);
      return this.getFallbackReactReport(workflowData);
    }
  }

  private getFallbackReactReport(workflowData: WorkflowAnalysisRequest): AIGeneratedReport {
    console.log('⚠️ Using STATIC FALLBACK React component for:', workflowData.workflowName);
    console.log('🔧 Deploy to production to see real AI-generated components');
    
    const fallbackComponent = `import React from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, TrendingUp, Target, Award } from 'lucide-react';

export default function ${workflowData.workflowName.replace(/[^a-zA-Z0-9]/g, '')}Report() {
  const chartData = [
    { name: 'Phase 1', value: 30, color: '#3b82f6' },
    { name: 'Phase 2', value: 25, color: '#8b5cf6' },
    { name: 'Phase 3', value: 25, color: '#ec4899' },
    { name: 'Phase 4', value: 20, color: '#f59e0b' }
  ];

  const monthlyData = [
    { month: 'Jan', value: 1200 },
    { month: 'Feb', value: 1800 },
    { month: 'Mar', value: 2400 },
    { month: 'Apr', value: 3200 },
    { month: 'May', value: 4100 },
    { month: 'Jun', value: 5000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Building2 className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">${workflowData.workflowName}</h1>
              <p className="text-blue-200">AI-Powered Implementation Guide</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <TrendingUp className="w-8 h-8 mb-3" />
              <h3 className="text-2xl font-bold">£156,000</h3>
              <p className="text-blue-200">Annual Value</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Target className="w-8 h-8 mb-3" />
              <h3 className="text-2xl font-bold">2,400 hrs</h3>
              <p className="text-blue-200">Hours Saved</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Award className="w-8 h-8 mb-3" />
              <h3 className="text-2xl font-bold">85%</h3>
              <p className="text-blue-200">Efficiency Gain</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <Building2 className="w-8 h-8 mb-3" />
              <h3 className="text-2xl font-bold">6-8 weeks</h3>
              <p className="text-blue-200">Implementation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-yellow-800 mb-2">⚠️ Development Mode</h3>
          <p className="text-yellow-700">This is a static template. Deploy to production for real Claude 4 Opus generated components.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Implementation Phases</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => \`\${name}: \${(percent * 100).toFixed(0)}%\`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Progress Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Implementation Overview</h3>
          <p className="text-gray-600 mb-6">
            This automated solution for ${workflowData.workflowName} will transform your business operations 
            through intelligent automation and data-driven insights.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${workflowData.steps.map((step, index) => `
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">${step.name}</h4>
              <p className="text-sm text-gray-600">Phase ${index + 1} implementation details</p>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  );
}`;

    return {
      componentCode: fallbackComponent,
      reportData: {
        workflowName: workflowData.workflowName,
        workflowDescription: workflowData.workflowDescription,
        steps: workflowData.steps
      },
      metadata: {
        title: workflowData.workflowName,
        generatedAt: new Date().toISOString(),
        isRealAI: false
      }
    };
  }
}

export const claudeService = new ClaudeService(); 