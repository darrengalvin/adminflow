import { AIGeneratedReport } from './claudeService';

export interface ReportHistoryItem {
  id: string;
  report: AIGeneratedReport | null; // Allow null for pending reports
  createdAt: string;
  workflowName: string;
  status: 'pending' | 'generating' | 'generated' | 'pdf_created' | 'failed';
  pdfUrl?: string;
  previewImage?: string;
  progress?: number;
  phase?: string;
  error?: string;
  metadata?: {
    reportType?: 'sectioned' | 'legacy';
    selectedIndustry?: any;
    selectedSections?: string[];
    sectionProgress?: any;
    hasFailures?: boolean;
    failedSections?: number;
    completedSections?: number;
    totalSections?: number;
  };
}

export class ReportHistoryService {
  private static readonly STORAGE_KEY = 'adminflow_report_history';
  private static readonly MAX_REPORTS = 50; // Keep last 50 reports

  // Create a pending report entry immediately when generation starts
  static createPendingReport(workflowName: string): string {
    const reportId = this.generateReportId();
    const historyItem: ReportHistoryItem = {
      id: reportId,
      report: null,
      createdAt: new Date().toISOString(),
      workflowName,
      status: 'pending',
      progress: 0,
      phase: 'Initializing...'
    };

    const history = this.getHistory();
    history.unshift(historyItem);
    
    // Keep only the most recent reports
    if (history.length > this.MAX_REPORTS) {
      history.splice(this.MAX_REPORTS);
    }
    
    this.saveHistory(history);
    return reportId;
  }

  // Create a pending sectioned report with metadata
  static createPendingSectionedReport(workflowName: string, selectedIndustry: any, selectedSections: string[]): string {
    const reportId = this.generateReportId();
    const historyItem: ReportHistoryItem = {
      id: reportId,
      report: null,
      createdAt: new Date().toISOString(),
      workflowName,
      status: 'pending',
      progress: 0,
      phase: 'Initializing...',
      metadata: {
        reportType: 'sectioned',
        selectedIndustry,
        selectedSections,
        totalSections: selectedSections.length,
        completedSections: 0,
        failedSections: 0,
        hasFailures: false
      }
    };

    const history = this.getHistory();
    history.unshift(historyItem);
    
    // Keep only the most recent reports
    if (history.length > this.MAX_REPORTS) {
      history.splice(this.MAX_REPORTS);
    }
    
    this.saveHistory(history);
    return reportId;
  }

  // Update report progress and status
  static updateReportProgress(reportId: string, progress: number, phase: string, status?: 'generating' | 'generated' | 'failed'): void {
    const history = this.getHistory();
    const reportIndex = history.findIndex(item => item.id === reportId);
    
    if (reportIndex !== -1) {
      history[reportIndex].progress = progress;
      history[reportIndex].phase = phase;
      if (status) {
        history[reportIndex].status = status;
      }
      this.saveHistory(history);
    }
  }

  // Update sectioned report metadata
  static updateSectionedReportMetadata(reportId: string, sectionProgress: any): void {
    const history = this.getHistory();
    const reportIndex = history.findIndex(item => item.id === reportId);
    
    if (reportIndex !== -1 && history[reportIndex].metadata) {
      const completedSections = Object.values(sectionProgress).filter((s: any) => s.status === 'completed').length;
      const failedSections = Object.values(sectionProgress).filter((s: any) => s.status === 'error').length;
      
      history[reportIndex].metadata.sectionProgress = sectionProgress;
      history[reportIndex].metadata.completedSections = completedSections;
      history[reportIndex].metadata.failedSections = failedSections;
      history[reportIndex].metadata.hasFailures = failedSections > 0;
      
      this.saveHistory(history);
    }
  }

  // Complete report with final data
  static completeReport(reportId: string, report: AIGeneratedReport): void {
    const history = this.getHistory();
    const reportIndex = history.findIndex(item => item.id === reportId);
    
    if (reportIndex !== -1) {
      history[reportIndex].report = report;
      history[reportIndex].status = 'generated';
      history[reportIndex].progress = 100;
      history[reportIndex].phase = 'Complete';
      this.saveHistory(history);
    }
  }

