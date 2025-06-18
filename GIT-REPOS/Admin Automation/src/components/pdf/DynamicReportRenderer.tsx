import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Legend } from 'recharts';
import * as LucideIcons from 'lucide-react';
import { AIGeneratedReport } from '../../services/claudeService';
// @ts-ignore
import { transform } from '@babel/standalone';

interface DynamicReportRendererProps {
  report: AIGeneratedReport;
  onConvertToPDF?: () => void;
}

// React Error Boundary to catch invariant errors
class ComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 React Error Boundary caught error:', error);
    console.error('Error info:', errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        className: 'bg-red-50 border border-red-200 rounded-lg p-6 m-4'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-red-800 font-bold mb-3 text-lg'
        }, '🚨 React Error Boundary Triggered'),
        React.createElement('p', {
          key: 'message',
          className: 'text-red-600 mb-3'
        }, 'A React invariant error occurred while rendering the AI-generated component.'),
        React.createElement('details', {
          key: 'details',
          className: 'text-sm'
        }, [
          React.createElement('summary', {
            key: 'summary',
            className: 'cursor-pointer text-red-700 font-medium mb-2'
          }, 'Technical Details'),
          React.createElement('div', {
            key: 'error-details',
            className: 'bg-red-100 p-3 rounded text-xs'
          }, [
            React.createElement('p', {
              key: 'error-message',
              className: 'font-medium mb-2'
            }, 'Error: ' + (this.state.error?.message || 'Unknown error')),
            React.createElement('pre', {
              key: 'stack',
              className: 'overflow-auto max-h-40 text-xs'
            }, this.state.error?.stack || 'No stack trace available')
          ])
        ]),
        React.createElement('button', {
          key: 'retry',
          className: 'mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
          onClick: () => {
            this.setState({ hasError: false, error: null, errorInfo: null });
            window.location.reload();
          }
        }, 'Reload Page')
      ]);
    }

    return this.props.children;
  }
}

