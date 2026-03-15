import https from 'https';

export interface RoadmapSubtopic {
  name: string;
}

export interface RoadmapTopic {
  name: string;
  subtopics: RoadmapSubtopic[];
  note?: string;
}

export interface PersonalizedRoadmapResult {
  topics: RoadmapTopic[];
  aiMessage: string;
}

export async function generatePersonalizedRoadmapFromNvidia(
  courseKey: string,
  companyType: string,
  stuckOnTopic: string,
  stuckOnSubtopic: string,
  stuckReason: string,
  completedKeys: string[],
  baseTopics: { name: string; subtopics: { name: string }[] }[]
): Promise<PersonalizedRoadmapResult> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not set.');

  const completedList =
    completedKeys.length > 0
      ? completedKeys.map((k) => `  - ${k.replace('::', ' → ')}`).join('\n')
      : '  - (none yet)';

  const baseRoadmapJson = JSON.stringify(
    baseTopics.map((t) => ({ name: t.name, subtopics: t.subtopics.map((s) => s.name) })),
    null,
    2
  );

  const systemPrompt = `You are an expert learning roadmap designer.
You will output ONLY valid JSON — no markdown, no explanation outside the JSON.

Required JSON format:
{
  "aiMessage": "One sentence explaining what you changed and why.",
  "topics": [
    {
      "name": "Topic Name",
      "note": "(optional) Short note if this topic needs special attention",
      "subtopics": [{ "name": "Subtopic Name" }]
    }
  ]
}

Rules:
1. Place the stuck topic FIRST with a detailed breakdown of its fundamentals.
2. Review prerequisites of the stuck topic if needed.
3. Remove subtopics the user has already completed (unless they are direct prerequisites).
4. Keep the total roadmap focused — max 8 topics.
5. Do NOT include any text outside the JSON object.`;

  const userPrompt = `The user is learning "${courseKey}" targeting "${companyType}" companies.

STUCK AT:
  Topic: "${stuckOnTopic}"
  Subtopic: "${stuckOnSubtopic}"
  Reason: "${stuckReason}"

ALREADY COMPLETED:
${completedList}

BASE ROADMAP (for context):
${baseRoadmapJson}

Generate a personalized roadmap to help this user get unstuck and continue learning.`;

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
