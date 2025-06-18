const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export interface WorkflowAnalysisRequest {
  workflowName: string;
  workflowDescription: string;
  steps: Array<{
    name: string;
    description?: string;
    type: string;
  }>;
}

export interface AIGeneratedReport {
  componentCode: string;
  reportData: any;
  metadata: {
    title: string;
    generatedAt: string;
    isRealAI: boolean;
  };
}

export class ClaudeService {
  private async callClaude(prompt: string): Promise<string> {
    console.log('🔄 Creating dedicated PDF report API call...');
    
    try {
      // Create a new proxy API call specifically for PDF reports
      const response = await fetch('/api/claude-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          reportType: 'html-document'
        })
      });

      console.log('📡 PDF API response status:', response.status);

      if (!response.ok) {
        // Handle authentication error specifically
        if (response.status === 401) {
          console.log('🔒 API endpoint is protected by Vercel authentication');
          throw new Error('API endpoint protected - deployment requires public access');
        }
        
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ PDF API error:', errorData);
        
        // Handle timeout specifically
        if (response.status === 504) {
          throw new Error(`Report generation timed out. The comprehensive prompt requires significant processing time. Please try again or consider simplifying the workflow.`);
        }
        
        throw new Error(`PDF API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('✅ PDF API response received:', { 
        success: data.success, 
        source: data.source || 'api',
        hasContent: !!data.content 
      });

      if (data.success && data.content) {
        console.log('✅ Using REAL AI-generated React component from Claude 4 Opus');
        return data.content;
      } else {
        throw new Error('Invalid response format from PDF API');
      }
    } catch (error) {
      console.error('❌ Error calling PDF API:', error);
      console.log('⚠️ Falling back to static content (API not available in local dev)');
      throw error;
    }
  }

  async generateReactReport(workflowData: WorkflowAnalysisRequest): Promise<AIGeneratedReport> {
    console.log('🤖 Making REAL API call to Claude 4 Opus for React component generation...');
    console.log('📊 Workflow data:', { 
      name: workflowData.workflowName, 
      steps: workflowData.steps.length,
      hasApiKey: !!CLAUDE_API_KEY
    });
    
    // Ultra-detailed Fortune 500 quality HTML/JS report prompt with enhanced styling guidelines
    const prompt = `Generate a complete, professional HTML document for: ${workflowData.workflowName}

Create a Fortune 500-quality business report that rivals the most sophisticated corporate annual reports and premium consulting firm deliverables. This document should demonstrate the highest level of design sophistication, visual hierarchy, and professional presentation standards.

MANDATORY DOCUMENT STRUCTURE:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${workflowData.workflowName} - Implementation Report 2024</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        /* COMPLETE CSS RESET AND VARIABLES */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --primary-blue: #1e40af;
            --secondary-slate: #475569;
            --accent-emerald: #10b981;
            --accent-rose: #f43f5e;
            --accent-amber: #f59e0b;
            --accent-cyan: #06b6d4;
            --bg-gray-50: #f9fafb;
            --bg-slate-50: #f8fafc;
            --text-gray-900: #111827;
            --text-gray-700: #374151;
            --text-gray-600: #4b5563;
            --white: #ffffff;
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
                 /* COMPLETE PROFESSIONAL CSS SYSTEM - PREMIUM FORTUNE 500 QUALITY */
         body {
             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
             line-height: 1.6;
             color: var(--text-gray-700);
             background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
             font-weight: 400;
             letter-spacing: -0.01em;
         }
         
         /* Typography Scale */
         h1 { font-size: 3.75rem; font-weight: 700; line-height: 1; }
         h2 { font-size: 2.25rem; font-weight: 700; color: var(--text-gray-900); }
         h3 { font-size: 1.5rem; font-weight: 600; color: var(--text-gray-900); }
         h4 { font-size: 1.125rem; font-weight: 600; color: var(--text-gray-900); }
         p { font-size: 1.125rem; line-height: 1.75; color: var(--text-gray-700); }
         
         /* Layout System */
         .container { display: flex; min-height: 100vh; }
         .sidebar { width: 256px; background: var(--white); box-shadow: var(--shadow-lg); padding: 1.5rem; position: fixed; height: 100%; overflow-y: auto; z-index: 10; }
         .main-content { flex: 1; margin-left: 256px; background: var(--white); max-width: 1280px; margin-left: auto; margin-right: auto; box-shadow: var(--shadow-xl); }
         
         /* Cover Page - CLEAN LIKE SAMPLE */
         .cover-page {
             height: 100vh;
             background: linear-gradient(135deg, #1e293b 0%, #1e40af 100%);
             color: white;
             padding: 4rem;
             display: flex;
             flex-direction: column;
             justify-content: space-between;
             position: relative;
             overflow: hidden;
         }
         
         /* Decorative Elements - MINIMAL */
         .cover-decorative-1, .cover-decorative-2 {
             position: absolute;
             background: rgba(255, 255, 255, 0.05);
             border-radius: 50%;
         }
         .cover-decorative-1 { width: 24rem; height: 24rem; top: -12rem; right: -12rem; }
         .cover-decorative-2 { width: 20rem; height: 20rem; bottom: -10rem; left: -10rem; }
         
         /* Navigation */
         .nav-link { display: block; padding: 0.75rem 1rem; border-radius: 0.5rem; text-decoration: none; color: var(--text-gray-700); transition: all 0.3s ease; margin-bottom: 0.5rem; }
         .nav-link:hover { background-color: #dbeafe; color: var(--primary-blue); }
         
         /* Sections */
         .section { padding: 4rem; }
         .section:nth-child(odd) { background-color: var(--bg-gray-50); }
         
         /* Cards - PREMIUM DESIGN */
         .card { 
             background: var(--white); 
             border-radius: 1rem; 
             padding: 2.5rem; 
             box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
             border: 1px solid rgba(255, 255, 255, 0.8);
             backdrop-filter: blur(10px);
         }
         .kpi-grid { 
             display: grid; 
             grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
             gap: 2rem; 
             margin: 3rem 0; 
         }
         .kpi-card { 
             text-align: center; 
             padding: 2rem; 
             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
             border-radius: 1rem; 
             color: white;
             box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
             transform: translateY(0);
             transition: transform 0.3s ease, box-shadow 0.3s ease;
         }
         .kpi-card:hover {
             transform: translateY(-5px);
             box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);
         }
         
         /* Charts */
         .chart-container { position: relative; height: 400px; margin: 2rem 0; }
         
                   /* CRITICAL: PRINT STYLES FOR PROPER PAGE BREAKS AND ALIGNMENT */
          @media print {
              /* Reset margins and hide navigation */
              * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
              .sidebar, .sticky-header { display: none !important; }
              .main-content { 
                  margin: 0 !important; 
                  padding: 0 !important; 
                  width: 100% !important; 
                  max-width: none !important;
                  box-shadow: none !important;
              }
              
              /* Page setup */
              @page {
                  margin: 0.5in;
                  size: A4;
              }
              
              /* Cover page - full page */
              .cover-page { 
                  page-break-after: always !important; 
                  height: 100vh !important;
                  margin: 0 !important;
                  padding: 2rem !important;
                  box-sizing: border-box !important;
              }
              
              /* Section spacing and breaks */
              .section { 
                  page-break-inside: avoid !important; 
                  margin: 0 !important;
                  padding: 1.5rem !important;
                  min-height: auto !important;
              }
              
              /* Text and heading alignment */
              h1, h2, h3, h4 { 
                  page-break-after: avoid !important; 
                  page-break-inside: avoid !important;
                  margin-bottom: 1rem !important;
                  margin-top: 0 !important;
              }
              
              h2 { 
                  font-size: 1.5rem !important;
                  margin-bottom: 1rem !important;
                  orphans: 3; 
                  widows: 3; 
              }
              
              /* Prevent content overflow */
              .card { 
                  page-break-inside: avoid !important;
                  margin-bottom: 1rem !important;
                  padding: 1rem !important;
                  box-sizing: border-box !important;
              }
              
              .kpi-grid { 
                  page-break-inside: avoid !important;
                  display: grid !important;
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 1rem !important;
                  margin: 1rem 0 !important;
              }
              
              .kpi-card {
                  padding: 0.75rem !important;
                  font-size: 0.875rem !important;
              }
              
              /* Chart containers */
              .chart-container { 
                  page-break-inside: avoid !important;
                  height: 300px !important;
                  margin: 1rem 0 !important;
              }
              
              /* Table of contents */
              .toc-section { 
                  page-break-after: always !important;
                  padding: 1.5rem !important;
              }
              
              /* Footer */
              .report-footer { 
                  page-break-before: auto !important;
                  padding: 1rem !important;
                  margin-top: 2rem !important;
              }
              
              /* Text sizing for print */
              p { 
                  font-size: 0.875rem !important; 
                  line-height: 1.4 !important;
                  margin-bottom: 0.5rem !important;
              }
              
              /* Remove decorative elements that cause alignment issues */
              .cover-decorative-1, .cover-decorative-2 {
                  display: none !important;
              }
          }
         
         /* Responsive Design */
         @media (max-width: 1024px) {
             .sidebar { display: none; }
             .main-content { margin-left: 0; }
         }
    </style>
</head>

REQUIRED SECTIONS IN EXACT ORDER:

1. COVER PAGE (Full viewport height):
   - Gradient background: linear-gradient(135deg, #1e293b 0%, #1e40af 100%)
   - Company header with logo/icon (top-left)
   - Centered title: "${workflowData.workflowName} - Implementation Report"
   - Subtitle: "Implementation Analysis 2024"
   - Sub-subtitle: "Q4 Performance Review"
   - Dynamic date footer: document.getElementById('report-date').textContent = new Date().toLocaleDateString()
   - Two decorative circles with rgba(255,255,255,0.05) background

2. FIXED SIDEBAR NAVIGATION (256px width):
   - White background with shadow
   - "Table of Contents" header
   - 5 clickable nav links with page numbers
   - Hover effects: background #dbeafe, color #1e40af
   - Responsive: hidden on mobile

3. STICKY HEADER:
   - Company branding and report title
   - Print button with SVG icon
   - White background with shadow
   - z-index: 20

4. TABLE OF CONTENTS PAGE (Full viewport height):
   - Large "Table of Contents" title
   - 5 numbered items (01-05) with:
     * Large section numbers (1.875rem, font-weight 300, color #9ca3af)
     * Section titles (1.25rem, font-weight 500)
     * Page numbers on right
     * Full-row clickable areas
     * Hover effects

5. EXECUTIVE SUMMARY SECTION:
   - Professional opening paragraph (1.125rem, line-height 1.75) with compelling business case
   - 4 KPI cards in responsive grid with impressive metrics:
     * Implementation Progress: 92% (+18% from baseline)
     * Annual Cost Savings: £247K (+£89K vs projection)
     * User Adoption Rate: 97% (+23% vs industry average)
     * ROI Achievement: 340% (+115% vs target)
   - Each KPI card with premium gradient backgrounds and hover effects
   - 5 key achievement bullet points with colored icons and quantified benefits
   - Executive summary with strategic insights and competitive advantages

6. MARKET OVERVIEW SECTION:
   - Market analysis paragraph
   - 3 feature cards with different gradient backgrounds:
     * Global Implementation (🌍 icon, blue gradient)
     * Market Position (🎯 icon, emerald gradient)
     * Industry Recognition (🏆 icon, amber gradient)
   - Competitive analysis table with:
     * Professional table styling
     * Hover effects on rows
     * Highlighted company row
     * Proper data alignment

7. FINANCIAL PERFORMANCE SECTION:
   - Interactive Chart.js area chart (400px height):
     * 6 months of revenue data
     * Gradient fill with linearGradient
     * Professional styling and animations
   - Two metric cards side-by-side:
     * Financial Highlights card
     * Growth Metrics card
   - Each metric with label/value pairs

8. PRODUCT ANALYSIS SECTION:
   - Two-column layout (Chart left, Progress bars right)
   - Chart.js pie chart with 4 segments:
     * Professional color scheme
     * Hover effects and tooltips
   - Animated progress bars for each product:
     * Different colors per product
     * Animation: @keyframes fillProgress
   - Innovation pipeline with 3 product cards

9. STRATEGIC RECOMMENDATIONS SECTION:
   - 3 numbered recommendation cards
   - Each with:
     * Colored circle number (3rem x 3rem)
     * Title and detailed description
     * Priority and timeline badges
     * Professional spacing and shadows

10. PROFESSIONAL FOOTER:
    - Dark background (#111827)
    - Three-column grid layout
    - Contact information with icons
    - Legal disclaimer text
    - Copyright notice with border-top

TECHNICAL REQUIREMENTS:

CSS SYSTEM:
- Complete reset and base styles
- CSS custom properties (variables)
- Professional typography scale (h1: 3.75rem, h2: 2.25rem, etc.)
- Responsive grid systems
- Hover effects and transitions
- Print media queries
- Smooth scrolling behavior

JAVASCRIPT FUNCTIONALITY:
- Dynamic date insertion
- Chart.js configurations for area and pie charts
- Smooth scrolling navigation
- Progress bar animations
- Print functionality
- Responsive sidebar handling

CHART.JS IMPLEMENTATIONS:
1. Area Chart:
   - 6 months of realistic data
   - Gradient fill configuration
   - Professional styling
   - Responsive container

2. Pie Chart:
   - 4 data segments
   - Professional color palette
   - Labels and tooltips
   - Hover animations

CONTENT QUALITY (FORTUNE 500 STANDARD):
- Use realistic, impressive business metrics (revenue: $12.4M, users: 15.8K, growth: +247%, etc.)
- Executive-level business language with strategic insights
- Proper number formatting with K/M/B suffixes and currency symbols
- Industry-standard terminology and business acronyms
- Compelling value propositions with quantified benefits
- Data-driven insights with percentage improvements
- Professional executive summary with key takeaways
- Strategic recommendations with implementation timelines
- Risk assessment and mitigation strategies
- Competitive analysis and market positioning
- ROI calculations with detailed financial projections
- Implementation roadmap with clear milestones
- Success metrics and KPI tracking
- Professional disclaimers and legal considerations

STYLING EXCELLENCE (CRITICAL FOR PREMIUM QUALITY):
- Consistent spacing system using 8px grid (0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem)
- Sophisticated color harmonies with proper contrast ratios (4.5:1 minimum)
- Multi-layered shadows for depth: box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
- Smooth micro-interactions: transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Professional typography scale: 12px, 14px, 16px, 18px, 24px, 32px, 48px
- Proper visual hierarchy with clear content grouping
- Premium gradients: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- Sophisticated hover states with transform: translateY(-2px)
- Professional spacing ratios (golden ratio: 1.618)
- Enterprise-grade component styling with proper padding and margins
- Advanced CSS Grid and Flexbox layouts for perfect alignment
- Subtle border-radius values: 4px, 8px, 12px, 16px for different elements
- Professional color palette with semantic meaning
- Consistent iconography and visual elements

RESPONSIVE DESIGN:
- Sidebar hidden on tablets/mobile
- Grid columns adapt (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Text sizes scale appropriately
- Touch-friendly interactive elements

PRINT OPTIMIZATION:
- Print-specific CSS rules
- Page break controls
- Optimized layouts for paper

ACCESSIBILITY:
- Semantic HTML structure
- Proper heading hierarchy
- High contrast ratios
- Focus indicators
- Screen reader friendly

PERFORMANCE:
- Efficient CSS selectors
- Optimized animations
- Proper image handling
- Fast loading CDN resources

RETURN FORMAT:
- Complete, valid HTML5 document
- All CSS inline in <style> tags
- All JavaScript inline in <script> tags
- No markdown formatting
- No explanatory text
- Ready to render immediately

Generate a document that would impress Fortune 500 executives, board members, and top-tier consulting firms. Every pixel should demonstrate premium quality, sophisticated design thinking, and meticulous attention to detail. The document should look like it was created by McKinsey, BCG, or Bain & Company.

VISUAL EXCELLENCE REQUIREMENTS:
- Use premium color schemes with sophisticated gradients
- Implement proper visual hierarchy with clear information architecture
- Include professional data visualizations and infographics
- Apply consistent branding and design language throughout
- Use high-quality typography with proper kerning and leading
- Implement sophisticated layout grids and alignment systems
- Include subtle animations and micro-interactions
- Apply professional spacing and white space management
- Use enterprise-grade iconography and visual elements
- Implement responsive design with mobile-first approach

BUSINESS CONTENT STANDARDS:
- Include executive summary with key insights and recommendations
- Provide detailed financial analysis with ROI projections
- Include market analysis and competitive positioning
- Provide implementation timeline with clear milestones
- Include risk assessment and mitigation strategies
- Provide success metrics and KPI tracking framework
- Include appendices with detailed technical specifications
- Use professional business language and terminology
- Include proper citations and data sources
- Provide actionable next steps and recommendations

Title: ${workflowData.workflowName} - Professional Implementation Report`;

    try {
      console.log('📡 Sending professional HTML document prompt to Claude 4 Opus...');
      const aiResponse = await this.callClaude(prompt);
      console.log('✅ Got HTML document from Claude API:', { 
        responseLength: aiResponse.length,
        preview: aiResponse.substring(0, 200) + '...'
      });
      
      // Enhanced HTML extraction with multiple strategies
      let htmlContent = aiResponse.trim();
      
      // Strategy 1: Remove markdown code blocks
      if (htmlContent.includes('```')) {
        const codeBlockMatch = htmlContent.match(/```(?:html?)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          htmlContent = codeBlockMatch[1].trim();
        }
      }
      
      // Strategy 2: Find HTML document boundaries
      const htmlStart = htmlContent.toLowerCase().indexOf('<!doctype html>') !== -1 
        ? htmlContent.toLowerCase().indexOf('<!doctype html>')
        : htmlContent.toLowerCase().indexOf('<html');
      
      if (htmlStart !== -1) {
        const htmlEndMatch = htmlContent.toLowerCase().lastIndexOf('</html>');
        if (htmlEndMatch !== -1) {
          htmlContent = htmlContent.substring(htmlStart, htmlEndMatch + 7).trim();
        }
      }
      
      // Strategy 3: Very lenient HTML validation - just check for basic HTML content
      const hasValidDoctype = htmlContent.toLowerCase().includes('<!doctype') || htmlContent.toLowerCase().includes('<html');
      const hasValidHead = htmlContent.toLowerCase().includes('<head>');
      const hasValidBody = htmlContent.toLowerCase().includes('<body>');
      const hasStyles = htmlContent.includes('<style>') || htmlContent.includes('style=');
      const isBasicHTML = htmlContent.length > 1000 && (hasValidDoctype || htmlContent.toLowerCase().includes('<html'));
      
      console.log('🔍 HTML validation (very lenient):', {
        hasValidDoctype,
        hasValidHead,
        hasValidBody,
        hasStyles,
        isBasicHTML,
        length: htmlContent.length,
        startsWithDoctype: htmlContent.toLowerCase().startsWith('<!doctype') || htmlContent.toLowerCase().startsWith('<html'),
        endsWithHtml: htmlContent.toLowerCase().endsWith('</html>'),
        contentPreview: htmlContent.substring(0, 200) + '...',
        contentEnd: '...' + htmlContent.substring(Math.max(0, htmlContent.length - 200))
      });
      
      // TEMPORARILY DISABLED - Accept any response to debug
      if (htmlContent.length < 100) {
        console.error('❌ Response too short (less than 100 chars)');
        console.error('HTML preview:', htmlContent.substring(0, 1000));
        throw new Error('Response too short from Claude API');
      }
      
      console.log('✅ ACCEPTING RESPONSE (validation temporarily disabled for debugging)');
      
      // Strategy 4: Ensure proper HTML structure
      if (!htmlContent.toLowerCase().startsWith('<!doctype')) {
        if (htmlContent.toLowerCase().startsWith('<html')) {
          htmlContent = '<!DOCTYPE html>\n' + htmlContent;
        }
      }
      
             console.log('🎯 Successfully extracted HTML document for:', workflowData.workflowName);
       return {
         componentCode: htmlContent,
        reportData: {
          workflowName: workflowData.workflowName,
          workflowDescription: workflowData.workflowDescription,
          steps: workflowData.steps
        },
        metadata: {
          title: workflowData.workflowName,
          generatedAt: new Date().toISOString(),
          isRealAI: true
        }
      };
    } catch (error) {
      console.error('❌ FAILED to get real Claude HTML report, using fallback:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error type'
      });
      console.error('❌ This error occurred during HTML report generation for:', workflowData.workflowName);
      return this.getFallbackReactReport(workflowData);
    }
  }

  private getFallbackReactReport(workflowData: WorkflowAnalysisRequest): AIGeneratedReport {
    console.log('❌ REPORT GENERATION FAILED for:', workflowData.workflowName);
    console.log('🚨 Showing error message instead of fake report');
    
    const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Access Issue</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f9fafb;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .error-container {
            background: white;
            border-radius: 1rem;
            padding: 3rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }
        .error-icon {
            width: 4rem;
            height: 4rem;
            background: #fee2e2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            font-size: 2rem;
        }
        .error-title {
            font-size: 1.875rem;
            font-weight: 700;
            color: #dc2626;
            margin-bottom: 1rem;
        }
        .error-message {
            font-size: 1.125rem;
            color: #374151;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        .workflow-name {
            font-weight: 600;
            color: #1f2937;
            background: #f3f4f6;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            display: inline-block;
            margin: 0.5rem 0;
        }
        .retry-button {
            background: #3b82f6;
            color: white;
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .retry-button:hover {
            background: #2563eb;
        }
        .support-info {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #e5e7eb;
            font-size: 0.875rem;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h1 class="error-title">🔒 API Access Protected</h1>
        <p class="error-message">
            The Claude AI API endpoint is currently protected by Vercel authentication for:<br>
            <span class="workflow-name">${workflowData.workflowName}</span>
        </p>
        <p class="error-message">
            <strong>This is a deployment configuration issue.</strong> The API requires public access to generate reports.
        </p>
        <button class="retry-button" onclick="window.location.reload()">
            🔄 Try Again
        </button>
        <div class="support-info">
            <p><strong>Technical Details:</strong></p>
            <p>• Vercel deployment has authentication protection enabled</p>
            <p>• API endpoints require public access for external calls</p>
            <p>• Contact administrator to disable authentication or make API public</p>
        </div>
    </div>
</body>
</html>`;

    return {
      componentCode: errorHtml,
      reportData: {
        workflowName: workflowData.workflowName,
        workflowDescription: workflowData.workflowDescription,
        steps: workflowData.steps
      },
      metadata: {
        title: workflowData.workflowName,
        generatedAt: new Date().toISOString(),
        isRealAI: false
      }
    };
  }
}

export const claudeService = new ClaudeService(); 