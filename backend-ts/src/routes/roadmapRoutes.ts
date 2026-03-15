import { Router } from 'express';
import { toggleSubtopic, getRoadmapProgress, getStartedRoadmaps, generatePersonalizedRoadmap, getPersonalizedRoadmap } from '../controllers/roadmapController';
import { jwtWebMiddleware } from '../middleware/jwt';

const router = Router();

/**
 * @route   POST /api/roadmap/toggle
 * @desc    Toggle a roadmap subtopic as complete/incomplete
 * @access  Private
 */
router.post('/toggle', jwtWebMiddleware, toggleSubtopic);

/**
 * @route   GET /api/roadmap/started
 * @desc    Get all course keys the user has started
 * @access  Private
 */
router.get('/started', jwtWebMiddleware, getStartedRoadmaps);

// POST /api/roadmap/personalized/generate — Generate AI roadmap when stuck
router.post('/personalized/generate', jwtWebMiddleware, generatePersonalizedRoadmap);

// GET /api/roadmap/personalized/:courseKey — Fetch saved AI roadmap
router.get('/personalized/:courseKey', jwtWebMiddleware, getPersonalizedRoadmap);

/**
 * @route   GET /api/roadmap/:courseKey/:companyType
 * @desc    Get all completed subtopics for a user/course/company
 * @access  Private
 */
router.get('/:courseKey/:companyType', jwtWebMiddleware, getRoadmapProgress);

export default router;
