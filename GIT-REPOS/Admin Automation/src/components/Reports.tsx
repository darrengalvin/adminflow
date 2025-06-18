import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Settings
} from 'lucide-react';
import { SectionedReportBuilder } from './SectionedReportBuilder';
import { PDFReportGenerator } from './pdf/PDFReportGenerator';

export function Reports() {
  const [activeMode, setActiveMode] = useState<'template' | 'legacy'>('template');
  const [dataImportText, setDataImportText] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📊 Professional Reports
            </h1>
            <p className="text-gray-600">
              Generate comprehensive business automation reports with AI-powered insights
            </p>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveMode('template')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                activeMode === 'template'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏗️ Template Builder
            </button>
            <button
              onClick={() => setActiveMode('legacy')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                activeMode === 'legacy'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⚡ Quick Generate
            </button>
          </div>
        </div>
      </div>

      {/* Template Builder Mode */}
      {activeMode === 'template' && (
        <div>
          <SectionedReportBuilder />
        </div>
      )}

      {/* Legacy Mode */}
      {activeMode === 'legacy' && (
        <div className="space-y-6">
          {/* Quick Data Import */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Upload className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Quick Data Import</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Paste your workflow data, business processes, or requirements for instant report generation
            </p>
            <textarea
              value={dataImportText}
              onChange={(e) => setDataImportText(e.target.value)}
              placeholder="Paste your business data, workflow descriptions, or requirements here..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                {dataImportText.length} characters
              </span>
              <button
                onClick={() => {
                  // Handle quick generation
                  console.log('Quick generate with:', dataImportText);
                }}
                disabled={!dataImportText.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Sparkles className="h-4 w-4 inline mr-2" />
                Generate Report
              </button>
            </div>
          </div>

          {/* Legacy PDF Generator */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Legacy Report Generator</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Use the original single-generation approach for smaller reports
            </p>
            <PDFReportGenerator />
          </div>

          {/* Migration Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Settings className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  🚀 Upgrade to Template Builder
                </h3>
                <p className="text-blue-800 mb-4">
                  The new Template Builder offers superior report quality with section-by-section generation, 
                  industry-specific templates, and comprehensive multi-page reports that far exceed the legacy system's capabilities.
                </p>
                <button
                  onClick={() => setActiveMode('template')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  Switch to Template Builder
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
} 