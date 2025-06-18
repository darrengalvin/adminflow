import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { ReportHistoryItem } from '../services/reportHistoryService';

// Professional PDF styles for beautiful, structured reports
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  
  // Header styles
  header: {
    marginBottom: 30,
    borderBottom: '3 solid #2563eb',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
    textAlign: 'center',
  },
  
  // Section styles
  sectionContainer: {
    marginBottom: 25,
    break: false,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: '2 solid #e5e7eb',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 4,
  },
  
  // Metrics styles
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  metricCard: {
    width: '48%',
    marginRight: '4%',
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#f0f9ff',
    border: '1 solid #0ea5e9',
    borderRadius: 6,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#0c4a6e',
    marginBottom: 3,
  },
  metricLabel: {
    fontSize: 10,
    color: '#374151',
    fontFamily: 'Helvetica-Bold',
  },
  metricDescription: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
  
  // Content sections
  contentSection: {
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    marginBottom: 8,
    paddingLeft: 5,
    borderLeft: '3 solid #3b82f6',
  },
  
  // Lists and points
  listItem: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 6,
    paddingLeft: 15,
    lineHeight: 1.4,
  },
  bulletPoint: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 5,
    paddingLeft: 12,
    lineHeight: 1.4,
  },
  
  // Implementation steps
  stepContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f9fafb',
    border: '1 solid #e5e7eb',
    borderRadius: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  stepNumber: {
    width: 20,
    height: 20,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.8,
    marginRight: 8,
  },
  stepTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
  },
  stepDescription: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 3,
    lineHeight: 1.4,
  },
  stepTimeline: {
    fontSize: 9,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  
  // Risk assessment
  riskContainer: {
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
  },
  riskHigh: {
    backgroundColor: '#fef2f2',
    border: '1 solid #fca5a5',
  },
  riskMedium: {
    backgroundColor: '#fffbeb',
    border: '1 solid #fcd34d',
  },
  riskLow: {
    backgroundColor: '#f0fdf4',
    border: '1 solid #86efac',
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  riskImpact: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 8,
  },
  riskImpactHigh: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
  },
  riskImpactMedium: {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
  },
  riskImpactLow: {
    backgroundColor: '#10b981',
    color: '#ffffff',
  },
  riskText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.3,
  },
  riskMitigation: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 3,
    fontStyle: 'italic',
  },
  
  // Recommendations
  recommendationItem: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 8,
    paddingLeft: 15,
    paddingRight: 10,
    lineHeight: 1.4,
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 4,
    border: '1 solid #0ea5e9',
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
});

interface PDFGeneratorProps {
  report: ReportHistoryItem;
  onComplete?: (blob: Blob) => void;
}