// HTML renderer for safer component display
const createHTMLRenderer = (componentCode: string, componentName: string) => {
  try {
    console.log('🌐 Creating HTML renderer as fallback...');
    
    // Convert React component to static HTML structure
    let htmlContent = componentCode;
    
    // Remove imports and exports
    htmlContent = htmlContent
      .replace(/import\s+[^;]+;?\s*/g, '')
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+\{[^}]*\}\s*;?\s*/g, '');
    
    // Extract JSX content from the component
    const jsxMatch = htmlContent.match(/return\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*\}/);
    if (!jsxMatch) {
      throw new Error('Could not extract JSX from component');
    }
    
    let jsxContent = jsxMatch[1];
    
    // Convert common JSX patterns to HTML
    jsxContent = jsxContent
      // Convert className to class
      .replace(/className=/g, 'class=')
      // Convert self-closing tags
      .replace(/<(\w+)([^>]*?)\/>/g, '<$1$2></$1>')
      // Convert React fragments
      .replace(/<React\.Fragment>/g, '<div>')
      .replace(/<\/React\.Fragment>/g, '</div>')
      .replace(/<>/g, '<div>')
      .replace(/<\/>/g, '</div>')
      // Convert common React patterns
      .replace(/\{([^}]+)\}/g, (match, content) => {
        // Handle simple variable substitutions
        if (content.includes("'") || content.includes('"')) {
          return content.replace(/['"]/g, '');
        }
        // For complex expressions, return placeholder
        return '[Dynamic Content]';
      });
    
    // Wrap in a container with proper styling
    const styledHTML = `
      <div class="dynamic-report-html-fallback">
        <style>
          .dynamic-report-html-fallback {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
          }
          .dynamic-report-html-fallback .bg-gradient-to-br { background: linear-gradient(to bottom right, #3b82f6, #1e40af); }
          .dynamic-report-html-fallback .bg-gradient-to-r { background: linear-gradient(to right, #3b82f6, #06b6d4); }
          .dynamic-report-html-fallback .text-white { color: white; }
          .dynamic-report-html-fallback .text-center { text-align: center; }
          .dynamic-report-html-fallback .p-6 { padding: 1.5rem; }
          .dynamic-report-html-fallback .p-8 { padding: 2rem; }
          .dynamic-report-html-fallback .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
          .dynamic-report-html-fallback .mb-4 { margin-bottom: 1rem; }
          .dynamic-report-html-fallback .mb-6 { margin-bottom: 1.5rem; }
          .dynamic-report-html-fallback .text-4xl { font-size: 2.25rem; }
          .dynamic-report-html-fallback .text-5xl { font-size: 3rem; }
          .dynamic-report-html-fallback .font-bold { font-weight: bold; }
          .dynamic-report-html-fallback .rounded-xl { border-radius: 0.75rem; }
          .dynamic-report-html-fallback .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
          .dynamic-report-html-fallback .bg-white { background-color: white; }
          .dynamic-report-html-fallback .grid { display: grid; }
          .dynamic-report-html-fallback .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
          .dynamic-report-html-fallback .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .dynamic-report-html-fallback .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .dynamic-report-html-fallback .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .dynamic-report-html-fallback .gap-6 { gap: 1.5rem; }
          .dynamic-report-html-fallback .gap-8 { gap: 2rem; }
          .dynamic-report-html-fallback .max-w-7xl { max-width: 80rem; }
          .dynamic-report-html-fallback .mx-auto { margin-left: auto; margin-right: auto; }
          .dynamic-report-html-fallback .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
          .dynamic-report-html-fallback .min-h-screen { min-height: 100vh; }
          .dynamic-report-html-fallback .bg-gray-50 { background-color: #f9fafb; }
          .dynamic-report-html-fallback .text-xl { font-size: 1.25rem; }
          .dynamic-report-html-fallback .text-lg { font-size: 1.125rem; }
          .dynamic-report-html-fallback .text-2xl { font-size: 1.5rem; }
          .dynamic-report-html-fallback .text-3xl { font-size: 1.875rem; }
          @media (min-width: 768px) {
            .dynamic-report-html-fallback .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .dynamic-report-html-fallback .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .dynamic-report-html-fallback .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          }
          @media (min-width: 1024px) {
            .dynamic-report-html-fallback .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .dynamic-report-html-fallback .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .dynamic-report-html-fallback .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          }
        </style>
        <div class="min-h-screen bg-gray-50">
          <div class="bg-gradient-to-r text-white">
            <div class="max-w-7xl mx-auto px-6 py-16">
              <div class="text-center">
                <h1 class="text-4xl font-bold mb-6">${componentName.replace(/([A-Z])/g, ' $1').trim()}</h1>
                <p class="text-xl mb-8">AI-Generated Implementation Report</p>
                <div class="bg-white/10 p-4 rounded-xl">
                  <p class="text-lg">📊 Professional Business Analysis</p>
                  <p class="text-sm mt-2">Generated using Claude 4 Opus AI</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="max-w-7xl mx-auto px-6 py-16">
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-bold mb-4">📈 Performance Metrics</h3>
                <p class="text-gray-600">Comprehensive analysis of system performance and efficiency improvements.</p>
              </div>
              <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-bold mb-4">🎯 Implementation Strategy</h3>
                <p class="text-gray-600">Step-by-step roadmap for successful deployment and adoption.</p>
              </div>
              <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-bold mb-4">💰 ROI Analysis</h3>
                <p class="text-gray-600">Financial projections and return on investment calculations.</p>
              </div>
            </div>
            
            <div class="mt-16 bg-white rounded-xl shadow-lg p-8">
              <h2 class="text-3xl font-bold mb-6 text-center">Report Overview</h2>
              <div class="prose max-w-none">
                <p class="text-lg text-gray-700 mb-4">
                  This comprehensive implementation report provides detailed insights into the 
                  <strong>${componentName.replace(/([A-Z])/g, ' $1').trim()}</strong> project.
                </p>
                <p class="text-gray-600 mb-4">
                  The analysis includes performance metrics, implementation strategies, cost-benefit analysis, 
                  and recommendations for successful deployment.
                </p>
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                  <p class="text-blue-800 font-medium">
                    🤖 This report was generated using advanced AI technology to provide 
                    professional-grade business analysis and recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    console.log('✅ HTML renderer created successfully');
    return styledHTML;
  } catch (error) {
    console.error('❌ HTML renderer creation failed:', error);
    return `
      <div class="bg-gray-50 min-h-screen p-8">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">${componentName.replace(/([A-Z])/g, ' $1').trim()}</h1>
            <p class="text-lg text-gray-600 mb-6">AI-Generated Implementation Report</p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p class="text-blue-800">
                📊 This report contains comprehensive analysis and recommendations 
                for your business implementation project.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

export const DynamicReportRenderer: React.FC<DynamicReportRendererProps> = ({ 
  report, 
  onConvertToPDF 
}) => {
  const [RenderedComponent, setRenderedComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create the dynamic component from AI-generated HTML
  const createDynamicComponent = useMemo(() => {
    if (!report.componentCode) return null;

    try {
      console.log('🌐 Processing AI-generated HTML document...');
      console.log('📄 HTML content length:', report.componentCode.length);
      console.log('🔍 HTML preview:', report.componentCode.substring(0, 300) + '...');

      // Validate HTML structure
      const htmlContent = report.componentCode.trim();
      const hasValidHTML = htmlContent.toLowerCase().includes('<html') && htmlContent.toLowerCase().includes('</html>');
      const hasValidBody = htmlContent.toLowerCase().includes('<body>') && htmlContent.toLowerCase().includes('</body>');
      
      console.log('🔍 HTML validation:', {
        hasValidHTML,
        hasValidBody,
        length: htmlContent.length,
        isHTML: htmlContent.toLowerCase().startsWith('<!doctype') || htmlContent.toLowerCase().startsWith('<html')
      });

      if (!hasValidHTML || !hasValidBody) {
        throw new Error('Invalid HTML document structure');
      }

      // Extract the body content for rendering within our React app
      const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      let bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;

      // Extract and combine styles
      const styleMatches = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
      let combinedStyles = '';
      if (styleMatches) {
        styleMatches.forEach(styleBlock => {
          const styleContent = styleBlock.replace(/<\/?style[^>]*>/gi, '');
          combinedStyles += styleContent + '\n';
        });
      }

      // Extract and combine scripts
      const scriptMatches = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
      let combinedScripts = '';
      if (scriptMatches) {
        scriptMatches.forEach(scriptBlock => {
          const scriptContent = scriptBlock.replace(/<\/?script[^>]*>/gi, '');
          combinedScripts += scriptContent + '\n';
        });
      }

      // Create a safe HTML renderer component
      const HTMLRenderer = () => {
        useEffect(() => {
          // Execute scripts after component mounts
          if (combinedScripts) {
            try {
              console.log('📜 Executing embedded JavaScript...');
              const scriptFunction = new Function(combinedScripts);
              scriptFunction();
              console.log('✅ JavaScript execution successful');
            } catch (scriptError) {
              console.error('❌ JavaScript execution failed:', scriptError);
            }
          }
        }, []);

        return (
          <div className="html-report-container">
            {/* Inject styles */}
            {combinedStyles && (
              <style dangerouslySetInnerHTML={{ __html: combinedStyles }} />
            )}
            
            {/* Render HTML content */}
            <div 
              dangerouslySetInnerHTML={{ __html: bodyContent }}
              className="html-content"
            />
          </div>
        );
      };

      console.log('✅ Successfully created HTML renderer component');
      return HTMLRenderer;
    } catch (err) {
      console.error('❌ Error creating HTML renderer:', err);
      console.error('HTML content preview:', report.componentCode.substring(0, 1000));
      setError(`Failed to render AI-generated HTML: ${err.message}`);
      return null;
    }
  }, [report.componentCode]);

  useEffect(() => {
    if (createDynamicComponent) {
      setRenderedComponent(() => createDynamicComponent);
      setError(null);
    }
  }, [createDynamicComponent]);

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h3 className="font-bold">Component Rendering Error</h3>
            <p className="mt-2">{error}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Generated Component Code:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              <code>{report.componentCode}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!RenderedComponent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700">Rendering AI-Generated Report...</h3>
          <p className="text-gray-500 mt-2">
            {report.metadata.isRealAI ? '🤖 Real Claude 4 Opus Content' : '⚠️ Static Template'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Action Bar */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {onConvertToPDF && (
          <button
            onClick={onConvertToPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
          >
            <LucideIcons.Download className="w-4 h-4" />
            Convert to PDF
          </button>
        )}
        <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-sm">
          {report.metadata.isRealAI ? (
            <span className="text-green-600 font-medium">🤖 Real Claude 4 Opus</span>
          ) : (
            <span className="text-yellow-600 font-medium">⚠️ Static Template</span>
          )}
        </div>
      </div>

      {/* Render the AI-generated component */}
      <div id="dynamic-report-content">
        <ComponentErrorBoundary>
          <RenderedComponent />
        </ComponentErrorBoundary>
      </div>
    </div>
  );
}; 