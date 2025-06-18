export default async function handler(req, res) {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get API key from environment
    const apiKey = process.env.CLAUDE_API_KEY || process.env.VITE_CLAUDE_API_KEY;
    
    if (!apiKey) {
      console.error('❌ No Claude API key found');
      return res.status(500).json({ 
        error: 'Claude API key not configured',
        details: 'Missing CLAUDE_API_KEY or VITE_CLAUDE_API_KEY environment variable'
      });
    }

    const { section, industry, userDetails } = req.body;

    if (!section || !industry) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'section and industry are required'
      });
    }

    console.log(`🔧 Generating section: ${section.title} for ${industry.name}`);

    // Create focused prompt for individual section
    const prompt = `Generate a professional HTML section for a business automation report.

SECTION: ${section.title}
INDUSTRY: ${industry.name}
DESCRIPTION: ${section.description}

REQUIREMENTS:
- Generate complete HTML with embedded CSS
- Professional business styling
- Include specific metrics and data
- Add implementation steps
- Include risk assessment
- Use tables and visual elements

IMPORTANT: Respond with HTML only, starting with <div class="report-section"> and ending with </div>.

Include these CSS classes in a <style> tag:
- .section-header (blue gradient background)
- .metric-card (for key numbers)
- .implementation-step (for action items)
- .highlight-box (for important notes)

Generate a comprehensive, professional section with real business insights.`;

    const requestBody = {
      model: "claude-3-opus-20240229",
      max_tokens: 4000, // Increased for better content
      messages: [{
        role: "user",
        content: prompt
      }]
    };

    console.log('📡 Calling Claude API for section generation...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Claude API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Claude API request failed',
        details: errorText,
        status: response.status
      });
    }

    const data = await response.json();
    console.log('✅ Claude API response received');

    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('❌ Invalid response format from Claude API');
      return res.status(500).json({
        error: 'Invalid response format from Claude API',
        details: 'Missing content in response'
      });
    }

    const generatedContent = data.content[0].text;

    // Validate HTML structure
    const hasHtmlStructure = generatedContent.includes('<html') || generatedContent.includes('<div');
    
    if (!hasHtmlStructure) {
      console.warn('⚠️ Generated content may not be valid HTML');
    }

    console.log(`✅ Section generated successfully: ${generatedContent.length} characters`);

    return res.status(200).json({
      success: true,
      content: generatedContent,
      section: section,
      metadata: {
        contentLength: generatedContent.length,
        hasHtmlStructure,
        generatedAt: new Date().toISOString(),
        estimatedPages: section.estimatedPages
      }
    });

  } catch (error) {
    console.error('❌ Section generation error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      section: section?.title,
      industry: industry?.name
    });
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      section: section?.title,
      timestamp: new Date().toISOString()
    });
  }
} 