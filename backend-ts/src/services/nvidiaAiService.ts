import https from 'https';

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  milestone_id: string;
  completed: boolean;
}

export interface MonthlyGoal {
  month: string;
  focus: string;
  deliverables?: string[];
}

export interface SubGoal {
  title: string;
  description: string;
}

export interface LongTermMilestone {
  id: string;
  title: string;
  timeline: string;
  description: string;
  sub_goals?: SubGoal[];
  skills_to_gain?: string[];
}

export interface PersonalizedRoadmapResult {
  long_term_milestones: LongTermMilestone[];
  monthly_goals: MonthlyGoal[];
  weekly_focus: string;
  daily_tasks: DailyTask[];
}

export async function generatePersonalizedRoadmapFromNvidia(
  courseKey: string,
  companyType: string,
  answers: { dream_job?: string; skill_gap?: string; hours_per_week?: string; current_project?: string; improvement_area?: string }
): Promise<PersonalizedRoadmapResult> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not set.');

  const systemPrompt = `You are an expert tech career coach and learning roadmap designer.
You will output ONLY valid JSON — no markdown, no explanation outside the JSON.

Required JSON format:
{
  "long_term_milestones": [
    {
      "id": "m1",
      "title": "Milestone Title",
      "timeline": "Phase 1 / Months 1-3",
      "description": "...",
      "skills_to_gain": ["Skill 1"],
      "sub_goals": [
        { "title": "Sub Goal", "description": "..." }
      ]
    }
  ],
  "monthly_goals": [
    {
      "month": "Month 1",
      "focus": "Focus Area",
      "deliverables": ["Deliverable 1"]
    }
  ],
  "weekly_focus": "The primary learning objective for this week",
  "daily_tasks": [
    {
      "id": "task1",
      "title": "Task Title",
      "description": "Specific actionable item",
      "milestone_id": "m1",
      "completed": false
    }
  ]
}

Rules:
1. Generate exactly 4 levels of detail (milestones, monthly, weekly, daily tasks).
2. 'daily_tasks' must have 'milestone_id' matching one of the 'long_term_milestones' ids.
3. Incorporate the user's specific answers into the learning path.
4. Ensure 'completed' is false for all tasks.
5. Do NOT include any text outside the JSON object.`;

  const userPrompt = `The user is building a roadmap for "${courseKey}" targeting "${companyType}" companies.

USER QUESTIONNAIRE ANSWERS:
- Dream Job (next 2 years): ${answers.dream_job || 'Not provided'}
- Primary Skill Gap: ${answers.skill_gap || 'Not provided'}
- Hours/Week available: ${answers.hours_per_week || 'Not provided'}
- Current Project: ${answers.current_project || 'Not provided'}
- Improvement Area: ${answers.improvement_area || 'Not provided'}

Generate a highly personalized, actionable roadmap tailored exactly to these inputs.`;

  const payload = JSON.stringify({
    model: 'meta/llama-3.1-70b-instruct',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.4,
    top_p: 0.9,
    max_tokens: 2048,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'integrate.api.nvidia.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(`NVIDIA API error: ${parsed.error.message || JSON.stringify(parsed.error)}`));
            return;
          }
          const raw: string = parsed?.choices?.[0]?.message?.content || '';
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            reject(new Error('Could not extract JSON from NVIDIA response.'));
            return;
          }
          const result: PersonalizedRoadmapResult = JSON.parse(jsonMatch[0]);
          resolve(result);
        } catch (err) {
          reject(new Error(`Failed to parse NVIDIA response: ${err}`));
        }
      });
    });

    req.on('error', (err) => reject(new Error(`NVIDIA request failed: ${err.message}`)));
    req.write(payload);
    req.end();
  });
}
