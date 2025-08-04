/**
 * FirebaseCorporationManager - Handles corporation-related operations
 * Manages corporations, memberships, and invite system
 */

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { 
  Corporation, 
  CorporationMember, 
  CorporationInvite, 
  CorporationOnboarding,
  JoinCorporationData 
} from '../types';

export class FirebaseCorporationManager {
  private static instance: FirebaseCorporationManager;

  public static getInstance(): FirebaseCorporationManager {
    if (!FirebaseCorporationManager.instance) {
      FirebaseCorporationManager.instance = new FirebaseCorporationManager();
    }
    return FirebaseCorporationManager.instance;
  }

  // Create a new corporation
  async createCorporation(ownerId: string, data: CorporationOnboarding): Promise<Corporation> {
    try {
      const corporationData: Omit<Corporation, 'id'> = {
        name: data.corporationName.toLowerCase().replace(/[^a-z0-9]/g, ''),
        displayName: data.displayName,
        description: data.description,
        industry: data.industry,
        socialMedia: data.socialMedia,
        settings: data.settings,
        ownerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        memberCount: 1,
        activeInvites: 0
      };

      // Create corporation document
      const corporationRef = await addDoc(collection(db, 'corporations'), corporationData);
      const corporationId = corporationRef.id;

      // Add owner as first member
      await this.addMember(corporationId, {
        userId: ownerId,
        corporationId,
        role: 'owner',
        joinedAt: new Date().toISOString(),
        status: 'active'
      });

      // Create first invite if requested
      if (data.createFirstInvite) {
        await this.createInvite(corporationId, ownerId, {
          role: 'creator',
          maxUses: 10,
          expiresInDays: 30,
          note: data.firstInviteNote
        });
      }

      return { id: corporationId, ...corporationData };
    } catch (error) {
      console.error('Error creating corporation:', error);
      throw new Error('Failed to create corporation');
    }
  }

  // Get corporation by ID
  async getCorporation(corporationId: string): Promise<Corporation | null> {
    try {
      const corporationDoc = await getDoc(doc(db, 'corporations', corporationId));
      if (corporationDoc.exists()) {
        return { id: corporationDoc.id, ...corporationDoc.data() } as Corporation;
      }
      return null;
    } catch (error) {
      console.error('Error getting corporation:', error);
      return null;
    }
  }

  // Get corporation members
  async getCorporationMembers(corporationId: string): Promise<CorporationMember[]> {
    try {
      const membersQuery = query(
        collection(db, 'corporationMembers'),
        where('corporationId', '==', corporationId),
        orderBy('joinedAt', 'desc')
      );
      
      const snapshot = await getDocs(membersQuery);
      return snapshot.docs.map(doc => ({ ...doc.data() } as CorporationMember));
    } catch (error) {
      console.error('Error getting corporation members:', error);
      return [];
    }
  }

  // Add member to corporation
  async addMember(corporationId: string, memberData: Omit<CorporationMember, 'id'>): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Add member document
      const memberRef = doc(collection(db, 'corporationMembers'));
      batch.set(memberRef, memberData);

      // Update corporation member count
      const corporationRef = doc(db, 'corporations', corporationId);
      batch.update(corporationRef, {
        memberCount: (await this.getCorporationMembers(corporationId)).length + 1,
        updatedAt: serverTimestamp()
      });