  // Mark report as failed
  static markReportFailed(reportId: string, error: string): void {
    const history = this.getHistory();
    const reportIndex = history.findIndex(item => item.id === reportId);
    
    if (reportIndex !== -1) {
      history[reportIndex].status = 'failed';
      history[reportIndex].error = error;
      this.saveHistory(history);
    }
  }

  // Fix stuck reports that have all sections completed but are stuck at 90%
  static fixStuckReports(): number {
    const history = this.getHistory();
    let fixedCount = 0;
    
    console.log('🔍 Debugging stuck reports. Total reports in history:', history.length);
    
    history.forEach((report, index) => {
      console.log(`📋 Report ${index}: ${report.workflowName}`);
      console.log(`   Status: ${report.status}, Progress: ${report.progress}%`);
      console.log(`   Report Type: ${report.metadata?.reportType}`);
      console.log(`   Has sectionProgress:`, !!report.metadata?.sectionProgress);
      console.log(`   Has report.content:`, !!report.report?.content);
      console.log(`   Total sections: ${report.metadata?.totalSections}`);
      
      if (report.metadata?.sectionProgress) {
        const sectionProgress = report.metadata.sectionProgress;
        console.log(`   Section progress keys:`, Object.keys(sectionProgress));
        
        Object.entries(sectionProgress).forEach(([key, value]) => {
          console.log(`     ${key}:`, value);
        });
        
        const completedSections = Object.values(sectionProgress).filter((s: any) => s.status === 'completed').length;
        const errorSections = Object.values(sectionProgress).filter((s: any) => s.status === 'error').length;
        console.log(`   Completed: ${completedSections}, Errors: ${errorSections}`);
      }
      
      // Look for reports that are stuck in any incomplete state with all sections completed
      // This includes "generating", "pdf_created", or any status with progress < 100 but sections complete
      const isStuckReport = (
        (report.status === 'generating' || report.status === 'pdf_created' || report.progress < 100) &&
        report.metadata?.reportType === 'sectioned' && 
        report.metadata?.sectionProgress &&
        (!report.report || !report.report.content?.sections) // No proper report content yet
      );
      
      console.log(`   Is stuck report: ${isStuckReport}`);
      
      if (isStuckReport) {
        const sectionProgress = report.metadata.sectionProgress;
        const completedSections = Object.values(sectionProgress).filter((s: any) => s.status === 'completed').length;
        const errorSections = Object.values(sectionProgress).filter((s: any) => s.status === 'error').length;
        const totalSections = report.metadata.totalSections || 0;
        
        console.log(`🔧 Attempting to fix: ${completedSections}/${totalSections} completed, ${errorSections} errors`);
        
        // RELAXED CONDITIONS: Fix if we have ANY completed sections or if all sections exist with content
        const hasCompletedSections = completedSections > 0;
        const hasAllSectionsWithContent = Object.values(sectionProgress).every((s: any) => s.content && s.content.length > 0);
        const shouldFix = hasCompletedSections || hasAllSectionsWithContent;
        
        console.log(`   Should fix: ${shouldFix} (hasCompleted: ${hasCompletedSections}, hasContent: ${hasAllSectionsWithContent})`);
        
        if (shouldFix) {
          console.log(`🔧 Fixing stuck report: ${report.workflowName} (${completedSections}/${totalSections} sections completed, status: ${report.status})`);
          
          // Create proper report data structure from sections with content
          const sectionsArray = Object.entries(sectionProgress)
            .filter(([_, sectionData]: [string, any]) => sectionData.content && sectionData.content.length > 0)
            .map(([sectionId, sectionData]: [string, any]) => ({
              id: sectionId,
              title: sectionData.title || sectionId,
              content: sectionData.content || '',
              category: sectionData.category || 'general'
            }));
          
          console.log(`   Created ${sectionsArray.length} sections for report`);
          
          const mockReport = {
            content: { sections: sectionsArray },
            metadata: {
              title: report.workflowName,
              isRealAI: true,
              generatedAt: report.createdAt,
              sectionsGenerated: sectionsArray.length,
              totalSections: totalSections,
              failedSections: errorSections,
              isPartiallyComplete: sectionsArray.length < totalSections,
              isRestored: true
            }
          };
          
          // Complete the report
          history[index].report = mockReport as any;
          history[index].status = 'generated';
          history[index].progress = 100;
          history[index].phase = sectionsArray.length === totalSections ? 'Complete' : `Generated ${sectionsArray.length}/${totalSections} sections`;
          
          fixedCount++;
          console.log(`✅ Fixed report with ${sectionsArray.length} sections`);
        }
      }
      
      console.log('---');
    });
    
    if (fixedCount > 0) {
      this.saveHistory(history);
      console.log(`✅ Fixed ${fixedCount} stuck report(s)`);
    } else {
      console.log('❌ No reports were fixed');
    }
    
    return fixedCount;
  }

