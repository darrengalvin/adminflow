import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { AIGeneratedContent, WorkflowAnalysisRequest } from '../../services/claudeService';

// Modern, clean styling for dynamic content
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
  },
  
  // Cover Page
  coverPage: {
    flexDirection: 'column',
    backgroundColor: '#1e40af',
    padding: 0,
    height: '100%',
    color: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.9,
  },
  
  // ROI Summary Card
  roiCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 12,
    marginTop: 30,
    color: '#1f2937',
    minWidth: 280,
  },
  roiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#1e40af',
  },
  roiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  roiMetric: {
    width: '48%',
    textAlign: 'center',
    marginBottom: 12,
  },
  roiValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  roiLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  
  // Dynamic Content Styling
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 25,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    borderBottomStyle: 'solid',
  },
  
  contentText: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 10,
    textAlign: 'justify',
  },
  
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletSymbol: {
    width: 15,
    fontSize: 11,
    color: '#3b82f6',
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.4,
  },
  
  // Metrics display
  metricBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    borderLeftStyle: 'solid',
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 10,
    color: '#374151',
  },
  
  // Code blocks
  codeBlock: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    fontFamily: 'Courier',
  },
  codeText: {
    fontSize: 9,
    fontFamily: 'Courier',
    color: '#374151',
    lineHeight: 1.3,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 9,
    color: '#6b7280',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderTopStyle: 'solid',
    paddingTop: 8,
  },
  
  // Source indicator
  sourceIndicator: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 4,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    borderLeftStyle: 'solid',
  },
  sourceText: {
    fontSize: 9,
    color: '#92400e',
    fontWeight: 'bold',
  },
});

interface PDFReportProps {
  content: AIGeneratedContent;
  workflowData: WorkflowAnalysisRequest;
}

