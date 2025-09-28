// Manual script to seed Firebase with demo credentials
// Run with: node scripts/seedFirebase.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Your Firebase config - UPDATE THESE VALUES!
const firebaseConfig = {
  apiKey: "AIzaSyDlvl16HnO3mMgx0qXGH5ASNhVMKfdaQOM", // Replace with your actual API key
  authDomain: "nationalparks-2341c.firebaseapp.com",
  projectId: "nationalparks-2341c",
  storageBucket: "nationalparks-2341c.appspot.com",
  messagingSenderId: "123456789012", // Replace with your actual sender ID
  appId: "1:123456789012:web:abcdef123456789012345678" // Replace with your actual app ID
};

// Demo credentials to inject
const demoCredentials = {
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

const demoConfigs = {
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
      defaultTags: ['gmail-lead', 'ai-processed', 'team-building']
    },
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  }
};

async function seedFirebase() {
  try {
    console.log('🔥 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Replace with your actual user ID (you'll get this after signing in)
    const userId = 'demo-user-id'; // UPDATE THIS!
    console.log('🌱 Seeding data for user:', userId);
    
    const userDoc = doc(db, 'users', userId);
    
    await setDoc(userDoc, {
      email: 'demo@newforest.com',
      createdAt: new Date(),
      credentials: demoCredentials,
      configurations: demoConfigs,
      isDemo: true,
      lastSeeded: new Date()
    });
    
    console.log('✅ Successfully seeded Firebase!');
    console.log('📋 Added credentials:', Object.keys(demoCredentials));
    console.log('⚙️ Added configurations:', Object.keys(demoConfigs));
    
  } catch (error) {
    console.error('❌ Error seeding Firebase:', error);
  }
}

// Run the seeding function
seedFirebase(); 