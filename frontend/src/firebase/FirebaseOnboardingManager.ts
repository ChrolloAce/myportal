/**
 * FirebaseOnboardingManager - Handles user onboarding processes
 * Manages creator and admin onboarding flows with corporation integration
 */

import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { FirebaseAuthManager } from './FirebaseAuthManager';
import { FirebaseCorporationManager } from './FirebaseCorporationManager';
import { 
  CreatorOnboardingData, 
  AdminOnboardingData, 
  CorporationOnboarding,
  CreatorUser,
  AdminUser,
  UserRole,
  BaseUser
} from '../types';

export class FirebaseOnboardingManager {
  private static instance: FirebaseOnboardingManager;
  private authManager: FirebaseAuthManager;
  private corporationManager: FirebaseCorporationManager;

  private constructor() {
    this.authManager = FirebaseAuthManager.getInstance();
    this.corporationManager = FirebaseCorporationManager.getInstance();
  }

  public static getInstance(): FirebaseOnboardingManager {
    if (!FirebaseOnboardingManager.instance) {
      FirebaseOnboardingManager.instance = new FirebaseOnboardingManager();
    }
    return FirebaseOnboardingManager.instance;
  }

  // Complete creator onboarding
  async completeCreatorOnboarding(userId: string, data: CreatorOnboardingData): Promise<CreatorUser> {
    try {
      console.log('🎬 Starting creator onboarding for user:', userId);

      // Prepare creator user data
      const creatorData: Partial<CreatorUser> = {
        username: data.name, // Use name as username
        socialHandles: {
          instagram: data.instagramHandle || '',
          tiktok: data.tiktokHandle || ''
        },
        onboardingCompleted: true,
        onboardingSteps: {
          profileSetup: true,
          socialHandles: true,
          corporationJoin: false
        }
      };

      // Handle corporation joining if invite code provided
      if (data.inviteCode && data.inviteCode.trim()) {
        try {
          console.log('🏢 Attempting to join corporation with invite:', data.inviteCode);
          
          const corporation = await this.corporationManager.joinCorporation(userId, {
            inviteCode: data.inviteCode,
            creatorInfo: {
              instagramHandle: data.instagramHandle || '',
              tiktokHandle: data.tiktokHandle || ''
            }
          });

          // Get user's membership details
          const membership = await this.corporationManager.getUserMembership(userId);
          
          creatorData.corporationId = corporation.id;
          creatorData.corporationRole = membership?.role as 'creator' | 'admin';
          creatorData.joinedCorporationAt = membership?.joinedAt;
          creatorData.onboardingSteps!.corporationJoin = true;

          console.log('✅ Successfully joined corporation:', corporation.displayName);
        } catch (error) {
          console.warn('⚠️ Failed to join corporation:', error);
          // Continue with onboarding even if corporation join fails
        }
      }

      // Update user document in Firestore
      const userRef = doc(db, 'users', userId);
      
      // Filter out undefined values to prevent Firestore errors
      const updateData = Object.fromEntries(
        Object.entries(creatorData).filter(([_, value]) => value !== undefined)
      );
      
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Creator onboarding completed successfully');

      // Refresh user profile from Firestore to get the latest data
      const refreshedUser = await this.authManager.refreshUserProfile();
      if (!refreshedUser) {
        throw new Error('Failed to refresh user profile after onboarding');
      }
      return refreshedUser as CreatorUser;

    } catch (error) {
      console.error('❌ Error completing creator onboarding:', error);
      throw new Error('Failed to complete onboarding. Please try again.');
    }
  }

  // Complete admin onboarding
  async completeAdminOnboarding(
    userId: string, 
    data: AdminOnboardingData & { corporationData: CorporationOnboarding }
  ): Promise<AdminUser> {
    try {
      console.log('🏢 Starting admin onboarding for user:', userId);

      // Create corporation first
      const corporation = await this.corporationManager.createCorporation(userId, data.corporationData);
      console.log('✅ Corporation created:', corporation.displayName);

      // Prepare admin user data
      const adminData: Partial<AdminUser> = {
        username: data.username || '',
        profilePicture: data.profilePicture,
        corporationId: corporation.id,
        corporationRole: 'owner',
        onboardingCompleted: true,
        onboardingSteps: {
          corporationSetup: true,
          profileSetup: true,
          inviteSetup: data.corporationData.createFirstInvite || false
        }
      };

      // Update user document in Firestore
      const userRef = doc(db, 'users', userId);
      
      // Filter out undefined values to prevent Firestore errors
      const updateData = Object.fromEntries(
        Object.entries(adminData).filter(([_, value]) => value !== undefined)
      );
      
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Admin onboarding completed successfully');

      // Refresh user profile from Firestore to get the latest data
      const refreshedUser = await this.authManager.refreshUserProfile();
      if (!refreshedUser) {
        throw new Error('Failed to refresh user profile after onboarding');
      }
      return refreshedUser as AdminUser;

    } catch (error) {
      console.error('❌ Error completing admin onboarding:', error);
      throw new Error('Failed to complete onboarding. Please try again.');
    }
  }

