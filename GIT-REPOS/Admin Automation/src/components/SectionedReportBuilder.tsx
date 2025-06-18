import React, { useState, useEffect } from 'react';
import { industryTemplates, IndustryTemplate, ReportSection, getSectionsByCategory } from '../data/industryTemplates';
import { PDFCompiler } from '../services/pdfCompiler';
import { ReportHistoryService } from '../services/reportHistoryService';
import { generateAndDownloadPDF } from './PDFGenerator';
import { claudeService } from '../services/claudeService';

interface SectionProgress {
  id: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  content?: string;
  pdfData?: any; // Structured data for PDF generation
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

  // Check for restoration data on component mount
  useEffect(() => {
    const restoreData = localStorage.getItem('restoreSectionedReport');
    if (restoreData) {
      try {
        const parsed = JSON.parse(restoreData);
        
        // Check if restoration data is recent (within 1 hour)
        const isRecent = Date.now() - parsed.timestamp < 3600000;
        
        if (isRecent && parsed.selectedIndustry) {
          console.log('🔄 Restoring sectioned report state:', parsed);
          
          // Find the industry template
          const industry = industryTemplates.find(t => t.id === parsed.selectedIndustry.id);
          if (industry) {
            setSelectedIndustry(industry);
            setSelectedSections(parsed.selectedSections || []);
            setCurrentReportId(parsed.reportId);
            
            // Restore section progress if available
            if (parsed.sectionProgress) {
              setSectionProgress(parsed.sectionProgress);
            }
            
            // Show restoration message
            setTimeout(() => {
              alert(`Restored report: "${parsed.workflowName}"\nYou can now retry failed sections or compile the partial report.`);
            }, 500);
          }
        }
        
        // Clean up restoration data
        localStorage.removeItem('restoreSectionedReport');
      } catch (error) {
        console.error('Failed to restore sectioned report:', error);
        localStorage.removeItem('restoreSectionedReport');
      }
    }
  }, []);

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
    if (selectedSections.length === 0) {
      alert('Please select at least one section to generate.');
      return;
    }

    setIsGenerating(true);
    
    // Create a pending report in history
    const reportId = ReportHistoryService.createPendingSectionedReport(
      `${selectedIndustry.name} - Sectioned Report`,
      selectedIndustry,
      selectedSections
    );
    setCurrentReportId(reportId);
    
    // Initialize section progress
    const initialProgress: Record<string, SectionProgress> = {};
    selectedSections.forEach(sectionId => {
      initialProgress[sectionId] = {
        id: sectionId,
        status: 'pending',
        progress: 0
      };
    });
    setSectionProgress(initialProgress);
    
    // Update initial metadata
    ReportHistoryService.updateSectionedReportMetadata(reportId, initialProgress);
    
    // Update to generating status
    ReportHistoryService.updateReportProgress(
      reportId,
      10,
      'Starting section generation...',
      'generating'
    );

    console.log('📚 Created pending sectioned report in history with ID:', reportId);

