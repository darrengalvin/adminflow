import { Workflow, WorkflowStep } from '../types';

export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();
  private stepExecutors: Map<string, (step: WorkflowStep, data?: any) => Promise<any>> = new Map();

  constructor() {
    this.initializeExecutors();
  }

  private initializeExecutors() {
    this.stepExecutors.set('api', this.executeAPICall);
    this.stepExecutors.set('ai', this.executeAIProcess);
    this.stepExecutors.set('decision', this.executeDecision);
    this.stepExecutors.set('notification', this.sendNotification);
    this.stepExecutors.set('document', this.generateDocument);
  }

  async executeWorkflow(workflowId: string): Promise<void> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

    workflow.status = 'active';
    let completedSteps = 0;

    for (const step of workflow.steps) {
      if (this.canExecuteStep(step, workflow)) {
        await this.executeStep(step, workflow);
        completedSteps++;
        workflow.progress = (completedSteps / workflow.steps.length) * 100;
      }
    }

    workflow.status = workflow.steps.every(s => s.status === 'completed') ? 'completed' : 'failed';
  }

  private canExecuteStep(step: WorkflowStep, workflow: Workflow): boolean {
    if (!step.dependencies) return true;
    
    return step.dependencies.every(depId => {
      const depStep = workflow.steps.find(s => s.id === depId);
      return depStep?.status === 'completed';
    });
  }

  private async executeStep(step: WorkflowStep, workflow: Workflow): Promise<void> {
    step.status = 'running';
    step.startTime = new Date();

    try {
      const executor = this.stepExecutors.get(step.type);
      if (executor) {
        const result = await executor(step);
        step.data = result;
        step.status = 'completed';
      }
    } catch (error) {
      step.status = 'failed';
      step.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      step.endTime = new Date();
      if (step.startTime) {
        step.duration = step.endTime.getTime() - step.startTime.getTime();
      }
    }
  }

  private async executeAPICall(step: WorkflowStep): Promise<any> {
    // Simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
    
    if (Math.random() > 0.9) {
      throw new Error('API call failed: Connection timeout');
    }

    return {
      success: true,
      data: { id: Math.random().toString(36), timestamp: new Date() },
      responseTime: Math.random() * 1000 + 200
    };
  }

  private async executeAIProcess(step: WorkflowStep): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));
    
    return {
      confidence: Math.random() * 0.3 + 0.7,
      result: 'Processed successfully',
      extractedData: {
        entities: ['Customer Name', 'Project Details', 'Timeline'],
        sentiment: 'positive'
      }
    };
  }

  private async executeDecision(step: WorkflowStep): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      decision: Math.random() > 0.5 ? 'approve' : 'review',
      confidence: Math.random() * 0.4 + 0.6,
      reasoning: 'Based on historical data and current parameters'
    };
  }

  private async sendNotification(step: WorkflowStep): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      sent: true,
      channel: Math.random() > 0.5 ? 'email' : 'slack',
      recipients: Math.floor(Math.random() * 5) + 1
    };
  }

  private async generateDocument(step: WorkflowStep): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2500 + 1500));
    
    return {
      documentId: Math.random().toString(36),
      type: 'contract',
      pages: Math.floor(Math.random() * 10) + 1,
      generated: true
    };
  }

  addWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }
}

export const workflowEngine = new WorkflowEngine();