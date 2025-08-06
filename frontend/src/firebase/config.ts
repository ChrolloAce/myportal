/**
 * Firebase configuration and initialization
 * Centralized Firebase setup following clean architecture
 */

import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPh4W8_KfpnpAfZ975Hx8YTeSA8F2Lf-g",
  authDomain: "portal-89a33.firebaseapp.com",
  projectId: "portal-89a33",
  storageBucket: "portal-89a33.firebasestorage.app",
  messagingSenderId: "973672798923",
  appId: "1:973672798923:web:05faa7da68451ceab1d94e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Set authentication to persist across browser sessions
// This ensures users stay logged in even after closing the browser
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('Failed to set auth persistence:', error);
  // Continue anyway - auth will still work, just might not persist as long
});

// Export the app instance
export default app;