    try {
      // Generate sections in parallel batches to avoid overwhelming the API
      const sectionsToGenerate = selectedIndustry.sections.filter(s => selectedSections.includes(s.id));
      const batchSize = 3; // Process 3 sections at a time
      
      for (let i = 0; i < sectionsToGenerate.length; i += batchSize) {
        const batch = sectionsToGenerate.slice(i, i + batchSize);
        console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}: ${batch.map(s => s.title).join(', ')}`);
        
        // Process batch in parallel
        await Promise.all(
          batch.map(section => generateSection(section))
        );
        
        // Update progress after each batch
        const completedSoFar = i + batch.length;
        const progressPercent = Math.round((completedSoFar / sectionsToGenerate.length) * 90); // Leave 10% for finalization
        
        ReportHistoryService.updateReportProgress(
          reportId,
          progressPercent,
          `Generated ${completedSoFar}/${sectionsToGenerate.length} sections...`,
          'generating'
        );
      }
      
      console.log('📊 All batches completed, sections should be finalizing automatically...');
      
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

      // Add section to PDF compiler (using HTML content for legacy compatibility)
      pdfCompiler.addSection(section, data.htmlContent || data.content);

      setSectionProgress(prev => {
        const newProgress = {
          ...prev,
          [section.id]: { 
            ...prev[section.id], 
            status: 'completed', 
            progress: 100,
            content: data.htmlContent || data.content, // HTML for web display
            pdfData: data.pdfData, // Structured data for PDF
            title: data.pdfData?.title || section.title // Use AI-generated title if available
          }
        };
        
        // Update metadata in history
        if (currentReportId) {
          ReportHistoryService.updateSectionedReportMetadata(currentReportId, newProgress);
          
          // Check if this was the last section to complete
          const completedCount = Object.values(newProgress).filter(s => s.status === 'completed').length;
          const errorCount = Object.values(newProgress).filter(s => s.status === 'error').length;
          const totalSections = selectedSections.length;
          
          console.log(`📊 Section ${section.title} completed. Status: ${completedCount + errorCount}/${totalSections} sections done`);
          
          // If all sections are done, trigger final report completion
          if (completedCount + errorCount === totalSections) {
            console.log('🎯 All sections completed! Triggering final report completion...');
            setTimeout(() => {
              // Transform sections data for proper storage
              const sectionsData = Object.fromEntries(
                Object.entries(newProgress)
                  .filter(([_, sectionData]) => sectionData.status === 'completed')
                  .map(([sectionId, sectionData]) => [
                    sectionId,
                    {
                      id: sectionId,
                      title: sectionData.title || sectionId,
                      content: sectionData.content,
                      pdfData: sectionData.pdfData,
                      status: sectionData.status,
                      progress: sectionData.progress
                    }
                  ])
              );

              const mockReport = {
                content: { sections: sectionsData },
                metadata: {
                  title: `${selectedIndustry.name} Implementation Report`,
                  isRealAI: true,
                  generatedAt: new Date().toISOString(),
                  sectionsGenerated: completedCount,
                  totalSections: totalSections,
                  failedSections: errorCount,
                  isPartiallyComplete: errorCount > 0,
                  hasStructuredPdfData: Object.values(sectionsData).some(s => s.pdfData)
                }
              };
              
              if (completedCount === totalSections) {
                ReportHistoryService.completeReport(currentReportId, mockReport as any);
                console.log('🎉 Perfect completion - all sections generated!');
              } else if (completedCount > 0) {
                ReportHistoryService.completeReport(currentReportId, mockReport as any);
                ReportHistoryService.updateReportProgress(
                  currentReportId, 
                  100, 
                  `Generated ${completedCount}/${totalSections} sections`,
                  'generated'
                );
                console.log(`✅ Partial completion - ${completedCount}/${totalSections} sections generated`);
              }
            }, 500); // Small delay to ensure state updates
          }
        }
        
        return newProgress;
      });

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
        setSectionProgress(prev => {
          const newProgress = {
            ...prev,
            [section.id]: { ...prev[section.id], status: 'pending', progress: 0 }
          };
          
          // Update metadata in history
          if (currentReportId) {
            ReportHistoryService.updateSectionedReportMetadata(currentReportId, newProgress);
          }
          
          return newProgress;
        });
        
        setTimeout(() => {
          generateSection(section, retryCount + 1);
        }, 5000); // Longer delay between retries
      } else {
        setSectionProgress(prev => {
          const newProgress = {
            ...prev,
            [section.id]: { ...prev[section.id], status: 'error', progress: 0 }
          };
          
          // Update metadata in history
          if (currentReportId) {
            ReportHistoryService.updateSectionedReportMetadata(currentReportId, newProgress);
            
            // Check if this was the last section to complete (including errors)
            const completedCount = Object.values(newProgress).filter(s => s.status === 'completed').length;
            const errorCount = Object.values(newProgress).filter(s => s.status === 'error').length;
            const totalSections = selectedSections.length;
            
            console.log(`❌ Section ${section.title} failed. Status: ${completedCount + errorCount}/${totalSections} sections done`);
            
            // If all sections are done, trigger final report completion
            if (completedCount + errorCount === totalSections) {
              console.log('🎯 All sections completed (with some failures)! Triggering final report completion...');
              setTimeout(() => {
                const mockReport = {
                  content: { sections: newProgress },
                  metadata: {
                    title: `${selectedIndustry.name} Implementation Report`,
                    isRealAI: true,
                    generatedAt: new Date().toISOString(),
                    sectionsGenerated: completedCount,
                    totalSections: totalSections,
                    failedSections: errorCount,
                    isPartiallyComplete: errorCount > 0
                  }
                };
                
                if (completedCount === totalSections) {
                  ReportHistoryService.completeReport(currentReportId, mockReport as any);
                  console.log('🎉 Perfect completion - all sections generated!');
                } else if (completedCount > 0) {
                  ReportHistoryService.completeReport(currentReportId, mockReport as any);
                  ReportHistoryService.updateReportProgress(
                    currentReportId, 
                    100, 
                    `Generated ${completedCount}/${totalSections} sections`,
                    'generated'
                  );
                  console.log(`✅ Partial completion - ${completedCount}/${totalSections} sections generated`);
                } else {
                  ReportHistoryService.markReportFailed(
                    currentReportId, 
                    `All ${totalSections} sections failed to generate`
                  );
                  console.log('❌ Complete failure - all sections failed');
                }
              }, 500); // Small delay to ensure state updates
            }
          }
          
          return newProgress;
        });
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

  const compilePDF = async () => {
    if (!selectedIndustry) return;
    
    console.log('🔄 Compiling professional PDF from sections:', sectionProgress);
    
    // Check if we have completed sections
    const completedSections = Object.values(sectionProgress).filter(s => s.status === 'completed');
    if (completedSections.length === 0) {
      alert('No completed sections to compile. Please wait for sections to finish generating.');
      return;
    }
    
    // IMPORTANT: Don't change the report status during PDF generation
    // The report should remain 'generated' and accessible in history
    // regardless of PDF compilation success/failure
    
    try {
      // Create a temporary report object for PDF generation
      const reportData = {
        id: currentReportId || `temp_${Date.now()}`,
        workflowName: `${selectedIndustry.name} - Sectioned Report`,
        createdAt: new Date().toISOString(),
        status: 'generated' as const,
        report: {
          content: {
            sections: Object.entries(sectionProgress)
              .filter(([_, sectionData]) => sectionData.status === 'completed')
              .map(([sectionId, sectionData]) => {
                const section = selectedIndustry.sections.find(s => s.id === sectionId);
                return {
                  id: sectionId,
                  title: section?.title || 'Unknown Section',
                  content: sectionData.content || '',
                  category: section?.category || 'general'
                };
              })
          },
          metadata: {
            title: `${selectedIndustry.name} Implementation Report`,
            industry: selectedIndustry.name,
            totalSections: completedSections.length,
            generatedAt: new Date().toISOString()
          }
        }
      };
      
      console.log('📄 Generating professional PDF with React PDF renderer...');
      
      // Use the new PDF generator
      await generateAndDownloadPDF(reportData);
      
      console.log('✅ Professional PDF generated successfully');
      
      // Only update to 'pdf_created' if PDF generation succeeds
      if (currentReportId) {
        ReportHistoryService.updateReportStatus(currentReportId, 'pdf_created');
      }
      
      // Show success message
      alert(`Successfully generated professional PDF with ${completedSections.length} sections! The PDF has been downloaded to your device.`);
      
    } catch (error) {
      console.error('❌ PDF compilation failed:', error);
      
      // CRITICAL: Don't mark the report as failed just because PDF failed
      // The sections are still completed and should remain accessible
      console.log('ℹ️ PDF generation failed, but report sections remain accessible in history');
      
      alert(`PDF generation failed, but your ${completedSections.length} completed sections are still saved and accessible in Report History. You can try generating the PDF again later.`);
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

      {/* Generation Progress Display */}
      {Object.keys(sectionProgress).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isGenerating ? 'Generation Progress' : 'Generated Sections'}
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="text-sm text-gray-600">
                  Progress: {Math.round(totalProgress)}%
                </div>
                <div className="flex space-x-3 text-xs">
                  <span className="text-green-600">✅ {completedSections} completed</span>
                  {generatingSections > 0 && <span className="text-blue-600">🔄 {generatingSections} generating</span>}
                  {failedSections > 0 && <span className="text-red-600">❌ {failedSections} failed</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{completedSections}/{selectedSections.length}</div>
              <div className="text-sm text-gray-500">sections done</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {selectedSections.map(sectionId => {
               const section = selectedIndustry.sections.find(s => s.id === sectionId);
               const progress = sectionProgress[sectionId] || { id: sectionId, status: 'pending', progress: 0 };
               
               if (!section) return null;
               
               return (
                 <div key={section.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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
                       <div className="bg-white rounded-lg p-4 border border-green-300 max-h-48 overflow-y-auto shadow-inner">
                         <div 
                           className="preview-content"
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