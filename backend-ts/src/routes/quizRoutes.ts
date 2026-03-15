import { Router } from 'express';
import { quizController } from '../controllers/quizController';
import { jwtWebMiddleware } from '../middleware/jwt';

const router = Router();

// GET /api/quizzes/course/:courseId
// Fetch all manual quizzes for a given course
router.get('/course/:courseId', jwtWebMiddleware, quizController.getQuizzesByCourse);

// GET /api/quizzes/:quizId/questions
// Fetch questions for a specific manual quiz
router.get('/:quizId/questions', jwtWebMiddleware, quizController.getQuizQuestions);

// POST /api/quizzes/:quizId/attempt
// Submit a quiz attempt and calculate weakness
router.post('/:quizId/attempt', jwtWebMiddleware, quizController.submitAttempt);

// GET /api/quizzes/weakness/:moduleId
// Fetch the weakness report for a module based on the submitted attempts
router.get('/weakness/:moduleId', jwtWebMiddleware, quizController.getModuleWeakness);

export default router;
