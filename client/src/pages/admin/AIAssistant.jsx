import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, Loader2, Lightbulb, BarChart3, Users, Zap } from 'lucide-react';
import useStore from '../../store/useStore';
import PageTransition from '../../components/PageTransition';

const QUICK_PROMPTS = [
  { label: 'Summarize active tasks', icon: BarChart3, prompt: 'Give me a summary of all active tasks and their urgency levels.' },
  { label: 'Volunteer recommendations', icon: Users, prompt: 'Which volunteers are most underutilized and should be assigned more tasks?' },
  { label: 'Matching insights', icon: Zap, prompt: 'What are the top skill gaps between our volunteer pool and pending tasks?' },
  { label: 'Optimization tips', icon: Lightbulb, prompt: 'How can we improve our volunteer coordination efficiency?' },
];

function generateAIResponse(prompt, tasks, volunteers) {
  const pending = tasks.filter(t => t.status === 'pending');
  const assigned = tasks.filter(t => t.status === 'assigned');
  const completed = tasks.filter(t => t.status === 'completed');
  const available = volunteers.filter(v => v.available);
  const allSkills = [...new Set(volunteers.flatMap(v => v.skills || []))];
  const requiredSkills = [...new Set(tasks.flatMap(t => t.requiredSkills || []))];
  const gaps = requiredSkills.filter(s => !allSkills.map(x => x.toLowerCase()).includes(s.toLowerCase()));

  const lp = prompt.toLowerCase();

  if (lp.includes('summary') || lp.includes('active') || lp.includes('overview')) {
    return `## Task Summary\n\n- **${pending.length}** pending tasks awaiting assignment\n- **${assigned.length}** tasks currently in progress\n- **${completed.length}** tasks completed\n- **${tasks.filter(t => t.urgency === 'high').length}** high-urgency tasks need immediate attention\n\n### High Priority Tasks:\n${tasks.filter(t => t.urgency === 'high' && t.status === 'pending').map(t => `- **${t.title}**: Requires ${t.requiredSkills?.join(', ')}`).join('\n') || '- All high-priority tasks are handled!'}\n\n### Recommendation:\n${pending.length > available.length ? 'You have more pending tasks than available volunteers. Consider prioritizing high-urgency tasks and reaching out for more volunteers.' : 'Your volunteer-to-task ratio looks healthy. Focus on matching quality over speed.'}`;
  }

  if (lp.includes('underutilized') || lp.includes('volunteer') && lp.includes('recommend')) {
    const unassigned = volunteers.filter(v => v.available && !assigned.some(t => t.assignedVolunteer === v.id));
    return `## Underutilized Volunteers\n\n${unassigned.length > 0 ? unassigned.map(v => `- **${v.name}** — Skills: ${v.skills?.join(', ')}. Currently available but unassigned.`).join('\n') : '- All available volunteers are assigned!'}\n\n### Action Items:\n1. Review pending tasks that match these volunteers' skills\n2. Consider cross-training volunteers for higher flexibility\n3. ${available.length} of ${volunteers.length} volunteers are currently available (${Math.round(available.length/volunteers.length*100)}% availability rate)`;
  }

  if (lp.includes('skill gap') || lp.includes('gaps')) {
    return `## Skill Gap Analysis\n\n### Skills in Demand but Short Supply:\n${gaps.length > 0 ? gaps.map(g => `- **${g}**: Required by tasks but no volunteer has this skill`).join('\n') : '- No critical skill gaps detected!'}\n\n### Most Common Skills:\n${Object.entries(volunteers.reduce((acc, v) => { v.skills?.forEach(s => { acc[s] = (acc[s] || 0) + 1; }); return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s, c]) => `- ${s}: ${c} volunteers`).join('\n')}\n\n### Recommendation:\nFocus recruitment on skills with highest demand-supply mismatch. Consider partnering with professional organizations for specialized skills.`;
  }

  if (lp.includes('efficiency') || lp.includes('optimization') || lp.includes('improve')) {
    const efficiency = tasks.length > 0 ? Math.round(((assigned.length + completed.length) / tasks.length) * 100) : 0;
    return `## Optimization Insights\n\n### Current Metrics:\n- **Efficiency Rate**: ${efficiency}%\n- **Volunteer Utilization**: ${Math.round(assigned.length / Math.max(available.length, 1) * 100)}%\n- **Avg Skills per Volunteer**: ${(volunteers.reduce((a, v) => a + (v.skills?.length || 0), 0) / Math.max(volunteers.length, 1)).toFixed(1)}\n\n### Recommendations:\n1. **Automate matching** for low-urgency tasks to free coordinator time\n2. **Batch similar tasks** in same location for efficiency\n3. **Pre-assign volunteers** for recurring tasks based on past performance\n4. **Implement shift scheduling** to ensure continuous coverage\n5. **Enable volunteer self-service** for task acceptance to reduce admin overhead\n\n### Priority Actions:\n${pending.filter(t => t.urgency === 'high').length > 0 ? '- Immediately match high-urgency pending tasks' : '- No urgent actions needed'}\n- Review volunteer availability for upcoming week\n- Send reminders for upcoming task deadlines`;
  }

  return `## Analysis\n\nBased on current data:\n- **${volunteers.length}** volunteers registered (${available.length} available)\n- **${tasks.length}** total tasks (${pending.length} pending, ${assigned.length} assigned, ${completed.length} completed)\n- **${allSkills.length}** unique skills across the volunteer pool\n\nI can help with:\n- Task summaries and prioritization\n- Volunteer matching recommendations\n- Skill gap analysis\n- Coordination efficiency tips\n\nTry asking a more specific question about your volunteer operations!`;
}

