import React, { useState } from 'react';
import { Mail, Lock, Chrome, UserPlus, AlertCircle, Loader } from 'lucide-react';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';

const FirebaseLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signInWithEmail, signInWithGoogle, signUpWithEmail } = useFirebaseAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔥 Login Form: Form submitted', { email, isSignUp });
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        console.log('🔥 Login Form: Calling signUpWithEmail');
        await signUpWithEmail(email, password);
        console.log('🔥 Login Form: Sign up completed successfully');
      } else {
        console.log('🔥 Login Form: Calling signInWithEmail');
        await signInWithEmail(email, password);
        console.log('🔥 Login Form: Sign in completed successfully');
      }
    } catch (error: any) {
      console.error('🔥 Login Form: Authentication error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    console.log('🔥 Login Form: Google auth button clicked');
    setError('');
    setLoading(true);

    try {
      console.log('🔥 Login Form: Calling signInWithGoogle');
      await signInWithGoogle();
      console.log('🔥 Login Form: Google sign in completed successfully');
    } catch (error: any) {
      console.error('🔥 Login Form: Google auth error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-600">
            {isSignUp 
              ? 'Sign up for New Forest Admin Automation' 
              : 'Sign in to your New Forest Admin account'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Google Sign In */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full mb-6 bg-white border border-slate-300 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Chrome className="h-5 w-5" />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your password"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {isSignUp ? <UserPlus className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign Up/Sign In */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            disabled={loading}
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>

        {/* Demo Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Firebase Integration</h3>
          <p className="text-xs text-blue-700">
            This uses your Firebase project (nationalparks-2341c) for secure authentication and API key storage. 
            All credentials are stored server-side in Firestore with proper security rules.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseLoginForm; 