export interface ReportSection {
  id: string;
  title: string;
  description: string;
  estimatedPages: number;
  priority: 'high' | 'medium' | 'low';
  category: 'executive' | 'analysis' | 'implementation' | 'technical' | 'financial';
}

export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  sections: ReportSection[];
  estimatedTotalPages: number;
}

export const industryTemplates: IndustryTemplate[] = [
  {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    description: 'Patient management, compliance, and clinical workflow automation',
    icon: '🏥',
    sections: [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        description: 'High-level overview and key recommendations',
        estimatedPages: 2,
        priority: 'high',
        category: 'executive'
      },
      {
        id: 'patient-intake',
        title: 'Patient Intake Automation',
        description: 'Digital registration and triage systems',
        estimatedPages: 3,
        priority: 'high',
        category: 'implementation'
      },
      {
        id: 'ehr-integration',
        title: 'EHR Integration Strategy',
        description: 'Electronic health record system integration',
        estimatedPages: 4,
        priority: 'high',
        category: 'technical'
      },
      {
        id: 'compliance-framework',
        title: 'HIPAA Compliance Framework',
        description: 'Privacy and security compliance measures',
        estimatedPages: 3,
        priority: 'high',
        category: 'analysis'
      },
      {
        id: 'appointment-scheduling',
        title: 'Automated Scheduling',
        description: 'Smart appointment booking and management',
        estimatedPages: 2,
        priority: 'medium',
        category: 'implementation'
      },
      {
        id: 'billing-automation',
        title: 'Billing & Claims Processing',
        description: 'Automated insurance and payment processing',
        estimatedPages: 3,
        priority: 'medium',
        category: 'financial'
      },
      {
        id: 'clinical-workflows',
        title: 'Clinical Workflow Optimization',
        description: 'Streamlined care delivery processes',
        estimatedPages: 4,
        priority: 'medium',
        category: 'implementation'
      },
      {
        id: 'telehealth-platform',
        title: 'Telehealth Integration',
        description: 'Remote consultation capabilities',
        estimatedPages: 3,
        priority: 'medium',
        category: 'technical'
      },
      {
        id: 'data-analytics',
        title: 'Healthcare Analytics Dashboard',
        description: 'Patient outcomes and operational metrics',
        estimatedPages: 3,
        priority: 'medium',
        category: 'analysis'
      },
      {
        id: 'staff-training',
        title: 'Staff Training Program',
        description: 'Change management and user adoption',
        estimatedPages: 2,
        priority: 'low',
        category: 'implementation'
      },
      {
        id: 'roi-analysis',
        title: 'ROI & Cost Analysis',
        description: 'Financial impact and cost savings projection',
        estimatedPages: 3,
        priority: 'high',
        category: 'financial'
      },
      {
        id: 'implementation-timeline',
        title: 'Implementation Roadmap',
        description: 'Phased rollout plan and milestones',
        estimatedPages: 2,
        priority: 'high',
        category: 'implementation'
      }
    ],
    estimatedTotalPages: 34
  },
  {
    id: 'finance',
    name: 'Financial Services',
    description: 'Banking, investment, and financial process automation',
    icon: '🏦',
    sections: [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        description: 'Strategic overview and recommendations',
        estimatedPages: 2,
        priority: 'high',
        category: 'executive'
      },
      {
        id: 'kyc-automation',
        title: 'KYC/AML Automation',
        description: 'Know Your Customer and Anti-Money Laundering',
        estimatedPages: 4,
        priority: 'high',
        category: 'implementation'
      },
      {
        id: 'fraud-detection',
        title: 'AI Fraud Detection',
        description: 'Real-time transaction monitoring',
        estimatedPages: 3,
        priority: 'high',
        category: 'technical'
      },
      {
        id: 'regulatory-compliance',
        title: 'Regulatory Compliance',
        description: 'SOX, PCI-DSS, and banking regulations',
        estimatedPages: 4,
        priority: 'high',
        category: 'analysis'
      },
      {
        id: 'loan-processing',
        title: 'Automated Loan Processing',
        description: 'Digital application and approval workflows',
        estimatedPages: 3,
        priority: 'medium',
        category: 'implementation'
      },
      {
        id: 'trading-automation',
        title: 'Trading System Automation',
        description: 'Algorithmic trading and risk management',
        estimatedPages: 4,
        priority: 'medium',
        category: 'technical'
      },
      {
        id: 'customer-onboarding',
        title: 'Digital Customer Onboarding',
        description: 'Streamlined account opening process',
        estimatedPages: 2,
        priority: 'medium',
        category: 'implementation'
      },
      {
        id: 'risk-assessment',
        title: 'Risk Assessment Framework',
        description: 'Credit scoring and risk modeling',
        estimatedPages: 3,
        priority: 'medium',
        category: 'analysis'
      },
      {
        id: 'reporting-automation',
        title: 'Regulatory Reporting',
        description: 'Automated compliance reporting',
        estimatedPages: 3,
        priority: 'medium',
        category: 'financial'
      },
      {
        id: 'cybersecurity',
        title: 'Cybersecurity Framework',
        description: 'Financial data protection strategy',
        estimatedPages: 4,
        priority: 'high',
        category: 'technical'
      },
      {
        id: 'cost-benefit',
        title: 'Cost-Benefit Analysis',
        description: 'Financial impact assessment',
        estimatedPages: 3,
        priority: 'high',
        category: 'financial'
      },
      {
        id: 'implementation-plan',
        title: 'Implementation Strategy',
        description: 'Phased deployment approach',
        estimatedPages: 2,
        priority: 'high',
        category: 'implementation'
      }
    ],
    estimatedTotalPages: 37
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Industry',
    description: 'Production optimization and supply chain automation',
    icon: '🏭',
    sections: [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        description: 'Strategic automation overview',
        estimatedPages: 2,
        priority: 'high',
        category: 'executive'
      },
      {
        id: 'quality-control',
        title: 'AI Quality Control',
        description: 'Automated inspection and defect detection',
        estimatedPages: 4,
        priority: 'high',
        category: 'technical'
      },
      {
        id: 'supply-chain',
        title: 'Supply Chain Optimization',
        description: 'Inventory and logistics automation',
        estimatedPages: 4,
        priority: 'high',
        category: 'implementation'
      },
      {
        id: 'predictive-maintenance',
        title: 'Predictive Maintenance',
        description: 'IoT-based equipment monitoring',
        estimatedPages: 3,
        priority: 'high',
        category: 'technical'
      },
      {
        id: 'production-planning',
        title: 'Production Planning Automation',
        description: 'Demand forecasting and scheduling',
        estimatedPages: 3,
        priority: 'medium',
        category: 'implementation'
      },
      {
        id: 'warehouse-automation',
        title: 'Warehouse Management',
        description: 'Automated storage and retrieval',
        estimatedPages: 3,
        priority: 'medium',
        category: 'implementation'
      },
      {
        id: 'safety-compliance',
        title: 'Safety & Compliance',
        description: 'OSHA and industry safety standards',
        estimatedPages: 3,
        priority: 'high',
        category: 'analysis'
      },
      {
        id: 'energy-optimization',
        title: 'Energy Management',
        description: 'Smart energy consumption monitoring',
        estimatedPages: 2,
        priority: 'medium',
        category: 'technical'
      },
      {
        id: 'workforce-management',
        title: 'Workforce Optimization',
        description: 'Staff scheduling and productivity tracking',
        estimatedPages: 2,
        priority: 'medium',
        category: 'implementation'
      },
      {
        id: 'sustainability',
        title: 'Sustainability Initiatives',
        description: 'Environmental impact reduction',
        estimatedPages: 3,
        priority: 'low',
        category: 'analysis'
      },
      {
        id: 'cost-analysis',
        title: 'Cost Reduction Analysis',
        description: 'Operational efficiency savings',
        estimatedPages: 3,
        priority: 'high',
        category: 'financial'
      },
      {
        id: 'deployment-strategy',
        title: 'Deployment Strategy',
        description: 'Phased implementation approach',
        estimatedPages: 2,
        priority: 'high',
        category: 'implementation'
      }
    ],
    estimatedTotalPages: 34
  }
];

export const getSectionsByCategory = (template: IndustryTemplate) => {
  const categories = {
    executive: template.sections.filter(s => s.category === 'executive'),
    analysis: template.sections.filter(s => s.category === 'analysis'),
    implementation: template.sections.filter(s => s.category === 'implementation'),
    technical: template.sections.filter(s => s.category === 'technical'),
    financial: template.sections.filter(s => s.category === 'financial')
  };
  return categories;
};

export const getHighPrioritySections = (template: IndustryTemplate) => {
  return template.sections.filter(s => s.priority === 'high');
}; 