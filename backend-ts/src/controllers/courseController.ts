import { Request, Response } from 'express';
import { pool } from '../config/db';

// GET /api/courses — List all courses
export const getAllCourses = async (_req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT c.id, c.title, c.description,
              COUNT(DISTINCT p.id) AS phase_count,
              COUNT(DISTINCT m.id) AS module_count
       FROM courses c
       LEFT JOIN phases p ON p.course_id = c.id
       LEFT JOIN modules m ON m.phase_id = p.id
       GROUP BY c.id
       ORDER BY c.id`
        );

        res.status(200).json({
            success: true,
            courses: result.rows,
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
        });
    }
};

// GET /api/courses/:id — Single course with phases + modules
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const courseResult = await pool.query(
            'SELECT id, title, description FROM courses WHERE id = $1',
            [id]
        );

        if (courseResult.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }

        const phasesResult = await pool.query(
            `SELECT
         p.id AS phase_id, p.title AS phase_title, p.phase_order,
         m.id AS module_id, m.title AS module_title, m.module_order
       FROM phases p
       LEFT JOIN modules m ON m.phase_id = p.id
       WHERE p.course_id = $1
       ORDER BY p.phase_order, m.module_order`,
            [id]
        );

        // Group modules under phases
        const phasesMap = new Map<number, any>();
        for (const row of phasesResult.rows) {
            if (!phasesMap.has(row.phase_id)) {
                phasesMap.set(row.phase_id, {
                    id: row.phase_id,
                    title: row.phase_title,
                    phase_order: row.phase_order,
                    modules: [],
                });
            }
            if (row.module_id) {
                phasesMap.get(row.phase_id).modules.push({
                    id: row.module_id,
                    title: row.module_title,
                    module_order: row.module_order,
                });
            }
        }

        res.status(200).json({
            success: true,
            course: {
                ...courseResult.rows[0],
                phases: Array.from(phasesMap.values()),
            },
        });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course',
        });
    }
};

// GET /api/courses/modules/:id — Single module content
export const getModuleById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT m.id, m.title, m.content, m.module_order,
              p.id AS phase_id, p.title AS phase_title,
              c.id AS course_id, c.title AS course_title
       FROM modules m
       JOIN phases p ON p.id = m.phase_id
       JOIN courses c ON c.id = p.course_id
       WHERE m.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Module not found' });
            return;
        }

        res.status(200).json({
            success: true,
            module: result.rows[0],
        });
    } catch (error) {
        console.error('Get module error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch module',
        });
    }
};

// POST /api/courses/purchase — Save purchased course for user
export const purchaseCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { course_id } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        if (!course_id) {
            res.status(400).json({ success: false, message: 'course_id is required' });
            return;
        }

        await pool.query(
            `INSERT INTO user_courses (user_id, course_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, course_id) DO NOTHING`,
            [userId, course_id]
        );

        res.status(200).json({
            success: true,
            message: 'Course purchased successfully',
        });
    } catch (error) {
        console.error('Purchase course error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to purchase course',
        });
    }
};

// GET /api/courses/purchased — Get all purchased course IDs for user
export const getPurchasedCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const result = await pool.query(
            'SELECT course_id FROM user_courses WHERE user_id = $1',
            [userId]
        );

        const courseIds = result.rows.map((row: any) => row.course_id);

        res.status(200).json({
            success: true,
            purchasedCourseIds: courseIds,
        });
    } catch (error) {
        console.error('Get purchased courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch purchased courses',
        });
    }
};
