interface GroqApiResponse {
  error?: { message?: string };
  choices?: Array<{ message?: { content?: string } }>;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  milestone_id: string;
  month: string;
  completed: boolean;
}

export interface MonthlyGoal {
  month: string;
  focus: string;
  milestone_id?: string;
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
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set.');

  const systemPrompt = `You are a senior software engineer and career mentor creating a precise, manual, step-by-step learning roadmap. Think like you are writing a handcrafted study plan for a junior developer — every task must be a concrete action they can do TODAY, not a vague topic.

Output ONLY a valid JSON object. No markdown. No prose. No explanation.

JSON SCHEMA:
{
  "long_term_milestones": [
    {
      "id": "m1",
      "title": "Short milestone title",
      "timeline": "Phase 1 – Months 1–3",
      "description": "What the developer will be capable of doing by end of this milestone.",
      "skills_to_gain": ["Skill A", "Skill B"],
      "sub_goals": [
        { "title": "Sub-goal title", "description": "Specific sub-goal outcome." }
      ]
    }
  ],
  "monthly_goals": [
    {
      "month": "Month 1",
      "focus": "Exact technology or concept being mastered this month",
      "milestone_id": "m1",
      "deliverables": ["A working project or output that proves mastery"]
    }
  ],
  "weekly_focus": "One crisp sentence: the single most important thing to learn or build THIS week.",
  "daily_tasks": [
    {
      "id": "task1",
      "title": "Concise task name",
      "description": "Exact action: e.g. 'Read MDN docs on Flexbox and build a 3-column responsive layout from scratch. Aim for 45 minutes. Commit code to GitHub.'",
      "milestone_id": "m1",
      "month": "Month 1",
      "completed": false
    }
  ]
}

STRICT RULES:
1. Every daily_task description must be a CONCRETE ACTION — use verbs: Read, Build, Watch, Practice, Implement, Deploy, Debug, Write. Never say "Learn about X", say "Build X that does Y".
2. Include resource hints where useful — e.g. "Watch Fireship's 100-second video on X" or "Read the official React docs section on hooks".
3. Each month must have AT LEAST 4 daily_tasks spread across the learning arc of that month.
4. Tasks within the same month must follow a logical progression: concept → small exercise → mini-project → review.
5. milestone_id in both monthly_goals and daily_tasks MUST reference a real id from long_term_milestones.
6. The 'month' field in daily_tasks MUST exactly match a 'month' value in monthly_goals.
7. completed is always false.
8. Tailor everything to the user's exact answers — do NOT generate a generic roadmap.
9. Output NOTHING outside the JSON object.`;

  const userPrompt = `Create a detailed, handcrafted learning roadmap for the following developer:

GOAL: Become a "${answers.dream_job || courseKey + ' developer'}" at ${companyType} companies within 2 years.
COURSE TRACK: ${courseKey}
TARGET COMPANY TYPE: ${companyType}

DEVELOPER PROFILE:
• Dream Role: ${answers.dream_job || 'Not specified'}
• Biggest Skill Gap right now: ${answers.skill_gap || 'Not specified'}
• Hours available per week to study: ${answers.hours_per_week || 'Not specified'}
• Current side project or work context: ${answers.current_project || 'Not specified'}
• Area they most want to improve: ${answers.improvement_area || 'Not specified'}

Generate a roadmap that:
- Addresses the skill gap FIRST in Month 1 so progress is immediately visible
- Scales difficulty progressively each month
- Keeps daily tasks realistic for the hours/week they have available
- Includes project-based tasks that build a portfolio
- Prepares them specifically for ${companyType} company interviews and expectations`;


  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      top_p: 0.9,
      max_tokens: 6000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorBody}`);
  }

  const parsed = (await response.json()) as GroqApiResponse;

  if (parsed.error) {
    throw new Error(`Groq API error: ${parsed.error.message || JSON.stringify(parsed.error)}`);
  }

  const raw: string = parsed?.choices?.[0]?.message?.content || '';
  if (!raw) {
    throw new Error('Empty response from Groq API.');
  }

  // response_format: json_object guarantees valid JSON, but fall back to regex extraction if needed
  let jsonStr = raw.trim();
  if (!jsonStr.startsWith('{')) {
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`Could not extract JSON from Groq response. Raw: ${jsonStr.slice(0, 200)}`);
    }
    jsonStr = jsonMatch[0];
  }

  const result: PersonalizedRoadmapResult = JSON.parse(jsonStr);
  return result;
}
