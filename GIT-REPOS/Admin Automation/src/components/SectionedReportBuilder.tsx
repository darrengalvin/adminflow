import React, { useState, useEffect } from 'react';
import { industryTemplates, IndustryTemplate, ReportSection, getSectionsByCategory } from '../data/industryTemplates';
import { PDFCompiler } from '../services/pdfCompiler';
import { ReportHistoryService } from '../services/reportHistoryService';

interface SectionProgress {
  id: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  content?: string;
  progress: number;
}

export const SectionedReportBuilder: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryTemplate | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sectionProgress, setSectionProgress] = useState<Record<string, SectionProgress>>({});
  const [currentlyGenerating, setCurrentlyGenerating] = useState<string | null>(null);
  const [pdfCompiler] = useState(() => new PDFCompiler());
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);

  const handleIndustrySelect = (template: IndustryTemplate) => {
    setSelectedIndustry(template);
    // Auto-select high priority sections
    const highPrioritySections = template.sections
      .filter(s => s.priority === 'high')
      .map(s => s.id);
    setSelectedSections(highPrioritySections);
  };

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const startGeneration = async () => {
    if (!selectedIndustry) return;
    
    setIsGenerating(true);
    
    // Create pending report entry immediately in history
    const reportId = ReportHistoryService.createPendingReport(`${selectedIndustry.name} - Sectioned Report`);
    setCurrentReportId(reportId);
    console.log('📚 Created pending sectioned report in history with ID:', reportId);
    
    // Initialize progress for all selected sections
    const initialProgress: Record<string, SectionProgress> = {};
    selectedSections.forEach(sectionId => {
      initialProgress[sectionId] = {
        id: sectionId,
        status: 'pending',
        progress: 0
      };
    });
    setSectionProgress(initialProgress);

    // Generate sections in batches of 2-3
    const batchSize = 2;
    const sections = selectedIndustry.sections.filter(s => selectedSections.includes(s.id));
    
    try {
      for (let i = 0; i < sections.length; i += batchSize) {
        const batch = sections.slice(i, i + batchSize);
        
        // Update overall progress in history
        const overallProgress = Math.round((i / sections.length) * 100);
        ReportHistoryService.updateReportProgress(
          reportId, 
          overallProgress, 
          `Generating sections ${i + 1}-${Math.min(i + batchSize, sections.length)} of ${sections.length}...`,
          'generating'
        );
        
        // Generate batch in parallel
        await Promise.all(
          batch.map(section => generateSection(section))
        );
      }

      // Always save the report, even with partial completion
      const completedSections = Object.values(sectionProgress).filter(s => s.status === 'completed');
      const totalSections = selectedSections.length;
      const failedSections = Object.values(sectionProgress).filter(s => s.status === 'error');
      
      // Create report with current progress (completed + failed sections)
      const mockReport = {
        content: { sections: sectionProgress },
        metadata: {
          title: `${selectedIndustry.name} Implementation Report`,
          isRealAI: true,
          generatedAt: new Date().toISOString(),
          sectionsGenerated: completedSections.length,
          totalSections: totalSections,
          failedSections: failedSections.length,
          isPartiallyComplete: failedSections.length > 0
        }
      };
      
      if (completedSections.length === totalSections) {
        // All sections completed successfully
        ReportHistoryService.completeReport(reportId, mockReport as any);
        console.log('📚 Sectioned report completed successfully in history with ID:', reportId);
      } else if (completedSections.length > 0) {
        // Partial completion - save what we have
        ReportHistoryService.completeReport(reportId, mockReport as any);
        ReportHistoryService.updateReportProgress(
          reportId, 
          100, 
          `Partial completion: ${completedSections.length}/${totalSections} sections generated`,
          'generated'
        );
        console.log(`📚 Partial sectioned report saved: ${completedSections.length}/${totalSections} sections completed`);
      } else {
        // Complete failure - no sections completed
        ReportHistoryService.markReportFailed(
          reportId, 
          `All ${totalSections} sections failed to generate`
        );
      }
    } catch (error) {
      // Generation failed entirely
      ReportHistoryService.markReportFailed(reportId, error.message || 'Section generation failed');
    }

    setIsGenerating(false);
    setCurrentlyGenerating(null);
  };

  const generateSection = async (section: ReportSection, retryCount = 0): Promise<void> => {
    const maxRetries = 2;
    setCurrentlyGenerating(section.id);
    
    // Update status to generating
    setSectionProgress(prev => ({
      ...prev,
      [section.id]: { ...prev[section.id], status: 'generating', progress: 10 }
    }));

    try {
      // Progress updates during API call
      const progressInterval = setInterval(() => {
        setSectionProgress(prev => {
          const currentProgress = prev[section.id]?.progress || 10;
          if (currentProgress < 80) {
            return {
              ...prev,
              [section.id]: { ...prev[section.id], progress: currentProgress + 10 }
            };
          }
          return prev;
        });
      }, 3000); // Slower progress updates

      // Call the section API
      const response = await fetch('/api/claude-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          industry: selectedIndustry,
          userDetails: {
            company: 'Professional Organization',
            role: 'Business Leader',
            goals: 'Operational Excellence',
            challenges: 'Manual Processes'
          }
        })
      });
      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.content) {
        throw new Error('Invalid response from API');
      }

      // Add section to PDF compiler
      pdfCompiler.addSection(section, data.content);

      setSectionProgress(prev => ({
        ...prev,
        [section.id]: { 
          ...prev[section.id], 
          status: 'completed', 
          progress: 100,
          content: data.content
        }
      }));

    } catch (error) {
      console.error(`Error generating section ${section.title} (attempt ${retryCount + 1}):`, error);
      
      // Retry logic for server errors
      if (retryCount < maxRetries && (
        error.message.includes('504') || 
        error.message.includes('500') || 
        error.name === 'AbortError' ||
        error.message.includes('API call failed')
      )) {
        console.log(`Retrying section ${section.title} in 5 seconds... (attempt ${retryCount + 2}/${maxRetries + 1})`);
        setSectionProgress(prev => ({
          ...prev,
          [section.id]: { ...prev[section.id], status: 'pending', progress: 0 }
        }));
        
        setTimeout(() => {
          generateSection(section, retryCount + 1);
        }, 5000); // Longer delay between retries
      } else {
        setSectionProgress(prev => ({
          ...prev,
          [section.id]: { ...prev[section.id], status: 'error', progress: 0 }
        }));
      }
    }
  };

  const retryFailedSections = async () => {
    if (!selectedIndustry || !currentReportId) return;
    
    const failedSections = Object.entries(sectionProgress)
      .filter(([_, progress]) => progress.status === 'error')
      .map(([sectionId]) => selectedIndustry.sections.find(s => s.id === sectionId))
      .filter(Boolean);
    
    if (failedSections.length === 0) {
      alert('No failed sections to retry.');
      return;
    }
    
    console.log(`🔄 Retrying ${failedSections.length} failed sections...`);
    
    // Update report status back to generating
    ReportHistoryService.updateReportProgress(
      currentReportId,
      Math.round((Object.values(sectionProgress).filter(s => s.status === 'completed').length / selectedSections.length) * 100),
      `Retrying ${failedSections.length} failed sections...`,
      'generating'
    );
    
    // Reset failed sections to pending
    const updatedProgress = { ...sectionProgress };
    failedSections.forEach(section => {
      if (section) {
        updatedProgress[section.id] = {
          ...updatedProgress[section.id],
          status: 'pending',
          progress: 0
        };
      }
    });
    setSectionProgress(updatedProgress);
    
    // Retry failed sections
    try {
      await Promise.all(
        failedSections.map(section => section && generateSection(section))
      );
      
      // Update final status
      const newCompletedSections = Object.values(sectionProgress).filter(s => s.status === 'completed');
      const newFailedSections = Object.values(sectionProgress).filter(s => s.status === 'error');
      
      if (newFailedSections.length === 0) {
        // All sections now completed
        ReportHistoryService.updateReportProgress(
          currentReportId,
          100,
          'All sections completed successfully!',
          'generated'
        );
      } else {
        // Still some failures
        ReportHistoryService.updateReportProgress(
          currentReportId,
          100,
          `Retry completed: ${newCompletedSections.length}/${selectedSections.length} sections generated`,
          'generated'
        );
      }
    } catch (error) {
      console.error('❌ Retry failed:', error);
    }
  };

  const compilePDF = () => {
    if (!selectedIndustry) return;
    
    console.log('🔄 Compiling PDF from sections:', sectionProgress);
    
    // Check if we have completed sections
    const completedSections = Object.values(sectionProgress).filter(s => s.status === 'completed');
    if (completedSections.length === 0) {
      alert('No completed sections to compile. Please wait for sections to finish generating.');
      return;
    }
    
    try {
      const compiledHTML = pdfCompiler.compileToPDF(
        selectedIndustry.name,
        sectionProgress
      );
      
      console.log('✅ PDF compilation completed');
      
      // Show success message
      alert(`Successfully compiled ${completedSections.length} sections into PDF! The report has opened in a new window for printing.`);
    } catch (error) {
      console.error('❌ PDF compilation failed:', error);
      alert('PDF compilation failed. Please try again.');
    }
  };

  const getStatusColor = (status: SectionProgress['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-200';
      case 'generating': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-200';
    }
  };

  const getStatusIcon = (status: SectionProgress['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'generating': return '🔄';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const totalProgress = selectedSections.length > 0 
    ? Object.values(sectionProgress).reduce((sum, section) => sum + section.progress, 0) / selectedSections.length
    : 0;

  const completedSections = Object.values(sectionProgress).filter(s => s.status === 'completed').length;
  const failedSections = Object.values(sectionProgress).filter(s => s.status === 'error').length;
  const generatingSections = Object.values(sectionProgress).filter(s => s.status === 'generating').length;
  const allCompleted = completedSections === selectedSections.length && selectedSections.length > 0;
  const hasFailures = failedSections > 0;
  const hasCompletedSections = completedSections > 0;

  if (!selectedIndustry) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏗️ Professional Report Builder
          </h1>
          <p className="text-xl text-gray-600">
            Generate comprehensive industry reports section by section
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {industryTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleIndustrySelect(template)}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-500"
            >
              <div className="text-4xl mb-4 text-center">{template.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {template.name}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {template.description}
              </p>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Estimated Pages</div>
                <div className="text-2xl font-bold text-blue-600">
                  {template.estimatedTotalPages}
                </div>
                <div className="text-sm text-gray-500">
                  {template.sections.length} sections
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const categories = getSectionsByCategory(selectedIndustry);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedIndustry(null)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Industries
            </button>
            <div className="text-3xl">{selectedIndustry.icon}</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedIndustry.name} Report
              </h1>
              <p className="text-gray-600">{selectedIndustry.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Selected Sections</div>
            <div className="text-2xl font-bold text-blue-600">
              {selectedSections.length} / {selectedIndustry.sections.length}
            </div>
            <div className="text-sm text-gray-500">
              ~{selectedIndustry.sections
                .filter(s => selectedSections.includes(s.id))
                .reduce((sum, s) => sum + s.estimatedPages, 0)} pages
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      {isGenerating && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Generation Progress</h2>
            <div className="text-sm text-gray-600">
              {completedSections} / {selectedSections.length} completed
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {selectedSections.map(sectionId => {
               const section = selectedIndustry.sections.find(s => s.id === sectionId);
               const progress = sectionProgress[sectionId];
               if (!section || !progress) return null;

               return (
                 <div
                   key={sectionId}
                   className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                     currentlyGenerating === sectionId ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                   }`}
                 >
                   <div className={`w-full h-20 rounded-lg ${getStatusColor(progress.status)} flex items-center justify-center text-white font-bold mb-3`}>
                     <span className="text-3xl">{getStatusIcon(progress.status)}</span>
                   </div>
                   <div className="text-sm font-bold text-gray-900 mb-2">
                     {section.title}
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                     <div 
                       className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                       style={{ width: `${progress.progress}%` }}
                     ></div>
                   </div>
                   
                   {/* Content Preview */}
                   {progress.status === 'completed' && progress.content && (
                     <div className="bg-green-50 rounded-md p-3 border border-green-200">
                       <div className="flex items-center justify-between mb-2">
                         <div className="text-xs font-medium text-green-800">✅ Content Generated</div>
                         <button
                           onClick={() => {
                             const newWindow = window.open('', '_blank');
                             if (newWindow) {
                               newWindow.document.write(`
                                 <!DOCTYPE html>
                                 <html>
                                 <head>
                                   <title>${section.title} - Preview</title>
                                   <meta charset="UTF-8">
                                 </head>
                                 <body style="margin: 20px;">
                                   ${progress.content}
                                 </body>
                                 </html>
                               `);
                               newWindow.document.close();
                             }
                           }}
                           className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                         >
                           Full Preview
                         </button>
                       </div>
                       <div className="bg-white rounded p-2 border border-green-300 max-h-48 overflow-y-auto">
                         <div 
                           className="text-xs"
                           dangerouslySetInnerHTML={{
                             __html: progress.content
                           }}
                         />
                       </div>
                       <div className="text-xs text-green-600 mt-1">
                         {progress.content.length} characters • Click "Full Preview" to see complete design
                       </div>
                     </div>
                   )}
                   
                   {progress.status === 'error' && (
                     <div className="bg-red-50 rounded-md p-3 border border-red-200">
                       <div className="text-xs font-medium text-red-800 mb-2">Generation Failed</div>
                       <div className="text-xs text-red-700 mb-2">
                         API timeout - click to retry
                       </div>
                       <button
                         onClick={() => generateSection(section)}
                         className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                       >
                         Retry Now
                       </button>
                     </div>
                   )}
                   
                   {progress.status === 'generating' && (
                     <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
                       <div className="text-xs font-medium text-blue-800 mb-1">Generating...</div>
                       <div className="text-xs text-blue-700">
                         Creating {section.category} content
                       </div>
                     </div>
                   )}
                 </div>
               );
             })}
          </div>
        </div>
      )}

      {/* Section Selection */}
      {!isGenerating && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {Object.entries(categories).map(([categoryName, sections]) => (
            <div key={categoryName} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 capitalize">
                {categoryName} Sections
              </h3>
              <div className="space-y-3">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedSections.includes(section.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{section.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            section.priority === 'high' ? 'bg-red-100 text-red-800' :
                            section.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {section.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          ~{section.estimatedPages} pages
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 mt-2 ${
                          selectedSections.includes(section.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedSections.includes(section.id) && (
                            <div className="text-white text-center text-sm">✓</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {isGenerating ? 'Generation in Progress' : 
               allCompleted ? 'Generation Complete!' :
               hasFailures ? 'Generation Completed with Issues' :
               hasCompletedSections ? 'Partial Generation Complete' :
               'Ready to Generate?'}
            </h3>
            <p className="text-gray-600">
              {selectedSections.length} sections selected • 
              ~{selectedIndustry.sections
                .filter(s => selectedSections.includes(s.id))
                .reduce((sum, s) => sum + s.estimatedPages, 0)} pages total
              {hasCompletedSections && (
                <> • {completedSections} completed{hasFailures && `, ${failedSections} failed`}</>
              )}
            </p>
            {hasFailures && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm font-medium">
                  ⚠️ {failedSections} section{failedSections > 1 ? 's' : ''} failed to generate. 
                  You can retry failed sections or compile the report with completed sections only.
                </p>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            {!isGenerating && !allCompleted && !hasCompletedSections && (
              <button
                onClick={startGeneration}
                disabled={selectedSections.length === 0}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                🚀 Start Generation
              </button>
            )}
            
            {hasFailures && !isGenerating && (
              <button
                onClick={retryFailedSections}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                🔄 Retry Failed Sections
              </button>
            )}
            
            {hasCompletedSections && !isGenerating && (
              <button
                onClick={compilePDF}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                📄 Compile PDF ({completedSections} sections)
              </button>
            )}
            
            {!isGenerating && hasCompletedSections && (
              <button
                onClick={() => {
                  // Reset and start fresh
                  setSectionProgress({});
                  setCurrentReportId(null);
                  setCurrentlyGenerating(null);
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                🔄 Start Fresh
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 