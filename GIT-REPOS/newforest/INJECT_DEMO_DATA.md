# 🚀 Inject Demo Credentials into Firebase

I've created several ways to get demo credentials into your Firebase collection:

## 🎯 **Option 1: Automatic Seeding (Easiest)**

When you enable Firebase and sign in for the first time, demo credentials will automatically be added to your account.

### Steps:
1. **Enable Firebase**: Set `USE_FIREBASE = true` in `src/App.tsx`
2. **Sign in**: Use Google sign-in or create an email account
3. **Demo data loads automatically** 🎉

## 🎯 **Option 2: Manual Button (In-App)**

If automatic seeding doesn't work, use the manual button:

1. Go to **Security Center** (with Firebase enabled)
2. Click **"Load Demo Credentials"** button
3. Demo data will be injected instantly

## 🎯 **Option 3: Direct Firebase Console**

Add data directly in Firebase Console:

1. Go to: https://console.firebase.google.com/u/0/project/nationalparks-2341c/firestore
2. Navigate to: `users/{your-user-id}`
3. Add this document structure:

```json
{
  "email": "demo@newforest.com",
  "createdAt": "2024-01-20T10:00:00Z",
  "credentials": {
    "gohighlevel": {
      "id": "ghl_demo_001",
      "name": "GoHighLevel Production API",
      "service": "gohighlevel",
      "type": "api_key",
      "credentials": {
        "location_id": "ve9EPM428h8vShlRW1KT",
        "jwt_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2ZTlFUE00MjhoOHZTaGxSVzFLVCIsImxvY2F0aW9uSWQiOiJ2ZTlFUE00MjhoOHZTaGxSVzFLVCIsInZlcnNpb24iOjEsImlhdCI6MTczNDU0NDQyNywiZXhwIjoxNzY2MDgwNDI3fQ.ZkJcXrr6vEVPNnOvr-6bvEE-gFXM4r4r_YgF5Y1YNIY",
        "pipeline_id": "GiZpprwMTc0aBVpaGCPL"
      },
      "isActive": true,
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    },
    "gmail": {
      "id": "gmail_demo_001", 
      "name": "Gmail OAuth Integration",
      "service": "gmail",
      "type": "oauth",
      "credentials": {
        "client_id": "123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com",
        "client_secret": "GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ123",
        "refresh_token": "1//04demo_refresh_token_here"
      },
      "isActive": true,
      "createdAt": "2024-01-10T00:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    },
    "xero": {
      "id": "xero_demo_001",
      "name": "Xero Accounting API", 
      "service": "xero",
      "type": "oauth",
      "credentials": {
        "client_id": "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
        "client_secret": "xero_secret_demo_key_here_123456",
        "tenant_id": "tenant-uuid-1234-5678-9012-abcdefghijkl"
      },
      "isActive": true,
      "createdAt": "2024-01-12T00:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    },
    "pandadoc": {
      "id": "pandadoc_demo_001",
      "name": "PandaDoc Contract API",
      "service": "pandadoc", 
      "type": "api_key",
      "credentials": {
        "api_key": "pd_live_demo_key_1234567890abcdefghijklmnopqrstuvwxyz"
      },
      "isActive": true,
      "createdAt": "2024-01-08T00:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  },
  "isDemo": true
}
```

## 🎯 **What You'll See**

Once demo data is injected, your Firebase Security Center will show:

- ✅ **GoHighLevel Production API** (with your actual JWT token)
- ✅ **Gmail OAuth Integration** (demo OAuth credentials)
- ✅ **Xero Accounting API** (demo OAuth credentials)  
- ✅ **PandaDoc Contract API** (demo API key)

Each credential card will show:
- 🔒 **"Firebase Secured"** badge
- ✅ **Active status** indicator
- 🌐 **Service-specific icons**
- 👁️ **Show/hide credential values**

## 🔧 **Using Your Real GoHighLevel Token**

The demo data includes your actual GoHighLevel JWT token:
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2ZTlFUE00MjhoOHZTaGxSVzFLVCIsImxvY2F0aW9uSWQiOiJ2ZTlFUE00MjhoOHZTaGxSVzFLVCIsInZlcnNpb24iOjEsImlhdCI6MTczNDU0NDQyNywiZXhwIjoxNzY2MDgwNDI3fQ.ZkJcXrr6vEVPNnOvr-6bvEE-gFXM4r4r_YgF5Y1YNIY
```

This means your **Admin Workflow will work with real GoHighLevel integration** while other services use demo mode!

## 🚀 **Ready to Test**

1. Enable Firebase (`USE_FIREBASE = true`)
2. Sign in with Google or email
3. Go to Security Center
4. See your demo credentials with Firebase security! 🔥 