// Component to render structured section data beautifully
const StructuredSectionRenderer: React.FC<{ 
  title: string; 
  pdfData: any;
  sectionNumber: number;
}> = ({ title, pdfData, sectionNumber }) => {
  
  const getRiskStyle = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high': return [styles.riskContainer, styles.riskHigh];
      case 'medium': return [styles.riskContainer, styles.riskMedium];
      case 'low': return [styles.riskContainer, styles.riskLow];
      default: return [styles.riskContainer, styles.riskMedium];
    }
  };
  
  const getRiskImpactStyle = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high': return [styles.riskImpact, styles.riskImpactHigh];
      case 'medium': return [styles.riskImpact, styles.riskImpactMedium];
      case 'low': return [styles.riskImpact, styles.riskImpactLow];
      default: return [styles.riskImpact, styles.riskImpactMedium];
    }
  };

  return (
    <View style={styles.sectionContainer}>
      {/* Section Title */}
      <Text style={styles.sectionTitle}>
        {sectionNumber}. {pdfData?.title || title}
      </Text>

      {/* Key Metrics */}
      {pdfData?.keyMetrics && pdfData.keyMetrics.length > 0 && (
        <View style={styles.contentSection}>
          <Text style={styles.sectionSubtitle}>Key Metrics & Performance Indicators</Text>
          <View style={styles.metricsContainer}>
            {pdfData.keyMetrics.slice(0, 6).map((metric: any, index: number) => (
              <View key={index} style={styles.metricCard}>
                <Text style={styles.metricValue}>{String(metric.value || '').substring(0, 50)}</Text>
                <Text style={styles.metricLabel}>{String(metric.label || '').substring(0, 100)}</Text>
                {metric.description && (
                  <Text style={styles.metricDescription}>{String(metric.description || '').substring(0, 200)}</Text>
                )}
              </View>
            ))}
          </View>
          {pdfData.keyMetrics.length > 6 && (
            <Text style={styles.listItem}>... and {pdfData.keyMetrics.length - 6} more metrics (see web view)</Text>
          )}
        </View>
      )}

      {/* Main Points */}
      {pdfData?.mainPoints && pdfData.mainPoints.length > 0 && (
        <View style={styles.contentSection}>
          <Text style={styles.sectionSubtitle}>Key Insights & Analysis</Text>
          {pdfData.mainPoints.slice(0, 8).map((point: string, index: number) => (
            <Text key={index} style={styles.bulletPoint}>
              • {String(point || '').substring(0, 300)}
            </Text>
          ))}
          {pdfData.mainPoints.length > 8 && (
            <Text style={styles.listItem}>... and {pdfData.mainPoints.length - 8} more insights (see web view)</Text>
          )}
        </View>
      )}

      {/* Implementation Steps */}
      {pdfData?.implementationSteps && pdfData.implementationSteps.length > 0 && (
        <View style={styles.contentSection}>
          <Text style={styles.sectionSubtitle}>Implementation Roadmap</Text>
          {pdfData.implementationSteps.map((step: any, index: number) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>{step.step || index + 1}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepDescription}>{step.description}</Text>
              {step.timeline && (
                <Text style={styles.stepTimeline}>Timeline: {step.timeline}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Risk Assessment */}
      {pdfData?.risks && pdfData.risks.length > 0 && (
        <View style={styles.contentSection}>
          <Text style={styles.sectionSubtitle}>Risk Assessment & Mitigation</Text>
          {pdfData.risks.map((risk: any, index: number) => (
            <View key={index} style={getRiskStyle(risk.impact)}>
              <View style={styles.riskHeader}>
                <Text style={getRiskImpactStyle(risk.impact)}>
                  {risk.impact?.toUpperCase() || 'MEDIUM'}
                </Text>
                <Text style={styles.riskText}>{risk.risk}</Text>
              </View>
              {risk.mitigation && (
                <Text style={styles.riskMitigation}>
                  Mitigation: {risk.mitigation}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Recommendations */}
      {pdfData?.recommendations && pdfData.recommendations.length > 0 && (
        <View style={styles.contentSection}>
          <Text style={styles.sectionSubtitle}>Strategic Recommendations</Text>
          {pdfData.recommendations.map((recommendation: string, index: number) => (
            <Text key={index} style={styles.recommendationItem}>
              ✓ {recommendation}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

// Fallback renderer for HTML-only content (simplified)
const HTMLFallbackRenderer: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  // Extract key information from HTML content
  const extractTextContent = (html: string): string => {
    let cleanText = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    
    // Limit content length to prevent RangeError
    const MAX_CONTENT_LENGTH = 5000; // 5KB per section
    if (cleanText.length > MAX_CONTENT_LENGTH) {
      console.warn(`⚠️ Content truncated for PDF: ${cleanText.length} chars -> ${MAX_CONTENT_LENGTH} chars`);
      cleanText = cleanText.substring(0, MAX_CONTENT_LENGTH) + '\n\n[Content truncated for PDF generation]';
    }
    
    return cleanText;
  };

  const cleanContent = extractTextContent(content);
  
  // Split content into manageable chunks
  const chunkContent = (text: string, maxLength: number = 1000): string[] => {
    const chunks: string[] = [];
    let currentChunk = '';
    const sentences = text.split('. ');
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxLength && currentChunk.length > 0) {
        chunks.push(currentChunk.trim() + '.');
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks.slice(0, 10); // Limit to 10 chunks per section
  };
  
  const contentChunks = chunkContent(cleanContent);
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {contentChunks.map((chunk, index) => (
        <Text key={index} style={styles.listItem}>{chunk}</Text>
      ))}
      {contentChunks.length === 10 && (
        <Text style={styles.listItem}>[Additional content available in web view]</Text>
      )}
    </View>
  );
};

// Main PDF Document component
const PDFDocument: React.FC<{ report: ReportHistoryItem }> = ({ report }) => {
  const reportData = report.report;
  const sections = reportData?.content?.sections || {};
  const sectionEntries = Object.entries(sections);
  
  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View wrap={false} style={styles.header}>
          <Text style={styles.title}>
            {report.workflowName}
          </Text>
          <Text style={styles.subtitle}>
            Professional Implementation Strategy & Analysis Report
          </Text>
          <Text style={styles.subtitle}>
            Generated: {new Date(report.createdAt).toLocaleDateString()}
          </Text>
          {report.metadata?.selectedIndustry?.name && (
            <Text style={styles.subtitle}>
              Industry: {report.metadata.selectedIndustry.name}
            </Text>
          )}
          <Text style={styles.subtitle}>
            Sections: {sectionEntries.length} • Estimated Pages: {sectionEntries.length * 2 + 2}
          </Text>
        </View>

        {/* Executive Summary */}
        <View wrap={false} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.listItem}>
            This comprehensive implementation report provides strategic insights and actionable 
            recommendations for {report.metadata?.selectedIndustry?.name || 'your organization'}. 
            The analysis covers {sectionEntries.length} key areas including operational efficiency, 
            technology integration, compliance requirements, and financial projections.
          </Text>
          <Text style={styles.listItem}>
            Each section includes specific metrics, implementation timelines, risk assessments, 
            and strategic recommendations designed to drive measurable business outcomes and 
            sustainable growth.
          </Text>
        </View>

        {/* Table of Contents */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionSubtitle}>Table of Contents</Text>
          {sectionEntries.map(([sectionId, sectionData], index) => (
            <View key={sectionId} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 5,
              paddingHorizontal: 10,
            }}>
              <Text style={styles.listItem}>
                {index + 1}. {sectionData.title || sectionId}
              </Text>
              <Text style={styles.listItem}>
                Page {index + 2}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          {report.workflowName} - Implementation Report | Page 1
        </Text>
      </Page>

      {/* Individual Section Pages */}
      {sectionEntries.map(([sectionId, sectionData], index) => (
        <Page key={sectionId} size="A4" style={styles.page}>
          {/* Check if we have structured PDF data */}
          {sectionData.pdfData ? (
            <StructuredSectionRenderer 
              title={sectionData.title || sectionId}
              pdfData={sectionData.pdfData}
              sectionNumber={index + 1}
            />
          ) : (
            <HTMLFallbackRenderer 
              title={sectionData.title || sectionId}
              content={sectionData.content || ''}
            />
          )}
          
          <Text style={styles.footer}>
            {report.workflowName} - Implementation Report | Page {index + 2}
          </Text>
        </Page>
      ))}
    </Document>
  );
};

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({ report, onComplete }) => {
  const generatePDF = async () => {
    try {
      const doc = <PDFDocument report={report} />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      
      if (onComplete) {
        onComplete(blob);
      }
      
      return blob;
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    }
  };

  React.useEffect(() => {
    generatePDF();
  }, [report]);

  return null;
};

export const generateAndDownloadPDF = async (report: ReportHistoryItem): Promise<void> => {
  try {
    const doc = <PDFDocument report={report} />;
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.workflowName.replace(/[^a-zA-Z0-9]/g, '_')}_Report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ PDF generated and downloaded successfully');
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  }
};

export default PDFGenerator; 