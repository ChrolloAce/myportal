/**
 * Submission model - Database schema and business logic for video submissions
 * Clean model following single responsibility principle
 */

export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum Platform {
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram'
}

export interface SubmissionData {
  id: string;
  creator_id: string;
  creator_username: string;
  video_url: string;
  platform: Platform;
  caption?: string;
  hashtags?: string;
  notes?: string;
  status: SubmissionStatus;
  admin_feedback?: string;
  admin_id?: string;
  submitted_at: Date;
  reviewed_at?: Date;
  updated_at: Date;
}

export class SubmissionModel {
  public id: string;
  public creatorId: string;
  public creatorUsername: string;
  public videoUrl: string;
  public platform: Platform;
  public caption?: string;
  public hashtags: string[];
  public notes?: string;
  public status: SubmissionStatus;
  public adminFeedback?: string;
  public adminId?: string;
  public submittedAt: Date;
  public reviewedAt?: Date;
  public updatedAt: Date;

  constructor(data: Partial<SubmissionData & { hashtags: string[] }>) {
    this.id = data.id || this.generateId();
    this.creatorId = data.creator_id!;
    this.creatorUsername = data.creator_username!;
    this.videoUrl = data.video_url!;
    this.platform = data.platform!;
    this.caption = data.caption;
    this.hashtags = data.hashtags || this.parseHashtags(data.hashtags);
    this.notes = data.notes;
    this.status = data.status || SubmissionStatus.PENDING;
    this.adminFeedback = data.admin_feedback;
    this.adminId = data.admin_id;
    this.submittedAt = data.submitted_at || new Date();
    this.reviewedAt = data.reviewed_at;
    this.updatedAt = data.updated_at || new Date();
  }

  public toJSON(): any {
    return {
      id: this.id,
      creatorId: this.creatorId,
      creatorUsername: this.creatorUsername,
      videoUrl: this.videoUrl,
      platform: this.platform,
      caption: this.caption,
      hashtags: this.hashtags,
      notes: this.notes,
      status: this.status,
      adminFeedback: this.adminFeedback,
      adminId: this.adminId,
      submittedAt: this.submittedAt.toISOString(),
      reviewedAt: this.reviewedAt?.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  public toDatabaseRow(): SubmissionData {
    return {
      id: this.id,
      creator_id: this.creatorId,
      creator_username: this.creatorUsername,
      video_url: this.videoUrl,
      platform: this.platform,
      caption: this.caption,
      hashtags: this.hashtags.join(','),
      notes: this.notes,
      status: this.status,
      admin_feedback: this.adminFeedback,
      admin_id: this.adminId,
      submitted_at: this.submittedAt,
      reviewed_at: this.reviewedAt,
      updated_at: this.updatedAt
    };
  }

  public approve(adminId: string, feedback?: string): void {
    this.status = SubmissionStatus.APPROVED;
    this.adminId = adminId;
    this.adminFeedback = feedback;
    this.reviewedAt = new Date();
    this.updatedAt = new Date();
  }

  public reject(adminId: string, feedback?: string): void {
    this.status = SubmissionStatus.REJECTED;
    this.adminId = adminId;
    this.adminFeedback = feedback;
    this.reviewedAt = new Date();
    this.updatedAt = new Date();
  }

  public updateContent(updates: {
    caption?: string;
    hashtags?: string[];
    notes?: string;
  }): void {
    if (updates.caption !== undefined) this.caption = updates.caption;
    if (updates.hashtags !== undefined) this.hashtags = updates.hashtags;
    if (updates.notes !== undefined) this.notes = updates.notes;
    this.updatedAt = new Date();
  }

  public isPending(): boolean {
    return this.status === SubmissionStatus.PENDING;
  }

  public isReviewed(): boolean {
    return this.status !== SubmissionStatus.PENDING && !!this.reviewedAt;
  }

  public canBeModified(): boolean {
    return this.status === SubmissionStatus.PENDING;
  }

  public getAgeInHours(): number {
    const now = new Date();
    const diffMs = now.getTime() - this.submittedAt.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60));
  }

  private parseHashtags(hashtagString?: string): string[] {
    if (!hashtagString) return [];
    
    return hashtagString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  private generateId(): string {
    return 'sub_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}