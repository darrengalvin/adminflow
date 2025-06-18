import React, { useState, useRef, useEffect } from 'react';
import { ClaudeService, AIGeneratedReport, WorkflowAnalysisRequest } from '../../services/claudeService';
import { StatusService, StatusUpdate } from '../../services/statusService';
import { DynamicReportRenderer } from './DynamicReportRenderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFReportGeneratorProps {
  workflowData: WorkflowAnalysisRequest;
  onGenerateReport?: (report: AIGeneratedReport) => void;
}

export const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = ({
  workflowData,
  onGenerateReport
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<AIGeneratedReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [dynamicStatus, setDynamicStatus] = useState<StatusUpdate | null>(null);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState('');

  const claudeService = new ClaudeService();
  const statusService = new StatusService();
  const statusCleanupRef = useRef<(() => void) | null>(null);

  // Cleanup status updates when component unmounts
  useEffect(() => {
    return () => {
      if (statusCleanupRef.current) {
        statusCleanupRef.current();
      }
    };
  }, []);

  const generateReport = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setDynamicStatus(null);
    
    // Cleanup any existing status updates
    if (statusCleanupRef.current) {
      statusCleanupRef.current();
    }
    
    try {
      // Phase 1: Initializing
      setCurrentPhase('🔄 Initializing Claude 4 Opus...');
      setProgress(10);
      setEstimatedTimeRemaining('5-10 seconds');
      
      // Start dynamic status updates for initializing phase
      statusCleanupRef.current = statusService.startStatusUpdates('initializing', (status) => {
        setDynamicStatus(status);
      }, 2000);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Phase 2: Generating Component (This is the main phase)
      setCurrentPhase('🤖 Generating React Component with Claude 4 Opus...');
      setProgress(30);
      setEstimatedTimeRemaining('90-120 seconds');
      
      // Stop initializing updates and start generating updates
      if (statusCleanupRef.current) {
        statusCleanupRef.current();
      }
      
      statusCleanupRef.current = statusService.startStatusUpdates('generating', (status) => {
        setDynamicStatus(status);
      }, 3000); // Update every 3 seconds during the long Claude generation
      
      // This is where the actual Claude API call happens
      const report = await claudeService.generateReactReport(workflowData);
      
      // Phase 3: Processing
      setCurrentPhase('⚙️ Processing AI-generated component...');
      setProgress(70);
      setEstimatedTimeRemaining('10-15 seconds');
      
      // Switch to processing status updates
      if (statusCleanupRef.current) {
        statusCleanupRef.current();
      }
      
      statusCleanupRef.current = statusService.startStatusUpdates('processing', (status) => {
        setDynamicStatus(status);
      }, 2500);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      // Phase 4: Rendering
      setCurrentPhase('🎨 Rendering beautiful report...');
      setProgress(90);
      setEstimatedTimeRemaining('5-8 seconds');
      
      // Switch to rendering status updates
      if (statusCleanupRef.current) {
        statusCleanupRef.current();
      }
      
      statusCleanupRef.current = statusService.startStatusUpdates('rendering', (status) => {
        setDynamicStatus(status);
      }, 2000);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 5: Complete
      setCurrentPhase('✅ Report generated successfully!');
      setProgress(100);
      setEstimatedTimeRemaining('');
      
      // Stop all status updates
      if (statusCleanupRef.current) {
        statusCleanupRef.current();
        statusCleanupRef.current = null;
      }
      
      setGeneratedReport(report);
      onGenerateReport?.(report);
      
      // Keep the success message visible longer and don't clear it automatically
      // User can manually clear it with "Generate New" button
      
    } catch (err) {
      console.error('Report generation failed:', err);
      setError(err.message || 'Failed to generate report');
      
      // Cleanup status updates on error
      if (statusCleanupRef.current) {
        statusCleanupRef.current();
        statusCleanupRef.current = null;
      }
    } finally {
      setIsGenerating(false);
      setEstimatedTimeRemaining('');
      // Only reset progress if there was an error (no report generated)
      // If successful, keep progress at 100% to show completion
    }
  };

  const convertToPDF = async () => {
    if (!generatedReport) return;

    try {
      setIsGenerating(true);
      setCurrentPhase('📄 Converting to PDF...');
      setProgress(50);

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

      setProgress(80);

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

      setProgress(100);
      setCurrentPhase('✅ PDF ready for download!');

      // Download the PDF
      const fileName = `${generatedReport.metadata.title.replace(/[^a-zA-Z0-9]/g, '_')}_Implementation_Guide.pdf`;
      pdf.save(fileName);

      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentPhase('');
      
    } catch (err) {
      console.error('PDF conversion failed:', err);
      setError(`PDF conversion failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const resetReport = () => {
    setGeneratedReport(null);
    setError(null);
    setProgress(0);
    setCurrentPhase('');
    setDynamicStatus(null);
  };

  if (generatedReport) {
    return (
      <div className="space-y-4">
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div>
                <h3 className="font-bold text-green-800">Report Generated Successfully!</h3>
                <p className="text-green-700">
                  {generatedReport.metadata.isRealAI 
                    ? 'Your AI-powered implementation guide is ready' 
                    : 'Static template loaded (deploy to production for AI content)'
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={convertToPDF}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                📄 Download PDF
              </button>
              <button
                onClick={resetReport}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                🔄 Generate New
              </button>
            </div>
          </div>
        </div>

        {/* Loading State for PDF Conversion */}
        {isGenerating && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-800 font-medium">{currentPhase}</span>
                  <span className="text-blue-600 text-sm">{progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render the AI-generated component */}
        <DynamicReportRenderer 
          report={generatedReport} 
          onConvertToPDF={convertToPDF}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">❌</span>
            </div>
            <div>
              <h3 className="font-bold text-red-800">Generation Failed</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generation Loading State */}
      {isGenerating ? (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Generating Your AI-Powered Report</h3>
            
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-800 font-medium">{currentPhase}</span>
                <span className="text-blue-600 text-sm">{progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {estimatedTimeRemaining && (
                <div className="text-xs text-blue-600 mt-2">
                  Estimated time: {estimatedTimeRemaining}
                </div>
              )}
            </div>

            {/* Dynamic Status Updates */}
            {dynamicStatus && (
              <div className="bg-white/70 rounded-lg p-4 mb-6 border border-blue-100">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800 font-medium">{dynamicStatus.message}</span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Phase: {dynamicStatus.phase} • {new Date(dynamicStatus.timestamp).toLocaleTimeString()}
                </div>
              </div>
            )}

            <div className="text-gray-600 space-y-2">
              <p>🤖 Claude 4 Opus is crafting your custom implementation guide</p>
              <p>⚡ Using Vercel Pro extended timeout (5 minutes)</p>
              <p>🎨 Generating beautiful React components with charts and visualizations</p>
            </div>
          </div>
        </div>
      ) : (
        /* Generate Button */
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">AI-Powered Implementation Guide</h3>
            <p className="text-gray-600">
              Generate a comprehensive, beautiful report with real business insights, interactive charts, 
              and professional design - all created by Claude 4 Opus from scratch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl mb-2">🤖</div>
              <h4 className="font-semibold">AI-Generated Design</h4>
              <p className="text-gray-600">Complete React components created by Claude 4 Opus</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold">Interactive Charts</h4>
              <p className="text-gray-600">Beautiful visualizations with real data insights</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-semibold">Professional Layout</h4>
              <p className="text-gray-600">Fortune 500-quality design and presentation</p>
            </div>
          </div>

          <button
            onClick={generateReport}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🚀 Generate AI Implementation Report
          </button>
        </div>
      )}
    </div>
  );
}; 