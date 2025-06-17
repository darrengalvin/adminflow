import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { AIGeneratedContent, WorkflowAnalysisRequest } from '../../services/claudeService';

// Professional fonts and styling
const styles = StyleSheet.create({
  // Page Layout
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  
  // Cover Page Styles
  coverPage: {
    flexDirection: 'column',
    backgroundColor: '#1e40af',
    padding: 0,
    height: '100%',
    color: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
  },
  coverContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  coverTagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  
  // ROI Summary Card on Cover
  roiCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 30,
    borderRadius: 12,
    marginTop: 40,
    color: '#1f2937',
    minWidth: 300,
  },
  roiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
    marginBottom: 15,
  },
  roiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 5,
  },
  roiLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  
  // Header Styles
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 30,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    borderBottomStyle: 'solid',
  },
  subHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 20,
    marginBottom: 10,
  },
  
  // Text and Paragraph Styles  
  paragraph: {
    marginBottom: 12,
    textAlign: 'justify',
    lineHeight: 1.5,
    maxWidth: '100%',
  },
  shortParagraph: {
    marginBottom: 8,
    lineHeight: 1.4,
  },
  highlightBox: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    borderLeftStyle: 'solid',
    marginBottom: 15,
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
  },
  
  // Two-Column Layout
  twoColumnContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
  },
  leftColumn: {
    width: '48%',
  },
  rightColumn: {
    width: '48%',
  },
  columnDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 10,
  },
  
  // List Styles with Hierarchy
  bulletList: {
    marginBottom: 15,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 0,
  },
  bulletPoint: {
    width: 20,
    fontSize: 12,
    color: '#059669',
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.4,
  },
  numberedList: {
    marginBottom: 15,
  },
  numberedItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  numberPoint: {
    width: 25,
    fontSize: 11,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  
  // Table Styles
  table: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    borderBottomStyle: 'solid',
    padding: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderBottomStyle: 'solid',
    padding: 8,
  },
  tableRowAlternate: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
    textAlign: 'left',
    paddingHorizontal: 4,
  },
  
  // Code Block Styles
  codeContainer: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    marginBottom: 15,
    fontFamily: 'Courier',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
  },
  codeLanguage: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
  },
  codeText: {
    fontSize: 9,
    fontFamily: 'Courier',
    color: '#374151',
    lineHeight: 1.2,
  },
  
  // Card Styles
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
    marginBottom: 15,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
  },
  
  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftStyle: 'solid',
    marginBottom: 10,
    textAlign: 'center',
  },
  metricCardPrimary: {
    borderLeftColor: '#3b82f6',
  },
  metricCardSecondary: {
    borderLeftColor: '#059669',
  },
  metricCardAccent: {
    borderLeftColor: '#7c3aed',
  },
  metricCardWarning: {
    borderLeftColor: '#ea580c',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
  
  // Visual Breaks
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    marginVertical: 20,
  },
  spacer: {
    height: 15,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#6b7280',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
  
  // Table of Contents
  tocContainer: {
    marginBottom: 30,
  },
  tocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderBottomStyle: 'dotted',
  },
  tocText: {
    fontSize: 11,
    color: '#374151',
  },
  tocPage: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
});

interface PDFReportProps {
  content: AIGeneratedContent;
  workflowData: WorkflowAnalysisRequest;
}

