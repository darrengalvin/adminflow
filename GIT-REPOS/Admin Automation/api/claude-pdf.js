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
    const { prompt, reportType } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get API key from environment variables
    const apiKey = process.env.VITE_CLAUDE_API_KEY || process.env.claudeApiKey;
    
    console.log('📋 PDF Report API Key check:', {
      hasViteKey: !!process.env.VITE_CLAUDE_API_KEY,
      hasClaudeKey: !!process.env.claudeApiKey,
      hasAnyKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      reportType: reportType
    });
    
    if (!apiKey) {
      console.error('❌ No Claude API key found in environment variables');
      return res.status(500).json({ 
        error: 'Claude API key not configured',
        success: false,
        source: 'fallback'
      });
    }

    // Make request to Claude API
    console.log('🤖 Making PDF report request to Claude API with model: claude-opus-4-20250514');
    console.log('📝 Prompt length:', prompt.length, 'characters');
    console.log('📋 Prompt preview:', prompt.substring(0, 200) + '...');
    
    const requestBody = {
      model: 'claude-opus-4-20250514', // Using Claude 4 Opus - the most capable model
      max_tokens: 4000, // Matching working task analysis
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };
    
    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2).substring(0, 500) + '...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📡 Claude API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Claude API error details:');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Error Data:', errorData);
      console.error('Request headers:', response.headers);
      
      // Try to parse error for more details
      try {
        const parsedError = JSON.parse(errorData);
        console.error('Parsed error:', parsedError);
      } catch (e) {
        console.error('Could not parse error as JSON');
      }
      
      return res.status(500).json({ 
        error: `Claude API error: ${response.status}`,
        details: errorData,
        success: false,
        source: 'fallback'
      });
    }

    const data = await response.json();
    const claudeResponse = data.content[0]?.text || '';

    console.log('✅ Successfully received Claude response for PDF report');
    console.log('📊 Response length:', claudeResponse.length, 'characters');

    return res.status(200).json({
      success: true,
      content: claudeResponse,
      source: 'claude-api',
      model: 'claude-opus-4-20250514',
      reportType: reportType
    });

  } catch (error) {
    console.error('❌ Error in PDF report generation:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      success: false,
      source: 'fallback',
      details: error.message
    });
  }
} 