export default function AIAssistant() {
  const { tasks, volunteers, fetchTasks, fetchVolunteers } = useStore();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI coordination assistant powered by Gemini. I can help you with task summaries, volunteer recommendations, skill gap analysis, and optimization insights. What would you like to know?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    fetchTasks().catch(() => {});
    fetchVolunteers().catch(() => {});
  }, [fetchTasks, fetchVolunteers]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    let response;
    try {
      // Try Gemini API directly from browser
      const pending = tasks.filter(t => t.status === 'pending');
      const assigned = tasks.filter(t => t.status === 'assigned');
      const completed = tasks.filter(t => t.status === 'completed');
      const available = volunteers.filter(v => v.available);
      const allSkills = [...new Set(volunteers.flatMap(v => v.skills || []))];

      const systemPrompt = `You are an AI assistant for NGO Hub, a volunteer coordination platform.
Context: ${volunteers.length} volunteers (${available.length} available), ${tasks.length} tasks (${pending.length} pending, ${assigned.length} assigned, ${completed.length} completed).
Skills pool: ${allSkills.join(', ')}.
High urgency tasks: ${tasks.filter(t => t.urgency === 'high').map(t => t.title).join(', ') || 'None'}.
Respond with actionable insights in markdown format. Be concise and specific.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDJ2apMPWz3yrJ4IuMtoQGyVgufOAKCocU`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser query: ${text}` }] }],
        }),
      });
      const data = await res.json();
      const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (geminiText) {
        response = geminiText;
      } else {
        response = generateAIResponse(text, tasks, volunteers);
      }
    } catch {
      response = generateAIResponse(text, tasks, volunteers);
    }

    setMessages(m => [...m, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-600" />
          AI Assistant
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Gemini-powered insights for smarter coordination</p>
      </div>

      {/* Quick Prompts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
        {QUICK_PROMPTS.map(qp => (
          <motion.button
            key={qp.label}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => sendMessage(qp.prompt)}
            disabled={loading}
            className="card p-3 text-left hover:border-violet-200 hover:bg-violet-50/50 transition disabled:opacity-50"
          >
            <qp.icon className="w-4 h-4 text-violet-500 mb-1.5" />
            <p className="text-xs font-medium text-slate-700">{qp.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Chat */}
      <div className="card flex flex-col" style={{ height: 'calc(100vh - 320px)', minHeight: '400px' }}>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-violet-600" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-slate-50 text-slate-700 rounded-tl-sm border border-slate-100'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm prose-slate max-w-none [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-0 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:my-1 [&_li]:my-0.5 [&_strong]:text-slate-900">
                      {msg.content.split('\n').map((line, j) => {
                        if (line.startsWith('## ')) return <h2 key={j}>{line.slice(3)}</h2>;
                        if (line.startsWith('### ')) return <h3 key={j}>{line.slice(4)}</h3>;
                        if (line.startsWith('- ')) {
                          const parts = line.slice(2).split('**');
                          return (
                            <div key={j} className="flex gap-1.5 my-0.5">
                              <span className="text-violet-400 mt-0.5">•</span>
                              <span>{parts.map((p, k) => k % 2 === 1 ? <strong key={k}>{p}</strong> : p)}</span>
                            </div>
                          );
                        }
                        if (line.match(/^\d+\./)) {
                          const parts = line.split('**');
                          return <div key={j} className="my-0.5">{parts.map((p, k) => k % 2 === 1 ? <strong key={k}>{p}</strong> : p)}</div>;
                        }
                        if (line.trim() === '') return <div key={j} className="h-2" />;
                        const parts = line.split('**');
                        return <p key={j}>{parts.map((p, k) => k % 2 === 1 ? <strong key={k}>{p}</strong> : p)}</p>;
                      })}
                    </div>
                  ) : msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-violet-600" />
              </div>
              <div className="bg-slate-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing data...
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-slate-100 p-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about tasks, volunteers, or get AI insights..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
            disabled={loading}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </PageTransition>
  );
}
