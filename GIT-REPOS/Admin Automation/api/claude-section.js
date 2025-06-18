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

    // Create focused prompt for individual section with dual output format
    const prompt = `You are a business consultant. Generate content for a report section in STRICT JSON format.

SECTION: ${section.title}
INDUSTRY: ${industry.name}
DESCRIPTION: ${section.description}

CRITICAL: You MUST respond with ONLY a valid JSON object. No other text before or after.

The JSON must have this EXACT structure:
{
  "htmlContent": "<div class='section'>HTML content with CSS styling for web display</div>",
  "pdfData": {
    "title": "Section Title",
    "keyMetrics": [
      {"label": "ROI Improvement", "value": "25%", "description": "Expected return on investment"}
    ],
    "mainPoints": [
      "Key business insight with specific details",
      "Another important point with actionable information"
    ],
    "implementationSteps": [
      {"step": 1, "title": "Initial Assessment", "description": "Conduct comprehensive evaluation", "timeline": "2-3 weeks"}
    ],
    "risks": [
      {"risk": "Implementation delays", "impact": "Medium", "mitigation": "Establish clear timelines"}
    ],
    "recommendations": [
      "Implement automated quality control systems",
      "Train staff on new procedures"
    ]
  }
}

REQUIREMENTS:
- htmlContent: Complete HTML with embedded CSS for beautiful web display
- pdfData: Clean structured data with specific metrics, steps, and recommendations
- All fields must contain realistic business content
- No placeholder text or generic examples
- Focus on ${industry.name} industry specifics

RESPOND WITH ONLY THE JSON OBJECT - NO MARKDOWN, NO EXPLANATIONS, NO OTHER TEXT.`;

    const requestBody = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
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

    let generatedContent = data.content[0].text.trim();
    
    console.log('🔍 Raw Claude response preview:', generatedContent.substring(0, 200) + '...');
    
    // Try to parse as JSON first
    let parsedContent;
    try {
      // More aggressive cleanup of the response
      let cleanedContent = generatedContent;
      
      // Remove any markdown code blocks
      if (cleanedContent.includes('```')) {
        cleanedContent = cleanedContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      }
      
      // Remove any leading/trailing explanatory text
      const jsonStart = cleanedContent.indexOf('{');
      const jsonEnd = cleanedContent.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleanedContent = cleanedContent.substring(jsonStart, jsonEnd + 1);
      }
      
      // Remove any remaining non-JSON text
      cleanedContent = cleanedContent.trim();
      
      console.log('🧹 Cleaned content for JSON parsing:', cleanedContent.substring(0, 200) + '...');
      
      parsedContent = JSON.parse(cleanedContent);
      
      // Validate the structure
      if (!parsedContent.htmlContent || !parsedContent.pdfData) {
        throw new Error('Invalid JSON structure - missing htmlContent or pdfData');
      }
      
      console.log(`✅ Section generated successfully with dual format`);
      
      return res.status(200).json({
        success: true,
        content: parsedContent.htmlContent, // For backward compatibility
        htmlContent: parsedContent.htmlContent,
        pdfData: parsedContent.pdfData,
        section: section,
        metadata: {
          contentLength: parsedContent.htmlContent.length,
          hasHtmlStructure: true,
          hasPdfData: true,
          generatedAt: new Date().toISOString(),
          estimatedPages: section.estimatedPages
        }
      });
      
    } catch (parseError) {
      console.warn('⚠️ Failed to parse as JSON, falling back to HTML-only mode');
      console.warn('📝 Parse error:', parseError.message);
      console.warn('🔍 Content that failed to parse:', generatedContent.substring(0, 500) + '...');
      
      // Fallback to original HTML-only behavior
      const hasHtmlStructure = generatedContent.includes('<html') || generatedContent.includes('<div');
      
      if (!hasHtmlStructure) {
        console.warn('⚠️ Generated content may not be valid HTML');
      }

      console.log(`✅ Section generated successfully (HTML-only fallback): ${generatedContent.length} characters`);

      return res.status(200).json({
        success: true,
        content: generatedContent,
        htmlContent: generatedContent,
        pdfData: null, // No structured data available
        section: section,
        metadata: {
          contentLength: generatedContent.length,
          hasHtmlStructure,
          hasPdfData: false,
          generatedAt: new Date().toISOString(),
          estimatedPages: section.estimatedPages
        }
      });
    }

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