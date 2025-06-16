interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

interface TaskAnalysisPrompt {
  taskName: string;
  description: string;
  software: string;
  timeSpent: string;
  painPoints: string;
  alternatives: string;
}

class ClaudeApiService {
  private apiUrl: string;

  constructor() {
    // Use our serverless API route instead of direct Claude API calls
    this.apiUrl = '/api/claude';
  }

  private async makeDirectClaudeRequest(taskData: TaskAnalysisPrompt): Promise<any> {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Claude API key not found in environment variables');
    }

    const timePerWeek = this.parseTimeSpent(taskData.timeSpent);
    const annualHours = timePerWeek * 52;
    const savings = Math.round(annualHours * 0.7);

    const prompt = `You are an expert automation consultant. Analyze this business task and provide detailed automation recommendations.

TASK DETAILS:
- Task Name: ${taskData.taskName}
- Description: ${taskData.description}
- Software Used: ${taskData.software}
- Time Spent Weekly: ${taskData.timeSpent}
- Current Pain Points: ${taskData.painPoints}
- What else could they do instead: ${taskData.alternatives}

Please provide a comprehensive analysis in this EXACT JSON format (return only valid JSON, no markdown):

{
  "taskName": "Automate: ${taskData.taskName}",
  "description": "AI-powered automation to eliminate manual ${taskData.taskName.toLowerCase()} process",
  "userFriendlyExplanation": {
    "goodNews": "Brief exciting explanation of why this is automatable",
    "whatIsAPI": "Simple explanation of what an API is in context",
    "howItWorks": "Step-by-step explanation of the automation process",
    "whatYouNeed": "What specific technical requirements are needed",
    "endpoints": [
      {
        "name": "Specific API endpoint name",
        "endpoint": "Actual API URL if known",
        "purpose": "What this endpoint does",
        "whatItDoes": "Detailed explanation of functionality"
      }
    ],
    "nextSteps": "Clear instructions for implementation"
  },
  "currentProcess": {
    "software": "${taskData.software}",
    "timePerWeek": ${timePerWeek},
    "painPoints": "${taskData.painPoints}",
    "alternativeUse": "${taskData.alternatives}"
  },
  "automation": {
    "type": "Type of automation (API Integration, RPA, etc.)",
    "apiConnections": ["List of specific APIs that could be used"],
    "aiCapabilities": ["List of AI features that could help"],
    "integrations": ["List of integration tools like Zapier, Make.com"]
  },
  "impact": {
    "annualHoursSaved": ${savings},
    "monthlyHoursSaved": ${Math.round(timePerWeek * 4 * 0.7)},
    "valuePerYear": "£${savings * 25}",
    "efficiencyGain": "70%"
  },
  "implementation": {
    "setupTime": "Realistic time estimate for implementation",
    "difficulty": "Easy/Medium/Hard",
    "steps": ["Step 1", "Step 2", "Step 3", "etc."],
    "nextActions": ["Immediate action items"]
  }
}

Focus on:
1. REAL, specific APIs and endpoints where possible
2. Practical, implementable solutions
3. Clear business value and time savings
4. Specific next steps the user can take
5. Accurate technical requirements

Be precise about which software integrations are actually possible and provide realistic implementation guidance.`;

    console.log('🔄 Making direct Claude API request...');
    console.log('📊 Request details:', {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      taskName: taskData.taskName,
      software: taskData.software
    });
    
    const requestBody = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('✅ Claude API response status:', response.status);
    console.log('📈 Response headers:', {
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Claude API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Claude API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Raw Claude API response:', {
      usage: data.usage,
      model: data.model,
      contentLength: data.content?.[0]?.text?.length || 0
    });
    
    const claudeResponse = data.content[0]?.text || '';
    console.log('🎯 Claude response preview:', claudeResponse.substring(0, 200) + '...');

    // Try to parse JSON response
    const cleanedResponse = claudeResponse.replace(/```json\n?|\n?```/g, '').trim();
    const parsedResponse = JSON.parse(cleanedResponse);
    
    console.log('✨ Successfully parsed Claude analysis:', {
      taskName: parsedResponse.taskName,
      automationType: parsedResponse.automation?.type,
      timesSaved: parsedResponse.impact?.monthlyHoursSaved
    });
    
