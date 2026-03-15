import { Router } from 'express';
import {
    markModuleComplete,
    submitQuizAttempt,
    getUserProgress,
} from '../controllers/progressController';
import { jwtWebMiddleware } from '../middleware/jwt';

const router = Router();

/**
 * @route   POST /api/progress/complete
 * @desc    Mark a module as complete
 * @access  Private
 */
router.post('/complete', jwtWebMiddleware, markModuleComplete);

/**
 * @route   POST /api/progress/quiz
 * @desc    Submit a quiz attempt
 * @access  Private
 */
router.post('/quiz', jwtWebMiddleware, submitQuizAttempt);

/**
 * @route   GET /api/progress/:courseId
 * @desc    Get user progress for a course
 * @access  Private
 */
router.get('/:courseId', jwtWebMiddleware, getUserProgress);

export default router;
