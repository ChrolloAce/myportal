/**
 * SubmissionManager - Handles all video submission operations
 * Separated from auth logic for clean architecture
 */

import { 
  VideoSubmission, 
  SubmissionFormData, 
  SubmissionFilters, 
  SubmissionStats, 
  AdminAction,
  PaginatedResponse 
} from '../types';
import { AuthManager } from './AuthManager';

export class SubmissionManager {
  private static instance: SubmissionManager;
  private authManager: AuthManager;

  private constructor() {
    this.authManager = AuthManager.getInstance();
  }

  public static getInstance(): SubmissionManager {
    if (!SubmissionManager.instance) {
      SubmissionManager.instance = new SubmissionManager();
    }
    return SubmissionManager.instance;
  }

  public async submitVideo(formData: SubmissionFormData): Promise<VideoSubmission> {
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.authManager.getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      return data.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Submission failed');
    }
  }

  public async getSubmissions(
    filters?: SubmissionFilters,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<VideoSubmission>> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...this.buildFilterParams(filters),
      });

      const response = await fetch(`/api/submissions?${queryParams}`, {
        headers: this.authManager.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch submissions');
      }

      return data.data;
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
      const response = await fetch('/api/submissions/stats', {
        headers: this.authManager.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stats');
      }

      return data.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch stats');
    }
  }

  public async performAdminAction(action: AdminAction): Promise<VideoSubmission> {
    try {
      const response = await fetch(`/api/submissions/${action.submissionId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.authManager.getAuthHeaders(),
        },
        body: JSON.stringify(action),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Action failed');
      }

      return data.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Action failed');
    }
  }

  private buildFilterParams(filters?: SubmissionFilters): Record<string, string> {
    if (!filters) return {};

    const params: Record<string, string> = {};

    if (filters.status) params.status = filters.status;
    if (filters.platform) params.platform = filters.platform;
    if (filters.creatorId) params.creatorId = filters.creatorId;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.searchTerm) params.search = filters.searchTerm;

    return params;
  }
}