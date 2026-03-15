import { Router } from 'express';
import {
    getAllCourses,
    getCourseById,
    getModuleById,
    purchaseCourse,
    getPurchasedCourses,
} from '../controllers/courseController';
import { jwtWebMiddleware } from '../middleware/jwt';

const router = Router();

/**
 * @route   GET /api/courses
 * @desc    Get all courses with phase/module counts
 * @access  Public
 */
router.get('/', getAllCourses);

/**
 * @route   GET /api/courses/purchased
 * @desc    Get purchased course IDs for logged-in user
 * @access  Private (JWT)
 */
router.get('/purchased', jwtWebMiddleware, getPurchasedCourses);

/**
 * @route   POST /api/courses/purchase
 * @desc    Record a course purchase for logged-in user
 * @access  Private (JWT)
 */
router.post('/purchase', jwtWebMiddleware, purchaseCourse);

/**
 * @route   GET /api/courses/modules/:id
 * @desc    Get single module content
 * @access  Public
 */
router.get('/modules/:id', getModuleById);

/**
 * @route   GET /api/courses/:id
 * @desc    Get single course with phases + modules
 * @access  Public
 */
router.get('/:id', getCourseById);

export default router;

