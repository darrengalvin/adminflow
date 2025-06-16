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
      
      // Return fallback response if JSON parsing fails
      const fallbackResponse = {
        taskName: `Automate: ${taskData.taskName}`,
        description: `AI-powered automation to eliminate manual ${taskData.taskName.toLowerCase()} process`,
        userFriendlyExplanation: {
          goodNews: `This task shows good automation potential using ${taskData.software}.`,
          whatIsAPI: "An API is like a bridge that lets different software systems talk to each other automatically.",
          howItWorks: `When the trigger event occurs, the automation will handle ${taskData.taskName.toLowerCase()} without manual intervention.`,
          whatYouNeed: `Integration with ${taskData.software} and automation platform setup.`,
          endpoints: [
            {
              name: `${taskData.software} Integration`,
              endpoint: "Specific API endpoint depends on your software version",
              purpose: `Automate ${taskData.taskName.toLowerCase()}`,
              whatItDoes: "Eliminates manual data entry and processing"
            }
          ],
          nextSteps: "Connect with a developer to implement the specific API integrations needed."
        },
        currentProcess: {
          software: taskData.software,
          timePerWeek: timePerWeek,
          painPoints: taskData.painPoints,
          alternativeUse: taskData.alternatives
        },
        automation: {
          type: "API Integration",
          apiConnections: [`${taskData.software} API`],
          aiCapabilities: ["Data extraction", "Pattern recognition", "Automated decision making"],
          integrations: ["Zapier", "Make.com", "Custom API integration"]
        },
        impact: {
          annualHoursSaved: savings,
          monthlyHoursSaved: Math.round(timePerWeek * 4 * 0.7),
          valuePerYear: `£${savings * 25}`,
          efficiencyGain: "70%"
        },
        implementation: {
          setupTime: "2-4 weeks",
          difficulty: "Medium",
          steps: [
            "Identify specific API endpoints",
            "Set up authentication",
            "Create automation workflow",
            "Test and refine",
            "Deploy to production"
          ],
          nextActions: [
            "Consult with technical team",
            "Research specific API documentation",
            "Create implementation timeline"
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