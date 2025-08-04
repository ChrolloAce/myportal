/**
 * FirebaseAuthManager - Firebase Authentication manager
 * Replaces JWT-based authentication with Firebase Auth
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { BaseUser, UserRole, LoginCredentials, RegisterData } from '../types';

export interface FirebaseAuthResponse {
  user: BaseUser;
  firebaseUser: FirebaseUser;
}

export class FirebaseAuthManager {
  private static instance: FirebaseAuthManager;
  private currentUser: BaseUser | null = null;
  private firebaseUser: FirebaseUser | null = null;
  private googleProvider: GoogleAuthProvider;

  private constructor() {
    // Initialize Google provider
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');

    // Listen to auth state changes
    onAuthStateChanged(auth, async (user) => {
      this.firebaseUser = user;
      if (user) {
        // Load user profile from Firestore
        this.currentUser = await this.loadUserProfile(user.uid);
      } else {
        this.currentUser = null;
      }
    });
  }

  public static getInstance(): FirebaseAuthManager {
    if (!FirebaseAuthManager.instance) {
      FirebaseAuthManager.instance = new FirebaseAuthManager();
    }
    return FirebaseAuthManager.instance;
  }

  public async login(credentials: LoginCredentials): Promise<FirebaseAuthResponse> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );

      const userProfile = await this.loadUserProfile(userCredential.user.uid);
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      this.currentUser = userProfile;

      return {
        user: userProfile,
        firebaseUser: userCredential.user
      };
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  public async register(data: RegisterData): Promise<FirebaseAuthResponse> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );

      // Create user profile in Firestore
      const userProfile: BaseUser = {
        id: userCredential.user.uid,
        email: data.email,
        username: data.username,
        role: data.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add role-specific fields
      const profileData = {
        ...userProfile,
        ...(data.role === UserRole.CREATOR ? {
          isActive: true,
          totalSubmissions: 0,
          approvedSubmissions: 0
        } : {
          permissions: ['manage_submissions', 'view_analytics']
        })
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), profileData);

      this.currentUser = userProfile;

      return {
        user: userProfile,
        firebaseUser: userCredential.user
      };
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  public async signInWithGoogle(role: UserRole = UserRole.CREATOR): Promise<FirebaseAuthResponse> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      const firebaseUser = result.user;

      // Check if user profile exists
      let userProfile = await this.loadUserProfile(firebaseUser.uid);

      if (!userProfile) {
        // Create new user profile for first-time Google users
        const displayName = firebaseUser.displayName || 'Google User';
        const username = displayName.toLowerCase().replace(/\s+/g, '') + Math.random().toString(36).substr(2, 4);

        userProfile = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          username,
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Add role-specific fields
        const profileData = {
          ...userProfile,
          displayName,
          photoURL: firebaseUser.photoURL,
          ...(role === UserRole.CREATOR ? {
            isActive: true,
            totalSubmissions: 0,
            approvedSubmissions: 0
          } : {
            permissions: ['manage_submissions', 'view_analytics']
          })
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), profileData);
      }

      this.currentUser = userProfile;

      return {
        user: userProfile,
        firebaseUser
      };
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled');
      }
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  public async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.firebaseUser = null;
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  public getCurrentUser(): BaseUser | null {
    return this.currentUser;
  }

  public getFirebaseUser(): FirebaseUser | null {
    return this.firebaseUser;
  }

  public isAuthenticated(): boolean {
    return !!this.firebaseUser && !!this.currentUser;
  }

  public isAdmin(): boolean {
    return this.currentUser?.role === UserRole.ADMIN;
  }

  public isCreator(): boolean {
    return this.currentUser?.role === UserRole.CREATOR;
  }

  private async loadUserProfile(uid: string): Promise<BaseUser | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as BaseUser;
      }
      return null;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  }

  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/popup-blocked':
        return 'Pop-up blocked. Please allow pop-ups and try again';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in method';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled. Please contact support';
      default:
        return 'Authentication failed. Please try again';
    }
  }

  // Helper method to wait for auth initialization
  public async waitForAuthInit(): Promise<FirebaseUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
}