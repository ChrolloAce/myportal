/**
 * Firebase Profile Manager - Handles user profile operations
 * Manages profile updates, picture uploads, and user data
 */

import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import { BaseUser } from '../types';

export interface ProfileUpdateData {
  username?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  profilePicture?: string | null;
}

export class FirebaseProfileManager {
  private static instance: FirebaseProfileManager;

  public static getInstance(): FirebaseProfileManager {
    if (!FirebaseProfileManager.instance) {
      FirebaseProfileManager.instance = new FirebaseProfileManager();
    }
    return FirebaseProfileManager.instance;
  }

  /**
   * Update user profile data
   */
  public async updateProfile(userId: string, profileData: ProfileUpdateData): Promise<BaseUser> {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Prepare update data
      const updateData: any = {
        updatedAt: new Date().toISOString()
      };

      if (profileData.username) {
        updateData.username = profileData.username;
      }

      if (profileData.instagramHandle !== undefined || profileData.tiktokHandle !== undefined) {
        // Get current social handles
        const userDoc = await getDoc(userRef);
        const currentData = userDoc.data();
        const currentSocialHandles = currentData?.socialHandles || {};

        updateData.socialHandles = {
          ...currentSocialHandles,
          ...(profileData.instagramHandle !== undefined && { instagram: profileData.instagramHandle }),
          ...(profileData.tiktokHandle !== undefined && { tiktok: profileData.tiktokHandle })
        };
      }

      if (profileData.profilePicture !== undefined) {
        updateData.profilePicture = profileData.profilePicture;
      }

      // Update the document
      await updateDoc(userRef, updateData);

      // Fetch and return updated user data
      const updatedDoc = await getDoc(userRef);
      if (!updatedDoc.exists()) {
        throw new Error('User not found after update');
      }

      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as BaseUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload profile picture to Firebase Storage
   */
  public async uploadProfilePicture(userId: string, file: File): Promise<string> {
    try {
      // Create a reference to the file location
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile-pictures/${userId}/profile.${fileExtension}`;
      const storageRef = ref(storage, fileName);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw new Error(`Failed to upload profile picture: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete profile picture from Firebase Storage
   */
  public async deleteProfilePicture(userId: string): Promise<void> {
    try {
      // Try to delete common file extensions
      const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      for (const ext of extensions) {
        try {
          const fileName = `profile-pictures/${userId}/profile.${ext}`;
          const storageRef = ref(storage, fileName);
          await deleteObject(storageRef);
          console.log(`Deleted profile picture: ${fileName}`);
          break; // Exit loop if successful
        } catch (error) {
          // Continue to next extension if file doesn't exist
          continue;
        }
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      // Don't throw error for deletion failures as file might not exist
    }
  }

  /**
   * Update profile with new picture upload
   */
  public async updateProfileWithPicture(
    userId: string, 
    profileData: Omit<ProfileUpdateData, 'profilePicture'>,
    pictureFile?: File
  ): Promise<BaseUser> {
    try {
      let profilePictureUrl: string | null = null;

      // Upload new picture if provided
      if (pictureFile) {
        // Delete old picture first
        await this.deleteProfilePicture(userId);
        
        // Upload new picture
        profilePictureUrl = await this.uploadProfilePicture(userId, pictureFile);
      }

      // Update profile with new data
      return await this.updateProfile(userId, {
        ...profileData,
        ...(profilePictureUrl && { profilePicture: profilePictureUrl })
      });
    } catch (error) {
      console.error('Error updating profile with picture:', error);
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user profile data
   */
  public async getProfile(userId: string): Promise<BaseUser | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      return {
        id: userDoc.id,
        ...userDoc.data()
      } as BaseUser;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw new Error(`Failed to get profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}