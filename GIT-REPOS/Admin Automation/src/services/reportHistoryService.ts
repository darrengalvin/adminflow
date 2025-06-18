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

  // Update report status (used by PDF generation)
  static updateReportStatus(reportId: string, status: 'pdf_created'): void {
    const history = this.getHistory();
    const reportIndex = history.findIndex(item => item.id === reportId);
    
    if (reportIndex !== -1) {
      history[reportIndex].status = status;
      this.saveHistory(history);
    }
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