import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ApiCredential, WorkflowConfig } from '../types/auth';

// Demo credentials that will be added to Firebase
const demoCredentials: Record<string, ApiCredential> = {
  gohighlevel: {
    id: 'ghl_demo_001',
    name: 'GoHighLevel Production API',
    service: 'gohighlevel',
    type: 'api_key',
    credentials: {
      location_id: 've9EPM428h8vShlRW1KT',
      jwt_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2ZTlFUE00MjhoOHZTaGxSVzFLVCIsImxvY2F0aW9uSWQiOiJ2ZTlFUE00MjhoOHZTaGxSVzFLVCIsInZlcnNpb24iOjEsImlhdCI6MTczNDU0NDQyNywiZXhwIjoxNzY2MDgwNDI3fQ.ZkJcXrr6vEVPNnOvr-6bvEE-gFXM4r4r_YgF5Y1YNIY',
      pipeline_id: 'GiZpprwMTc0aBVpaGCPL'
    },
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  gmail: {
    id: 'gmail_demo_001',
    name: 'Gmail OAuth Integration',
    service: 'gmail',
    type: 'oauth',
    credentials: {
      client_id: '123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
      client_secret: 'GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ123',
      refresh_token: '1//04demo_refresh_token_here'
    },
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date()
  },
  xero: {
    id: 'xero_demo_001',
    name: 'Xero Accounting API',
    service: 'xero',
    type: 'oauth',
    credentials: {
      client_id: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
      client_secret: 'xero_secret_demo_key_here_123456',
      tenant_id: 'tenant-uuid-1234-5678-9012-abcdefghijkl'
    },
    isActive: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date()
  },
  pandadoc: {
    id: 'pandadoc_demo_001',
    name: 'PandaDoc Contract API',
    service: 'pandadoc',
    type: 'api_key',
    credentials: {
      api_key: 'pd_live_demo_key_1234567890abcdefghijklmnopqrstuvwxyz'
    },
    isActive: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date()
  }
};

// Demo configurations
const demoConfigs: Record<string, WorkflowConfig> = {
  gohighlevel: {
    id: 'ghl_config_001',
    name: 'GoHighLevel Pipeline Configuration',
    service: 'gohighlevel',
    settings: {
      pipelines: [
        {
          id: 'GiZpprwMTc0aBVpaGCPL',
          name: 'Fun Groups',
          stages: [
            { id: '959215d4-d801-40b2-8816-150712c9fcc6', name: 'Initial Contact' },
            { id: 'stage-2-uuid', name: 'Qualification' },
            { id: 'stage-3-uuid', name: 'Proposal Sent' },
            { id: 'stage-4-uuid', name: 'Closed Won' }
          ]
        }
      ],
      defaultTags: ['gmail-lead', 'ai-processed', 'team-building'],
      autoAssignUser: true,
      notificationSettings: {
        emailNotifications: true,
        slackWebhook: 'https://hooks.slack.com/services/demo/webhook'
      }
    },
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  workflow: {
    id: 'workflow_config_001',
    name: 'Main Automation Workflow Settings',
    service: 'workflow',
    settings: {
      emailProcessing: {
        minimumBudget: 1000,
        requiredFields: ['name', 'email', 'company'],
        autoResponseEnabled: true,
        processingDelay: 30
      },
      integrationOrder: ['gmail', 'gohighlevel', 'pandadoc', 'xero'],
      errorHandling: {
        retryAttempts: 3,
        fallbackMode: 'manual',
        notifyOnFailure: true
      }
    },
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date()
  }
};

// Function to seed Firebase with demo data
export const seedFirebaseWithDemoData = async (userId: string) => {
  try {
    console.log('🌱 Seeding Firebase with demo data for user:', userId);
    
    // Create user document with demo credentials and configs
    const userDoc = doc(db, 'users', userId);
    
    await setDoc(userDoc, {
      email: 'demo@newforest.com',
      createdAt: new Date(),
      credentials: demoCredentials,
      configurations: demoConfigs,
      isDemo: true,
      lastSeeded: new Date()
    });
    
    console.log('✅ Successfully seeded Firebase with demo data!');
    console.log('📋 Added credentials:', Object.keys(demoCredentials));
    console.log('⚙️ Added configurations:', Object.keys(demoConfigs));
    
    return true;
  } catch (error) {
    console.error('❌ Failed to seed Firebase:', error);
    throw error;
  }
};

// Function to check if user already has demo data
export const hasExistingData = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await (await import('firebase/firestore')).getDoc(userDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return !!(data.credentials && Object.keys(data.credentials).length > 0);
    }
    
    return false;
  } catch (error) {
    console.error('Error checking existing data:', error);
    return false;
  }
};

// Export demo data for reference
export { demoCredentials, demoConfigs }; 