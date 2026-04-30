import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Award, TrendingUp, Clock, CheckCircle2, Star, Heart, Users, MapPin,
  Calendar, Target,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useStore from '../../store/useStore';
import useAuthStore from '../../store/useAuthStore';
import PageTransition from '../../components/PageTransition';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function Impact() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks } = useStore();

  useEffect(() => { fetchTasks().catch(() => {}); }, [fetchTasks]);

  const impactHistory = [
    { task: 'Emergency Medical Camp', date: '2026-04-15', hours: 6, category: 'Health', rating: 5 },
    { task: 'Community Kitchen Setup', date: '2026-04-10', hours: 4, category: 'Food', rating: 4 },
    { task: 'School Tutoring Program', date: '2026-04-05', hours: 3, category: 'Education', rating: 5 },
    { task: 'Shelter Repair Drive', date: '2026-03-28', hours: 8, category: 'Infrastructure', rating: 5 },
    { task: 'Health Awareness Camp', date: '2026-03-20', hours: 5, category: 'Health', rating: 4 },
    { task: 'Tree Plantation Drive', date: '2026-03-15', hours: 4, category: 'Environment', rating: 5 },
  ];

  const totalHours = impactHistory.reduce((a, h) => a + h.hours, 0);
  const avgRating = (impactHistory.reduce((a, h) => a + h.rating, 0) / impactHistory.length).toFixed(1);

  const trendData = useMemo(() =>
    ['Jan', 'Feb', 'Mar', 'Apr'].map(m => ({ month: m, hours: Math.floor(Math.random() * 15) + 5 })),
  []);

  const categories = useMemo(() => {
    const map = {};
    impactHistory.forEach(h => { map[h.category] = (map[h.category] || 0) + h.hours; });
    return Object.entries(map).map(([name, hours]) => ({ name, hours })).sort((a, b) => b.hours - a.hours);
  }, []);

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" /> Impact Summary
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Your contributions to the community</p>
      </div>

      {/* Hero Stats */}
      <div className="card p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { icon: Clock, label: 'Total Hours', value: totalHours },
            { icon: CheckCircle2, label: 'Tasks Done', value: impactHistory.length },
            { icon: Star, label: 'Avg Rating', value: avgRating },
            { icon: Heart, label: 'Lives Impacted', value: '120+' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <s.icon className="w-6 h-6 mx-auto mb-2 text-indigo-200" />
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-xs text-indigo-200 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Hours Trend */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Hours Over Time
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="hours" stroke="#6366f1" fill="#eef2ff" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Categories */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-500" /> By Category
          </h3>
          <div className="space-y-3">
            {categories.map(c => (
              <div key={c.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{c.name}</span>
                  <span className="text-slate-400">{c.hours}h</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.hours / totalHours) * 100}%` }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-blue-500" /> Activity History
      </h3>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
        {impactHistory.map((h, i) => (
          <motion.div key={i} variants={fadeUp} className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{h.task}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[10px] text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {h.date}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {h.hours}h</span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{h.category}</span>
              </div>
            </div>
            <div className="flex gap-0.5 flex-shrink-0">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-3 h-3 ${s <= h.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Badges */}
      <div className="mt-8">
        <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" /> Badges Earned
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'First Task', icon: CheckCircle2, color: 'emerald', desc: 'Completed your first task' },
            { name: 'Reliable', icon: Star, color: 'amber', desc: '90%+ reliability score' },
            { name: 'Team Player', icon: Users, color: 'blue', desc: 'Worked with 5+ volunteers' },
            { name: 'Impact Maker', icon: Heart, color: 'rose', desc: 'Contributed 20+ hours' },
          ].map(b => (
            <motion.div key={b.name} whileHover={{ y: -2 }} className="card p-4 text-center">
              <div className={`w-12 h-12 rounded-xl bg-${b.color}-50 flex items-center justify-center mx-auto mb-2`}>
                <b.icon className={`w-6 h-6 text-${b.color}-500`} />
              </div>
              <p className="text-sm font-semibold text-slate-900">{b.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