export const PDFReport: React.FC<PDFReportProps> = ({ content, workflowData }) => {
  const renderCoverPage = () => (
    <Page size="A4" style={styles.coverPage}>
      <Text style={styles.coverTitle}>🤖 AI Implementation Guide</Text>
      <Text style={styles.coverSubtitle}>{workflowData.workflowName}</Text>
      <Text style={styles.coverTagline}>
        Comprehensive Automation Strategy & Technical Implementation
      </Text>
      
      <View style={styles.roiCard}>
        <Text style={styles.roiTitle}>📊 ROI Impact Summary</Text>
        <View style={styles.roiGrid}>
          <View style={styles.roiMetric}>
            <Text style={styles.roiValue}>{content.executiveSummary.roiMetrics.annualValue}</Text>
            <Text style={styles.roiLabel}>Annual Value</Text>
          </View>
          <View style={styles.roiMetric}>
            <Text style={styles.roiValue}>{content.executiveSummary.roiMetrics.annualHoursSaved} hrs</Text>
            <Text style={styles.roiLabel}>Hours Saved/Year</Text>
          </View>
          <View style={styles.roiMetric}>
            <Text style={styles.roiValue}>{content.executiveSummary.roiMetrics.efficiencyGain}</Text>
            <Text style={styles.roiLabel}>Efficiency Gain</Text>
          </View>
          <View style={styles.roiMetric}>
            <Text style={styles.roiValue}>{content.executiveSummary.roiMetrics.setupTime}</Text>
            <Text style={styles.roiLabel}>Setup Time</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text>Generated {new Date().toLocaleDateString()} | Powered by Claude 4 Opus AI | Confidential</Text>
      </View>
    </Page>
  );

  const renderTableOfContents = () => (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionHeader}>📋 Table of Contents</Text>
      
      <View style={styles.tocContainer}>
        <View style={styles.tocItem}>
          <Text style={styles.tocText}>1. Executive Summary</Text>
          <Text style={styles.tocPage}>3</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocText}>2. Technical Implementation</Text>
          <Text style={styles.tocPage}>4</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocText}>3. Implementation Plan</Text>
          <Text style={styles.tocPage}>5</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocText}>4. Resource Requirements</Text>
          <Text style={styles.tocPage}>6</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocText}>5. Code Examples</Text>
          <Text style={styles.tocPage}>7</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocText}>6. Success Metrics</Text>
          <Text style={styles.tocPage}>8</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocText}>7. Risk Assessment</Text>
          <Text style={styles.tocPage}>9</Text>
        </View>
      </View>
    </Page>
  );

  const renderExecutiveSummary = () => (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionHeader}>📊 Executive Summary</Text>
      
      <View style={styles.highlightBox}>
        <Text style={styles.highlightTitle}>🤖 AI Automation Assessment</Text>
        <Text style={styles.highlightText}>{content.executiveSummary.overview}</Text>
      </View>

      <Text style={styles.subHeader}>🎯 Strategic Business Benefits</Text>
      <View style={styles.bulletList}>
        {content.executiveSummary.keyBenefits.map((benefit, index) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>{benefit}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subHeader}>💹 ROI Analysis</Text>
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, styles.metricCardPrimary]}>
          <Text style={[styles.metricValue, { color: '#3b82f6' }]}>
            {content.executiveSummary.roiMetrics.annualHoursSaved}
          </Text>
          <Text style={styles.metricLabel}>Hours Saved Annually</Text>
        </View>
        <View style={[styles.metricCard, styles.metricCardSecondary]}>
          <Text style={[styles.metricValue, { color: '#059669' }]}>
            {content.executiveSummary.roiMetrics.annualValue}
          </Text>
          <Text style={styles.metricLabel}>Annual Value</Text>
        </View>
        <View style={[styles.metricCard, styles.metricCardAccent]}>
          <Text style={[styles.metricValue, { color: '#7c3aed' }]}>
            {content.executiveSummary.roiMetrics.efficiencyGain}
          </Text>
          <Text style={styles.metricLabel}>Efficiency Improvement</Text>
        </View>
        <View style={[styles.metricCard, styles.metricCardWarning]}>
          <Text style={[styles.metricValue, { color: '#ea580c' }]}>
            {content.executiveSummary.roiMetrics.setupTime}
          </Text>
          <Text style={styles.metricLabel}>Implementation Time</Text>
        </View>
      </View>
    </Page>
  );

  const renderTechnicalImplementation = () => (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionHeader}>🏗️ Technical Implementation</Text>
      
      <View style={styles.highlightBox}>
        <Text style={styles.highlightTitle}>⚙️ System Architecture</Text>
        <Text style={styles.highlightText}>{content.technicalSpecification.architectureOverview}</Text>
      </View>

      <Text style={styles.subHeader}>🔧 Technology Stack</Text>
      <View style={styles.twoColumnContainer}>
        <View style={styles.leftColumn}>
          <View style={styles.bulletList}>
            {content.technicalSpecification.requiredTechnologies.slice(0, Math.ceil(content.technicalSpecification.requiredTechnologies.length / 2)).map((tech, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>▶</Text>
                <Text style={styles.bulletText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.columnDivider} />
        <View style={styles.rightColumn}>
          <View style={styles.bulletList}>
            {content.technicalSpecification.requiredTechnologies.slice(Math.ceil(content.technicalSpecification.requiredTechnologies.length / 2)).map((tech, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>▶</Text>
                <Text style={styles.bulletText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.subHeader}>🔌 API Integration Specifications</Text>
      {content.technicalSpecification.apiConnections.map((api, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardHeader}>{api.name}</Text>
          <Text style={styles.cardContent}>{api.purpose}</Text>
          <View style={styles.spacer} />
          <Text style={[styles.cardContent, { fontFamily: 'Courier', fontSize: 9 }]}>
            {api.method} {api.endpoint}
          </Text>
          <Text style={[styles.cardContent, { fontSize: 9, color: '#6b7280' }]}>
            Auth: {api.authentication}
          </Text>
        </View>
      ))}
    </Page>
  );

  const renderCodeExamples = () => (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionHeader}>💻 Code Examples & Integration</Text>
      
      {content.codeExamples.map((example, index) => (
        <View key={index}>
          <Text style={styles.subHeader}>{example.title}</Text>
          <Text style={styles.paragraph}>{example.description}</Text>
          
          <View style={styles.codeContainer}>
            <View style={styles.codeHeader}>
              <Text style={styles.codeLanguage}>{example.language.toUpperCase()}</Text>
              <Text style={[styles.codeText, { fontSize: 8, color: '#6b7280' }]}>📋 Copy</Text>
            </View>
            <Text style={styles.codeText}>{example.code}</Text>
          </View>
          
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>💡 Code Explanation</Text>
            <Text style={styles.highlightText}>{example.explanation}</Text>
          </View>
          
          {index < content.codeExamples.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </Page>
  );

  return (
    <Document>
      {renderCoverPage()}
      {renderTableOfContents()}
      {renderExecutiveSummary()}
      {renderTechnicalImplementation()}
      {renderCodeExamples()}
    </Document>
  );
}; 