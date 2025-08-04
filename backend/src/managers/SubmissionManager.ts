/**
 * SubmissionManager - Handles all submission-related database operations
 * Clean business logic separation following OOP principles
 */

import { DatabaseManager } from './DatabaseManager';
import { UserManager } from './UserManager';
import { SubmissionModel, SubmissionStatus, Platform } from '../models/Submission';

export interface CreateSubmissionData {
  creatorId: string;
  videoUrl: string;
  platform: Platform;
  caption?: string;
  hashtags?: string[];
  notes?: string;
}

export interface SubmissionFilters {
  status?: SubmissionStatus;
  platform?: Platform;
  creatorId?: string;
  adminId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  todaySubmissions: number;
  mostActiveCreator: {
    username: string;
    count: number;
  } | null;
}

export class SubmissionManager {
  private static instance: SubmissionManager;
  private dbManager: DatabaseManager;
  private userManager: UserManager;

  private constructor() {
    this.dbManager = DatabaseManager.getInstance();
    this.userManager = UserManager.getInstance();
  }

  public static getInstance(): SubmissionManager {
    if (!SubmissionManager.instance) {
      SubmissionManager.instance = new SubmissionManager();
    }
    return SubmissionManager.instance;
  }

  public async createSubmission(data: CreateSubmissionData): Promise<SubmissionModel> {
    const creator = await this.userManager.findById(data.creatorId);
    if (!creator) {
      throw new Error('Creator not found');
    }

    if (!creator.isActive) {
      throw new Error('Creator account is inactive');
    }

    // Check for duplicate URLs
    const existingSubmission = await this.findByVideoUrl(data.videoUrl);
    if (existingSubmission) {
      throw new Error('This video URL has already been submitted');
    }

    const submission = new SubmissionModel({
      creator_id: data.creatorId,
      creator_username: creator.username,
      video_url: data.videoUrl,
      platform: data.platform,
      caption: data.caption,
      hashtags: data.hashtags,
      notes: data.notes
    });

    // Save submission and update creator stats in transaction
    await this.dbManager.executeTransaction([
      async () => this.saveSubmission(submission),
      async () => {
        creator.updateSubmissionCount();
        await this.userManager.updateUser(creator);
      }
    ]);

    return submission;
  }

  public async findById(id: string): Promise<SubmissionModel | null> {
    const sql = 'SELECT * FROM submissions WHERE id = ?';
    const row = await this.dbManager.get(sql, [id]);
    
    return row ? this.rowToSubmissionModel(row) : null;
  }

  public async findByVideoUrl(videoUrl: string): Promise<SubmissionModel | null> {
    const sql = 'SELECT * FROM submissions WHERE video_url = ?';
    const row = await this.dbManager.get(sql, [videoUrl]);
    
    return row ? this.rowToSubmissionModel(row) : null;
  }

  public async getSubmissions(
    filters: SubmissionFilters = {},
    limit = 20,
    offset = 0
  ): Promise<{ submissions: SubmissionModel[]; total: number }> {
    const { sql: countSql, params: countParams } = this.buildSubmissionQuery(filters, true);
    const { sql: selectSql, params: selectParams } = this.buildSubmissionQuery(filters, false);
    
    selectSql += ' ORDER BY submitted_at DESC LIMIT ? OFFSET ?';
    selectParams.push(limit, offset);

    const [totalResult, rows] = await Promise.all([
      this.dbManager.get(countSql, countParams),
      this.dbManager.all(selectSql, selectParams)
    ]);

    return {
      submissions: rows.map(row => this.rowToSubmissionModel(row)),
      total: totalResult.count
    };
  }

  public async reviewSubmission(
    submissionId: string,
    adminId: string,
    action: 'approve' | 'reject',
    feedback?: string
  ): Promise<SubmissionModel> {
    const submission = await this.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (!submission.isPending()) {
      throw new Error('Submission has already been reviewed');
    }

    const admin = await this.userManager.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new Error('Only admins can review submissions');
    }

    const creator = await this.userManager.findById(submission.creatorId);
    if (!creator) {
      throw new Error('Creator not found');
    }

    // Update submission status
    if (action === 'approve') {
      submission.approve(adminId, feedback);
    } else {
      submission.reject(adminId, feedback);
    }

    // Update creator stats in transaction
    await this.dbManager.executeTransaction([
      async () => this.updateSubmission(submission),
      async () => {
        if (action === 'approve') {
          creator.updateSubmissionCount(true);
          await this.userManager.updateUser(creator);
        }
      }
    ]);

