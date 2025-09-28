import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { ApiCredential, WorkflowConfig } from '../types/auth';

interface FirebaseAuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // API Credentials management
  saveCredential: (service: string, credential: ApiCredential) => Promise<void>;
  getCredential: (service: string) => Promise<ApiCredential | null>;
  getAllCredentials: () => Promise<Record<string, ApiCredential>>;
  deleteCredential: (service: string) => Promise<void>;
  
  // Configuration management
  saveConfig: (key: string, config: WorkflowConfig) => Promise<void>;
  getConfig: (key: string) => Promise<WorkflowConfig | null>;
  getAllConfigs: () => Promise<Record<string, WorkflowConfig>>;
  deleteConfig: (key: string) => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | null>(null);

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔥 Firebase Auth: Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Firebase Auth: State changed', { user: user?.email || 'No user', uid: user?.uid });
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log('🔥 Firebase Auth: Attempting to sign in with email:', email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('🔥 Firebase Auth: Sign in successful');
    } catch (error: any) {
      console.error('🔥 Firebase Auth: Sign in error:', error);
      throw new Error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      console.log('🔥 Firebase Auth: Attempting to sign up with email:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('🔥 Firebase Auth: Sign up successful, creating user document');
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        createdAt: new Date(),
        credentials: {},
        configurations: {}
      });
      console.log('🔥 Firebase Auth: User document created successfully');
    } catch (error: any) {
      console.error('🔥 Firebase Auth: Sign up error:', error);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // API Credentials management
  const saveCredential = async (service: string, credential: ApiCredential) => {
    if (!user) throw new Error('User not authenticated');
    
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const credentials = userData.credentials || {};
      credentials[service] = credential;
      
      await updateDoc(userDoc, { credentials });
    } else {
      await setDoc(userDoc, {
        email: user.email,
        createdAt: new Date(),
        credentials: { [service]: credential },
        configurations: {}
      });
    }
  };

  const getCredential = async (service: string): Promise<ApiCredential | null> => {
    if (!user) return null;
    
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.credentials?.[service] || null;
    }
    
    return null;
  };

  const getAllCredentials = async (): Promise<Record<string, ApiCredential>> => {
    if (!user) return {};
    
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.credentials || {};
    }
    
    return {};
  };

  const deleteCredential = async (service: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const credentials = userData.credentials || {};
      delete credentials[service];
      
      await updateDoc(userDoc, { credentials });
    }
  };

  // Configuration management
  const saveConfig = async (key: string, config: WorkflowConfig) => {
    if (!user) throw new Error('User not authenticated');
    
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const configurations = userData.configurations || {};
      configurations[key] = config;
      
      await updateDoc(userDoc, { configurations });
    } else {
      await setDoc(userDoc, {
        email: user.email,
        createdAt: new Date(),
        credentials: {},
        configurations: { [key]: config }
      });
    }
  };

  const getConfig = async (key: string): Promise<WorkflowConfig | null> => {
    if (!user) return null;
    
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.configurations?.[key] || null;
    }
    
    return null;
  };

  const getAllConfigs = async (): Promise<Record<string, WorkflowConfig>> => {
    if (!user) return {};
    
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.configurations || {};
    }
    
    return {};
  };

  const deleteConfig = async (key: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const userDoc = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const configurations = userData.configurations || {};
      delete configurations[key];
      
      await updateDoc(userDoc, { configurations });
    }
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    logout,
    saveCredential,
    getCredential,
    getAllCredentials,
    deleteCredential,
    saveConfig,
    getConfig,
    getAllConfigs,
    deleteConfig
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}; 