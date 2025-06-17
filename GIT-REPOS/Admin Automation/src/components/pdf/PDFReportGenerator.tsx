import React, { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { PDFReport } from './PDFReport';
import { AIGeneratedContent, WorkflowAnalysisRequest } from '../../services/claudeService';

interface PDFReportGeneratorProps {
  content: AIGeneratedContent;
  workflowData: WorkflowAnalysisRequest;
  isGenerating?: boolean;
}

export const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = ({ 
  content, 
  workflowData, 
  isGenerating = false 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  
  const fileName = `${workflowData.workflowName.replace(/[^a-zA-Z0-9]/g, '_')}_Implementation_Guide.pdf`;
  
  if (isGenerating) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-200">
        <div className="flex items-center justify-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🤖 AI is generating your implementation guide...
            </h3>
            <p className="text-sm text-gray-600">
              Claude 4 Opus is analyzing your workflow and creating a comprehensive PDF report
            </p>
          </div>
        </div>
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
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
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