    return parsedResponse;
  }

  private async makeRequest(taskData: TaskAnalysisPrompt): Promise<any> {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Claude API key not configured. Please add VITE_CLAUDE_API_KEY to your .env file.');
    }
    
    console.log('🚀 Making REAL Claude API request via proxy');
    console.log('📊 Task data:', {
      taskName: taskData.taskName,
      software: taskData.software,
      timeSpent: taskData.timeSpent
    });
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskData })
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Claude API request failed:', errorData);
      throw new Error(`Claude API request failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('✅ Claude API response received:', {
      success: result.success,
      source: result.source,
      taskName: result.analysis?.taskName
    });
    
    if (result.success && result.analysis) {
      console.log('🎯 REAL Claude analysis completed!');
      return result.analysis;
    } else {
      throw new Error('Invalid response format from Claude API');
    }
  }

  async analyzeTask(taskData: TaskAnalysisPrompt): Promise<any> {
    return await this.makeRequest(taskData);
  }

  async generateNextStepSuggestions(task: any): Promise<any[]> {
    const prompt = `Based on this analyzed task, suggest 3 logical next automation steps:

TASK: ${task.name}
DESCRIPTION: ${task.description}
SOFTWARE: ${task.software}

Provide 3 follow-up automation suggestions as JSON array:
[
  {
    "name": "Suggestion name",
    "description": "Brief description",
    "estimatedTime": "X minutes",
    "difficulty": "Easy/Medium/Hard",
    "trigger": "What triggers this step",
    "action": "What action it performs",
    "condition": "When it should run",
    "waitTime": "How long to wait",
    "icon": "Relevant emoji"
  }
]`;

    try {
      // For next steps, we'll just return fallback for now since it's not critical
      console.log('Generating next step suggestions...');
      return this.getFallbackNextSteps();
    } catch (error) {
      console.error('Failed to generate next steps:', error);
      return this.getFallbackNextSteps();
    }
  }

  private parseTimeSpent(timeText: string): number {
    const numbers = timeText.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      return parseInt(numbers[0]);
    }
    return 2; // Default 2 hours
  }

  private generateFallbackResponse(taskData: TaskAnalysisPrompt): any {
    console.log('🎭 Generating AI-powered analysis simulation for:', taskData.taskName);
    console.log('💡 This demonstrates what Claude AI would provide in production');
    
    const timePerWeek = this.parseTimeSpent(taskData.timeSpent);
    const annualHours = timePerWeek * 52;
    const savings = Math.round(annualHours * 0.7);

    // Generate intelligent, context-aware responses based on the task data
    const getAutomationType = (software: string, taskName: string) => {
      const softwareLower = software.toLowerCase();
      const taskLower = taskName.toLowerCase();
      
      if (softwareLower.includes('excel') || softwareLower.includes('spreadsheet')) {
        return "Excel API Integration with Power Automate";
      } else if (softwareLower.includes('email') || taskLower.includes('email')) {
        return "Email API Automation with AI Processing";
      } else if (softwareLower.includes('crm') || softwareLower.includes('salesforce')) {
        return "CRM API Integration with Workflow Automation";
      } else if (softwareLower.includes('accounting') || softwareLower.includes('quickbooks')) {
        return "Accounting Software API with Document Processing";
      } else {
        return "Custom API Integration with AI Enhancement";
      }
    };

    const getSpecificAPIs = (software: string, taskName: string) => {
      const softwareLower = software.toLowerCase();
      const taskLower = taskName.toLowerCase();
      
      if (softwareLower.includes('excel')) {
        return ["Microsoft Graph API", "Excel Online API", "OneDrive API"];
      } else if (softwareLower.includes('gmail') || softwareLower.includes('email')) {
        return ["Gmail API", "Outlook API", "SendGrid API"];
      } else if (softwareLower.includes('salesforce')) {
        return ["Salesforce REST API", "Salesforce Bulk API", "Salesforce Streaming API"];
      } else if (softwareLower.includes('quickbooks')) {
        return ["QuickBooks Online API", "Intuit Developer API"];
      } else {
        return [`${software} API`, "REST APIs", "Webhook APIs"];
      }
    };

    const getIntelligentSteps = (software: string, taskName: string) => {
      const softwareLower = software.toLowerCase();
      const taskLower = taskName.toLowerCase();
      
      if (softwareLower.includes('excel')) {
        return [
          "Set up Microsoft Graph API access for Excel automation",
          "Create Power Automate flow to monitor Excel files",
          "Configure automatic data processing and validation",
          "Set up email notifications for completed tasks",
          "Test automation with sample data",
          "Deploy and monitor performance"
        ];
      } else if (taskLower.includes('email') || taskLower.includes('communication')) {
        return [
          "Configure email API access (Gmail/Outlook)",
          "Set up AI-powered email classification",
          "Create automated response templates",
          "Implement smart routing and prioritization",
          "Test with sample emails",
          "Deploy with monitoring and analytics"
        ];
      } else {
        return [
          `Research ${software} API documentation and capabilities`,
          "Map current manual process to API endpoints",
          "Set up development environment and API keys",
          "Build automation workflow with error handling",
          "Implement AI enhancement for decision-making",
          "Test thoroughly and deploy with monitoring"
        ];
      }
    };

    return {
      taskName: `Automate: ${taskData.taskName}`,
      description: `AI-powered automation to eliminate manual ${taskData.taskName.toLowerCase()} process`,
      userFriendlyExplanation: {
        goodNews: `Excellent news! Your ${taskData.taskName.toLowerCase()} process is highly automatable. Based on your use of ${taskData.software}, there are proven automation pathways that could save you ${Math.round(timePerWeek * 0.7)} hours per week.`,
        whatIsAPI: `An API (Application Programming Interface) is like a digital bridge that lets ${taskData.software} communicate directly with other systems. Instead of you manually copying data between applications, the API does it instantly and accurately.`,
        howItWorks: `We'll connect ${taskData.software} to your other business tools using its API, then add AI to handle the decision-making and data processing. The system will monitor for triggers (like new data or specific times), process the information automatically, and complete the tasks you currently do manually.`,
        whatYouNeed: `API access to ${taskData.software} (usually available in business plans), an automation platform account, and potentially some custom development depending on complexity.`,
        endpoints: [
          {
            name: `${taskData.software} Primary API`,
            endpoint: "Available through your software's developer documentation",
            purpose: "Automate data extraction and updates",
            whatItDoes: `Handles all the manual data entry, retrieval, and processing you currently do in ${taskData.software}`
          },
          {
            name: "AI Processing Endpoint",
            endpoint: "Claude API / OpenAI API for intelligent processing",
            purpose: "Add smart decision-making to your automation",
            whatItDoes: "Analyzes data patterns, makes intelligent decisions, and handles complex logic that would normally require human judgment"
          }
        ],
        nextSteps: `Start by contacting ${taskData.software} support to confirm API availability and pricing. Then explore automation platforms like Zapier or Make.com for quick setup, or consider custom development for more complex requirements.`
      },
      currentProcess: {
        software: taskData.software,
        timePerWeek: timePerWeek,
        painPoints: taskData.painPoints,
        alternativeUse: taskData.alternatives
      },
      automation: {
        type: getAutomationType(taskData.software, taskData.taskName),
        apiConnections: getSpecificAPIs(taskData.software, taskData.taskName),
        aiCapabilities: [
          "Intelligent data extraction and validation",
          "Pattern recognition and anomaly detection", 
          "Automated decision-making based on business rules",
          "Natural language processing for document handling",
          "Predictive analytics for process optimization"
        ],
        integrations: ["Zapier", "Make.com", "Microsoft Power Automate", "Custom API development", "AI/ML platforms"]
      },
      impact: {
        annualHoursSaved: savings,
        monthlyHoursSaved: Math.round(timePerWeek * 4 * 0.7),
        valuePerYear: `£${savings * 25}`,
        efficiencyGain: "70%"
      },
      implementation: {
        setupTime: timePerWeek > 5 ? "3-6 weeks for complex automation" : "1-3 weeks for standard automation",
        difficulty: timePerWeek > 8 ? "Hard" : timePerWeek > 3 ? "Medium" : "Easy",
        steps: getIntelligentSteps(taskData.software, taskData.taskName),
        nextActions: [
          `Contact ${taskData.software} support about API access and pricing`,
          "Document your current process in detail with screenshots",
          "Sign up for a free trial of Zapier or Make.com",
          "Consider consulting with an automation specialist for complex workflows",
          "Start with a small pilot automation to test the concept"
        ]
      }
    };
  }

  private getFallbackNextSteps(): any[] {
    return [
      {
        name: "Set up automated notifications",
        description: "Get notified when the automation runs",
        estimatedTime: "15 minutes",
        difficulty: "Easy",
        trigger: "When automation completes",
        action: "Send status notification",
        condition: "Always notify on completion",
        waitTime: "0 seconds",
        icon: "📧"
      },
      {
        name: "Add error handling",
        description: "Handle edge cases and failures gracefully",
        estimatedTime: "30 minutes", 
        difficulty: "Medium",
        trigger: "When automation encounters errors",
        action: "Log error and retry or alert user",
        condition: "On any automation failure",
        waitTime: "5 seconds",
        icon: "⚠️"
      },
      {
        name: "Create progress tracking",
        description: "Monitor automation performance and efficiency",
        estimatedTime: "20 minutes",
        difficulty: "Easy",
        trigger: "After each automation run",
        action: "Log performance metrics",
        condition: "Always track performance",
        waitTime: "0 seconds",
        icon: "📊"
      }
    ];
  }

  // Check if API is available by testing the endpoint
  async isConfigured(): Promise<boolean> {
    // First check if we have the API key in environment
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    console.log('Checking API configuration:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0
    });
    
    if (apiKey) {
      console.log('API key found in environment - Claude should be available');
      return true;
    }

    // Fallback to testing serverless endpoint
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          taskData: {
            taskName: 'test',
            description: 'test',
            software: 'test',
            timeSpent: '1 hour',
            painPoints: 'test',
            alternatives: 'test'
          }
        })
      });
      
      if (response.status === 500) {
        const data = await response.json();
        return !data.fallback;
      }
      
      return response.ok;
    } catch (error) {
      console.error('API configuration check failed:', error);
      return false;
    }
  }

  // Get configuration status
  getStatus(): { configured: boolean; message: string } {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    
    if (apiKey) {
      return {
        configured: true,
        message: 'Claude AI Ready - Real API Calls'
      };
    }
    
    return {
      configured: false,
      message: 'Claude API Not Configured'
    };
  }
}

export const claudeApi = new ClaudeApiService();
export default claudeApi; 