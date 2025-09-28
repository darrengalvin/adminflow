// Simple client-side encryption for additional security
// Note: This is not a replacement for server-side security, but adds an extra layer

const ENCRYPTION_KEY = 'your-app-encryption-key'; // In production, this should be from env vars

export const encryptValue = async (value: string): Promise<string> => {
  // For now, we'll use base64 encoding as a simple obfuscation
  // In production, you'd want to use Web Crypto API or similar
  try {
    return btoa(value);
  } catch (error) {
    console.error('Encryption failed:', error);
    return value; // Fallback to plain text
  }
};

export const decryptValue = async (encryptedValue: string): Promise<string> => {
  try {
    return atob(encryptedValue);
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedValue; // Fallback to assuming it's plain text
  }
};

// For production use, implement proper encryption:
/*
export const encryptValue = async (value: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  
  const key = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...result));
};
*/ 