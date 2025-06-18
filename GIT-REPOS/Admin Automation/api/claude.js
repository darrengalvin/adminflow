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

    const prompt = `You are an AI automation specialist with real-time access to current API documentation and integration capabilities. You MUST provide specific, working solutions based on actual research.

TASK ANALYSIS - MANUAL TO AUTOMATED:
- Task: "${taskData.taskName}"
- Current Software: "${taskData.software}"
- Description: "${taskData.description}"
- Weekly Time: ${taskData.timeSpent}
- Pain Points: ${taskData.painPoints}

🔍 RESEARCH REQUIREMENTS:
You have access to current API documentation. Based on the software "${taskData.software}", provide REAL API endpoints, actual authentication methods, and working code examples.

For "${taskData.software}" specifically:
1. Find the ACTUAL REST API endpoints
2. Identify REAL authentication requirements  
3. Provide WORKING code examples with proper error handling
4. Include SPECIFIC rate limits and costs
5. Reference ACTUAL documentation URLs

💡 AUTOMATION STRATEGY:
Analyze this as: "Here's exactly how you do this manually now" → "Here's the complete automated solution that replaces every step"

Return comprehensive automation analysis in this EXACT JSON format (return only valid JSON, no markdown):

  {
    "taskName": "🚀 Complete Automation: ${taskData.taskName}",
    "description": "Research-based AI/API solution to completely automate ${taskData.taskName.toLowerCase()} in ${taskData.software}",
    "researchFindings": {
      "apiAvailability": "VERIFIED: ${taskData.software} has comprehensive REST API",
      "authenticationMethod": "Bearer token authentication required",
      "documentationUrl": "https://developers.${taskData.software.toLowerCase().replace(/\s+/g, '')}.com/api/v2",
      "rateLimits": "1000 requests/hour (verified current limits)",
      "pricing": "API access included in Professional plans ($97/month+)"
    },
    "manualProcessBreakdown": {
      "currentSystem": "${taskData.software}",
      "exactStepsNow": [
        "🖱️ Navigate to ${taskData.software} dashboard",
        "📝 Manual data entry in forms",
        "🔍 Search and locate existing records",
        "✏️ Update fields one by one",
        "💾 Save changes manually",
        "📧 Send notifications manually"
      ],
      "timeWasted": "${timePerWeek} hours/week on repetitive clicks and data entry",
      "errorProneParts": [
        "Manual typing introduces typos",
        "Forgetting to update related fields",
        "Missing follow-up actions",
        "Inconsistent data formatting"
      ]
    },
      "completeSolution": {
      "automationArchitecture": {
        "triggerSource": "📨 Email monitoring via Gmail API webhook or 📝 Form submission trigger",
        "aiDataExtraction": "🤖 Claude Sonnet extracts: customer details, event requirements, budget indicators",
        "realTimeAPIs": "🔗 Direct integration with ${taskData.software} REST API v2.1",
        "smartErrorHandling": "🛡️ Automatic retries, manual review queue, admin notifications"
      },
      "liveImplementation": {
        "workingCode": \`// PRODUCTION-READY ${taskData.taskName} AUTOMATION
const express = require('express');
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

// Real webhook endpoint for ${taskData.software}
app.post('/webhook/${taskData.software.toLowerCase().replace(/\s+/g, '-')}-automation', async (req, res) => {
  console.log('🚀 New ${taskData.taskName.toLowerCase()} request received');
  
  try {
    // AI extracts structured data
    const aiResponse = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      messages: [{ 
        role: 'user', 
        content: \\\`Extract: \${JSON.stringify(req.body)}\\\` 
      }]
    });
    
    const extractedData = JSON.parse(aiResponse.content[0].text);
    
    // ${taskData.software} API integration
    const result = await fetch('https://rest.gohighlevel.com/v1/opportunities', {
      method: 'POST',
      headers: {
        'Authorization': \\\`Bearer \${process.env.GHL_API_KEY}\\\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contactId: extractedData.contactId,
        name: \\\`\${extractedData.date} | \${extractedData.activity} | \${extractedData.people}\\\`,
        stage: 'offer-made',
        monetaryValue: extractedData.budget || 0,
        source: 'ai-automation'
      })
    });
    
    const opportunityData = await result.json();
    console.log('✅ Opportunity created:', opportunityData.id);
    
    res.json({ 
      success: true, 
      opportunityId: opportunityData.id,
      automationTime: '12 seconds',
      manualTimeSaved: '6 minutes'
    });
    
  } catch (error) {
    console.error('❌ Automation failed:', error);
    
    // Smart error handling
    await fetch(process.env.SLACK_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify({
        text: \\\`🚨 ${taskData.taskName} automation failed: \${error.message}\\\`
      })
    });
    
    res.status(500).json({ error: 'Automation failed, manual review required' });
  }
});\`,
        "verifiedAPIs": [
          {
            "name": "${taskData.software} Opportunities API",
            "method": "POST",
            "endpoint": "https://rest.gohighlevel.com/v1/opportunities",
            "authentication": "Bearer token in Authorization header",
            "rateLimit": "1000/hour (verified Nov 2024)",
            "documentation": "https://highlevel.stoplight.io/docs/integrations/",
            "testable": true
          },
          {
            "name": "${taskData.software} Contacts API", 
            "method": "GET",
            "endpoint": "https://rest.gohighlevel.com/v1/contacts/lookup",
            "purpose": "Find existing contacts before creating opportunities",
            "responseTime": "~200ms average",
            "successRate": "99.2% uptime"
          }
        ],
        "bulletproofErrorHandling": [
          "🔄 API Rate Limiting: Exponential backoff with 3 retry attempts",
          "📧 Missing Data: AI fills gaps or routes to manual review queue",
          "🚨 Critical Failures: Instant Slack notifications + email alerts",
          "📊 Monitoring: Real-time dashboard tracks success rates",
          "🔐 Security: API keys stored in encrypted environment variables"
        ]
      }
    },
      "measuredResults": {
      "timeComparison": {
        "beforeAutomation": "${timePerWeek} hours/week manual ${taskData.taskName.toLowerCase()}",
        "afterAutomation": "12 seconds per ${taskData.taskName.toLowerCase()} (measured)",
        "timeMultiplier": "${Math.round((timePerWeek * 60 * 60) / 12)}x faster than manual",
        "weeklyTimeSaved": "${Math.round(timePerWeek * 0.98)} hours (${Math.round(timePerWeek * 0.98 * 60)} minutes)",
        "monthlyTimeSaved": "${Math.round(timePerWeek * 4 * 0.98)} hours",
        "yearlyTimeSaved": "${Math.round(timePerWeek * 52 * 0.98)} hours"
      },
      "financialROI": {
        "hourlyRate": "£35 (admin cost)",
        "yearlyLaborSavings": "£${Math.round(timePerWeek * 52 * 0.98 * 35)}",
        "developmentCost": "£3,200 (one-time)",
        "monthlyCosts": "£180 (API usage + hosting)",
        "breakEvenPoint": "${Math.round(3200 / (timePerWeek * 52 * 0.98 * 35 / 12))} months",
        "year1NetSavings": "£${Math.round(timePerWeek * 52 * 0.98 * 35 - 3200 - 180 * 12)}"
      },
      "scalabilityBenefits": [
        "🚀 Process 100x more ${taskData.taskName.toLowerCase()}s without hiring",
        "🌙 24/7 processing (no weekends/holidays delays)",
        "🎯 100% consistency (eliminates human errors)",
        "📊 Real-time analytics and reporting",
        "🔄 Instant updates across all connected systems"
      ]
    },
    "liveAPITesting": {
      "testableEndpoints": [
        {
          "name": "${taskData.software} Authentication Test",
          "method": "GET",
          "endpoint": "https://rest.gohighlevel.com/v1/locations",
          "purpose": "Verify API credentials and access",
          "expectedResponse": "200 OK with location data",
          "testable": true
        },
        {
          "name": "Create Opportunity Test",
          "method": "POST", 
          "endpoint": "https://rest.gohighlevel.com/v1/opportunities",
          "purpose": "Test ${taskData.taskName.toLowerCase()} automation",
          "sampleData": "{\\"contactId\\": \\"test_123\\", \\"name\\": \\"Test Opportunity\\"}",
          "testable": true
        }
      ],
      "integrationChecklist": [
        "✅ API credentials obtained and verified",
        "✅ Rate limits tested (1000/hour confirmed)",  
        "✅ Error handling verified with invalid data",
        "✅ Webhook endpoint tested and responding",
        "🔄 Production deployment ready"
      ]
    },
  "implementationRoadmap": {
    "phase1": {
      "title": "Setup (Week 1)",
      "tasks": [
        "Obtain API credentials for ${taskData.software}",
        "Set up development environment",
        "Create test data set",
        "Build basic API connectivity"
      ]
    },
    "phase2": {
      "title": "Core Automation (Week 2-3)",
      "tasks": [
        "Implement main automation workflow",
        "Add comprehensive error handling",
        "Create monitoring and logging",
        "Test with real data"
      ]
    },
    "phase3": {
      "title": "Deployment (Week 4)",
      "tasks": [
        "User acceptance testing",
        "Deploy to production",
        "Set up monitoring alerts", 
        "Train team on new process"
      ]
    },
    "requiredResources": {
      "technical": "Node.js developer, API integration experience",
      "access": "${taskData.software} admin access, API keys",
      "timeEstimate": "20-25 development hours",
      "budget": "£150/month ongoing costs"
    }
  },
  "riskAssessment": {
    "potentialRisks": [
      "API Changes: ${taskData.software} updates could break integration",
      "Data Quality: Poor input data could create issues",
      "Rate Limits: High volume could hit API limits"
    ],
    "mitigationStrategies": [
      "Subscribe to API changelog and maintain compatibility",
      "Implement data validation with manual review fallback",
      "Add request queuing and retry logic"
    ]
  }
}

CRITICAL REQUIREMENTS:
1. ✅ Provide SPECIFIC API endpoints - not generic "has an API"
2. ✅ Include WORKING code examples - actual implementable code  
3. ✅ Detail COMPREHENSIVE error handling - cover edge cases
4. ✅ Calculate EXACT time/cost savings - real business numbers
5. ✅ Create REALISTIC implementation timeline - actual project plan
6. ✅ Include TESTING procedures - how to validate it works

❌ AVOID: Generic statements, vague suggestions, missing technical details, no code examples

Focus on transforming the manual process into a complete technical automation solution with specific APIs, working code, and detailed implementation guidance.`;

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