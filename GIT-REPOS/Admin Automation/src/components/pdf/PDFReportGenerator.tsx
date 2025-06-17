import React, { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { PDFReport } from './PDFReport';
import { AIGeneratedContent, WorkflowAnalysisRequest } from '../../services/claudeService';

interface PDFReportGeneratorProps {
  content: AIGeneratedContent | null;
  workflowData: WorkflowAnalysisRequest;
  isGenerating?: boolean;
  onGenerateReport?: () => void;
}

export const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = ({ 
  content, 
  workflowData, 
  isGenerating = false,
  onGenerateReport
}) => {
  const [showPreview, setShowPreview] = useState(false);
  
  const fileName = `${workflowData.workflowName.replace(/[^a-zA-Z0-9]/g, '_')}_Implementation_Guide.pdf`;
  
  // Show fancy AI loading animation
  if (isGenerating) {
    return (
      <div className="bg-white p-8 rounded-xl border border-blue-200 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping"></div>
            <div className="relative w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl">🤖</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            AI is Crafting Your Implementation Guide
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Claude 3.5 Sonnet is analyzing your workflow, calculating ROI, and creating a comprehensive professional PDF report...
          </p>
          
          {/* Animated progress steps */}
          <div className="space-y-3 max-w-lg mx-auto">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
              <span className="text-gray-700">Analyzing workflow requirements</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <span className="text-gray-700">Calculating ROI and time savings</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
              <span className="text-gray-500">Generating technical specifications</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
              <span className="text-gray-500">Creating implementation roadmap</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
              <span className="text-gray-500">Formatting professional PDF</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show generate button if no content yet
  if (!content) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📄</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Ready to Generate Your Implementation Guide
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Click below to have our AI analyze your workflow and create a professional, comprehensive implementation guide with ROI calculations, technical specifications, and step-by-step roadmap.
        </p>
        <button
          onClick={onGenerateReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg border-l-4 border-blue-500"
        >
          🚀 Generate AI Implementation Report
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            📄 AI-Generated Implementation Guide
          </h3>
          <p className="text-sm text-gray-600">
            Professional PDF report with outstanding design and layout
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showPreview 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showPreview ? '📄 Hide Preview' : '👁️ Show Preview'}
          </button>
          
          <PDFDownloadLink
            document={<PDFReport content={content} workflowData={workflowData} />}
            fileName={fileName}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg border-l-4 border-emerald-500"
          >
            {({ blob, url, loading, error }) =>
              loading ? '⏳ Generating PDF...' : '⬇️ Download PDF'
            }
          </PDFDownloadLink>
        </div>
      </div>

      {showPreview && (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              📋 Interactive PDF Preview - Click and scroll to navigate
            </p>
          </div>
          <div style={{ height: '600px' }}>
            <PDFViewer 
              style={{ width: '100%', height: '100%' }}
              showToolbar={true}
            >
              <PDFReport content={content} workflowData={workflowData} />
            </PDFViewer>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✨</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-1">
              Outstanding Design Features
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>Consistent margins</strong> - Professional structure throughout</li>
              <li>• <strong>Strategic paragraph breaks</strong> - 3-4 sentences max for readability</li>
              <li>• <strong>Clean table design</strong> - Alternating rows, clear headers</li>
              <li>• <strong>Two-column layouts</strong> - Breaking up dense content</li>
              <li>• <strong>Bullet hierarchy</strong> - Mixed bullets, dashes, numbers</li>
              <li>• <strong>Visual breaks</strong> - Dividers, boxes, strategic spacing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 