  // Save a new report to history (legacy method for backward compatibility)
  static saveReport(report: AIGeneratedReport, workflowName: string): string {
    const reportId = this.generateReportId();
    const historyItem: ReportHistoryItem = {
      id: reportId,
      report,
      createdAt: new Date().toISOString(),
      workflowName,
      status: 'generated',
      progress: 100,
      phase: 'Complete'
    };

    const history = this.getHistory();
    history.unshift(historyItem); // Add to beginning

    // Keep only the latest reports
    if (history.length > this.MAX_REPORTS) {
      history.splice(this.MAX_REPORTS);
    }

    this.saveHistory(history);
    console.log('📚 Report saved to history:', reportId);
    return reportId;
  }

  // Get all reports from history
  static getHistory(): ReportHistoryItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading report history:', error);
      return [];
    }
  }

  // Get a specific report by ID
  static getReport(reportId: string): ReportHistoryItem | null {
    const history = this.getHistory();
    return history.find(item => item.id === reportId) || null;
  }

  // Update report status (e.g., when PDF is created)
  static updateReportStatus(reportId: string, status: 'generated' | 'pdf_created', pdfUrl?: string): void {
    const history = this.getHistory();
    const reportIndex = history.findIndex(item => item.id === reportId);
    
    if (reportIndex !== -1) {
      history[reportIndex].status = status;
      if (pdfUrl) {
        history[reportIndex].pdfUrl = pdfUrl;
      }
      this.saveHistory(history);
      console.log('📝 Report status updated:', reportId, status);
    }
  }

  // Delete a report from history
  static deleteReport(reportId: string): void {
    const history = this.getHistory();
    const filteredHistory = history.filter(item => item.id !== reportId);
    this.saveHistory(filteredHistory);
    console.log('🗑️ Report deleted from history:', reportId);
  }

  // Clear all history
  static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🧹 Report history cleared');
  }

  // Get reports by workflow name
  static getReportsByWorkflow(workflowName: string): ReportHistoryItem[] {
    const history = this.getHistory();
    return history.filter(item => item.workflowName === workflowName);
  }

  // Get recent reports (last N)
  static getRecentReports(limit: number = 10): ReportHistoryItem[] {
    const history = this.getHistory();
    return history.slice(0, limit);
  }

  // Private methods
  private static generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static saveHistory(history: ReportHistoryItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving report history:', error);
    }
  }

  // Get storage usage info
  static getStorageInfo(): { totalReports: number, storageSize: string } {
    const history = this.getHistory();
    const storageData = localStorage.getItem(this.STORAGE_KEY) || '';
    const sizeInBytes = new Blob([storageData]).size;
    const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);
    
    return {
      totalReports: history.length,
      storageSize: `${sizeInMB} MB`
    };
  }
} 