export const PDFReport: React.FC<PDFReportProps> = ({ content, workflowData }) => {
  // Comprehensive null checks to prevent undefined errors
  if (!content || !workflowData) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Loading Report...</Text>
          <Text style={styles.contentText}>Please wait while your AI-powered implementation guide is being generated.</Text>
        </Page>
      </Document>
    );
  }

  // Safe access with default values
  const executiveSummary = content.executiveSummary || {};
  const technicalSpec = content.technicalSpecification || {};
  const implementationPlan = content.implementationPlan || {};
  const successMetrics = content.successMetrics || {};
  const codeExamples = content.codeExamples || [];
  
  const roiMetrics = executiveSummary.roiMetrics || {};
  
  // Check if this is real AI content or fallback
  const isRealAI = roiMetrics.annualValue !== "£3,900";
  const contentSource = isRealAI ? "🤖 Real Claude 4 Sonnet Content" : "⚠️ Static Template (Deploy to Production)";
  
  const renderCoverPage = () => (
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.coverContent}>
        <Text style={styles.coverTitle}>🤖 AI Implementation Guide</Text>
        <Text style={styles.coverSubtitle}>{workflowData.workflowName || 'Automation Workflow'}</Text>
        
        <View style={styles.roiCard}>
          <Text style={styles.roiTitle}>📊 ROI Impact Summary</Text>
          <View style={styles.roiGrid}>
            <View style={styles.roiMetric}>
              <Text style={styles.roiValue}>{roiMetrics.annualValue || 'TBD'}</Text>
              <Text style={styles.roiLabel}>Annual Value</Text>
            </View>
            <View style={styles.roiMetric}>
              <Text style={styles.roiValue}>{roiMetrics.annualHoursSaved || 0} hrs</Text>
              <Text style={styles.roiLabel}>Hours Saved/Year</Text>
            </View>
            <View style={styles.roiMetric}>
              <Text style={styles.roiValue}>{roiMetrics.efficiencyGain || 'TBD'}</Text>
              <Text style={styles.roiLabel}>Efficiency Gain</Text>
            </View>
            <View style={styles.roiMetric}>
              <Text style={styles.roiValue}>{roiMetrics.setupTime || 'TBD'}</Text>
              <Text style={styles.roiLabel}>Setup Time</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
                  <Text>Generated {new Date().toLocaleDateString()} | Powered by Claude 4 Sonnet AI | {contentSource}</Text>
      </View>
    </Page>
  );

  const renderDynamicContent = () => (
    <Page size="A4" style={styles.page}>
      {!isRealAI && (
        <View style={styles.sourceIndicator}>
          <Text style={styles.sourceText}>
            ⚠️ DEVELOPMENT MODE: Showing static template. Deploy to production for real Claude 4 Sonnet content.
          </Text>
        </View>
      )}
      
      <Text style={styles.sectionTitle}>{executiveSummary.title || 'Executive Summary'}</Text>
                <Text style={styles.contentText}>{executiveSummary.overview || 'Implementation overview will be generated by Claude 4 Sonnet.'}</Text>
      
      {executiveSummary.keyBenefits && executiveSummary.keyBenefits.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>🎯 Key Benefits</Text>
          {executiveSummary.keyBenefits.map((benefit, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bulletSymbol}>•</Text>
              <Text style={styles.bulletText}>{benefit}</Text>
            </View>
          ))}
        </>
      )}
      
      <Text style={styles.sectionTitle}>💹 ROI Metrics</Text>
      <View style={styles.metricBox}>
        <Text style={styles.metricTitle}>Annual Hours Saved</Text>
        <Text style={styles.metricValue}>{roiMetrics.annualHoursSaved || 0} hours</Text>
      </View>
      <View style={styles.metricBox}>
        <Text style={styles.metricTitle}>Annual Value</Text>
        <Text style={styles.metricValue}>{roiMetrics.annualValue || 'To be determined'}</Text>
      </View>
      <View style={styles.metricBox}>
        <Text style={styles.metricTitle}>Efficiency Gain</Text>
        <Text style={styles.metricValue}>{roiMetrics.efficiencyGain || 'To be calculated'}</Text>
      </View>
      
      <Text style={styles.sectionTitle}>{technicalSpec.title || 'Technical Implementation'}</Text>
                <Text style={styles.contentText}>{technicalSpec.architectureOverview || 'Technical architecture will be detailed by Claude 4 Sonnet.'}</Text>
      
      {technicalSpec.requiredTechnologies && technicalSpec.requiredTechnologies.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>🔧 Required Technologies</Text>
          {technicalSpec.requiredTechnologies.map((tech, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bulletSymbol}>▶</Text>
              <Text style={styles.bulletText}>{tech}</Text>
            </View>
          ))}
        </>
      )}
      
      {codeExamples && codeExamples.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>💻 Code Examples</Text>
          {codeExamples.slice(0, 2).map((example, index) => (
            <View key={index}>
              <Text style={styles.metricTitle}>{example.title || `Code Example ${index + 1}`}</Text>
              <Text style={styles.contentText}>{example.description || 'Code implementation details'}</Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>{example.code || '// Code will be generated by Claude 4 Sonnet'}</Text>
              </View>
            </View>
          ))}
        </>
      )}
    </Page>
  );

  const renderImplementationPlan = () => (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>{implementationPlan.title || 'Implementation Plan'}</Text>
      <Text style={styles.contentText}>Total Timeline: {implementationPlan.totalTimeline || 'To be determined'}</Text>
      
      {implementationPlan.phases && implementationPlan.phases.length > 0 && implementationPlan.phases.map((phase, index) => (
        <View key={index} style={styles.metricBox}>
          <Text style={styles.metricTitle}>{phase.phase || `Phase ${index + 1}`} ({phase.duration || 'TBD'})</Text>
                      <Text style={styles.metricValue}>{phase.description || 'Phase details will be provided by Claude 4 Sonnet'}</Text>
          {phase.tasks && phase.tasks.slice(0, 3).map((task, taskIndex) => (
            <View key={taskIndex} style={styles.bulletPoint}>
              <Text style={styles.bulletSymbol}>•</Text>
              <Text style={styles.bulletText}>{task}</Text>
            </View>
          ))}
        </View>
      ))}
      
      <Text style={styles.sectionTitle}>{successMetrics.title || 'Success Metrics'}</Text>
      {successMetrics.kpis && successMetrics.kpis.length > 0 && successMetrics.kpis.map((kpi, index) => (
        <View key={index} style={styles.metricBox}>
          <Text style={styles.metricTitle}>{kpi.metric || `Metric ${index + 1}`}</Text>
          <Text style={styles.metricValue}>Target: {kpi.target || 'TBD'}</Text>
          <Text style={styles.metricValue}>Method: {kpi.measurementMethod || 'To be defined'}</Text>
        </View>
      ))}
    </Page>
  );

  return (
    <Document>
      {renderCoverPage()}
      {renderDynamicContent()}
      {renderImplementationPlan()}
    </Document>
  );
}; 