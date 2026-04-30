import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, TrendingUp, User } from 'lucide-react';
import PageTransition from '../../components/PageTransition';

const DEMO_FEEDBACK = [
  { id: 1, volunteer: 'Priya Sharma', task: 'Emergency Medical Camp', rating: 5, comment: 'Excellent coordination. The AI matching was spot on - my nursing skills were exactly what was needed.', date: '2026-04-28', reliability: 98 },
  { id: 2, volunteer: 'Rahul Patel', task: 'Community Kitchen Setup', rating: 4, comment: 'Great experience. Would have liked more advance notice. The cooking team was well-organized.', date: '2026-04-27', reliability: 92 },
  { id: 3, volunteer: 'Vikram Singh', task: 'Shelter Repair Drive', rating: 5, comment: 'Very impactful work. My construction skills were put to great use. The location matching saved time.', date: '2026-04-26', reliability: 95 },
  { id: 4, volunteer: 'Ananya Iyer', task: 'School Tutoring Program', rating: 4, comment: 'Enjoyed teaching the children. Good task assignment process. Communication could be improved.', date: '2026-04-25', reliability: 88 },
  { id: 5, volunteer: 'Arjun Nair', task: 'IT Infrastructure Setup', rating: 3, comment: 'Task was straightforward but took longer than estimated. Better time estimates would help.', date: '2026-04-24', reliability: 82 },
  { id: 6, volunteer: 'Meera Joshi', task: 'Health Awareness Workshop', rating: 5, comment: 'Perfectly organized. My counseling background made this a natural fit. Will volunteer again!', date: '2026-04-23', reliability: 96 },
];

export default function Feedback() {
  const [feedbacks] = useState(DEMO_FEEDBACK);
  const avgRating = (feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length).toFixed(1);
  const avgReliability = Math.round(feedbacks.reduce((a, f) => a + f.reliability, 0) / feedbacks.length);

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          Feedback & Ratings
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Volunteer feedback and reliability scores</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
            <Star className="w-4 h-4 text-amber-500" /> Average Rating
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">{avgRating}</span>
            <span className="text-sm text-slate-400">/ 5.0</span>
          </div>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={`w-4 h-4 ${i <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Avg Reliability
          </div>
          <span className="text-4xl font-bold text-slate-900">{avgReliability}%</span>
          <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${avgReliability}%` }} />
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
            <ThumbsUp className="w-4 h-4 text-blue-500" /> Total Reviews
          </div>
          <span className="text-4xl font-bold text-slate-900">{feedbacks.length}</span>
          <p className="text-xs text-slate-400 mt-2">From {new Set(feedbacks.map(f => f.volunteer)).size} volunteers</p>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbacks.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                  {f.volunteer.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{f.volunteer}</p>
                  <p className="text-xs text-slate-400">{f.task}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= f.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{f.date}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">"{f.comment}"</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Reliability Score:</span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${f.reliability >= 90 ? 'bg-emerald-500' : f.reliability >= 80 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${f.reliability}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-700">{f.reliability}%</span>
              </div>
              <div className="flex gap-2">
                <button className="p-1 rounded hover:bg-emerald-50 text-emerald-500"><ThumbsUp className="w-3.5 h-3.5" /></button>
                <button className="p-1 rounded hover:bg-rose-50 text-slate-300 hover:text-rose-400"><ThumbsDown className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
}
