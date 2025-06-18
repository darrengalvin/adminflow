import React, { useState, useEffect } from 'react';
import { ReportHistoryService, ReportHistoryItem } from '../services/reportHistoryService';
import { DynamicReportRenderer } from './pdf/DynamicReportRenderer';
import { FileText, Download, Trash2, Eye, Calendar, Clock, Search, Filter } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ReportHistory: React.FC = () => {
  const [reports, setReports] = useState<ReportHistoryItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportHistoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'generated' | 'pdf_created'>('all');
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

  // Filter reports based on search and status
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.report.metadata.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewReport = (report: ReportHistoryItem) => {
    setSelectedReport(report);
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
      // First, we need to render the report to get the DOM element
      setSelectedReport(report);
      
      // Wait a bit for the component to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const element = document.getElementById('dynamic-report-content');
      if (!element) {
        throw new Error('Report content not found');
      }

      // Capture the rendered component as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `${report.workflowName.replace(/[^a-zA-Z0-9]/g, '_')}_Implementation_Guide.pdf`;
      pdf.save(fileName);

      // Update report status
      ReportHistoryService.updateReportStatus(report.id, 'pdf_created');
      loadReports();

    } catch (error) {
      console.error('PDF generation failed:', error);
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
      case 'generated':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Generated</span>;
      case 'pdf_created':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">PDF Ready</span>;
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
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download PDF
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
        <DynamicReportRenderer 
          report={selectedReport.report} 
          onConvertToPDF={() => generatePDFFromHistory(selectedReport)}
        />
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
              <option value="generated">Generated Only</option>
              <option value="pdf_created">PDF Ready</option>
            </select>
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
                      {report.report.metadata.title}
                    </p>
                    {getStatusBadge(report.status)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(report.createdAt)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewReport(report)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Report
                  </button>
                  <button
                    onClick={() => generatePDFFromHistory(report)}
                    disabled={isGeneratingPDF}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
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