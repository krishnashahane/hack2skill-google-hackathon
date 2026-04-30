import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ClipboardList, CheckCircle2, Clock, Star, ArrowRight, Sparkles,
  MapPin, Bell, Award, TrendingUp,
} from 'lucide-react';
import useStore from '../../store/useStore';
import useAuthStore from '../../store/useAuthStore';
import PageTransition from '../../components/PageTransition';
import UrgencyBadge from '../../components/UrgencyBadge';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function VolDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { tasks, fetchTasks } = useStore();

  useEffect(() => { fetchTasks().catch(() => {}); }, [fetchTasks]);

  const myAssigned = tasks.filter(t => t.assignedVolunteer === user?.id || t.assignedVolunteerName === user?.name);
  const myCompleted = myAssigned.filter(t => t.status === 'completed');
  const myActive = myAssigned.filter(t => t.status === 'assigned');
  const recommended = tasks.filter(t => t.status === 'pending').slice(0, 4);

  const impactHours = myCompleted.length * 4;
  const reliabilityScore = 94;

  return (
    <PageTransition>
      {/* Welcome */}
      <div className="mb-8 card p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600 font-medium">Welcome back,</p>
            <h1 className="text-2xl font-bold text-slate-900">{user?.name || 'Volunteer'}</h1>
            <p className="text-sm text-slate-500 mt-1">Here's your volunteer activity overview</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-white rounded-xl shadow-sm">
              <p className="text-2xl font-bold text-emerald-600">{impactHours}</p>
              <p className="text-[10px] text-slate-400">Impact Hours</p>
            </div>
            <div className="text-center px-4 py-2 bg-white rounded-xl shadow-sm">
              <p className="text-2xl font-bold text-indigo-600">{reliabilityScore}%</p>
              <p className="text-[10px] text-slate-400">Reliability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ClipboardList, label: 'Active Tasks', value: myActive.length, color: 'amber' },
          { icon: CheckCircle2, label: 'Completed', value: myCompleted.length, color: 'emerald' },
          { icon: Clock, label: 'Hours Given', value: impactHours, color: 'blue' },
          { icon: Star, label: 'Avg Rating', value: '4.8', color: 'amber' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-${s.color}-50 flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 text-${s.color}-500`} />
              </div>
              <span className="text-xs text-slate-400 font-medium">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Active Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> My Active Tasks
            </h2>
            <button onClick={() => navigate('/volunteer/tasks')} className="text-xs text-indigo-600 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {myActive.length > 0 ? (
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
              {myActive.map(task => (
                <motion.div key={task.id} variants={item} className="card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                    <UrgencyBadge urgency={task.urgency} />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {task.requiredSkills?.slice(0, 3).map(s => (
                      <span key={s} className="text-[10px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{s}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="card p-8 text-center text-sm text-slate-400">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              No active tasks. Check recommended tasks below!
            </div>
          )}
        </div>

        {/* Recommended Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" /> Recommended For You
            </h2>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {recommended.map(task => (
              <motion.div key={task.id} variants={item} whileHover={{ x: 4 }} className="card-hover p-4 cursor-pointer" onClick={() => navigate('/volunteer/tasks')}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                      <UrgencyBadge urgency={task.urgency} />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                      <MapPin className="w-3 h-3" /> {task.location?.lat?.toFixed(3) ?? '—'}, {task.location?.lng?.toFixed(3) ?? '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded-full">
                    <Award className="w-3 h-3" /> 85% Match
                  </div>
                </div>
              </motion.div>
            ))}
            {recommended.length === 0 && (
              <div className="card p-8 text-center text-sm text-slate-400">No tasks available right now</div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Impact Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 card p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Your Impact Journey</h3>
            <p className="text-sm text-indigo-100 mt-1">You've contributed {impactHours} hours to {myCompleted.length} community projects. Keep making a difference!</p>
          </div>
          <button onClick={() => navigate('/volunteer/impact')} className="px-4 py-2 bg-white text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-50 transition">
            View Full Impact
          </button>
        </div>
      </motion.div>
    </PageTransition>
  );
}
