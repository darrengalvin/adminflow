import jsPDF from 'jspdf';
import { claudeService, WorkflowAnalysisRequest, AIGeneratedContent } from './claudeService';

export interface PDFGenerationOptions {
  includeCodeExamples: boolean;
  includeArchitectureDiagrams: boolean;
  colorScheme: 'professional' | 'modern' | 'corporate';
  documentTemplate: 'comprehensive' | 'executive' | 'technical';
}

export class AdvancedPDFGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private contentWidth: number;
  private yPosition: number;
  private currentPage: number = 1;

  // Enhanced color schemes for outstanding UI/UX
  private colorSchemes = {
    professional: {
      primary: '#1E40AF',      // Blue 700
      secondary: '#059669',     // Emerald 600  
      accent: '#7C3AED',       // Violet 600
      warning: '#EA580C',      // Orange 600
      text: '#1F2937',         // Gray 800
      lightText: '#6B7280',    // Gray 500
      background: '#F8FAFC',   // Slate 50
      codeBackground: '#F1F5F9', // Slate 100
      border: '#E2E8F0'        // Slate 200
    },
    modern: {
      primary: '#0EA5E9',      // Sky 500
      secondary: '#10B981',     // Emerald 500
      accent: '#8B5CF6',       // Violet 500
      warning: '#F59E0B',      // Amber 500
      text: '#111827',         // Gray 900
      lightText: '#6B7280',    // Gray 500
      background: '#FAFAFA',   // Neutral 50
      codeBackground: '#F5F5F5', // Neutral 100
      border: '#E5E5E5'        // Neutral 300
    },
    corporate: {
      primary: '#1F2937',      // Gray 800
      secondary: '#059669',     // Emerald 600
      accent: '#DC2626',       // Red 600
      warning: '#D97706',      // Amber 600
      text: '#1F2937',         // Gray 800
      lightText: '#6B7280',    // Gray 500
      background: '#FFFFFF',   // White
      codeBackground: '#F9FAFB', // Gray 50
      border: '#D1D5DB'        // Gray 300
    }
  };

  private selectedColors: any;

  constructor(options: PDFGenerationOptions = {
    includeCodeExamples: true,
    includeArchitectureDiagrams: true,
    colorScheme: 'professional',
    documentTemplate: 'comprehensive'
  }) {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.yPosition = this.margin;
    this.selectedColors = this.colorSchemes[options.colorScheme];
  }

  async generateComprehensiveGuide(workflowData: WorkflowAnalysisRequest): Promise<void> {
    try {
      console.log('🤖 Generating AI-powered implementation guide using Claude 4 Sonnet...');
      
      // Generate AI content using Claude 4 Sonnet
      const aiContent = await claudeService.generateImplementationGuide(workflowData);
      
      console.log('✅ AI content generated successfully');
      console.log('📄 Building sophisticated PDF document...');
      
      // Build the PDF with enhanced design
      await this.buildPDFDocument(aiContent, workflowData);
      
      // Save the PDF
      const fileName = `${workflowData.workflowName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_ai_implementation_guide.pdf`;
      this.pdf.save(fileName);
      
      console.log(`🎉 AI-powered PDF generated successfully: ${fileName}`);
    } catch (error) {
      console.error('❌ Error generating AI-powered PDF:', error);
      throw error;
    }
  }

  private async buildPDFDocument(content: AIGeneratedContent, workflowData: WorkflowAnalysisRequest): Promise<void> {
    // 1. Generate sophisticated cover page with gradient and ROI cards
    this.generateCoverPage(content, workflowData);
    
    // 2. Add professional table of contents with dotted lines
    this.addNewPage();
    this.generateTableOfContents();
    
    // 3. Executive Summary with enhanced styling and visual elements
    this.addNewPage();
    this.generateExecutiveSummary(content.executiveSummary);
    
    // 4. Technical Specifications with architecture diagrams
    this.addNewPage();
    this.generateTechnicalSpecification(content.technicalSpecification);
    
    // 5. Implementation Plan with timeline visualization
    this.addNewPage();
    this.generateImplementationPlan(content.implementationPlan);
    
    // 6. Resource Requirements with visual breakdown
    this.addNewPage();
    this.generateResourceRequirements(content.resourceRequirements);
    
    // 7. Code Examples with syntax highlighting and explanations
    if (content.codeExamples && content.codeExamples.length > 0) {
      this.addNewPage();
      this.generateCodeExamples(content.codeExamples);
    }
    
    // 8. Success Metrics with KPI dashboard design
    this.addNewPage();
    this.generateSuccessMetrics(content.successMetrics);
    
    // 9. Risk Assessment with mitigation matrix
    this.addNewPage();
    this.generateRiskAssessment(content.riskAssessment);
    
    // 10. Appendices and references
    this.addNewPage();
    this.generateAppendices();
    
    // Add professional page numbers and footers
    this.addPageNumbersAndFooters();
  }

  private generateCoverPage(content: AIGeneratedContent, workflowData: WorkflowAnalysisRequest): void {
    // Create sophisticated gradient background
    this.createGradientBackground();
    
    // Add company logo placeholder
    this.addLogoPlaceholder();
    
    // Main title with modern typography
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(36);
    this.pdf.setFont('helvetica', 'bold');
    this.addCenteredText('AI Implementation Guide', 70);
    
    // Workflow name subtitle
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'normal');
    this.addCenteredText(workflowData.workflowName, 95);
    
    // Sophisticated ROI summary card
    this.createROICard(content.executiveSummary.roiMetrics);
    
    // Professional footer with AI badge
    this.addCoverFooter();
  }

  private createGradientBackground(): void {
    // Create beautiful gradient effect with multiple color layers
    const gradientColors = [
      [30, 64, 175],    // Blue 700
      [37, 99, 235],    // Blue 600
      [59, 130, 246],   // Blue 500
      [96, 165, 250],   // Blue 400
    ];
    
    const sectionHeight = this.pageHeight / gradientColors.length;
    
    gradientColors.forEach((color, index) => {
      this.pdf.setFillColor(color[0], color[1], color[2]);
      this.pdf.rect(0, index * sectionHeight, this.pageWidth, sectionHeight, 'F');
    });
  }

  private addLogoPlaceholder(): void {
    // Professional logo placeholder with modern design
    this.pdf.setFillColor(255, 255, 255, 0.9);
    this.pdf.roundedRect(this.pageWidth - 60, 20, 40, 40, 5, 5, 'F');
    
    this.pdf.setTextColor(30, 64, 175);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('AI', this.pageWidth - 45, 43, { align: 'center' });
  }

  private createROICard(roiMetrics: any): void {
    const cardY = 140;
    const cardHeight = 80;
    
    // Card shadow effect for depth
    this.pdf.setFillColor(0, 0, 0, 0.1);
    this.pdf.roundedRect(32, cardY + 2, this.pageWidth - 64, cardHeight, 8, 8, 'F');
    
    // Main card with transparency
    this.pdf.setFillColor(255, 255, 255, 0.95);
    this.pdf.roundedRect(30, cardY, this.pageWidth - 60, cardHeight, 8, 8, 'F');
    
    // Card border with primary color
    this.pdf.setDrawColor(30, 64, 175);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(30, cardY, this.pageWidth - 60, cardHeight, 8, 8, 'S');
    
    // ROI header
    this.pdf.setTextColor(30, 64, 175);
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.addCenteredText('🎯 ROI IMPACT SUMMARY', cardY + 15);
    
    // Metrics in professional grid layout
    const metrics = [
      { label: 'Annual Value', value: roiMetrics.annualValue, icon: '💰' },
      { label: 'Hours Saved/Year', value: `${roiMetrics.annualHoursSaved}`, icon: '⏰' },
      { label: 'Efficiency Gain', value: roiMetrics.efficiencyGain, icon: '📈' },
      { label: 'Setup Timeline', value: roiMetrics.setupTime, icon: '🚀' }
    ];
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(55, 65, 81);
    
    const metricsPerRow = 2;
    const metricWidth = (this.pageWidth - 80) / metricsPerRow;
    
    metrics.forEach((metric, index) => {
      const col = index % metricsPerRow;
      const row = Math.floor(index / metricsPerRow);
      const x = 40 + (col * metricWidth);
      const y = cardY + 35 + (row * 20);
      
      // Icon and value
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`${metric.icon} ${metric.value}`, x + metricWidth/2, y, { align: 'center' });
      
      // Label
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(metric.label, x + metricWidth/2, y + 8, { align: 'center' });
    });
  }

  private addCoverFooter(): void {
    this.pdf.setTextColor(255, 255, 255, 0.8);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.addCenteredText(`Generated ${new Date().toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, this.pageHeight - 40);
    this.addCenteredText('🤖 Powered by Claude 4 Sonnet AI', this.pageHeight - 25);
  }

  private generateCodeExamples(codeExamples: any[]): void {
    this.addSectionHeader('💻 CODE EXAMPLES & INTEGRATION', this.selectedColors.primary);
    
    codeExamples.forEach((example, index) => {
      if (index > 0) this.yPosition += 20;
      
      // Code example header with language badge
      this.addSubSectionHeader(`${example.title}`);
      this.addLanguageBadge(example.language);
      
      // Description with enhanced styling
      this.addBodyText(example.description);
      this.yPosition += 5;
      
      // Code block with syntax highlighting simulation
      this.addAdvancedCodeBlock(example.code, example.language);
      
      // Explanation in highlight box
      this.yPosition += 10;
      this.addHighlightBox('💡 CODE EXPLANATION', example.explanation, this.selectedColors.warning);
    });
  }

  private addAdvancedCodeBlock(code: string, language: string): void {
    this.checkPageSpace(50);
    
    const codeHeight = Math.min(45, Math.max(35, code.split('\n').length * 4 + 15));
    
    // Code container with professional styling
    this.pdf.setFillColor(...this.hexToRgb(this.selectedColors.codeBackground));
    this.pdf.roundedRect(this.margin, this.yPosition - 5, this.contentWidth, codeHeight, 3, 3, 'F');
    
    // Code container border
    this.pdf.setDrawColor(...this.hexToRgb(this.selectedColors.border));
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(this.margin, this.yPosition - 5, this.contentWidth, codeHeight, 3, 3, 'S');
    
    // Language label with modern design
    this.pdf.setFillColor(...this.hexToRgb(this.selectedColors.primary));
    this.pdf.roundedRect(this.margin, this.yPosition - 5, 35, 10, 2, 2, 'F');
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(language.toUpperCase(), this.margin + 17.5, this.yPosition + 1, { align: 'center' });
    
    // Copy icon
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text('📋', this.pageWidth - this.margin - 10, this.yPosition + 1);
    
    // Code content with improved formatting
    this.pdf.setTextColor(...this.hexToRgb(this.selectedColors.text));
    this.pdf.setFontSize(9);
    this.pdf.setFont('courier', 'normal');
    
    const lines = code.split('\n');
    let codeY = this.yPosition + 12;
    
    lines.forEach((line, index) => {
      if (codeY > this.yPosition + codeHeight - 10) return; // Prevent overflow
      
      // Add line numbers for better readability
      this.pdf.setTextColor(150, 150, 150);
      this.pdf.text(`${index + 1}`.padStart(2, ' '), this.margin + 3, codeY);
      
      // Code content with syntax highlighting colors
      this.pdf.setTextColor(...this.getCodeColor(line, language));
      this.pdf.text(line, this.margin + 15, codeY);
      codeY += 4;
    });
    
    this.yPosition += codeHeight + 5;
  }

  private getCodeColor(line: string, language: string): [number, number, number] {
    // Simple syntax highlighting simulation
    if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
      return [108, 117, 125]; // Comments - gray
    } else if (line.includes('function') || line.includes('const') || line.includes('let')) {
      return [121, 85, 199]; // Keywords - purple
    } else if (line.includes('"') || line.includes("'")) {
      return [34, 139, 34]; // Strings - green
    } else if (line.includes('import') || line.includes('from')) {
      return [0, 100, 200]; // Imports - blue
    }
    return [31, 41, 55]; // Default text color
  }

  private addLanguageBadge(language: string): void {
    const badges: { [key: string]: { color: string, icon: string } } = {
      'javascript': { color: '#F7DF1E', icon: '🟨' },
      'typescript': { color: '#3178C6', icon: '🔷' },
      'python': { color: '#3776AB', icon: '🐍' },
      'java': { color: '#ED8B00', icon: '☕' },
      'go': { color: '#00ADD8', icon: '🐹' },
      'rust': { color: '#000000', icon: '🦀' }
    };
    
    const badge = badges[language.toLowerCase()] || { color: '#6B7280', icon: '📄' };
    
    this.pdf.setFillColor(...this.hexToRgb(badge.color));
    this.pdf.roundedRect(this.margin, this.yPosition - 8, 60, 12, 2, 2, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${badge.icon} ${language.toUpperCase()}`, this.margin + 30, this.yPosition - 2, { align: 'center' });
    
    this.yPosition += 8;
  }

  // Enhanced helper methods for superior UI/UX
  private addSectionHeader(title: string, color: string): void {
    this.checkPageSpace(30);
    
    // Section header with gradient effect
    const rgb = this.hexToRgb(color);
    this.pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
    this.pdf.rect(this.margin, this.yPosition - 3, this.contentWidth, 15, 'F');
    
    // Add subtle gradient effect
    this.pdf.setFillColor(rgb[0] + 20, rgb[1] + 20, rgb[2] + 20);
    this.pdf.rect(this.margin, this.yPosition - 3, this.contentWidth, 3, 'F');
    
    // Section header text with shadow effect
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin + 8, this.yPosition + 7);
    
    this.yPosition += 25;
  }

  private addSubSectionHeader(title: string): void {
    this.checkPageSpace(18);
    this.pdf.setTextColor(...this.hexToRgb(this.selectedColors.primary));
    this.pdf.setFontSize(13);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin, this.yPosition);
    
    // Add underline for better visual hierarchy
    const textWidth = this.pdf.getTextWidth(title);
    this.pdf.setDrawColor(...this.hexToRgb(this.selectedColors.primary));
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.margin, this.yPosition + 2, this.margin + textWidth, this.yPosition + 2);
    
    this.yPosition += 15;
  }

  private addHighlightBox(title: string, content: string, color: string): void {
    this.checkPageSpace(40);
    
    const lines = this.pdf.splitTextToSize(content, this.contentWidth - 20);
    const boxHeight = Math.max(35, lines.length * 5 + 20);
    
    // Box shadow for depth
    this.pdf.setFillColor(0, 0, 0, 0.05);
    this.pdf.roundedRect(this.margin + 1, this.yPosition - 2, this.contentWidth, boxHeight, 5, 5, 'F');
    
    // Box background with transparency
    const rgb = this.hexToRgb(color);
    this.pdf.setFillColor(rgb[0], rgb[1], rgb[2], 0.1);
    this.pdf.roundedRect(this.margin, this.yPosition - 3, this.contentWidth, boxHeight, 5, 5, 'F');
    
    // Box border with gradient effect
    this.pdf.setDrawColor(...rgb);
    this.pdf.setLineWidth(1.5);
    this.pdf.roundedRect(this.margin, this.yPosition - 3, this.contentWidth, boxHeight, 5, 5, 'S');
    
    // Title with icon
    this.pdf.setTextColor(...rgb);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin + 8, this.yPosition + 8);
    
    // Content with improved typography
    this.pdf.setTextColor(...this.hexToRgb(this.selectedColors.text));
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    
    let textY = this.yPosition + 18;
    lines.forEach((line: string) => {
      if (textY < this.yPosition + boxHeight - 5) {
        this.pdf.text(line, this.margin + 8, textY);
        textY += 5;
      }
    });
    
    this.yPosition += boxHeight + 8;
  }

  // Additional essential methods...
  private generateTableOfContents(): void {
    this.addSectionHeader('📋 TABLE OF CONTENTS', this.selectedColors.primary);
    
    const tocItems = [
      { title: '1. Executive Summary', page: 3, icon: '📊' },
      { title: '2. Technical Implementation', page: 4, icon: '🏗️' },
      { title: '3. Implementation Timeline', page: 5, icon: '📅' },
      { title: '4. Resource Requirements', page: 6, icon: '👥' },
      { title: '5. Code Examples', page: 7, icon: '💻' },
      { title: '6. Success Metrics', page: 8, icon: '🎯' },
      { title: '7. Risk Assessment', page: 9, icon: '⚠️' },
      { title: '8. Appendices', page: 10, icon: '📎' }
    ];
    
    this.yPosition += 15;
    
    tocItems.forEach(item => {
      this.checkPageSpace(18);
      
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(this.selectedColors.text);
      
      // Icon and title
      const titleText = `${item.icon} ${item.title}`;
      this.pdf.text(titleText, this.margin, this.yPosition);
      
      // Dotted line
      const titleWidth = this.pdf.getTextWidth(titleText);
      const pageNumWidth = this.pdf.getTextWidth(item.page.toString());
      const availableSpace = this.contentWidth - titleWidth - pageNumWidth - 10;
      const dotsCount = Math.floor(availableSpace / 3);
      const dots = '.'.repeat(dotsCount);
      
      this.pdf.setTextColor(this.selectedColors.lightText);
      this.pdf.text(dots, this.margin + titleWidth + 5, this.yPosition);
      
      // Page number
      this.pdf.setTextColor(this.selectedColors.primary);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(item.page.toString(), this.pageWidth - this.margin, this.yPosition, { align: 'right' });
      
      this.yPosition += 18;
    });
  }

  private generateExecutiveSummary(summary: any): void {
    this.addSectionHeader('📊 EXECUTIVE SUMMARY', this.selectedColors.primary);
    
    // AI-powered overview
    this.addHighlightBox(
      '🤖 AI AUTOMATION ASSESSMENT',
      summary.overview,
      this.selectedColors.secondary
    );
    
    // Key benefits with enhanced visual design
    this.yPosition += 15;
    this.addSubSectionHeader('🎯 Strategic Business Benefits');
    
    const benefitIcons = ['💰', '⚡', '📈', '🎯', '🔧', '📊', '✅'];
    summary.keyBenefits.forEach((benefit: string, index: number) => {
      this.checkPageSpace(15);
      const icon = benefitIcons[index] || '•';
      this.addEnhancedBulletPoint(`${icon} ${benefit}`);
    });
    
    // ROI Analysis with professional cards
    this.yPosition += 20;
    this.addSubSectionHeader('💹 Return on Investment Analysis');
    this.createAdvancedMetricsCards(summary.roiMetrics);
  }

  private createAdvancedMetricsCards(metrics: any): void {
    const cardData = [
      { label: 'Annual Hours Saved', value: `${metrics.annualHoursSaved}`, unit: 'hours', color: this.selectedColors.secondary, icon: '⏰' },
      { label: 'Annual Value', value: metrics.annualValue, unit: '', color: this.selectedColors.primary, icon: '💰' },
      { label: 'Efficiency Gain', value: metrics.efficiencyGain, unit: '', color: this.selectedColors.accent, icon: '📈' },
      { label: 'Setup Time', value: metrics.setupTime, unit: '', color: this.selectedColors.warning, icon: '🚀' }
    ];
    
    const cardWidth = (this.contentWidth - 15) / 2;
    const cardHeight = 30;
    
    cardData.forEach((card, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = this.margin + (col * (cardWidth + 5));
      const y = this.yPosition + (row * (cardHeight + 8));
      
      // Card shadow
      this.pdf.setFillColor(0, 0, 0, 0.05);
      this.pdf.roundedRect(x + 1, y + 1, cardWidth, cardHeight, 4, 4, 'F');
      
      // Card background with gradient effect
      const rgb = this.hexToRgb(card.color);
      this.pdf.setFillColor(rgb[0], rgb[1], rgb[2], 0.1);
      this.pdf.roundedRect(x, y, cardWidth, cardHeight, 4, 4, 'F');
      
      // Card border
      this.pdf.setDrawColor(...rgb);
      this.pdf.setLineWidth(0.8);
      this.pdf.roundedRect(x, y, cardWidth, cardHeight, 4, 4, 'S');
      
      // Icon
      this.pdf.setFontSize(16);
      this.pdf.text(card.icon, x + 8, y + 12);
      
      // Value with enhanced typography
      this.pdf.setTextColor(...rgb);
      this.pdf.setFontSize(18);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`${card.value} ${card.unit}`, x + cardWidth/2, y + 12, { align: 'center' });
      
      // Label
      this.pdf.setTextColor(...this.hexToRgb(this.selectedColors.text));
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(card.label, x + cardWidth/2, y + 22, { align: 'center' });
    });
    
    this.yPosition += (Math.ceil(cardData.length / 2) * (cardHeight + 8)) + 15;
  }

  // Additional helper methods...
  private addBodyText(text: string): void {
    this.pdf.setTextColor(...this.hexToRgb(this.selectedColors.text));
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    
    const lines = this.pdf.splitTextToSize(text, this.contentWidth);
    lines.forEach((line: string) => {
      this.checkPageSpace(7);
      this.pdf.text(line, this.margin, this.yPosition);
      this.yPosition += 7;
    });
  }

  private addEnhancedBulletPoint(text: string): void {
    this.pdf.setTextColor(...this.hexToRgb(this.selectedColors.text));
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    
    const lines = this.pdf.splitTextToSize(text, this.contentWidth - 15);
    lines.forEach((line: string, index: number) => {
      this.checkPageSpace(8);
      this.pdf.text(line, this.margin + (index === 0 ? 0 : 15), this.yPosition);
      this.yPosition += 8;
    });
  }

  private addCenteredText(text: string, y?: number): void {
    if (y) this.yPosition = y;
    this.pdf.text(text, this.pageWidth / 2, this.yPosition, { align: 'center' });
  }

  private checkPageSpace(requiredSpace: number): void {
    if (this.yPosition + requiredSpace > this.pageHeight - this.margin) {
      this.addNewPage();
    }
  }

  private addNewPage(): void {
    this.pdf.addPage();
    this.yPosition = this.margin;
    this.currentPage++;
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }

  // Placeholder methods for additional sections (to be implemented)
  private generateTechnicalSpecification(techSpec: any): void {
    this.addSectionHeader('🏗️ TECHNICAL IMPLEMENTATION', this.selectedColors.primary);
    this.addBodyText('AI-generated technical specifications will be implemented here...');
  }

  private generateImplementationPlan(plan: any): void {
    this.addSectionHeader('📅 IMPLEMENTATION TIMELINE', this.selectedColors.primary);
    this.addBodyText('AI-generated implementation plan will be implemented here...');
  }

  private generateResourceRequirements(requirements: any): void {
    this.addSectionHeader('👥 RESOURCE REQUIREMENTS', this.selectedColors.primary);
    this.addBodyText('AI-generated resource requirements will be implemented here...');
  }

  private generateSuccessMetrics(metrics: any): void {
    this.addSectionHeader('🎯 SUCCESS METRICS & KPIs', this.selectedColors.primary);
    this.addBodyText('AI-generated success metrics will be implemented here...');
  }

  private generateRiskAssessment(assessment: any): void {
    this.addSectionHeader('⚠️ RISK ASSESSMENT & MITIGATION', this.selectedColors.primary);
    this.addBodyText('AI-generated risk assessment will be implemented here...');
  }

  private generateAppendices(): void {
    this.addSectionHeader('📎 APPENDICES & REFERENCES', this.selectedColors.primary);
    this.addBodyText('Additional documentation and references...');
  }

  private addPageNumbersAndFooters(): void {
    const totalPages = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);
      
      if (i > 1) { // Skip page numbers on cover
        this.pdf.setTextColor(...this.hexToRgb(this.selectedColors.lightText));
        this.pdf.setFontSize(10);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.text(`Page ${i} of ${totalPages}`, this.pageWidth - this.margin, this.pageHeight - 10, { align: 'right' });
        this.pdf.text('🤖 AI-Generated Implementation Guide | Confidential', this.margin, this.pageHeight - 10);
      }
    }
  }
}

export const advancedPdfGenerator = new AdvancedPDFGenerator(); 