  // Check if user needs onboarding
  async needsOnboarding(user: BaseUser): Promise<boolean> {
    try {
      if (user.role === UserRole.CREATOR) {
        const creatorUser = user as CreatorUser;
        return !creatorUser.onboardingCompleted;
      } else if (user.role === UserRole.ADMIN) {
        const adminUser = user as AdminUser;
        return !adminUser.onboardingCompleted;
      }
      return false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return true; // Default to requiring onboarding if there's an error
    }
  }

  // Skip onboarding (mark as completed with minimal data)
  async skipOnboarding(userId: string, role: UserRole): Promise<void> {
    try {
      console.log('⏭️ Skipping onboarding for user:', userId);

      const baseData = {
        onboardingCompleted: true,
        updatedAt: serverTimestamp()
      };

      if (role === UserRole.CREATOR) {
        const creatorData = {
          ...baseData,
          onboardingSteps: {
            profileSetup: false,
            socialHandles: false,
            corporationJoin: false
          }
        };
        await updateDoc(doc(db, 'users', userId), creatorData);
      } else if (role === UserRole.ADMIN) {
        const adminData = {
          ...baseData,
          onboardingSteps: {
            corporationSetup: false,
            profileSetup: false,
            inviteSetup: false
          }
        };
        await updateDoc(doc(db, 'users', userId), adminData);
      }

      console.log('✅ Onboarding skipped successfully');
    } catch (error) {
      console.error('❌ Error skipping onboarding:', error);
      throw new Error('Failed to skip onboarding');
    }
  }

  // Get onboarding progress
  async getOnboardingProgress(): Promise<{
    completed: boolean;
    completedSteps: number;
    totalSteps: number;
    nextStep?: string;
  }> {
    try {
      const user = this.authManager.getCurrentUser();
      if (!user) {
        return { completed: false, completedSteps: 0, totalSteps: 3 };
      }

      if (user.role === UserRole.CREATOR) {
        const creatorUser = user as CreatorUser;
        const steps = creatorUser.onboardingSteps || {
          profileSetup: false,
          socialHandles: false,
          corporationJoin: false
        };

        const completedSteps = Object.values(steps).filter(Boolean).length;
        const totalSteps = Object.keys(steps).length;
        
        let nextStep: string | undefined;
        if (!steps.profileSetup) nextStep = 'profileSetup';
        else if (!steps.socialHandles) nextStep = 'socialHandles';
        else if (!steps.corporationJoin) nextStep = 'corporationJoin';

        return {
          completed: creatorUser.onboardingCompleted || false,
          completedSteps,
          totalSteps,
          nextStep
        };
      } else if (user.role === UserRole.ADMIN) {
        const adminUser = user as AdminUser;
        const steps = adminUser.onboardingSteps || {
          corporationSetup: false,
          profileSetup: false,
          inviteSetup: false
        };

        const completedSteps = Object.values(steps).filter(Boolean).length;
        const totalSteps = Object.keys(steps).length;
        
        let nextStep: string | undefined;
        if (!steps.profileSetup) nextStep = 'profileSetup';
        else if (!steps.corporationSetup) nextStep = 'corporationSetup';
        else if (!steps.inviteSetup) nextStep = 'inviteSetup';

        return {
          completed: adminUser.onboardingCompleted || false,
          completedSteps,
          totalSteps,
          nextStep
        };
      }

      return { completed: true, completedSteps: 0, totalSteps: 0 };
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      return { completed: false, completedSteps: 0, totalSteps: 3 };
    }
  }

  // Update specific onboarding step
  async updateOnboardingStep(
    userId: string, 
    step: string, 
    completed: boolean
  ): Promise<void> {
    try {
      const stepField = `onboardingSteps.${step}`;
      await updateDoc(doc(db, 'users', userId), {
        [stepField]: completed,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating onboarding step:', error);
      throw new Error('Failed to update onboarding progress');
    }
  }
}