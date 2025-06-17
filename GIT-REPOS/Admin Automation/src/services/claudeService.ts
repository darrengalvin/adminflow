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
    if (!CLAUDE_API_KEY) {
      throw new Error('Claude API key not configured. Please set VITE_CLAUDE_API_KEY in your environment variables.');
    }

    try {
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-20250514', // Using Claude 4 Opus - the most capable model with superior reasoning
          max_tokens: 64000, // Increased for comprehensive content generation
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }

  async generateImplementationGuide(workflowData: WorkflowAnalysisRequest): Promise<AIGeneratedContent> {
    console.log('🤖 Making API call to Claude 4 Opus...');
    
    const prompt = `You are an expert business automation consultant and technical architect. Analyze this workflow and generate a comprehensive, professional implementation guide.

WORKFLOW ANALYSIS:
• Name: ${workflowData.workflowName}
• Description: ${workflowData.workflowDescription}
• Steps: ${workflowData.steps.map((step, index) => `${index + 1}. ${step.name}${step.description ? ` - ${step.description}` : ''} (${step.type})`).join('\n')}

REQUIREMENTS:
Generate a professional-grade implementation guide with:
- Realistic ROI calculations based on industry standards
- Detailed technical architecture and API specifications  
- Comprehensive code examples with multiple languages
- Implementation timeline with specific phases
- Resource requirements and budget estimates
- Success metrics and KPIs
- Risk assessment with mitigation strategies

CRITICAL: Respond ONLY with valid JSON in this exact format (no markdown, no comments):

{
  "executiveSummary": {
    "title": "Executive Summary",
    "overview": "Comprehensive overview of the automation opportunity and business impact",
    "keyBenefits": ["List of 5-7 key business benefits"],
    "roiMetrics": {
      "annualHoursSaved": 156,
      "annualValue": "£3,900",
      "efficiencyGain": "70%",
      "setupTime": "3-5 days"
    }
  },
  "technicalSpecification": {
    "title": "Technical Implementation Specification",
    "automationType": "API Integration with AI Processing",
    "requiredTechnologies": ["List of required technologies"],
    "apiConnections": [
      {
        "name": "Primary API Name",
        "purpose": "What this API does",
        "endpoint": "https://api.example.com/v1/resource",
        "method": "POST",
        "authentication": "Bearer Token (OAuth 2.0)",
        "sampleRequest": {"key": "sample request payload"},
        "sampleResponse": {"key": "sample response payload"}
      }
    ],
    "architectureOverview": "Detailed explanation of system architecture"
  },
  "implementationPlan": {
    "title": "Implementation Timeline & Milestones",
    "phases": [
      {
        "phase": "Phase 1: API Setup & Authentication",
        "duration": "Day 1",
        "description": "Phase description",
        "tasks": ["List of specific tasks"],
        "deliverables": ["List of deliverables"]
      }
    ],
    "totalTimeline": "3-5 days",
    "criticalPath": ["List of critical path items"]
  },
  "resourceRequirements": {
    "title": "Resource Requirements & Prerequisites",
    "technicalRequirements": ["List of technical requirements"],
    "teamRequirements": [
      {
        "role": "Developer",
        "responsibilities": ["List of responsibilities"],
        "timeCommitment": "3-5 days"
      }
    ],
    "budgetEstimate": {
      "developmentCost": "£2,000-£5,000",
      "ongoingCosts": "£50-200/month",
      "roiBreakeven": "2-3 months"
    }
  },
  "successMetrics": {
    "title": "Success Metrics & KPIs",
    "kpis": [
      {
        "metric": "Time saved per task",
        "target": "3+ hours",
        "measurementMethod": "Before/after time tracking"
      }
    ],
    "monitoringApproach": "Continuous monitoring approach",
    "reportingFrequency": "Weekly/Monthly reporting schedule"
  },
  "riskAssessment": {
    "title": "Risk Assessment & Mitigation",
    "risks": [
      {
        "risk": "API downtime or rate limiting",
        "impact": "High",
        "probability": "Medium",
        "mitigation": "Implement retry logic and backup solutions"
      }
    ],
    "contingencyPlans": ["List of contingency plans"]
  },
  "codeExamples": [
    {
      "title": "API Authentication Setup",
      "language": "javascript",
      "description": "Code example description",
      "code": "// Actual code example",
      "explanation": "Detailed explanation of the code"
    }
  ]
}

Make this professional, comprehensive, and tailored to the specific workflow. Include realistic metrics, practical implementation details, and actionable code examples. Focus on creating value for both technical and business stakeholders.
`;

    try {
      const aiResponse = await this.callClaude(prompt);
      
      // Parse the JSON response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Claude API');
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0]);
      return parsedResponse as AIGeneratedContent;
    } catch (error) {
      console.error('Error generating implementation guide:', error);
      
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