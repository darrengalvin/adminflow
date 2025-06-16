import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/claude', async (req, res) => {
  try {
    console.log('🔄 Proxy: Received Claude API request');
    const { taskData } = req.body;
    
    if (!taskData) {
      return res.status(400).json({ error: 'Task data is required' });
    }

    const apiKey = process.env.VITE_CLAUDE_API_KEY;
    
    if (!apiKey) {
      console.log('❌ No Claude API key found');
      return res.status(500).json({ 
        error: 'Claude API key not configured',
        fallback: true 
      });
    }

    console.log('📊 Making REAL Claude API request for:', taskData.taskName);

    // Parse time spent to number
    const parseTimeSpent = (timeText) => {
      const numbers = timeText.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        return parseInt(numbers[0]);
      }
      return 2;
    };

    const timePerWeek = parseTimeSpent(taskData.timeSpent);
    const annualHours = timePerWeek * 52;
    const savings = Math.round(annualHours * 0.7);

    const prompt = `You are an expert automation consultant analyzing tasks for a CUSTOM AUTOMATION TOOL. This is NOT for Make.com, Zapier, or other third-party platforms. You are designing a workflow step that will be built into a custom automation system.

CONTEXT: This analysis is for building a custom workflow step in a proprietary automation platform. Focus on the technical implementation details, specific APIs, data flows, and code-level requirements.

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
    "goodNews": "Brief exciting explanation of why this is automatable as a custom workflow step",
    "whatIsAPI": "Simple explanation of what APIs are needed for this custom implementation",
    "howItWorks": "Technical step-by-step explanation of how this workflow step would execute",
    "whatYouNeed": "Specific technical requirements: APIs, authentication, data formats, etc.",
    "endpoints": [
      {
        "name": "Specific API endpoint name",
        "endpoint": "Actual API URL and method",
        "purpose": "What this endpoint does in the workflow",
        "whatItDoes": "Technical details of the API call and data handling",
        "authentication": "Required auth method",
        "inputData": "What data this step needs as input",
        "outputData": "What data this step produces as output"
      }
    ],
    "nextSteps": "Technical implementation steps for building this workflow step"
  },
  "currentProcess": {
    "software": "${taskData.software}",
    "timePerWeek": ${timePerWeek},
    "painPoints": "${taskData.painPoints}",
    "alternativeUse": "${taskData.alternatives}"
  },
  "automation": {
    "type": "Type of custom workflow step (API Integration, Document Processing, etc.)",
    "apiConnections": ["List of specific APIs this workflow step will call"],
    "aiCapabilities": ["List of AI/ML features needed for this step"],
    "technicalRequirements": ["Programming languages, libraries, infrastructure needed"]
  },
  "impact": {
    "annualHoursSaved": ${savings},
    "monthlyHoursSaved": ${Math.round(timePerWeek * 4 * 0.7)},
    "valuePerYear": "£${savings * 25}",
    "efficiencyGain": "70%"
  },
  "implementation": {
    "setupTime": "Development time estimate for this workflow step",
    "difficulty": "Easy/Medium/Hard",
    "steps": ["Technical implementation steps for building this workflow step"],
    "nextActions": ["Immediate development tasks"],
    "codeRequirements": {
      "inputSchema": "JSON schema for input data this step expects",
      "outputSchema": "JSON schema for output data this step produces",
      "errorHandling": "How to handle failures and edge cases",
      "dependencies": ["Required libraries, APIs, services"]
    }
  }
}

Focus on:
1. REAL, specific APIs and endpoints that this workflow step will call
2. Technical implementation details for custom development
3. Input/output data schemas and formats
4. Authentication and security requirements
5. Error handling and edge cases
6. NO mentions of Make.com, Zapier, or other third-party automation platforms
7. This is for building a custom workflow step from scratch

Be precise about technical requirements and provide actionable development guidance.`;

    // Make REAL request to Claude API
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

    console.log('✅ Claude API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Claude API error:', response.status, errorData);
      return res.status(500).json({ 
        error: `Claude API error: ${response.status}`,
        details: errorData
      });
    }

    const data = await response.json();
    console.log('📦 Claude API response received:', {
      usage: data.usage,
      contentLength: data.content?.[0]?.text?.length || 0
    });

    const claudeResponse = data.content[0]?.text || '';

    // Parse JSON response
    try {
      const cleanedResponse = claudeResponse.replace(/```json\n?|\n?```/g, '').trim();
      const analysis = JSON.parse(cleanedResponse);
      
      console.log('✨ REAL Claude analysis completed for:', analysis.taskName);
      
      return res.status(200).json({
        success: true,
        analysis,
        source: 'REAL_CLAUDE_API'
      });
    } catch (parseError) {
      console.error('❌ Failed to parse Claude response:', parseError);
      console.log('📝 Raw response:', claudeResponse.substring(0, 500));
      
      return res.status(500).json({ 
        error: 'Failed to parse Claude response',
        rawResponse: claudeResponse.substring(0, 1000)
      });
    }

  } catch (error) {
    console.error('❌ Proxy server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Claude API proxy running on http://localhost:${PORT}`);
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/api/claude`);
  console.log(`🔑 API Key configured: ${process.env.VITE_CLAUDE_API_KEY ? 'Yes (' + process.env.VITE_CLAUDE_API_KEY.length + ' chars)' : 'No'}`);
  console.log(`💡 This proxy enables REAL Claude API calls in development`);
}); 