export interface StatusUpdate {
  message: string;
  phase: string;
  estimatedTime: string;
  timestamp: string;
}

export class StatusService {
  private statusMessages = {
    'initializing': [
      '🔄 Connecting to Claude 4 Sonnet...',
      '🌟 Initializing AI analysis engine...',
      '⚡ Preparing advanced algorithms...',
      '🧠 Loading business intelligence models...'
    ],
    'generating': [
              '🤖 Claude 4 Sonnet is analyzing your workflow...',
      '📊 Processing business requirements...',
      '🎯 Identifying optimization opportunities...',
      '💡 Generating strategic recommendations...',
      '🏗️ Building React component architecture...',
      '🎨 Crafting professional UI elements...',
      '📈 Calculating ROI projections...',
      '🔍 Analyzing implementation complexity...',
      '⚙️ Optimizing workflow efficiency...',
      '📋 Structuring comprehensive report...',
      '🚀 Finalizing implementation roadmap...',
      '✨ Adding executive insights...'
    ],
    'processing': [
      '⚙️ Processing AI-generated component...',
      '🔧 Validating React code structure...',
      '🎨 Optimizing visual elements...',
      '📊 Formatting data visualizations...'
    ],
    'rendering': [
      '🎨 Rendering beautiful report interface...',
      '💫 Applying professional styling...',
      '📱 Ensuring responsive design...',
      '✨ Final polish and optimization...'
    ]
  };

  private estimatedTimes = {
    'initializing': '5-10 seconds',
    'generating': '90-120 seconds',
    'processing': '10-15 seconds',
    'rendering': '5-8 seconds'
  };

  getStatusUpdate(phase: string): StatusUpdate {
    const messages = this.statusMessages[phase] || this.statusMessages['generating'];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    return {
      message: randomMessage,
      phase: phase,
      estimatedTime: this.estimatedTimes[phase] || 'Processing...',
      timestamp: new Date().toISOString()
    };
  }

  // Start a status update interval that calls a callback with new status messages
  startStatusUpdates(
    phase: string, 
    callback: (status: StatusUpdate) => void, 
    intervalMs: number = 3000
  ): () => void {
    let isActive = true;
    
    const updateStatus = () => {
      if (!isActive) return;
      
      try {
        const status = this.getStatusUpdate(phase);
        if (isActive) {
          callback(status);
        }
      } catch (error) {
        console.error('Status update error:', error);
      }
    };

    // Initial update
    updateStatus();

    // Set up interval
    const intervalId = setInterval(updateStatus, intervalMs);

    // Return cleanup function
    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }
} 