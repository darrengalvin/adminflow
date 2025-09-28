# Firebase Setup Guide

## 1. Get Firebase Configuration

1. Go to your Firebase Console: https://console.firebase.google.com/u/0/project/nationalparks-2341c
2. Click on **Project Settings** (gear icon)
3. Scroll down to **Your apps** section
4. If you don't have a web app, click **Add app** and select **Web**
5. Copy the Firebase configuration object

## 2. Update Firebase Config

Replace the placeholder values in `src/config/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "nationalparks-2341c.firebaseapp.com",
  projectId: "nationalparks-2341c",
  storageBucket: "nationalparks-2341c.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 3. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Enable **Google** provider (optional but recommended)
4. For Google sign-in, you'll need to configure OAuth consent screen

## 4. Set Up Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Choose **Start in test mode** (we'll secure it with rules)
4. Select your preferred location

## 5. Apply Security Rules

1. Go to **Firestore Database** > **Rules**
2. Replace the default rules with the content from `firestore.rules`
3. Publish the rules

## 6. Update Your App

Replace the current auth system by updating `src/App.tsx`:

```typescript
// Replace this import
import { AuthProvider } from './contexts/AuthContext';

// With this
import { FirebaseAuthProvider } from './contexts/FirebaseAuthContext';

// And replace this component
<AuthProvider>
  // ... your app content
</AuthProvider>

// With this
<FirebaseAuthProvider>
  // ... your app content
</FirebaseAuthProvider>
```

## 7. Update Components

Update components that use authentication:

- Replace `useAuth()` with `useFirebaseAuth()`
- Replace `<LoginForm />` with `<FirebaseLoginForm />`
- Update credential management to use Firebase methods

## Benefits of Firebase Integration

### Security
- ✅ **Server-side storage**: API keys stored in Firestore, not localStorage
- ✅ **User isolation**: Each user can only access their own credentials
- ✅ **Security rules**: Firestore rules prevent unauthorized access
- ✅ **No client-side encryption needed**: Firebase handles security

### Authentication
- ✅ **Real user accounts**: Proper user management
- ✅ **Multiple sign-in methods**: Email/password + Google OAuth
- ✅ **Session management**: Automatic token refresh
- ✅ **Password reset**: Built-in password recovery

### Scalability
- ✅ **Multi-user support**: Each user has their own secure workspace
- ✅ **Real-time sync**: Changes sync across devices
- ✅ **Offline support**: Works offline with sync when back online
- ✅ **Backup & restore**: Firebase handles data backup

## Data Structure

Your Firestore will have this structure:

```
/users/{userId}
  ├── email: "user@example.com"
  ├── createdAt: timestamp
  ├── credentials: {
  │     "gohighlevel": { service: "gohighlevel", credentials: {...} }
  │     "gmail": { service: "gmail", credentials: {...} }
  │     "xero": { service: "xero", credentials: {...} }
  │   }
  └── configurations: {
        "gohighlevel": { key: "gohighlevel", settings: {...} }
        "workflow": { key: "workflow", settings: {...} }
      }
```

## Migration from Current System

1. Export existing credentials from localStorage
2. Sign in with Firebase
3. Import credentials using the new Firebase system
4. Remove old localStorage-based auth system

This provides enterprise-grade security for your API keys while maintaining the same functionality! 