      await batch.commit();
    } catch (error) {
      console.error('Error adding member:', error);
      throw new Error('Failed to add member to corporation');
    }
  }

  // Create invite link
  async createInvite(
    corporationId: string, 
    createdBy: string, 
    options: {
      role: 'creator' | 'admin';
      maxUses?: number;
      expiresInDays?: number;
      email?: string;
      note?: string;
    }
  ): Promise<CorporationInvite> {
    try {
      const inviteCode = this.generateInviteCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (options.expiresInDays || 30));

      const inviteData: Omit<CorporationInvite, 'id'> = {
        corporationId,
        inviteCode,
        inviteLink: `${window.location.origin}/invite/${inviteCode}`,
        createdBy,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        maxUses: options.maxUses,
        currentUses: 0,
        role: options.role,
        isActive: true,
        email: options.email,
        note: options.note
      };

      const inviteRef = await addDoc(collection(db, 'corporationInvites'), inviteData);
      
      // Update corporation active invites count
      await updateDoc(doc(db, 'corporations', corporationId), {
        activeInvites: (await this.getCorporationInvites(corporationId)).length + 1,
        updatedAt: serverTimestamp()
      });

      return { id: inviteRef.id, ...inviteData };
    } catch (error) {
      console.error('Error creating invite:', error);
      throw new Error('Failed to create invite');
    }
  }

  // Get corporation invites
  async getCorporationInvites(corporationId: string): Promise<CorporationInvite[]> {
    try {
      const invitesQuery = query(
        collection(db, 'corporationInvites'),
        where('corporationId', '==', corporationId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(invitesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CorporationInvite));
    } catch (error) {
      console.error('Error getting corporation invites:', error);
      return [];
    }
  }

  // Validate and get invite by code
  async getInvite(inviteCode: string): Promise<CorporationInvite | null> {
    try {
      const invitesQuery = query(
        collection(db, 'corporationInvites'),
        where('inviteCode', '==', inviteCode.toUpperCase()),
        where('isActive', '==', true),
        limit(1)
      );
      
      const snapshot = await getDocs(invitesQuery);
      if (snapshot.empty) return null;

      const invite = snapshot.docs[0];
      const inviteData = { id: invite.id, ...invite.data() } as CorporationInvite;

      // Check if invite is expired or maxed out
      const now = new Date();
      const expiresAt = new Date(inviteData.expiresAt);
      
      if (now > expiresAt) {
        await this.deactivateInvite(invite.id);
        return null;
      }

      if (inviteData.maxUses && inviteData.currentUses >= inviteData.maxUses) {
        await this.deactivateInvite(invite.id);
        return null;
      }

      return inviteData;
    } catch (error) {
      console.error('Error getting invite:', error);
      return null;
    }
  }

  // Join corporation using invite
  async joinCorporation(userId: string, joinData: JoinCorporationData): Promise<Corporation> {
    try {
      // Validate invite
      const invite = await this.getInvite(joinData.inviteCode);
      if (!invite) {
        throw new Error('Invalid or expired invite code');
      }

      // Check if user is already a member
      const existingMember = await this.getUserMembership(userId);
      if (existingMember) {
        throw new Error('You are already a member of a corporation');
      }

      // Get corporation
      const corporation = await this.getCorporation(invite.corporationId);
      if (!corporation) {
        throw new Error('Corporation not found');
      }

      const batch = writeBatch(db);

      // Add user as member
      const memberData: Omit<CorporationMember, 'id'> = {
        userId,
        corporationId: invite.corporationId,
        role: invite.role,
        joinedAt: new Date().toISOString(),
        invitedBy: invite.createdBy,
        status: corporation.settings.requireApproval ? 'pending' : 'active'
      };

      const memberRef = doc(collection(db, 'corporationMembers'));
      batch.set(memberRef, memberData);

      // Update invite usage
      const inviteRef = doc(db, 'corporationInvites', invite.id);
      batch.update(inviteRef, {
        currentUses: invite.currentUses + 1
      });

      // Update corporation member count
      const corporationRef = doc(db, 'corporations', invite.corporationId);
      batch.update(corporationRef, {
        memberCount: corporation.memberCount + 1,
        updatedAt: serverTimestamp()
      });

      await batch.commit();

      return corporation;
    } catch (error) {
      console.error('Error joining corporation:', error);
      throw error;
    }
  }

  // Get user's corporation membership
  async getUserMembership(userId: string): Promise<CorporationMember | null> {
    try {
      const memberQuery = query(
        collection(db, 'corporationMembers'),
        where('userId', '==', userId),
        limit(1)
      );
      
      const snapshot = await getDocs(memberQuery);
      if (snapshot.empty) return null;

      return { ...snapshot.docs[0].data() } as CorporationMember;
    } catch (error) {
      console.error('Error getting user membership:', error);
      return null;
    }
  }

  // Deactivate invite
  private async deactivateInvite(inviteId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'corporationInvites', inviteId), {
        isActive: false
      });
    } catch (error) {
      console.error('Error deactivating invite:', error);
    }
  }

  // Generate random invite code
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Update corporation
  async updateCorporation(corporationId: string, updates: Partial<Corporation>): Promise<void> {
    try {
      await updateDoc(doc(db, 'corporations', corporationId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating corporation:', error);
      throw new Error('Failed to update corporation');
    }
  }

  // Get corporation statistics
  async getCorporationStats(corporationId: string): Promise<{
    totalMembers: number;
    activeMembers: number;
    pendingMembers: number;
    activeInvites: number;
    totalSubmissions: number;
  }> {
    try {
      const members = await this.getCorporationMembers(corporationId);
      const invites = await this.getCorporationInvites(corporationId);

      // Get submission count (would need to query submissions by corporation members)
      // This is a placeholder - implement based on your submission structure
      const totalSubmissions = 0;

      return {
        totalMembers: members.length,
        activeMembers: members.filter(m => m.status === 'active').length,
        pendingMembers: members.filter(m => m.status === 'pending').length,
        activeInvites: invites.length,
        totalSubmissions
      };
    } catch (error) {
      console.error('Error getting corporation stats:', error);
      return {
        totalMembers: 0,
        activeMembers: 0,
        pendingMembers: 0,
        activeInvites: 0,
        totalSubmissions: 0
      };
    }
  }
}