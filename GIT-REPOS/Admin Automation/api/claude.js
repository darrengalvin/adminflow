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

    // Detect software/platform for targeted research
    const software = taskData.software || 
                    (taskData.taskName?.toLowerCase().includes('gohighlevel') || 
                     taskData.taskName?.toLowerCase().includes('ghl') ? 'GoHighLevel' : 
                     taskData.description?.toLowerCase().includes('crm') ? 'CRM' : 'Unknown');

    // Perform web search for API documentation
    let researchResults = '';
    try {
      console.log(`🔍 Researching ${software} API documentation...`);
      
      // Call our web search endpoint for real-time API research
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
      const searchResponse = await fetch(`${baseUrl}/api/web-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `${software} API documentation endpoints authentication`,
          software: software
        })
      });

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        researchResults = searchData.results;
        console.log('✅ Web search completed successfully');
      } else {
        throw new Error(`Search API returned ${searchResponse.status}`);
      }
    } catch (searchError) {
      console.error('Web search failed, using fallback:', searchError);
      
      // Fallback to curated knowledge base
      if (software.toLowerCase().includes('gohighlevel') || software.toLowerCase().includes('ghl')) {
        researchResults = `
🔍 **VERIFIED GOHIGHLEVEL API DOCUMENTATION (FALLBACK):**

**GoHighLevel API 2.0 (Current):**
- Base URL: https://services.leadconnectorhq.com/
- Documentation: https://highlevel.stoplight.io/docs/integrations/0443d7d1a4bd0-overview
- Authentication: Private Integration Tokens (OAuth 2.0)
- Required Headers: Authorization (no Bearer prefix), Version: 2021-07-28
- Status: Active, recommended for all new integrations

**Key Endpoints:**
- Opportunities: POST /opportunities (requires locationId, title, pipelineId)
- Contacts: GET/POST /contacts
- Pipelines: GET /opportunities/pipelines
- Locations: GET /locations

**Rate Limits:**
- Burst: 100 requests per 10 seconds
- Daily: 200,000 requests per day

**Authentication Format:**
- Header: Authorization: YOUR_PRIVATE_INTEGRATION_TOKEN
- NO "Bearer" prefix required
- Version header: 2021-07-28 (required)

**Critical Requirements:**
- locationId is REQUIRED for most endpoints
- API 2.0 uses "title" not "name" for opportunities
- Private Integration tokens don't expire unless rotated
- Pro plan or above required for API access

**Verified Working Example:**
POST https://services.leadconnectorhq.com/opportunities
Headers: Authorization: [token], Version: 2021-07-28
Body: {"locationId": "required", "title": "Deal Name", "pipelineId": "required"}
`;
      } else {
        researchResults = `
🔍 **GENERAL API RESEARCH:**
- Researched common API patterns for ${software}
- Standard REST API conventions apply
- OAuth 2.0 or API key authentication typical
- Rate limiting usually implemented
- Documentation should be consulted for specific endpoints
`;
      }
    }

    const ENHANCED_RESEARCH_PROMPT = `🔬 **RESEARCH-BASED AUTOMATION ANALYSIS**

You are an expert business automation consultant with access to real-time API research. Your task is to provide comprehensive, implementable automation solutions using the latest verified information.

**REAL-TIME RESEARCH RESULTS:**
${researchResults}

**TASK TO ANALYZE:**
- Task: ${taskData.taskName}
- Description: ${taskData.description}
- Software: ${software}
- Time Spent: ${taskData.timeSpent}
- Current Process: ${taskData.currentProcess || 'Manual workflow'}

**CRITICAL REQUIREMENTS:**
1. Use ONLY verified API endpoints from the research above
2. Include exact authentication headers and formats
3. Provide working code examples with real endpoints
4. Calculate specific business impact metrics
5. Include proper error handling and rate limiting

## 📋 **ANALYSIS FRAMEWORK:**

### 1. **Manual Process Breakdown**
- Document each manual step in detail
- Identify time-consuming pain points
- Calculate current time/cost investment

### 2. **API Integration Strategy** 
Using the researched API information above:
- Exact endpoint URLs (verified from research)
- Proper authentication format (no placeholders)
- Required headers and parameters
- Rate limiting considerations
- Error handling strategies

### 3. **Complete Technical Solution**
Provide working code with:
- Real API endpoints from research results
- Exact authentication headers (no Bearer prefix for GoHighLevel)
- Proper request body structure
- Error handling and retry logic
- Rate limiting implementation

### 4. **Business Impact Calculation**
- Current time: ${timePerWeek} hours/week
- Potential savings: ${savings} hours/year
- ROI calculations with specific numbers
- Implementation timeline

## 🚀 **OUTPUT FORMAT (JSON):**

{
  "taskName": "Specific task automation name",
  "description": "What this automation accomplishes",
  "manualProcessAnalysis": {
    "currentSteps": ["step1", "step2", "step3"],
    "timePerExecution": "X minutes",
    "painPoints": ["issue1", "issue2"],
    "errorProneness": "High/Medium/Low"
  },
  "automationSolution": {
    "architecture": {
      "trigger": "What initiates the automation",
      "processing": "How data is processed",
      "apiIntegration": "Which APIs are called",
      "output": "What is created/updated"
    },
    "technicalImplementation": {
      "verifiedEndpoint": "Exact URL from research",
      "authenticationMethod": "Exact format from research",
      "requiredHeaders": {"header": "value"},
      "sampleRequestBody": {"field": "value"},
      "errorHandling": ["strategy1", "strategy2"]
    },
    "workingCodeExample": "Complete Node.js implementation"
  },
  "businessImpact": {
    "timeReduction": "X% reduction in manual time",
    "costSavings": "£X per year",
    "accuracyImprovement": "Elimination of human errors",
    "scalabilityBenefit": "Can handle X times more volume"
  },
  "implementationPlan": {
    "phase1": "Setup and API integration",
    "phase2": "Testing and validation", 
    "phase3": "Deployment and monitoring",
    "timeline": "X weeks total",
    "resources": "Required skills and tools"
  }
}

**Remember:** Every endpoint, header, and code example must be based on the verified research results above. No generic placeholders allowed!`;

    const prompt = ENHANCED_RESEARCH_PROMPT;

    // Make request to Claude API
    console.log('Making request to Claude API with research-enhanced prompt...');
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
        analysis,
        researchUsed: true,
        researchResults: researchResults
      });
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      
      // Return enhanced fallback response
      const fallbackResponse = {
        taskName: `${taskData.taskName} - Research-Based Automation`,
        description: `AI/API automation solution using verified ${software} APIs`,
        manualProcessAnalysis: {
          system: software,
          currentSteps: [
            "Manual navigation to software interface",
            "Data entry through forms",
            "Processing and validation",
            "Save and confirmation steps"
          ],
          timePerExecution: `${timePerWeek} hours per week`,
          painPoints: [
            "Time-consuming manual navigation",
            "Repetitive data entry prone to errors",
            "No automated validation",
            "Scalability limitations"
          ],
          errorProneness: "High - manual processes are error-prone"
        },
        automationSolution: {
          architecture: {
            trigger: "Webhook or scheduled automation",
            processing: "AI validates and formats data",
            apiIntegration: `${software} REST API with verified endpoints`,
            output: "Automated task completion with logging"
          },
          technicalImplementation: {
            verifiedEndpoint: software.includes('GoHighLevel') ? 
              "https://services.leadconnectorhq.com/opportunities" : 
              `https://api.${software.toLowerCase()}.com/v1/endpoint`,
            authenticationMethod: software.includes('GoHighLevel') ? 
              "Private Integration Token (no Bearer prefix)" : 
              "API Key or OAuth 2.0",
            requiredHeaders: software.includes('GoHighLevel') ? {
              "Authorization": "YOUR_PRIVATE_INTEGRATION_TOKEN",
              "Content-Type": "application/json",
              "Version": "2021-07-28"
            } : {
              "Authorization": "Bearer YOUR_API_KEY",
              "Content-Type": "application/json"
            },
            sampleRequestBody: software.includes('GoHighLevel') ? {
              "locationId": "YOUR_LOCATION_ID",
              "title": "Automated Deal Creation",
              "pipelineId": "YOUR_PIPELINE_ID",
              "pipelineStageId": "YOUR_STAGE_ID",
              "status": "open"
            } : {
              "name": taskData.taskName,
              "data": "automation_data"
            },
            errorHandling: [
              "Retry logic with exponential backoff",
              "Validation before API calls",
              "Manual review queue for failures",
              "Comprehensive logging and monitoring"
            ]
          },
          workingCodeExample: `// ${taskData.taskName} Automation
const automation = async (data) => {
  try {
    const response = await fetch('${software.includes('GoHighLevel') ? 'https://services.leadconnectorhq.com/opportunities' : 'API_ENDPOINT'}', {
      method: 'POST',
      headers: ${JSON.stringify(software.includes('GoHighLevel') ? {
        "Authorization": "YOUR_PRIVATE_INTEGRATION_TOKEN",
        "Content-Type": "application/json",
        "Version": "2021-07-28"
      } : {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
      }, null, 8)},
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error(\`API Error: \${response.status}\`);
    return await response.json();
  } catch (error) {
    console.error('Automation failed:', error);
    // Add to manual review queue
    await addToReviewQueue(data, error);
    throw error;
  }
};`
        },
        businessImpact: {
          timeReduction: "90% reduction in manual processing time",
          costSavings: `£${Math.round(timePerWeek * 52 * 0.9 * 30)} per year`,
          accuracyImprovement: "Elimination of human data entry errors",
          scalabilityBenefit: "Can handle 10x more volume without additional staff"
        },
        implementationPlan: {
          phase1: `${software} API setup and authentication (Week 1)`,
          phase2: "Core automation development and testing (Week 2-3)",
          phase3: "Production deployment and monitoring (Week 4)",
          timeline: "4 weeks total implementation",
          resources: "Node.js developer, API access, testing environment"
        }
      };

      return res.status(200).json({
        success: true,
        analysis: fallbackResponse,
        researchUsed: true,
        researchResults: researchResults,
        note: "Enhanced fallback analysis with research-based information"
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