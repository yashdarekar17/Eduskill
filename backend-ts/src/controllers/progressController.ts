import { Request, Response } from 'express';
import { pool } from '../config/db';
import { getOrSet, invalidatePattern } from '../config/redis';




// POST /api/progress/complete — Mark module as complete (UPSERT)
export const markModuleComplete = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { module_id } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        if (!module_id) {
            res.status(400).json({ success: false, message: 'module_id is required' });
            return;
        }

        const result = await pool.query(
            `INSERT INTO module_progress (user_id, module_id, completed, completed_at)
       VALUES ($1, $2, TRUE, NOW())
       ON CONFLICT (user_id, module_id)
       DO UPDATE SET completed = TRUE, completed_at = NOW()
       RETURNING *`,
            [userId, module_id]
        );

        // Invalidate all progress caches for this user
        await invalidatePattern(`user:${userId}:progress:*`);

        res.status(200).json({
            success: true,
            message: 'Module marked as complete',
            progress: result.rows[0],
        });
    } catch (error) {
        console.error('Mark complete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark module as complete',
        });
    }
};

// POST /api/progress/quiz — Submit a quiz attempt (Now handled mainly by quizService)
export const submitQuizAttempt = async (_req: Request, res: Response): Promise<void> => {
    try {
        // The detailed attempt data is already saved by quizController (quizService.submitAttempt).
        // This endpoint is kept for backwards compatibility but we don't need to insert duplicate attempts.
        res.status(200).json({
            success: true,
            message: 'Quiz attempt handled by main quiz service',
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to acknowledge quiz attempt',
        });
    }
};

// GET /api/progress/:courseId — Get user's progress for a course
export const getUserProgress = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { courseId } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const progress = await getOrSet(`user:${userId}:progress:${courseId}`, 120, async () => {
            const totalResult = await pool.query(
                `SELECT COUNT(m.id) AS total_modules
       FROM modules m
       JOIN phases p ON p.id = m.phase_id
       WHERE p.course_id = $1`,
                [courseId]
            );

            const completedResult = await pool.query(
                `SELECT m.id AS module_id, mp.completed, mp.completed_at
       FROM modules m
       JOIN phases p ON p.id = m.phase_id
       LEFT JOIN module_progress mp ON mp.module_id = m.id AND mp.user_id = $1
       WHERE p.course_id = $2
       ORDER BY p.phase_order, m.module_order`,
                [userId, courseId]
            );

            const quizResult = await pool.query(
                `SELECT DISTINCT ON (q.module_id)
              q.module_id, qa.score, qa.total, qa.attempted_at
       FROM quiz_attempts qa
       JOIN quizzes q ON q.id = qa.quiz_id
       JOIN modules m ON m.id = q.module_id
       JOIN phases p ON p.id = m.phase_id
       WHERE qa.user_id = $1 AND p.course_id = $2
       ORDER BY q.module_id, qa.attempted_at DESC`,
                [userId, courseId]
            );

            const totalModules = parseInt(totalResult.rows[0].total_modules);
            const completedModules = completedResult.rows.filter((r: any) => r.completed).length;

            return {
                total_modules: totalModules,
                completed_modules: completedModules,
                percentage: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
                modules: completedResult.rows,
                quiz_attempts: quizResult.rows,
            };
        });

        res.status(200).json({
            success: true,
            progress,
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch progress',
        });
    }
};
