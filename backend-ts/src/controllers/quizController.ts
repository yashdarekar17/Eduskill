import { Request, Response } from 'express';
import { pool } from '../config/db';
import { quizService, QuizAttemptAnswer } from '../services/quizService';

// Interfaces for typing req.user if you use a middleware
interface AuthRequest extends Request {
    user?: {
        id: number;
        // other fields
    };
}

export const quizController = {
    // GET /api/quizzes/course/:courseId
    // Fetch all quizzes for a given course
    async getQuizzesByCourse(req: AuthRequest, res: Response) {
        try {
            const courseId = parseInt(req.params.courseId, 10);
            if (isNaN(courseId)) {
                return res.status(400).json({ success: false, message: 'Invalid courseId' });
            }

            const result = await pool.query(
                `SELECT id, module_id, title, created_at 
                 FROM quizzes 
                 WHERE course_id = $1 
                 ORDER BY created_at ASC`,
                [courseId]
            );

            return res.status(200).json({
                success: true,
                quizzes: result.rows,
            });
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch quizzes' });
        }
    },

    // GET /api/quizzes/:quizId/questions
    // Fetch all questions for a specific quiz
    async getQuizQuestions(req: AuthRequest, res: Response) {
        try {
            const quizId = parseInt(req.params.quizId, 10);
            if (isNaN(quizId)) {
                return res.status(400).json({ success: false, message: 'Invalid quizId' });
            }

            // Notice we do NOT send correct_option to the client.
            const result = await pool.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, topic
                 FROM quiz_questions 
                 WHERE quiz_id = $1`,
                [quizId]
            );

            const formattedQuestions = result.rows.map(row => ({
                id: row.id,
                question_text: row.question,
                options: {
                    a: row.option_a,
                    b: row.option_b,
                    c: row.option_c,
                    d: row.option_d
                },
                topic: row.topic
            }));

            return res.status(200).json({
                success: true,
                questions: formattedQuestions,
            });
        } catch (error) {
            console.error('Error fetching quiz questions:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch questions' });
        }
    },

    // POST /api/quizzes/:quizId/attempt
    // Submit an attempt
    async submitAttempt(req: AuthRequest, res: Response) {
        try {
            // Need user ID. Assuming an auth middleware attaches req.user
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const quizId = parseInt(req.params.quizId, 10);
            const { answers } = req.body as { answers: QuizAttemptAnswer[] };

            if (isNaN(quizId) || !answers || !Array.isArray(answers)) {
                return res.status(400).json({ success: false, message: 'Invalid payload' });
            }

            const attemptResult = await quizService.submitAttempt(userId, quizId, answers);

            return res.status(201).json({
                success: true,
                message: 'Quiz attempt saved successfully',
                data: attemptResult
            });
        } catch (error: any) {
            console.error('Error submitting attempt:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to submit attempt',
                error: (error as Error).message
            });
        }
    },

    // GET /api/quizzes/weakness/:moduleId
    // Get weakness report for a module
    async getModuleWeakness(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const moduleId = parseInt(req.params.moduleId, 10);
            if (isNaN(moduleId)) {
                return res.status(400).json({ success: false, message: 'Invalid moduleId' });
            }

            const weaknesses = await quizService.getWeaknessReport(userId, moduleId);

            return res.status(200).json({
                success: true,
                weaknessTopics: weaknesses
            });
        } catch (error) {
            console.error('Error fetching weakness report:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch weakness report' });
        }
    }
};
