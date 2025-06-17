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

export interface AIGeneratedContent {
  executiveSummary: {
    title: string;
    overview: string;
    keyBenefits: string[];
    roiMetrics: {
      annualHoursSaved: number;
      annualValue: string;
      efficiencyGain: string;
      setupTime: string;
    };
  };
  technicalSpecification: {
    title: string;
    automationType: string;
    requiredTechnologies: string[];
    apiConnections: Array<{
      name: string;
      purpose: string;
      endpoint: string;
      method: string;
      authentication: string;
      sampleRequest: any;
      sampleResponse: any;
    }>;
    architectureOverview: string;
  };
  implementationPlan: {
    title: string;
    phases: Array<{
      phase: string;
      duration: string;
      description: string;
      tasks: string[];
      deliverables: string[];
    }>;
    totalTimeline: string;
    criticalPath: string[];
  };
  resourceRequirements: {
    title: string;
    technicalRequirements: string[];
    teamRequirements: Array<{
      role: string;
      responsibilities: string[];
      timeCommitment: string;
    }>;
    budgetEstimate: {
      developmentCost: string;
      ongoingCosts: string;
      roiBreakeven: string;
    };
  };
  successMetrics: {
    title: string;
    kpis: Array<{
      metric: string;
      target: string;
      measurementMethod: string;
    }>;
    monitoringApproach: string;
    reportingFrequency: string;
  };
  riskAssessment: {
    title: string;
    risks: Array<{
      risk: string;
      impact: string;
      probability: string;
      mitigation: string;
    }>;
    contingencyPlans: string[];
  };
  codeExamples: Array<{
    title: string;
    language: string;
    description: string;
    code: string;
    explanation: string;
  }>;
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
          reportType: 'implementation-guide'
        })
      });

      console.log('📡 PDF API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ PDF API error:', errorData);
        throw new Error(`PDF API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('✅ PDF API response received:', { 
        success: data.success, 
        source: data.source || 'api',
        hasContent: !!data.content 
      });

      if (data.success && data.content) {
        return data.content;
      } else {
        throw new Error('Invalid response format from PDF API');
      }
    } catch (error) {
      console.error('❌ Error calling PDF API:', error);
      throw error;
    }
  }

  async generateImplementationGuide(workflowData: WorkflowAnalysisRequest): Promise<AIGeneratedContent> {
    console.log('🤖 Making REAL API call to Claude 3.5 Sonnet for report generation...');
    console.log('📊 Workflow data:', { 
      name: workflowData.workflowName, 
      steps: workflowData.steps.length,
      hasApiKey: !!CLAUDE_API_KEY
    });
    
    const prompt = `You are an expert automation consultant. Create a comprehensive implementation guide for this workflow automation project.

WORKFLOW TO AUTOMATE:
- Process Name: ${workflowData.workflowName}
- Description: ${workflowData.workflowDescription}
- Steps to Automate: ${workflowData.steps.map((step, index) => `${index + 1}. ${step.name} (${step.type})`).join(', ')}

Please provide a detailed implementation guide in this EXACT JSON format (return only valid JSON, no markdown):

{
  "executiveSummary": {
    "title": "Executive Summary",
    "overview": "Brief overview of automation opportunity and business impact",
    "keyBenefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5"],
    "roiMetrics": {
      "annualHoursSaved": 200,
      "annualValue": "£5,000",
      "efficiencyGain": "75%",
      "setupTime": "2-4 weeks"
    }
  },
  "technicalSpecification": {
    "title": "Technical Implementation",
    "automationType": "API Integration with AI Processing",
    "requiredTechnologies": ["Technology 1", "Technology 2", "Technology 3"],
    "apiConnections": [
      {
        "name": "Primary API",
        "purpose": "Main automation endpoint",
        "endpoint": "https://api.example.com/v1/endpoint",
        "method": "POST",
        "authentication": "Bearer Token",
        "sampleRequest": {"input": "sample"},
        "sampleResponse": {"output": "result"}
      }
    ],
    "architectureOverview": "High-level system architecture description"
  },
  "implementationPlan": {
    "title": "Implementation Roadmap",
    "phases": [
      {
        "phase": "Phase 1: Setup",
        "duration": "Week 1",
        "description": "Initial setup and configuration",
        "tasks": ["Task 1", "Task 2", "Task 3"],
        "deliverables": ["Deliverable 1", "Deliverable 2"]
      },
      {
        "phase": "Phase 2: Development",
        "duration": "Week 2-3",
        "description": "Core development and integration",
        "tasks": ["Task 1", "Task 2", "Task 3"],
        "deliverables": ["Deliverable 1", "Deliverable 2"]
      }
    ],
    "totalTimeline": "2-4 weeks",
    "criticalPath": ["Critical item 1", "Critical item 2"]
  },
  "resourceRequirements": {
    "title": "Resource Requirements",
    "technicalRequirements": ["Requirement 1", "Requirement 2", "Requirement 3"],
    "teamRequirements": [
      {
        "role": "Developer",
        "responsibilities": ["Responsibility 1", "Responsibility 2"],
        "timeCommitment": "2-3 weeks"
      }
    ],
    "budgetEstimate": {
      "developmentCost": "£3,000-£8,000",
      "ongoingCosts": "£100-300/month",
      "roiBreakeven": "3-6 months"
    }
  },
  "successMetrics": {
    "title": "Success Metrics",
    "kpis": [
      {
        "metric": "Time saved per process",
        "target": "4+ hours",
        "measurementMethod": "Before/after comparison"
      }
    ],
    "monitoringApproach": "Continuous monitoring with dashboards",
    "reportingFrequency": "Weekly progress reports"
  },
  "riskAssessment": {
    "title": "Risk Assessment",
    "risks": [
      {
        "risk": "API integration challenges",
        "impact": "Medium",
        "probability": "Low",
        "mitigation": "Thorough testing and fallback procedures"
      }
    ],
    "contingencyPlans": ["Plan A", "Plan B"]
  },
  "codeExamples": [
    {
      "title": "Basic API Integration",
      "language": "javascript",
      "description": "Example API call for automation",
      "code": "const response = await fetch('/api/automate', { method: 'POST', body: JSON.stringify(data) });",
      "explanation": "This code demonstrates the basic API integration pattern"
    }
  ]
}

