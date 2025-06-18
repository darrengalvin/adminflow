export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { taskData } = req.body;
    
    if (!taskData) {
      return res.status(400).json({ error: 'Task data is required' });
    }

    // Get API key from environment variables
    const apiKey = process.env.VITE_CLAUDE_API_KEY || process.env.claudeApiKey;
    
    console.log('API Key check:', {
      hasViteKey: !!process.env.VITE_CLAUDE_API_KEY,
      hasClaudeKey: !!process.env.claudeApiKey,
      hasAnyKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0
    });
    
    if (!apiKey) {
      console.error('No Claude API key found in environment variables');
      return res.status(500).json({ 
        error: 'Claude API key not configured',
        fallback: true 
      });
    }

    // Parse time spent to number
    const parseTimeSpent = (timeText) => {
      const numbers = timeText.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        return parseInt(numbers[0]);
      }
      return 2; // Default 2 hours
    };

    const timePerWeek = parseTimeSpent(taskData.timeSpent);
    const annualHours = timePerWeek * 52;
    const savings = Math.round(annualHours * 0.7);

    const DETAILED_TASK_ANALYSIS_PROMPT = `🔬 **RESEARCH-BASED AUTOMATION ANALYSIS**

You are an expert business automation consultant with deep API knowledge. Your task is to research and provide comprehensive, implementable automation solutions.

**CRITICAL REQUIREMENT:** You must provide REAL, VERIFIED API endpoints and working code examples. Do NOT use placeholder URLs or generic examples.

## 📋 **ANALYSIS FRAMEWORK:**

### 1. **Manual Process Breakdown**
- Document each manual step in detail
- Identify time-consuming pain points
- Calculate current time/cost investment

### 2. **API Research & Verification** 
🔍 **For GoHighLevel CRM APIs:**
- **Base URL:** https://services.leadconnectorhq.com/
- **Required Headers:** 
  - Authorization: YOUR_PRIVATE_INTEGRATION_TOKEN (NO "Bearer" prefix)
  - Content-Type: application/json
  - Version: 2021-07-28
- **Key Endpoints:**
  - Opportunities: POST /opportunities
  - Contacts: GET/POST /contacts
  - Pipelines: GET /opportunities/pipelines
- **Required Fields for Opportunities:**
  - locationId (REQUIRED - your sub-account ID)
  - title (not "name" - API 2.0 uses "title")
  - pipelineId
  - pipelineStageId
  - contactId
  - monetaryValue (optional)
  - status (open/won/lost/abandoned)

🔍 **For other APIs:** Research actual endpoints from official documentation

### 3. **Complete Technical Solution**
Provide working code with:
- Real API endpoints (verified from official docs)
- Proper authentication headers
- Error handling and retry logic
- Rate limiting considerations
- Sample request/response data

### 4. **Business Impact Calculation**
- Time saved per execution
- Cost reduction analysis
- ROI projections
- Scalability benefits

## 🚀 **OUTPUT FORMAT:**

**Manual Process Analysis:**
[Detailed breakdown of current manual steps]

**Automation Architecture:**
[Technical implementation plan with real APIs]

**Working Code Examples:**
[Complete, runnable code with real endpoints]

**API Integration Details:**
- Endpoint: [Real verified URL]
- Authentication: [Exact header format]
- Rate Limits: [Actual API limits]
- Error Handling: [Specific error codes and responses]

**Business Calculations:**
- Current Time: X minutes per task
- Automated Time: Y seconds per task  
- Time Savings: Z% reduction
- Monthly ROI: $X saved

**Testing & Validation:**
[Step-by-step testing instructions with real API calls]

**Implementation Roadmap:**
[Phased rollout plan with milestones]

Remember: Every API endpoint, authentication method, and code example must be REAL and VERIFIED. No placeholders allowed!`;

    const prompt = DETAILED_TASK_ANALYSIS_PROMPT;

    // Make request to Claude API
    console.log('Making request to Claude API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    console.log('Claude API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', response.status, errorData);
      return res.status(500).json({ 
        error: `Claude API error: ${response.status}`,
        fallback: true 
      });
    }

    const data = await response.json();
    const claudeResponse = data.content[0]?.text || '';

    // Try to parse JSON response
    try {
      const cleanedResponse = claudeResponse.replace(/```json\n?|\n?```/g, '').trim();
      const analysis = JSON.parse(cleanedResponse);
      
      return res.status(200).json({
        success: true,
        analysis
      });
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      
      // Return fallback response in new format if JSON parsing fails
      const fallbackResponse = {
        taskName: `Task Automation Analysis: ${taskData.taskName}`,
        description: `Complete AI/API automation solution to replace manual ${taskData.taskName.toLowerCase()} process`,
        manualProcessAnalysis: {
          system: taskData.software,
          trigger: "When this task is performed",
          timeRequired: `${timePerWeek} hours per week`,
          manualSteps: [
            "Navigate to software interface manually",
            "Enter data through form fields",
            "Process information manually",
            "Save and validate results"
          ],
          painPointsIdentified: [
            "Time-consuming manual navigation",
            "Repetitive data entry prone to errors",
            "No automated validation or processing"
          ]
        },
        automationSolution: {
          architecture: {
            dataSource: "Form submissions or email triggers containing task data",
            aiProcessing: "Claude/GPT-4 extracts and validates key information",
            apiIntegration: `${taskData.software} REST API for automated data processing`,
            errorHandling: "Validation, retry logic, and manual review queue for failures"
          },
          automationFlow: [
            "Data trigger captures task requirements automatically",
            `AI processes and validates data for ${taskData.software} integration`,
            "API calls execute task automatically with error handling"
          ],
          sampleImplementation: {
            codeExample: `// Sample automation code for ${taskData.taskName}
app.post('/webhook/task-trigger', async (req, res) => {
  try {
    const taskData = await aiProcessor.extract(req.body);
    const result = await ${taskData.software.toLowerCase()}Api.processTask(taskData);
    res.json({ success: true, result });
  } catch (error) {
    await notifyManualReview(req.body, error);
    res.status(500).json({ error: 'Automation failed' });
  }
});`,
            apiEndpoints: [
              {
                method: "POST",
                endpoint: `https://api.${taskData.software.toLowerCase()}.com/v1/tasks`,
                purpose: `Automate ${taskData.taskName.toLowerCase()} processing`,
                sampleCall: `curl -X POST "https://api.${taskData.software.toLowerCase()}.com/v1/tasks" -H "Authorization: Bearer API_KEY" -d '{"taskData": "values"}'`
              }
            ],
            errorHandlingStrategy: [
              "Missing Data: Route to manual review queue with partial data",
              "API Failures: Exponential backoff retry (3 attempts)",
              "Invalid Input: Data validation with user notification"
            ]
          }
        },
        businessImpact: {
          timeAnalysis: {
            currentManualTime: `${timePerWeek} hours per week`,
            automatedTime: "15 seconds per instance",
            timeSavingsPercent: "95%",
            monthlyHoursSaved: Math.round(timePerWeek * 4 * 0.9),
            annualHoursSaved: Math.round(timePerWeek * 52 * 0.9)
          },
          financialImpact: {
            costPerHour: 30,
            annualValue: Math.round(timePerWeek * 52 * 0.9 * 30),
            implementationCost: 2500,
            roiTimeline: "4-6 months payback"
          },
          additionalBenefits: [
            "24/7 processing capability",
            "Elimination of human errors",
            "Scalability without additional staff",
            "Consistent data quality"
          ]
        },
        implementationRoadmap: {
          phase1: {
            title: "Setup (Week 1)",
            tasks: [
              `Obtain API credentials for ${taskData.software}`,
              "Set up development environment",
              "Create test data set",
              "Build basic API connectivity"
            ]
          },
          phase2: {
            title: "Core Automation (Week 2-3)",
            tasks: [
              "Implement main automation workflow",
              "Add comprehensive error handling",
              "Create monitoring and logging",
              "Test with real data"
            ]
          },
          phase3: {
            title: "Deployment (Week 4)",
            tasks: [
              "User acceptance testing",
              "Deploy to production",
              "Set up monitoring alerts",
              "Train team on new process"
            ]
          },
          requiredResources: {
            technical: "Node.js developer, API integration experience",
            access: `${taskData.software} admin access, API keys`,
            timeEstimate: "20-25 development hours",
            budget: "£150/month ongoing costs"
          }
        },
        riskAssessment: {
          potentialRisks: [
            `API Changes: ${taskData.software} updates could break integration`,
            "Data Quality: Poor input data could create issues",
            "Rate Limits: High volume could hit API limits"
          ],
          mitigationStrategies: [
            "Subscribe to API changelog and maintain compatibility",
            "Implement data validation with manual review fallback",
            "Add request queuing and retry logic"
          ]
        }
      };

      return res.status(200).json({
        success: true,
        analysis: fallbackResponse,
        note: "Used fallback analysis due to response parsing issues"
      });
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      fallback: true 
    });
  }
} 