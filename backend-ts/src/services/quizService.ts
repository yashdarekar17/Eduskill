import { pool } from '../config/db';

export interface QuizAttemptAnswer {
    question_id: number;
    selected_option: string;
    time_taken: number;
}

export interface TopicWeakness {
    topic: string;
    accuracy: number;
    status: 'Strong' | 'Moderate' | 'Weak';
}

export class QuizService {

    // Helper: Calculate Weakness status based on accuracy
    private getWeaknessStatus(accuracy: number): 'Strong' | 'Moderate' | 'Weak' {
        if (accuracy < 60) return 'Weak';
        if (accuracy <= 80) return 'Moderate';
        return 'Strong';
    }

    /**
     * Submit a quiz attempt and calculate weakness
     */
    public async submitAttempt(
        userId: number,
        quizId: number,
        answers: QuizAttemptAnswer[]
    ): Promise<{ attemptId: number; score: number; weaknesses: TopicWeakness[]; detailedResults: any[] }> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Fetch the actual questions to get correct options and topics
            const questionsResult = await client.query(
                `SELECT id, correct_option, topic FROM quiz_questions WHERE quiz_id = $1`,
                [quizId]
            );

            const questionsMap = new Map<number, { correct_option: string; topic: string }>();
            questionsResult.rows.forEach(q => {
                questionsMap.set(q.id, { correct_option: q.correct_option, topic: q.topic });
            });

            // 2. Score the user
            let score = 0;
            const total = questionsResult.rows.length;

            // Topic tracking: { topicName: { correct: 0, total: 0 } }
            const topicStats: Record<string, { correct: number; total: number }> = {};

            // Initialize topic stats with all available questions to ensure we track unattempted questions if any
            questionsResult.rows.forEach(q => {
                if (!topicStats[q.topic]) {
                    topicStats[q.topic] = { correct: 0, total: 0 };
                }
                topicStats[q.topic].total += 1;
            });

            const processedAnswers = answers.map(ans => {
                const questionData = questionsMap.get(ans.question_id);
                if (!questionData) {
                    throw new Error(`Question ID ${ans.question_id} not found in this quiz.`);
                }

                const isCorrect = ans.selected_option.toLowerCase() === questionData.correct_option.toLowerCase();
                if (isCorrect) score += 1;

                // Update topic stats
                if (isCorrect) {
                    topicStats[questionData.topic].correct += 1;
                }

                return {
                    ...ans,
                    is_correct: isCorrect,
                };
            });

            // 3. Insert into quiz_attempts
            const attemptResult = await client.query(
                `INSERT INTO quiz_attempts (user_id, quiz_id, score, total) 
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                [userId, quizId, score, total]
            );
            const attemptId = attemptResult.rows[0].id;

            // 4. Insert into question_attempts
            for (const ans of processedAnswers) {
                await client.query(
                    `INSERT INTO question_attempts (attempt_id, question_id, selected_option, is_correct, time_taken)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [attemptId, ans.question_id, ans.selected_option, ans.is_correct, ans.time_taken]
                );
            }

            await client.query('COMMIT');

            // 5. Calculate Weaknesses
            const weaknesses: TopicWeakness[] = Object.keys(topicStats).map(topic => {
                const stat = topicStats[topic];
                const accuracy = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
                return {
                    topic,
                    accuracy: Math.round(accuracy * 10) / 10, // Round to 1 decimal
                    status: this.getWeaknessStatus(accuracy)
                };
            });

            // Prepare detailed results for frontend
            const detailedResults = processedAnswers.map(ans => {
                const qData = questionsMap.get(ans.question_id);
                return {
                    question_id: ans.question_id,
                    selected_option: ans.selected_option,
                    correct_option: qData?.correct_option || '',
                    is_correct: ans.is_correct
                };
            });

            return { attemptId, score, weaknesses, detailedResults };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get Weakness Report for a given User and Course/Module context
     * (e.g. all attempts for a user in a specific module's quizzes)
     */
    public async getWeaknessReport(userId: number, moduleId: number): Promise<TopicWeakness[]> {
        const result = await pool.query(
            `SELECT 
                qq.topic, 
                COUNT(*) as total_questions, 
                SUM(CASE WHEN qa.is_correct THEN 1 ELSE 0 END) as correct_questions
             FROM question_attempts qa
             JOIN quiz_attempts qatt ON qatt.id = qa.attempt_id
             JOIN quizzes q ON q.id = qatt.quiz_id
             JOIN quiz_questions qq ON qq.id = qa.question_id
             WHERE qatt.user_id = $1 AND q.module_id = $2
             GROUP BY qq.topic`,
            [userId, moduleId]
        );

        return result.rows.map(row => {
            const total = parseInt(row.total_questions, 10);
            const correct = parseInt(row.correct_questions, 10);
            const accuracy = total > 0 ? (correct / total) * 100 : 0;
            return {
                topic: row.topic,
                accuracy: Math.round(accuracy * 10) / 10,
                status: this.getWeaknessStatus(accuracy)
            };
        });
    }
}

export const quizService = new QuizService();
