import dotenv from 'dotenv';
dotenv.config();

/**
 * AI Summary Generator
 * Uses Google Gemini API when available, falls back to local analysis
 */

async function getGeminiResponse(prompt, context) {
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDJ2apMPWz3yrJ4IuMtoQGyVgufOAKCocU';
  if (!apiKey) return null;

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are an AI assistant for NGO Hub, a volunteer coordination platform.
You help NGO coordinators manage volunteers and tasks efficiently.
Here is the current data context:
- Volunteers: ${context.volunteers.length} total
- Tasks: ${context.tasks.length} total
- Pending: ${context.tasks.filter(t => t.status === 'pending').length}
- Assigned: ${context.tasks.filter(t => t.status === 'assigned').length}
- Completed: ${context.tasks.filter(t => t.status === 'completed').length}
- Available Volunteers: ${context.volunteers.filter(v => v.available).length}
- Skills pool: ${[...new Set(context.volunteers.flatMap(v => v.skills || []))].join(', ')}

Respond with actionable insights in markdown format.`;

    const result = await model.generateContent(`${systemPrompt}\n\nUser query: ${prompt}`);
    return result.response.text();
  } catch (error) {
    console.warn('Gemini API error, using local fallback:', error.message);
    return null;
  }
}

function localAnalysis(prompt, context) {
  const { volunteers, tasks } = context;
  const pending = tasks.filter(t => t.status === 'pending');
  const assigned = tasks.filter(t => t.status === 'assigned');
  const completed = tasks.filter(t => t.status === 'completed');
  const available = volunteers.filter(v => v.available);
  const allSkills = [...new Set(volunteers.flatMap(v => v.skills || []))];
  const requiredSkills = [...new Set(tasks.flatMap(t => t.requiredSkills || []))];
  const gaps = requiredSkills.filter(s => !allSkills.map(x => x.toLowerCase()).includes(s.toLowerCase()));

  const lp = prompt.toLowerCase();

  if (lp.includes('summary') || lp.includes('overview')) {
    return `## Operations Summary

**Workforce:** ${volunteers.length} volunteers (${available.length} available)
**Tasks:** ${tasks.length} total — ${pending.length} pending, ${assigned.length} assigned, ${completed.length} completed
**High Urgency:** ${tasks.filter(t => t.urgency === 'high').length} tasks need immediate attention
**Efficiency:** ${tasks.length > 0 ? Math.round(((assigned.length + completed.length) / tasks.length) * 100) : 0}%

### Recommendations
${pending.length > available.length ? '- More tasks than available volunteers. Prioritize high-urgency tasks.' : '- Healthy volunteer-to-task ratio.'}
${gaps.length > 0 ? `- Skill gaps detected: ${gaps.join(', ')}` : '- No critical skill gaps.'}`;
  }

  if (lp.includes('skill') || lp.includes('gap')) {
    return `## Skill Analysis

**Available Skills:** ${allSkills.join(', ')}
**Required Skills:** ${requiredSkills.join(', ')}
${gaps.length > 0 ? `**Gaps:** ${gaps.join(', ')}` : '**No gaps detected**'}

### Top Skills by Volunteer Count
${Object.entries(volunteers.reduce((acc, v) => { v.skills?.forEach(s => acc[s] = (acc[s] || 0) + 1); return acc; }, {})).sort((a, b) => b[1] - a[1]).map(([s, c]) => `- ${s}: ${c} volunteers`).join('\n')}`;
  }

  return `## Analysis

**${volunteers.length}** volunteers | **${tasks.length}** tasks | **${allSkills.length}** unique skills

${pending.length > 0 ? `${pending.length} tasks await assignment.` : 'All tasks assigned or completed.'}
${available.length} volunteers currently available.

Ask about: task summaries, skill gaps, volunteer utilization, or optimization tips.`;
}

export async function getAISummary(prompt, context) {
  // Try Gemini first, fall back to local
  const geminiResponse = await getGeminiResponse(prompt, context);
  if (geminiResponse) return geminiResponse;
  return localAnalysis(prompt, context);
}
