import { Request, Response } from 'express';
import { pool } from '../config/db';
import { generatePersonalizedRoadmapFromNvidia } from '../services/nvidiaAiService';
import { getOrSet, invalidateCache } from '../config/redis';

// POST /api/roadmap/toggle — Toggle a subtopic complete/incomplete
export const toggleSubtopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { course_key, company_type, topic_name, subtopic_name } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!course_key || !company_type || !topic_name || !subtopic_name) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    // Check if already exists
    const existing = await pool.query(
      `SELECT id FROM roadmap_progress 
       WHERE user_id = $1 AND course_key = $2 AND company_type = $3 
       AND topic_name = $4 AND subtopic_name = $5`,
      [userId, course_key, company_type, topic_name, subtopic_name]
    );

    if (existing.rows.length > 0) {
      // Un-tick: delete the row
      await pool.query(`DELETE FROM roadmap_progress WHERE id = $1`, [existing.rows[0].id]);

      // Invalidate roadmap caches
      await invalidateCache(
        `user:${userId}:roadmap:${course_key}:${company_type}`,
        `user:${userId}:roadmap:started`
      );

      res.status(200).json({ success: true, completed: false, message: 'Subtopic unmarked' });
    } else {
      // Tick: insert new row
      await pool.query(
        `INSERT INTO roadmap_progress (user_id, course_key, company_type, topic_name, subtopic_name)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, course_key, company_type, topic_name, subtopic_name]
      );

      // Invalidate roadmap caches
      await invalidateCache(
        `user:${userId}:roadmap:${course_key}:${company_type}`,
        `user:${userId}:roadmap:started`
      );

      res.status(200).json({ success: true, completed: true, message: 'Subtopic completed' });
    }
  } catch (error) {
    console.error('Toggle subtopic error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle subtopic' });
  }
};

// GET /api/roadmap/:courseKey/:companyType — Get completed subtopics
export const getRoadmapProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { courseKey, companyType } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const completedKeys = await getOrSet(
      `user:${userId}:roadmap:${courseKey}:${companyType}`, 120, async () => {
        const result = await pool.query(
          `SELECT topic_name, subtopic_name FROM roadmap_progress
           WHERE user_id = $1 AND course_key = $2 AND company_type = $3`,
          [userId, courseKey, companyType]
        );
        return result.rows.map((r: any) => `${r.topic_name}::${r.subtopic_name}`);
      }
    );

    res.status(200).json({ success: true, completedKeys });
  } catch (error) {
    console.error('Get roadmap progress error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch roadmap progress' });
  }
};

// GET /api/roadmap/started — Get list of course_keys the user has started making progress on
export const getStartedRoadmaps = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const startedCourses = await getOrSet(`user:${userId}:roadmap:started`, 300, async () => {
      const result = await pool.query(
        `SELECT DISTINCT course_key FROM roadmap_progress WHERE user_id = $1`,
        [userId]
      );
      return result.rows.map((r: any) => r.course_key);
    });

    res.status(200).json({ success: true, startedCourses });
  } catch (error) {
    console.error('Get started roadmaps error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch started roadmaps' });
  }
};

// POST /api/roadmap/personalized/generate
export const generatePersonalizedRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { course_key, company_type, answers } = req.body;

    if (!course_key || !company_type || !answers) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    // Call NVIDIA API
    const result = await generatePersonalizedRoadmapFromNvidia(
      course_key, company_type, answers
    );

    // Upsert into personalized_roadmaps
    await pool.query(
      `INSERT INTO personalized_roadmaps (user_id, course_key, roadmap_data, ai_message)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, course_key)
       DO UPDATE SET roadmap_data = EXCLUDED.roadmap_data, ai_message = EXCLUDED.ai_message, created_at = NOW()`,
      [userId, course_key, JSON.stringify(result), 'Roadmap generated successfully!']
    );

    // Invalidate personalized roadmap cache
    await invalidateCache(`user:${userId}:personalized:${course_key}`);

    res.status(200).json({ success: true, roadmap: result, aiMessage: 'Roadmap generated successfully!' });
  } catch (error: any) {
    console.error('Generate personalized roadmap error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate roadmap' });
  }
};

// GET /api/roadmap/personalized/:courseKey
export const getPersonalizedRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { courseKey } = req.params;

    const cached = await getOrSet(`user:${userId}:personalized:${courseKey}`, 600, async () => {
      const result = await pool.query(
        `SELECT roadmap_data, ai_message, created_at FROM personalized_roadmaps
         WHERE user_id = $1 AND course_key = $2`,
        [userId, courseKey]
      );

      if (result.rows.length === 0) {
        return { exists: false };
      }

      return {
        exists: true,
        roadmap: result.rows[0].roadmap_data,
        aiMessage: result.rows[0].ai_message,
        createdAt: result.rows[0].created_at,
      };
    });

    res.status(200).json({
      success: true,
      ...cached,
    });
  } catch (error) {
    console.error('Get personalized roadmap error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch personalized roadmap' });
  }
};

// POST /api/roadmap/personalized/toggle-task
export const togglePersonalizedTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' }); return;
    }
    const { course_key, task_id } = req.body;
    if (!course_key || !task_id) {
      res.status(400).json({ success: false, message: 'course_key and task_id required' }); return;
    }

    const mapRes = await pool.query(
      `SELECT roadmap_data FROM personalized_roadmaps WHERE user_id=$1 AND course_key=$2`,
      [userId, course_key]
    );
    if(mapRes.rows.length === 0){
      res.status(404).json({ success: false, message: 'Roadmap not found' }); return;
    }
    const mapData = mapRes.rows[0].roadmap_data;
    let toggled = false;
    let newTaskState = false;
    
    if(mapData && mapData.daily_tasks) {
      mapData.daily_tasks = mapData.daily_tasks.map((t: any) => {
        if(t.id === task_id) {
          toggled = true;
          newTaskState = !t.completed;
          return { ...t, completed: newTaskState };
        }
        return t;
      });
    }

    if(toggled) {
      await pool.query(
        `UPDATE personalized_roadmaps SET roadmap_data = $1 WHERE user_id=$2 AND course_key=$3`,
        [JSON.stringify(mapData), userId, course_key]
      );

      // Invalidate personalized roadmap cache
      await invalidateCache(`user:${userId}:personalized:${course_key}`);

      res.status(200).json({ success: true, completed: newTaskState });
    } else {
      res.status(404).json({ success: false, message: 'Task not found in roadmap' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
