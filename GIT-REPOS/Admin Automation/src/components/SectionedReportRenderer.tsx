import React from 'react';
import { ReportHistoryItem } from '../services/reportHistoryService';

interface SectionedReportRendererProps {
  report: ReportHistoryItem;
}

export const SectionedReportRenderer: React.FC<SectionedReportRendererProps> = ({ report }) => {
  if (!report.report?.content?.sections) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Report Data Not Available</h3>
          <p className="text-yellow-700">
            This sectioned report's data is not available for viewing. It may have been generated with an older version of the system.
          </p>
        </div>
      </div>
    );
  }

  const sections = report.report.content.sections;
  const metadata = report.report.metadata;

  return (
    <div id="sectioned-report-content" className="max-w-4xl mx-auto bg-white">
      {/* Report Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-t-xl">
        <h1 className="text-3xl font-bold mb-2">{metadata?.title || report.workflowName}</h1>
        <p className="text-blue-100">
          Generated on {new Date(report.createdAt).toLocaleDateString()} • 
          {metadata?.sectionsGenerated || Object.keys(sections).length} sections
          {metadata?.isPartiallyComplete && (
            <span className="ml-2 px-2 py-1 bg-yellow-500 text-yellow-900 text-xs rounded-full">
              Partial Report
            </span>
          )}
        </p>
        {metadata?.isPartiallyComplete && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ This is a partial report. {metadata.failedSections || 0} sections failed to generate and are not included.
            </p>
          </div>
        )}
      </div>

      {/* Table of Contents */}
      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Table of Contents</h2>
        <div className="space-y-3">
          {Object.entries(sections).map(([sectionId, sectionData], index) => (
            <div key={sectionId} className="flex justify-between items-center py-2 px-4 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-light text-gray-400">{String(index + 1).padStart(2, '0')}</span>
                <span className="font-medium text-gray-900">
                  {getSectionTitle(sectionId, sectionData)}
                </span>
              </div>
              <span className="text-gray-500">Page {index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Report Sections */}
      <div className="p-8 space-y-12">
        {Object.entries(sections).map(([sectionId, sectionData], index) => (
          <div key={sectionId} className="section-content">
            {/* Section Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {getSectionTitle(sectionId, sectionData)}
                </h2>
              </div>
              <div className="h-1 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
            </div>

            {/* Section Content */}
            <div className="prose prose-lg max-w-none">
              {sectionData.status === 'completed' && sectionData.content ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: sectionData.content }}
                  className="section-html-content"
                />
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <p className="text-yellow-800 font-medium">
                    Section Status: {sectionData.status}
                  </p>
                  {sectionData.status === 'error' && (
                    <p className="text-yellow-700 mt-2">
                      This section failed to generate and may need to be regenerated.
                    </p>
                  )}
                  {sectionData.status === 'generating' && (
                    <p className="text-yellow-700 mt-2">
                      This section was still generating when the report was saved.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Section Footer */}
            {index < Object.keys(sections).length - 1 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="text-center text-gray-400 text-sm">
                  Section {index + 1} of {Object.keys(sections).length}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Footer */}
      <div className="bg-gray-50 p-8 rounded-b-xl border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p className="font-medium">End of Report</p>
          <p className="text-sm mt-2">
            Generated by AdminFlow - Professional Report Builder
          </p>
          <p className="text-xs mt-1 text-gray-500">
            Report ID: {report.id} • Generated: {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <style jsx>{`
        .section-html-content h1, .section-html-content h2, .section-html-content h3 {
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .section-html-content p {
          margin-bottom: 1rem;
          color: #374151;
          line-height: 1.7;
        }
        .section-html-content ul, .section-html-content ol {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }
        .section-html-content li {
          margin-bottom: 0.5rem;
          color: #374151;
        }
        .section-html-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        .section-html-content th, .section-html-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }
        .section-html-content th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #1f2937;
        }
        .section-html-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

// Helper function to extract section title
function getSectionTitle(sectionId: string, sectionData: any): string {
  // Try to extract title from content if available
  if (sectionData.content) {
    const titleMatch = sectionData.content.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
    if (titleMatch) {
      return titleMatch[1].replace(/<[^>]*>/g, ''); // Strip HTML tags
    }
  }
  
  // Fallback to formatted section ID
  return sectionId
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} 