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

    // Get API key from environment variables (server-side doesn't use VITE_ prefix)
    const apiKey = process.env.CLAUDE_API_KEY || process.env.VITE_CLAUDE_API_KEY || process.env.claudeApiKey;
    
    console.log('📋 PDF Report API Key check (Vercel Pro):', {
      hasViteKey: !!process.env.VITE_CLAUDE_API_KEY,
      hasClaudeKey: !!process.env.CLAUDE_API_KEY,
      hasAnyKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      reportType: reportType,
      maxDuration: '300s (Vercel Pro)',
      envKeys: Object.keys(process.env).filter(key => key.includes('CLAUDE'))
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
    console.log('🤖 Making PDF report request to Claude API with model: claude-opus-4-20250514 (Vercel Pro Extended Timeout)');
    console.log('📝 Prompt length:', prompt.length, 'characters');
    console.log('📋 Prompt preview:', prompt.substring(0, 200) + '...');
    
    const requestBody = {
      model: 'claude-opus-4-20250514', // Keep Claude 4 Opus as requested
      max_tokens: 6000, // Increased for comprehensive reports
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    // Create AbortController for timeout handling - Vercel Pro allows up to 5 minutes (300s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 290000); // 4 min 50 sec timeout (10s buffer for Vercel Pro)
    
    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2).substring(0, 500) + '...');
    console.log('⏰ Using Vercel Pro extended timeout: 290 seconds');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId); // Clear timeout if request completes

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

    console.log('✅ Successfully received Claude response for PDF report (Vercel Pro)');
    console.log('📊 Response length:', claudeResponse.length, 'characters');

    return res.status(200).json({
      success: true,
      content: claudeResponse,
      source: 'claude-api',
      model: 'claude-opus-4-20250514',
      reportType: reportType,
      vercelPro: true
    });

  } catch (error) {
    console.error('❌ Error in PDF report generation:', error);
    
    // Handle timeout specifically
    if (error.name === 'AbortError') {
      console.error('⏰ Request timed out after 290 seconds (Vercel Pro limit)');
      return res.status(504).json({ 
        error: 'Request timeout - Claude API took longer than 5 minutes (Vercel Pro limit)',
        success: false,
        source: 'timeout',
        details: 'The comprehensive report generation exceeded Vercel Pro timeout limits. Consider simplifying the workflow or using split API strategy.'
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      success: false,
      source: 'fallback',
      details: error.message
    });
  }
} 