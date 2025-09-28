import { ReportSection } from '../data/industryTemplates';

interface SectionContent {
  section: ReportSection;
  content: string;
  generatedAt: string;
}

export class PDFCompiler {
  private sections: SectionContent[] = [];

  addSection(section: ReportSection, content: string) {
    this.sections.push({
      section,
      content,
      generatedAt: new Date().toISOString()
    });
  }

  compileToPDF(industryName: string, sections: Record<string, any>) {
    // Sort sections by category priority and then by individual priority
    const categoryOrder = ['executive', 'analysis', 'implementation', 'technical', 'financial'];
    const priorityOrder = ['high', 'medium', 'low'];

    const sortedSections = Object.entries(sections)
      .filter(([_, sectionData]) => sectionData.status === 'completed' && sectionData.content)
      .sort(([a], [b]) => {
        const sectionA = this.sections.find(s => s.section.id === a)?.section;
        const sectionB = this.sections.find(s => s.section.id === b)?.section;
        
        if (!sectionA || !sectionB) return 0;

        // First sort by category
        const categoryCompare = categoryOrder.indexOf(sectionA.category) - categoryOrder.indexOf(sectionB.category);
        if (categoryCompare !== 0) return categoryCompare;

        // Then by priority within category
        return priorityOrder.indexOf(sectionA.priority) - priorityOrder.indexOf(sectionB.priority);
      });

    // Create comprehensive HTML document
    const compiledHTML = this.createCompiledDocument(industryName, sortedSections, sections);

    // Open in new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(compiledHTML);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    }

    return compiledHTML;
  }

  private createCompiledDocument(industryName: string, sortedSections: [string, any][], sections: Record<string, any>): string {
    const totalPages = sortedSections.reduce((sum, [sectionId]) => {
      const section = this.sections.find(s => s.section.id === sectionId)?.section;
      return sum + (section?.estimatedPages || 0);
    }, 0);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${industryName} - Comprehensive Automation Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        /* Print-optimized styles */
        @media print {
            body { margin: 0; }
            .page-break { page-break-before: always; }
            .no-print { display: none; }
            @page { margin: 1in; size: letter; }
        }

        /* Base styles */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 20px;
        }

        .report-header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 30px;
            margin-bottom: 40px;
        }

        .report-title {
            font-size: 2.5em;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }

        .report-subtitle {
            font-size: 1.2em;
            color: #64748b;
            margin-bottom: 20px;
        }

        .report-meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.9em;
            color: #6b7280;
        }

        .table-of-contents {
            background: #f8fafc;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 40px;
            page-break-after: always;
        }

        .toc-title {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 20px;
            color: #1e40af;
        }

        .toc-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dotted #d1d5db;
        }

        .section-content {
            margin-bottom: 40px;
        }

        .section-header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 1.8em;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .section-description {
            opacity: 0.9;
            font-size: 1.1em;
        }

        /* Ensure proper spacing between sections */
        .section-content:not(:last-child) {
            page-break-after: always;
        }

        /* Chart containers */
        .chart-container {
            margin: 20px 0;
            text-align: center;
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        th, td {
            border: 1px solid #d1d5db;
            padding: 12px;
            text-align: left;
        }

        th {
            background: #f3f4f6;
            font-weight: bold;
        }

        /* Lists */
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }

        li {
            margin-bottom: 8px;
        }

        /* Highlights */
        .highlight {
            background: #fef3c7;
            padding: 15px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
        }

        .success {
            background: #d1fae5;
            border-left-color: #10b981;
        }

        .warning {
            background: #fee2e2;
            border-left-color: #ef4444;
        }
    </style>
</head>
<body>
    <!-- Report Header -->
    <div class="report-header">
        <h1 class="report-title">${industryName}</h1>
        <h2 class="report-subtitle">Comprehensive Business Automation Report</h2>
        <div class="report-meta">
            <span>Generated: ${new Date().toLocaleDateString()}</span>
            <span>Sections: ${sortedSections.length}</span>
            <span>Estimated Pages: ${totalPages}</span>
        </div>
    </div>

    <!-- Table of Contents -->
    <div class="table-of-contents">
        <h2 class="toc-title">📋 Table of Contents</h2>
        ${sortedSections.map(([sectionId], index) => {
          const section = this.sections.find(s => s.section.id === sectionId)?.section;
          if (!section) return '';
          return `
            <div class="toc-item">
                <span>${index + 1}. ${section.title}</span>
                <span>~${section.estimatedPages} pages</span>
            </div>
          `;
        }).join('')}
    </div>

    <!-- Report Sections -->
    ${sortedSections.map(([sectionId, sectionData], index) => {
      const section = this.sections.find(s => s.section.id === sectionId)?.section;
      if (!section) return '';
      
      return `
        <div class="section-content">
            <div class="section-header">
                <div class="section-title">${index + 1}. ${section.title}</div>
                <div class="section-description">${section.description}</div>
            </div>
            <div class="section-body">
                ${sectionData.content}
            </div>
        </div>
      `;
    }).join('')}

    <!-- Footer -->
    <div style="margin-top: 60px; padding-top: 30px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280;">
        <p><strong>${industryName} Automation Report</strong></p>
        <p>Generated by AdminFlow Professional Report Builder • ${new Date().toLocaleDateString()}</p>
        <p>This report contains ${sortedSections.length} comprehensive sections with actionable recommendations.</p>
    </div>

    <script>
        // Initialize any charts after page load
        window.onload = function() {
            // Charts will be initialized by the embedded Chart.js code in each section
            console.log('Report compiled successfully with ${sortedSections.length} sections');
        };
    </script>
</body>
</html>`;
  }
} 