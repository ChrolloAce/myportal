/**
 * Submission routes
 * Handles video submission CRUD operations and admin actions
 */

import { Router } from 'express';
import Joi from 'joi';
import { SubmissionManager } from '../managers/SubmissionManager';
import { Platform, SubmissionStatus } from '../models/Submission';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, requireAdmin, requireCreator } from '../middleware/auth';

const router = Router();
const submissionManager = SubmissionManager.getInstance();

// All routes require authentication
router.use(authenticateToken);

// Validation schemas
const createSubmissionSchema = Joi.object({
  videoUrl: Joi.string().uri().required(),
  platform: Joi.string().valid('tiktok', 'instagram').required(),
  caption: Joi.string().max(500).optional(),
  hashtags: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  notes: Joi.string().max(1000).optional()
});

const reviewSubmissionSchema = Joi.object({
  action: Joi.string().valid('approve', 'reject').required(),
  feedback: Joi.string().max(1000).optional()
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid('pending', 'approved', 'rejected').optional(),
  platform: Joi.string().valid('tiktok', 'instagram').optional(),
  creatorId: Joi.string().optional(),
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  search: Joi.string().max(100).optional()
});

// POST /api/submissions - Create new submission (creators only)
router.post('/', requireCreator, asyncHandler(async (req, res) => {
  const { error, value } = createSubmissionSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const submission = await submissionManager.createSubmission({
    creatorId: req.user.id,
    videoUrl: value.videoUrl,
    platform: value.platform as Platform,
    caption: value.caption,
    hashtags: value.hashtags,
    notes: value.notes
  });

  res.status(201).json({
    success: true,
    message: 'Submission created successfully',
    data: submission.toJSON()
  });
}));

// GET /api/submissions - Get submissions with filtering
router.get('/', asyncHandler(async (req, res) => {
  const { error, value } = querySchema.validate(req.query);
  if (error) {
    throw new AppError(`Query validation error: ${error.details[0].message}`, 400);
  }

  const { page, pageSize, status, platform, creatorId, dateFrom, dateTo, search } = value;

  // Build filters
  const filters: any = {};
  if (status) filters.status = status as SubmissionStatus;
  if (platform) filters.platform = platform as Platform;
  if (search) filters.searchTerm = search;
  if (dateFrom) filters.dateFrom = new Date(dateFrom);
  if (dateTo) filters.dateTo = new Date(dateTo);

  // For creators, only show their own submissions
  if (req.user.role === 'creator') {
    filters.creatorId = req.user.id;
  } else if (creatorId) {
    // Admins can filter by specific creator
    filters.creatorId = creatorId;
  }

  const offset = (page - 1) * pageSize;
  const result = await submissionManager.getSubmissions(filters, pageSize, offset);

  res.json({
    success: true,
    data: {
      items: result.submissions.map(s => s.toJSON()),
      total: result.total,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize)
    }
  });
}));

// GET /api/submissions/stats - Get submission statistics (admin only)
router.get('/stats', requireAdmin, asyncHandler(async (req, res) => {
  const stats = await submissionManager.getSubmissionStats();

  res.json({
    success: true,
    data: stats
  });
}));

// GET /api/submissions/:id - Get specific submission
router.get('/:id', asyncHandler(async (req, res) => {
  const submission = await submissionManager.findById(req.params.id);
  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  // Creators can only view their own submissions
  if (req.user.role === 'creator' && submission.creatorId !== req.user.id) {
    throw new AppError('Access denied', 403);
  }

  res.json({
    success: true,
    data: submission.toJSON()
  });
}));

// PUT /api/submissions/:id/review - Review submission (admin only)
router.put('/:id/review', requireAdmin, asyncHandler(async (req, res) => {
  const { error, value } = reviewSubmissionSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const { action, feedback } = value;

  const submission = await submissionManager.reviewSubmission(
    req.params.id,
    req.user.id,
    action,
    feedback
  );

  res.json({
    success: true,
    message: `Submission ${action}d successfully`,
    data: submission.toJSON()
  });
}));

// PUT /api/submissions/:id - Update submission (creators only, pending submissions only)
router.put('/:id', requireCreator, asyncHandler(async (req, res) => {
  const submission = await submissionManager.findById(req.params.id);
  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  // Only allow creator to update their own submissions
  if (submission.creatorId !== req.user.id) {
    throw new AppError('Access denied', 403);
  }

  // Only allow updates to pending submissions
  if (!submission.canBeModified()) {
    throw new AppError('Cannot modify reviewed submissions', 400);
  }

  const { error, value } = Joi.object({
    caption: Joi.string().max(500).optional(),
    hashtags: Joi.array().items(Joi.string().max(50)).max(20).optional(),
    notes: Joi.string().max(1000).optional()
  }).validate(req.body);

  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  submission.updateContent({
    caption: value.caption,
    hashtags: value.hashtags,
    notes: value.notes
  });

  await submissionManager.updateSubmission(submission);

  res.json({
    success: true,
    message: 'Submission updated successfully',
    data: submission.toJSON()
  });
}));

// DELETE /api/submissions/:id - Delete submission (creators only, pending submissions only)
router.delete('/:id', requireCreator, asyncHandler(async (req, res) => {
  const submission = await submissionManager.findById(req.params.id);
  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  // Only allow creator to delete their own submissions
  if (submission.creatorId !== req.user.id) {
    throw new AppError('Access denied', 403);
  }

  // Only allow deletion of pending submissions
  if (!submission.canBeModified()) {
    throw new AppError('Cannot delete reviewed submissions', 400);
  }

  await submissionManager.deleteSubmission(req.params.id);

  res.json({
    success: true,
    message: 'Submission deleted successfully'
  });
}));

export { router as submissionRoutes };