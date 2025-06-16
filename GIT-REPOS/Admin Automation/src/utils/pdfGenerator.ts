interface Task {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'adhoc';
  timePerTask: number;
  category: string;
  description: string;
  automationPotential: number;
  priority: number;
}

export const generateTaskAnalysisPDF = (tasks: Task[]) => {
  const topTasks = tasks
    .filter(task => task.priority > 0)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10);

  const totalAnnualSavings = topTasks.reduce((sum, task) => sum + task.priority, 0);
  const totalHoursSaved = Math.round(totalAnnualSavings / 60);
  const estimatedValue = totalHoursSaved * 25; // £25/hour

  // Create HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Task Analysis & Automation Planning Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #4285f4;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #4285f4;
          margin-bottom: 10px;
        }
        .summary {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          border-left: 5px solid #4285f4;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 15px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-number {
          font-size: 2em;
          font-weight: bold;
          color: #4285f4;
        }
        .summary-label {
          color: #666;
          font-size: 0.9em;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #333;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 10px;
        }
        .task-item {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .task-header {
          display: flex;
          justify-content: between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .task-title {
          font-weight: bold;
          color: #333;
          font-size: 1.1em;
        }
        .task-savings {
          color: #34c759;
          font-weight: bold;
          font-size: 1.2em;
        }
        .task-details {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 8px;
        }
        .task-description {
          color: #555;
          font-style: italic;
        }
        .automation-bar {
          background: #e0e0e0;
          height: 8px;
          border-radius: 4px;
          margin: 10px 0;
          overflow: hidden;
        }
        .automation-fill {
          height: 100%;
          background: linear-gradient(90deg, #4285f4, #34c759);
          border-radius: 4px;
        }
        .roadmap {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
        }
        .roadmap h3 {
          color: #4285f4;
          margin-bottom: 15px;
        }
        .roadmap-phase {
          margin-bottom: 20px;
          padding: 15px;
          border-left: 4px solid #4285f4;
          background: white;
          border-radius: 0 8px 8px 0;
        }
        .phase-title {
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
        }
        .phase-tasks {
          list-style: none;
          padding: 0;
        }
        .phase-tasks li {
          padding: 5px 0;
          color: #555;
        }
        .phase-tasks li:before {
          content: "→ ";
          color: #4285f4;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          color: #666;
          font-size: 0.9em;
        }
        .principles {
          background: #fff8e1;
          padding: 20px;
          border-radius: 10px;
          border-left: 5px solid #ff9f40;
          margin: 20px 0;
        }
        .principles h3 {
          color: #f57c00;
          margin-bottom: 15px;
        }
        .principles ul {
          list-style: none;
          padding: 0;
        }
        .principles li {
          padding: 8px 0;
          color: #555;
        }
        .principles li:before {
          content: "💡 ";
          margin-right: 8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Task Analysis & Automation Planning Report</h1>
        <p>AI-Enhanced Workflow Strategy for Your Organization</p>
        <p style="color: #666; font-size: 0.9em;">Generated on ${new Date().toLocaleDateString('en-GB', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      <div class="summary">
        <h2 style="margin-top: 0; color: #4285f4;">Executive Summary</h2>
        <p>This report analyzes ${tasks.length} administrative tasks and identifies the highest-value opportunities for AI automation. Our approach focuses on <strong>enhancing your team's capabilities</strong> rather than replacing them, freeing up time for strategic, creative, and relationship-building work.</p>
        
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-number">${tasks.length}</div>
            <div class="summary-label">Tasks Analyzed</div>
          </div>
          <div class="summary-item">
            <div class="summary-number">${totalHoursSaved}</div>
            <div class="summary-label">Hours/Year Potential Savings</div>
          </div>
          <div class="summary-item">
            <div class="summary-number">£${estimatedValue.toLocaleString()}</div>
            <div class="summary-label">Estimated Annual Value*</div>
          </div>
        </div>
        <p style="font-size: 0.8em; color: #666; margin-top: 15px;">*Based on £25/hour average administrative cost</p>
      </div>

      <div class="section">
        <h2>Top Automation Opportunities</h2>
        <p>The following tasks have been prioritized based on time investment, automation potential, and business impact:</p>
        
        ${topTasks.map((task, index) => `
          <div class="task-item">
            <div class="task-header">
              <div>
                <div class="task-title">${index + 1}. ${task.name}</div>
                <div class="task-details">
                  📅 ${task.frequency} • ⏱️ ${task.timePerTask} min/task • 📂 ${task.category}
                </div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
              </div>
              <div class="task-savings">${Math.round(task.priority / 60)} hrs/year</div>
            </div>
            <div class="automation-bar">
              <div class="automation-fill" style="width: ${task.automationPotential}%"></div>
            </div>
            <div style="font-size: 0.9em; color: #666;">
              Automation Potential: ${task.automationPotential}% • 
              Annual Value: £${Math.round((task.priority / 60) * 25).toLocaleString()}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="roadmap">
        <h3>Implementation Roadmap</h3>
        
        <div class="roadmap-phase">
          <div class="phase-title">🎯 Quick Wins (0-3 months)</div>
          <p>Start with these high-impact, low-complexity automations:</p>
          <ul class="phase-tasks">
            ${topTasks.slice(0, 2).map(task => 
              `<li>${task.name} - ${Math.round(task.priority / 60)} hours/year savings</li>`
            ).join('')}
          </ul>
        </div>

        <div class="roadmap-phase">
          <div class="phase-title">🚀 Major Initiatives (3-12 months)</div>
          <p>Larger automation projects with significant impact:</p>
          <ul class="phase-tasks">
            ${topTasks.slice(2, 5).map(task => 
              `<li>${task.name} - ${Math.round(task.priority / 60)} hours/year savings</li>`
            ).join('')}
          </ul>
        </div>
      </div>

      <div class="principles">
        <h3>Success Principles</h3>
        <ul>
          <li><strong>Start small:</strong> Pilot with one task before scaling</li>
          <li><strong>Involve your team:</strong> Get input from people who do the work daily</li>
          <li><strong>Measure impact:</strong> Track time saved and quality improvements</li>
          <li><strong>Communicate value:</strong> Show how AI frees up time for meaningful work</li>
          <li><strong>Iterate and improve:</strong> Continuously refine your automation processes</li>
        </ul>
      </div>

      <div class="section">
        <h2>Next Steps</h2>
        <ol>
          <li><strong>Review and validate</strong> the prioritized task list with your team</li>
          <li><strong>Select 1-2 quick wins</strong> to pilot your automation program</li>
          <li><strong>Define success metrics</strong> for measuring automation impact</li>
          <li><strong>Engage stakeholders</strong> to ensure buy-in and support</li>
          <li><strong>Plan your first automation</strong> using available AI tools and platforms</li>
        </ol>
      </div>

      <div class="footer">
        <p>This report was generated by AdminFlow - AI-Enhanced Workflow Management</p>
        <p>For support with implementing these recommendations, contact our automation specialists.</p>
      </div>
    </body>
    </html>
  `;

  // Create a blob and download link
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = `task-analysis-report-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
  
  // Also provide instructions for PDF conversion
  alert(`Report downloaded as HTML file. 
  
To convert to PDF:
1. Open the downloaded HTML file in your browser
2. Press Ctrl+P (or Cmd+P on Mac)
3. Select "Save as PDF" as the destination
4. Click Save

This ensures perfect formatting and professional presentation.`);
};

export default generateTaskAnalysisPDF; 