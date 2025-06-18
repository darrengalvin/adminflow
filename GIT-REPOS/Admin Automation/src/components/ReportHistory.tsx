import React, { useState, useEffect } from 'react';
import { ReportHistoryService, ReportHistoryItem } from '../services/reportHistoryService';
import { DynamicReportRenderer } from './pdf/DynamicReportRenderer';
import { SectionedReportRenderer } from './SectionedReportRenderer';
import { FileText, Download, Trash2, Eye, Calendar, Clock, Search, Filter, ExternalLink } from 'lucide-react';
import { generateAndDownloadPDF } from './PDFGenerator';

interface ReportHistoryProps {
  onNavigate?: (section: string) => void;
}

// Component to display individual sections like during generation
const SectionedReportViewer: React.FC<{ report: ReportHistoryItem }> = ({ report }) => {
  const getSectionsData = () => {
    // Try to get sections from different possible locations
    if (report.report?.content?.sections) {
      return report.report.content.sections;
    }
    
    // If not in report.content.sections, try to extract from metadata.sectionProgress
    if (report.metadata?.sectionProgress) {
      return Object.entries(report.metadata.sectionProgress)
        .filter(([_, sectionData]: [string, any]) => sectionData.content && sectionData.content.length > 0)
        .map(([sectionId, sectionData]: [string, any]) => ({
          id: sectionId,
          title: sectionData.title || sectionId,
          content: sectionData.content || '',
          category: sectionData.category || 'general'
        }));
    }
    
    return [];
  };

  const sections = getSectionsData();
  
  if (sections.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Sections Found</h3>
          <p className="text-yellow-700">
            This report doesn't have any accessible sections to display.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Report Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{report.workflowName}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>📊 {sections.length} sections generated</span>
          <span>📅 {new Date(report.createdAt).toLocaleDateString()}</span>
          {report.metadata?.selectedIndustry?.name && (
            <span>🏭 {report.metadata.selectedIndustry.name}</span>
          )}
        </div>
      </div>

      {/* Individual Sections */}
      <div className="space-y-6">
        {sections.map((section: any, index: number) => (
          <div key={section.id || index} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      ✅ Generated
                    </span>
                    <span className="text-sm text-gray-600">
                      {section.category || 'General'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newWindow = window.open('', '_blank');
                    if (newWindow) {
                      newWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>${section.title} - Full Preview</title>
                          <meta charset="UTF-8">
                          <style>
                            body { margin: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                            .container { max-width: 800px; margin: 0 auto; }
                          </style>
                        </head>
                        <body>
                          <div class="container">
                            <h1>${section.title}</h1>
                            ${section.content}
                          </div>
                        </body>
                        </html>
                      `);
                      newWindow.document.close();
                    }
                  }}
                  className="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  Full Preview
                </button>
              </div>
            </div>

            {/* Section Content Preview */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 border max-h-64 overflow-y-auto">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: section.content
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {section.content.length} characters • Click "Full Preview" to see complete design
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ReportHistory: React.FC<ReportHistoryProps> = ({ onNavigate }) => {
  const [reports, setReports] = useState<ReportHistoryItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportHistoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'generating' | 'generated' | 'pdf_created' | 'failed'>('all');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ totalReports: 0, storageSize: '0 MB' });

  // Load reports on component mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const history = ReportHistoryService.getHistory();
    setReports(history);
    setStorageInfo(ReportHistoryService.getStorageInfo());
  };

  const handleFixStuckReports = () => {
    const fixedCount = ReportHistoryService.fixStuckReports();
    if (fixedCount > 0) {
      alert(`✅ Fixed ${fixedCount} stuck report(s)! They should now appear in your history.`);
      loadReports();
    } else {
      alert('No stuck reports found to fix.');
    }
  };

  // Filter reports based on search and status
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.report.metadata.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewReport = (report: ReportHistoryItem) => {
    // Check if this is a sectioned report
    const isSectionedReport = report.metadata?.reportType === 'sectioned';
    
    if (isSectionedReport) {
      // For sectioned reports, always show the sectioned viewer (even if stuck or failed)
      // This will show individual sections with their content
      setSelectedReport(report);
    } else if (!report.report) {
      alert('This report is still being generated. Please wait for it to complete.');
      return;
    } else {
      // For legacy reports, show the normal view
      setSelectedReport(report);
    }
  };

  const handleRestoreSectionedReport = (report: ReportHistoryItem) => {
    // Check if this report has completed sections but is marked as failed
    if (report.metadata?.reportType === 'sectioned' && 
        report.metadata.completedSections && 
        report.metadata.completedSections > 0) {
      
      // If it has completed sections, restore it to 'generated' status
      console.log('🔄 Restoring completed sectioned report:', report.id);
      
      // Create a proper report object from the section data
      const restoredReport = {
        content: {
          sections: Object.entries(report.metadata.sectionProgress || {})
            .filter(([_, sectionData]: [string, any]) => sectionData.status === 'completed')
            .map(([sectionId, sectionData]: [string, any]) => ({
              id: sectionId,
              title: sectionData.title || sectionId,
              content: sectionData.content || '',
              category: sectionData.category || 'general'
            }))
        },
        metadata: {
          title: report.workflowName,
          industry: report.metadata.selectedIndustry?.name || 'Unknown',
          totalSections: report.metadata.completedSections,
          generatedAt: report.createdAt,
          isRestored: true
        }
      };
      
      // Update the report in history
      ReportHistoryService.completeReport(report.id, restoredReport as any);
      
      // Reload and show the restored report
      loadReports();
      setSelectedReport({
        ...report,
        status: 'generated',
        report: restoredReport as any
      });
      
      console.log('✅ Report restored successfully with', report.metadata.completedSections, 'sections');
    } else {
      // For other cases, just view the report
      setSelectedReport(report);
    }
  };

  const handleCloseReport = () => {
    setSelectedReport(null);
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      ReportHistoryService.deleteReport(reportId);
      loadReports();
      if (selectedReport?.id === reportId) {
        setSelectedReport(null);
      }
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all report history? This cannot be undone.')) {
      ReportHistoryService.clearHistory();
      loadReports();
      setSelectedReport(null);
    }
  };

  const generatePDFFromHistory = async (report: ReportHistoryItem) => {
    setIsGeneratingPDF(true);
    try {
      console.log('🔄 Generating professional PDF for:', report.workflowName);
      
      // Use the new PDF generator with proper layout controls
      await generateAndDownloadPDF(report);
      
      // Update report status
      ReportHistoryService.updateReportStatus(report.id, 'pdf_created');
      loadReports();
      
      console.log('✅ PDF generated successfully');
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>;
      case 'generating':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full animate-pulse">Generating...</span>;
      case 'generated':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Generated</span>;
      case 'pdf_created':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">PDF Ready</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  // If a report is selected, show the full report view
  if (selectedReport) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with back button */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCloseReport}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  ← Back to History
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{selectedReport.workflowName}</h1>
                  <p className="text-sm text-gray-600">
                    Generated {formatDate(selectedReport.createdAt)} • {getStatusBadge(selectedReport.status)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => generatePDFFromHistory(selectedReport)}
                  disabled={isGeneratingPDF}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating Professional PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Professional PDF
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteReport(selectedReport.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Render the selected report */}
        {selectedReport.metadata?.reportType === 'sectioned' ? (
          // Show sectioned reports with individual section previews
          <SectionedReportViewer report={selectedReport} />
        ) : selectedReport.report ? (
          // Show legacy reports with the dynamic renderer
          <DynamicReportRenderer 
            report={selectedReport.report} 
            onConvertToPDF={() => generatePDFFromHistory(selectedReport)}
          />
        ) : (
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Report Still Generating</h3>
              <p className="text-yellow-700">
                This report is still being generated. Please check back in a few minutes.
              </p>
              {selectedReport.progress !== undefined && (
                <div className="mt-4 max-w-md mx-auto">
                  <div className="flex justify-between text-sm text-yellow-700 mb-2">
                    <span>{selectedReport.phase || 'Processing...'}</span>
                    <span>{selectedReport.progress}%</span>
                  </div>
                  <div className="w-full bg-yellow-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${selectedReport.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main history view
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report History</h1>
        <p className="text-gray-600">
          Access and manage all your generated reports. {storageInfo.totalReports} reports stored ({storageInfo.storageSize})
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports by workflow name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="generating">Generating</option>
              <option value="generated">Generated</option>
              <option value="pdf_created">PDF Ready</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={handleFixStuckReports}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              🔧 Fix Stuck Reports
            </button>
            {reports.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {reports.length === 0 ? 'No Reports Yet' : 'No Reports Found'}
          </h3>
          <p className="text-gray-500">
            {reports.length === 0 
              ? 'Generate your first report to see it appear here.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {report.workflowName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {report.report?.metadata?.title || 'Report in progress...'}
                      {report.metadata?.reportType === 'sectioned' && report.metadata.hasFailures && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Partial Report
                        </span>
                      )}
                    </p>
                    {getStatusBadge(report.status)}
                    {report.metadata?.reportType === 'sectioned' && (
                      <div className="text-xs text-gray-500 mt-1">
                        {report.metadata.completedSections || 0}/{report.metadata.totalSections || 0} sections completed
                        {report.metadata.hasFailures && (
                          <span className="text-orange-600 ml-2">
                            • {report.metadata.failedSections} failed
                          </span>
                        )}
                        {report.status === 'failed' && report.metadata.completedSections && report.metadata.completedSections > 0 && (
                          <span className="text-green-600 ml-2 font-medium">
                            • Restorable!
                          </span>
                        )}
                      </div>
                    )}
                    {report.progress !== undefined && report.status !== 'generated' && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{report.phase || 'Processing...'}</span>
                          <span>{report.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${report.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(report.createdAt)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewReport(report)}
                    disabled={report.status === 'pending' || report.status === 'generating'}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {report.metadata?.reportType === 'sectioned' && report.metadata.hasFailures 
                      ? 'Resume & Retry' 
                      : report.status === 'failed' && report.metadata?.completedSections && report.metadata.completedSections > 0
                        ? `Restore ${report.metadata.completedSections} Sections`
                      : report.report 
                        ? 'View Report' 
                        : 'Generating...'}
                  </button>
                  <button
                    onClick={() => generatePDFFromHistory(report)}
                    disabled={isGeneratingPDF || !report.report || report.status === 'pending' || report.status === 'generating'}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 