Focus on practical, implementable solutions with realistic timelines and costs.`;

    try {
      console.log('📡 Sending prompt to Claude API...');
      const aiResponse = await this.callClaude(prompt);
      console.log('✅ Got response from Claude API:', { 
        responseLength: aiResponse.length,
        preview: aiResponse.substring(0, 100) + '...'
      });
      
      // Parse the JSON response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('❌ No JSON found in Claude response');
        throw new Error('Invalid response format from Claude API');
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0]);
      console.log('🎯 Successfully parsed REAL Claude response for:', workflowData.workflowName);
      return parsedResponse as AIGeneratedContent;
    } catch (error) {
      console.error('❌ FAILED to get real Claude response, using fallback:', error);
      
      // Fallback to a basic structure if API fails
      return this.getFallbackContent(workflowData);
    }
  }

  private getFallbackContent(workflowData: WorkflowAnalysisRequest): AIGeneratedContent {
    return {
      executiveSummary: {
        title: "Executive Summary",
        overview: `This implementation guide outlines the automation strategy for ${workflowData.workflowName}. The proposed solution will streamline operations, reduce manual effort, and improve overall efficiency through intelligent automation.`,
        keyBenefits: [
          "Significant time savings through automation",
          "Reduced human error and improved accuracy",
          "Enhanced scalability and consistency",
          "Better resource allocation and cost efficiency",
          "Improved data insights and reporting capabilities"
        ],
        roiMetrics: {
          annualHoursSaved: 156,
          annualValue: "£3,900",
          efficiencyGain: "70%",
          setupTime: "3-5 days"
        }
      },
      technicalSpecification: {
        title: "Technical Implementation Specification",
        automationType: "API Integration with AI Processing",
        requiredTechnologies: [
          "REST API Integration",
          "Authentication & Security",
          "Data Processing Pipeline",
          "Monitoring & Logging",
          "Error Handling & Recovery"
        ],
        apiConnections: [
          {
            name: "Primary Service API",
            purpose: "Main automation endpoint for workflow processing",
            endpoint: "https://api.service.com/v1/automation",
            method: "POST",
            authentication: "Bearer Token (OAuth 2.0)",
            sampleRequest: {
              "workflowId": "wf_123456",
              "data": {
                "input": "sample data"
              }
            },
            sampleResponse: {
              "status": "success",
              "processId": "proc_789012",
              "result": "processed data"
            }
          }
        ],
        architectureOverview: "The solution follows a microservices architecture with API-first design, ensuring scalability and maintainability."
      },
      implementationPlan: {
        title: "Implementation Timeline & Milestones",
        phases: [
          {
            phase: "Phase 1: Setup & Configuration",
            duration: "Day 1-2",
            description: "Initial setup, API configuration, and authentication",
            tasks: ["API key setup", "Environment configuration", "Basic connectivity testing"],
            deliverables: ["Working API connection", "Authentication setup", "Basic test results"]
          },
          {
            phase: "Phase 2: Development & Integration",
            duration: "Day 3-4",
            description: "Core development and system integration",
            tasks: ["Workflow logic implementation", "Error handling", "Data processing"],
            deliverables: ["Core automation logic", "Error handling system", "Integration tests"]
          },
          {
            phase: "Phase 3: Testing & Deployment",
            duration: "Day 5",
            description: "Final testing, deployment, and monitoring setup",
            tasks: ["Comprehensive testing", "Production deployment", "Monitoring setup"],
            deliverables: ["Deployed system", "Monitoring dashboard", "Documentation"]
          }
        ],
        totalTimeline: "5 days",
        criticalPath: ["API setup", "Core development", "Testing", "Deployment"]
      },
      resourceRequirements: {
        title: "Resource Requirements & Prerequisites",
        technicalRequirements: [
          "API access and credentials",
          "Development environment",
          "Testing infrastructure",
          "Monitoring tools",
          "Security compliance tools"
        ],
        teamRequirements: [
          {
            role: "Developer",
            responsibilities: ["API integration", "Code development", "Testing"],
            timeCommitment: "5 days"
          },
          {
            role: "QA Engineer",
            responsibilities: ["Testing", "Quality assurance", "Documentation"],
            timeCommitment: "2 days"
          }
        ],
        budgetEstimate: {
          developmentCost: "£2,000-£5,000",
          ongoingCosts: "£50-200/month",
          roiBreakeven: "2-3 months"
        }
      },
      successMetrics: {
        title: "Success Metrics & KPIs",
        kpis: [
          {
            metric: "Processing time reduction",
            target: "70% improvement",
            measurementMethod: "Before/after time comparison"
          },
          {
            metric: "Error rate reduction",
            target: "90% fewer errors",
            measurementMethod: "Error tracking and analysis"
          },
          {
            metric: "Cost savings",
            target: "£3,900 annually",
            measurementMethod: "Time value calculations"
          }
        ],
        monitoringApproach: "Continuous monitoring with automated alerts and dashboard reporting",
        reportingFrequency: "Weekly performance reports with monthly business impact analysis"
      },
      riskAssessment: {
        title: "Risk Assessment & Mitigation",
        risks: [
          {
            risk: "API availability and reliability",
            impact: "High",
            probability: "Low",
            mitigation: "Implement redundancy and failover mechanisms"
          },
          {
            risk: "Data security and privacy concerns",
            impact: "High",
            probability: "Low",
            mitigation: "Implement encryption and access controls"
          }
        ],
        contingencyPlans: [
          "Manual fallback procedures",
          "Alternative API providers",
          "Emergency rollback procedures"
        ]
      },
      codeExamples: [
        {
          title: "API Authentication Setup",
          language: "javascript",
          description: "Setting up OAuth 2.0 authentication for API access",
          code: `const auth = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  tokenUrl: 'https://api.service.com/oauth/token'
};

async function getAccessToken() {
  const response = await fetch(auth.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: auth.clientId,
      client_secret: auth.clientSecret
    })
  });
  
  const data = await response.json();
  return data.access_token;
}`,
          explanation: "This code demonstrates OAuth 2.0 client credentials flow for API authentication. Store credentials securely and implement token refresh logic."
        }
      ]
    };
  }
}

export const claudeService = new ClaudeService(); 