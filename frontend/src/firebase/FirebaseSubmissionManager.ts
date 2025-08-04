/**
 * FirebaseSubmissionManager - Firestore-based submission operations
 * Replaces SQL database with Firebase Firestore
 */

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from './config';
import { FirebaseAuthManager } from './FirebaseAuthManager';
import {
  VideoSubmission,
  SubmissionFormData,
  SubmissionFilters,
  SubmissionStats,
  AdminAction,
  PaginatedResponse,
  SubmissionStatus,
  Platform
} from '../types';

export interface SubmissionWithId extends VideoSubmission {
  docId: string;
}

export class FirebaseSubmissionManager {
  private static instance: FirebaseSubmissionManager;
  private authManager: FirebaseAuthManager;

  private constructor() {
    this.authManager = FirebaseAuthManager.getInstance();
  }

  public static getInstance(): FirebaseSubmissionManager {
    if (!FirebaseSubmissionManager.instance) {
      FirebaseSubmissionManager.instance = new FirebaseSubmissionManager();
    }
    return FirebaseSubmissionManager.instance;
  }

  public async submitVideo(formData: SubmissionFormData): Promise<VideoSubmission> {
    const currentUser = this.authManager.getCurrentUser();
    if (!currentUser || currentUser.role !== 'creator') {
      throw new Error('Only creators can submit videos');
    }

    try {
      const urls: { url: string; platform: Platform }[] = [];
      
      // Collect all valid URLs
      if (formData.tiktokUrl?.trim()) {
        urls.push({ url: formData.tiktokUrl.trim(), platform: Platform.TIKTOK });
      }
      if (formData.instagramUrl?.trim()) {
        urls.push({ url: formData.instagramUrl.trim(), platform: Platform.INSTAGRAM });
      }

      if (urls.length === 0) {
        throw new Error('At least one URL must be provided');
      }

      // Check for duplicate URLs
      for (const { url } of urls) {
        const duplicateQuery = query(
          collection(db, 'submissions'),
          where('videoUrl', '==', url)
        );
        const duplicateSnapshot = await getDocs(duplicateQuery);
        
        if (!duplicateSnapshot.empty) {
          throw new Error(`This URL has already been submitted: ${url}`);
        }
      }

      const submissions: VideoSubmission[] = [];
      let submissionCount = 0;

      // Create a submission for each URL
      for (const { url, platform } of urls) {
        const submissionData = {
          creatorId: currentUser.id,
          creatorUsername: currentUser.username,
          videoUrl: url,
          platform,
          caption: formData.caption || '',
          hashtags: this.parseHashtags(formData.hashtags || ''),
          notes: formData.notes || '',
          status: SubmissionStatus.PENDING,
          submittedAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, 'submissions'), submissionData);
        submissionCount++;

        submissions.push({
          id: docRef.id,
          ...submissionData,
          submittedAt: submissionData.submittedAt.toDate().toISOString(),
          updatedAt: submissionData.updatedAt.toDate().toISOString()
        } as VideoSubmission);
      }

      // Update user's submission count
      const userDocRef = doc(db, 'users', currentUser.id);
      await updateDoc(userDocRef, {
        totalSubmissions: increment(submissionCount),
        updatedAt: Timestamp.now()
      });

      // Return the first submission for backward compatibility
      // In the future, we might want to return all submissions
      return submissions[0];

    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Submission failed');
    }
  }

  public async getSubmissions(
    filters: SubmissionFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<VideoSubmission>> {
    try {
      let baseQuery = collection(db, 'submissions');
      let queryConstraints: any[] = [];

      // Apply filters
      if (filters.status) {
        queryConstraints.push(where('status', '==', filters.status));
      }
      if (filters.platform) {
        queryConstraints.push(where('platform', '==', filters.platform));
      }
      if (filters.creatorId) {
        queryConstraints.push(where('creatorId', '==', filters.creatorId));
      }
      if (filters.dateFrom) {
        queryConstraints.push(where('submittedAt', '>=', Timestamp.fromDate(new Date(filters.dateFrom))));
      }
      if (filters.dateTo) {
        queryConstraints.push(where('submittedAt', '<=', Timestamp.fromDate(new Date(filters.dateTo))));
      }

      // Add ordering and limit
      queryConstraints.push(orderBy('submittedAt', 'desc'));
      queryConstraints.push(limit(pageSize));

      const q = query(baseQuery, ...queryConstraints);
      const snapshot = await getDocs(q);

      const submissions: VideoSubmission[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
          reviewedAt: data.reviewedAt ? data.reviewedAt.toDate().toISOString() : undefined
        } as VideoSubmission;
      });

      // For simplicity, we'll estimate total count
      // In production, you might want to maintain counters or use a different approach
      const total = submissions.length < pageSize ? submissions.length : pageSize * page + 1;

      return {
        items: submissions,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      };

    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch submissions');
    }
  }

  public async getCreatorSubmissions(page = 1, pageSize = 10): Promise<PaginatedResponse<VideoSubmission>> {
    const user = this.authManager.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    return this.getSubmissions({ creatorId: user.id }, page, pageSize);
  }

  public async getSubmissionStats(): Promise<SubmissionStats> {
    try {
      const submissionsRef = collection(db, 'submissions');
      
      // Get all submissions for stats calculation
      const allSubmissionsSnapshot = await getDocs(submissionsRef);
      const submissions = allSubmissionsSnapshot.docs.map(doc => doc.data());

      // Calculate stats
      const total = submissions.length;
      const pending = submissions.filter(s => s.status === SubmissionStatus.PENDING).length;
      const approved = submissions.filter(s => s.status === SubmissionStatus.APPROVED).length;
      const rejected = submissions.filter(s => s.status === SubmissionStatus.REJECTED).length;

      // Today's submissions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todaySubmissions = submissions.filter(s => 
        s.submittedAt && s.submittedAt.toDate() >= today
      ).length;

      // Most active creator
      const creatorCounts: { [key: string]: { username: string; count: number } } = {};
      submissions.forEach(s => {
        if (s.creatorId) {
          if (!creatorCounts[s.creatorId]) {
            creatorCounts[s.creatorId] = { username: s.creatorUsername || 'Unknown', count: 0 };
          }
          creatorCounts[s.creatorId].count++;
        }
      });

      const mostActiveCreator = Object.values(creatorCounts)
        .sort((a, b) => b.count - a.count)[0] || null;

      return {
        total,
        pending,
        approved,
        rejected,
        todaySubmissions,
        mostActiveCreator
      };

    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch stats');
    }
  }

  public async performAdminAction(action: AdminAction): Promise<VideoSubmission> {
    const currentUser = this.authManager.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only admins can review submissions');
    }

    try {
      const submissionRef = doc(db, 'submissions', action.submissionId);
      const submissionSnap = await getDoc(submissionRef);

      if (!submissionSnap.exists()) {
        throw new Error('Submission not found');
      }

      const submissionData = submissionSnap.data();
      if (submissionData.status !== SubmissionStatus.PENDING) {
        throw new Error('Submission has already been reviewed');
      }

      // Update submission
      const updateData = {
        status: action.action === 'approve' ? SubmissionStatus.APPROVED : SubmissionStatus.REJECTED,
        adminFeedback: action.feedback || '',
        adminId: currentUser.id,
        reviewedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await updateDoc(submissionRef, updateData);

      // Update creator's approved count if approved
      if (action.action === 'approve') {
        const creatorRef = doc(db, 'users', submissionData.creatorId);
        await updateDoc(creatorRef, {
          approvedSubmissions: increment(1),
          updatedAt: Timestamp.now()
        });
      }

      // Return updated submission
      return {
        id: submissionSnap.id,
        ...submissionData,
        ...updateData,
        submittedAt: submissionData.submittedAt.toDate().toISOString(),
        reviewedAt: updateData.reviewedAt.toDate().toISOString(),
        updatedAt: updateData.updatedAt.toDate().toISOString()
      } as VideoSubmission;

    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Action failed');
    }
  }

  private parseHashtags(hashtagString: string): string[] {
    if (!hashtagString) return [];
    
    return hashtagString
      .split(/[,\s]+/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);
  }
}