    return submission;
  }

  public async getSubmissionStats(): Promise<SubmissionStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const queries = [
      // Total counts by status
      this.dbManager.get(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM submissions
      `),
      
      // Today's submissions
      this.dbManager.get(`
        SELECT COUNT(*) as count 
        FROM submissions 
        WHERE submitted_at >= ?
      `, [todayStr]),
      
      // Most active creator
      this.dbManager.get(`
        SELECT creator_username, COUNT(*) as count
        FROM submissions
        GROUP BY creator_id, creator_username
        ORDER BY count DESC
        LIMIT 1
      `)
    ];

    const [statsResult, todayResult, creatorResult] = await Promise.all(queries);

    return {
      total: statsResult.total,
      pending: statsResult.pending,
      approved: statsResult.approved,
      rejected: statsResult.rejected,
      todaySubmissions: todayResult.count,
      mostActiveCreator: creatorResult?.count ? {
        username: creatorResult.creator_username,
        count: creatorResult.count
      } : null
    };
  }

  public async updateSubmission(submission: SubmissionModel): Promise<void> {
    const dbRow = submission.toDatabaseRow();
    
    const sql = `
      UPDATE submissions SET
        caption = ?, hashtags = ?, notes = ?, status = ?,
        admin_feedback = ?, admin_id = ?, reviewed_at = ?, updated_at = ?
      WHERE id = ?
    `;

    const params = [
      dbRow.caption,
      dbRow.hashtags,
      dbRow.notes,
      dbRow.status,
      dbRow.admin_feedback,
      dbRow.admin_id,
      dbRow.reviewed_at?.toISOString(),
      dbRow.updated_at.toISOString(),
      dbRow.id
    ];

    await this.dbManager.run(sql, params);
  }

  public async deleteSubmission(id: string): Promise<void> {
    const sql = 'DELETE FROM submissions WHERE id = ?';
    await this.dbManager.run(sql, [id]);
  }

  private async saveSubmission(submission: SubmissionModel): Promise<void> {
    const dbRow = submission.toDatabaseRow();
    
    const sql = `
      INSERT INTO submissions (
        id, creator_id, creator_username, video_url, platform,
        caption, hashtags, notes, status, submitted_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      dbRow.id,
      dbRow.creator_id,
      dbRow.creator_username,
      dbRow.video_url,
      dbRow.platform,
      dbRow.caption,
      dbRow.hashtags,
      dbRow.notes,
      dbRow.status,
      dbRow.submitted_at.toISOString(),
      dbRow.updated_at.toISOString()
    ];

    await this.dbManager.run(sql, params);
  }

  private buildSubmissionQuery(filters: SubmissionFilters, isCount = false): { sql: string; params: any[] } {
    const selectClause = isCount ? 'SELECT COUNT(*) as count' : 'SELECT *';
    let sql = `${selectClause} FROM submissions WHERE 1=1`;
    const params: any[] = [];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.platform) {
      sql += ' AND platform = ?';
      params.push(filters.platform);
    }

    if (filters.creatorId) {
      sql += ' AND creator_id = ?';
      params.push(filters.creatorId);
    }

    if (filters.adminId) {
      sql += ' AND admin_id = ?';
      params.push(filters.adminId);
    }

    if (filters.dateFrom) {
      sql += ' AND submitted_at >= ?';
      params.push(filters.dateFrom.toISOString());
    }

    if (filters.dateTo) {
      sql += ' AND submitted_at <= ?';
      params.push(filters.dateTo.toISOString());
    }

    if (filters.searchTerm) {
      sql += ' AND (creator_username LIKE ? OR caption LIKE ? OR notes LIKE ?)';
      const searchPattern = `%${filters.searchTerm}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    return { sql, params };
  }

  private rowToSubmissionModel(row: any): SubmissionModel {
    return new SubmissionModel({
      id: row.id,
      creator_id: row.creator_id,
      creator_username: row.creator_username,
      video_url: row.video_url,
      platform: row.platform,
      caption: row.caption,
      hashtags: row.hashtags,
      notes: row.notes,
      status: row.status,
      admin_feedback: row.admin_feedback,
      admin_id: row.admin_id,
      submitted_at: new Date(row.submitted_at),
      reviewed_at: row.reviewed_at ? new Date(row.reviewed_at) : undefined,
      updated_at: new Date(row.updated_at)
    });
  }
}