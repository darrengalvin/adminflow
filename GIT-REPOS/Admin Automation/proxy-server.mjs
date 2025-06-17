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

CRITICAL: This is an AI-POWERED automation system. For every task, you MUST explain what AI will do with the data - how AI will process, enhance, analyze, or make decisions with the information. AI is not just connecting APIs, it's adding intelligence to the process.

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
    "goodNews": "Brief exciting explanation of why this is automatable as a custom workflow step with AI enhancement",
    "whatIsAPI": "Simple explanation of what APIs are needed for this custom implementation",
    "howItWorks": "Technical step-by-step explanation of how this workflow step would execute, emphasizing AI processing",
    "whatYouNeed": "Specific technical requirements: APIs, authentication, data formats, AI models, etc.",
    "aiProcessing": {
      "inputProcessing": "How AI will analyze and process the incoming data",
      "smartDecisions": "What intelligent decisions AI will make during processing",
      "dataEnhancement": "How AI will enrich, validate, or improve the data",
      "continuousLearning": "How the AI will learn and improve over time"
    },
    "endpoints": [
      {
        "name": "Specific API endpoint name",
        "endpoint": "Actual API URL and method",
        "purpose": "What this endpoint does in the workflow",
        "whatItDoes": "Technical details of the API call and data handling",
        "authentication": "Required auth method (Bearer Token, API Key, OAuth, etc.)",
        "inputData": "What data this step needs as input",
        "outputData": "What data this step produces as output",
        "aiEnhancement": "How AI processes the data from this endpoint"
      }
    ],
    "nextSteps": "Technical implementation steps for building this AI-enhanced workflow step"
  },
  "currentProcess": {
    "software": "${taskData.software}",
    "timePerWeek": ${timePerWeek},
    "painPoints": "${taskData.painPoints}",
    "alternativeUse": "${taskData.alternatives}"
  },
  "automation": {
    "type": "AI-Enhanced Custom Workflow Step",
    "apiConnections": ["List of specific APIs that will be integrated"],
    "aiCapabilities": [
      "Specific AI processing capabilities for this task",
      "Machine learning features that will be applied",  
      "Natural language processing if applicable",
      "Pattern recognition and anomaly detection",
      "Predictive analytics if relevant"
    ],
    "integrations": ["Custom API development", "AI/ML processing pipeline", "Database integrations", "Real-time monitoring"]
  },
  "impact": {
    "annualHoursSaved": ${savings},
    "monthlyHoursSaved": ${Math.round(timePerWeek * 4 * 0.7)},
    "valuePerYear": "£${savings * 25}",
    "efficiencyGain": "70%",
    "aiAdvantages": [
      "Specific advantages AI brings to this process",
      "Quality improvements through AI processing",
      "Error reduction through intelligent validation"
    ]
  },
  "implementation": {
    "setupTime": "Realistic time estimate for implementation including AI training",
    "difficulty": "Easy/Medium/Hard",
    "steps": [
      "Step 1: API integration setup",
      "Step 2: AI model configuration", 
      "Step 3: Data pipeline creation",
      "Step 4: AI training and testing",
      "Step 5: Production deployment",
      "Step 6: Monitoring and optimization"
    ],
    "nextActions": [
      "Immediate action items for getting started",
      "AI/ML requirements assessment",
      "Data preparation needs"
    ],
    "technicalRequirements": {
      "apis": ["Specific API endpoints needed"],
      "aiModels": ["AI models or services required"],
      "dataStorage": "Data storage requirements",
      "computing": "Processing power needs for AI"
    }
  }
}

Focus on:
1. REAL, specific APIs and endpoints where possible
2. Detailed explanation of AI processing and intelligence
3. Practical, implementable solutions with AI enhancement
4. Clear business value and time savings through AI
5. Specific next steps the user can take
6. How AI makes this automation smarter than simple API connections
7. Accurate technical requirements including AI/ML components

Be precise about which software integrations are actually possible and provide realistic implementation guidance that emphasizes the AI-powered nature of the automation.`;

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