import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  ClipboardList,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles,
  Database,
  TrendingUp,
  AlertTriangle,
  Activity,
  Clock3,
  ShieldCheck,
  RadioTower,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import StatCard from '../components/StatCard';
import UrgencyBadge from '../components/UrgencyBadge';
import PageTransition from '../components/PageTransition';
import { SkeletonCard, SkeletonList } from '../components/SkeletonLoader';
import MapView from '../components/MapView';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, tasks, volunteers, loading, fetchStats, fetchTasks, fetchVolunteers, seedData } = useStore();

  useEffect(() => {
    fetchStats().catch(() => {});
    fetchTasks().catch(() => {});
    fetchVolunteers().catch(() => {});
  }, [fetchStats, fetchTasks, fetchVolunteers]);

  const handleSeed = async () => {
    try {
      await seedData();
      toast.success('Demo data loaded successfully!');
    } catch {
      toast.error('Failed to seed data');
    }
  };

  const hasSomeData = (stats?.totalVolunteers || 0) + (stats?.totalTasks || 0) > 0;
  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const highUrgencyTasks = activeTasks.filter((t) => t.urgency === 'high');
  const availableVolunteers = volunteers.filter((v) => v.available);
  const uniqueSkills = new Set(volunteers.flatMap((v) => v.skills || [])).size;
  const coverage = volunteers.length > 0 ? Math.round((availableVolunteers.length / volunteers.length) * 100) : 0;
  const deploymentSignal =
    highUrgencyTasks.length > 0
      ? `${highUrgencyTasks.length} high urgency ${highUrgencyTasks.length === 1 ? 'task' : 'tasks'} need rapid assignment`
      : pendingTasks.length > 0
      ? `${pendingTasks.length} pending ${pendingTasks.length === 1 ? 'task is' : 'tasks are'} ready for matching`
      : 'All current work is assigned or completed';

  return (
    <PageTransition>
      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="p-5 sm:p-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live response desk
            </div>
            <h1 className="max-w-2xl text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Allocate the right volunteer before urgency becomes delay.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              SmartAlloc prioritizes active tasks, maps volunteer coverage, and explains each assignment with skill, distance, and availability signals.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {!hasSomeData && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSeed}
                  disabled={loading.seed}
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  {loading.seed ? 'Loading...' : 'Load Demo Data'}
                </motion.button>
              )}
              {hasSomeData && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSeed}
                  disabled={loading.seed}
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  {loading.seed ? 'Loading...' : 'Reset Demo Data'}
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/admin/match')}
                className="btn-primary inline-flex items-center justify-center gap-2 bg-slate-950 shadow-slate-300 hover:bg-slate-800"
              >
                <Sparkles className="w-4 h-4" />
                Run Matching
              </motion.button>
            </div>
          </div>
          <div className="border-t border-slate-200 bg-slate-950 p-5 text-white lg:border-l lg:border-t-0 sm:p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">
              <RadioTower className="h-4 w-4" />
              Dispatch Signal
            </div>
            <p className="mt-3 text-2xl font-bold leading-tight">{deploymentSignal}</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <p className="text-2xl font-bold">{availableVolunteers.length}</p>
                <p className="text-[11px] text-slate-300">available</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingTasks.length}</p>
                <p className="text-[11px] text-slate-300">pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{uniqueSkills}</p>
                <p className="text-[11px] text-slate-300">skills</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Operations Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">Real-time volunteer coordination overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      {loading.stats && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Volunteers" value={stats.totalVolunteers} color="indigo" delay={0} />
          <StatCard icon={ClipboardList} label="Active Tasks" value={stats.activeTasks} color="amber" delay={1} />
          <StatCard icon={CheckCircle2} label="Completed" value={stats.completedTasks} color="emerald" delay={2} />
          <StatCard icon={Zap} label="Efficiency" value={stats.efficiency} suffix="%" color="violet" delay={3} />
        </div>
      ) : null}

      {hasSomeData && (
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
          <div className="card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Activity className="h-4 w-4 text-cyan-600" />
              Coverage
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-950">{coverage}%</p>
            <p className="text-xs text-slate-500">{availableVolunteers.length} of {volunteers.length} volunteers are available now</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Clock3 className="h-4 w-4 text-amber-500" />
              Priority Queue
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-950">{highUrgencyTasks.length}</p>
            <p className="text-xs text-slate-500">high urgency active tasks need the fastest matches</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Skill Readiness
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-950">{uniqueSkills}</p>
            <p className="text-xs text-slate-500">distinct capabilities represented in the volunteer pool</p>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Active Tasks
            </h2>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/admin/tasks')}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>

          {loading.tasks && tasks.length === 0 ? (
            <SkeletonList count={3} />
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
              {activeTasks.slice(0, 5).map((task) => (
                <motion.div
                  key={task.id}
                  variants={item}
                  whileHover={{ x: 4 }}
                  className="card-hover p-4 cursor-pointer"
                  onClick={() => navigate(`/admin/match?taskId=${task.id}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{task.title}</h3>
                        <UrgencyBadge urgency={task.urgency} />
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {task.requiredSkills?.slice(0, 3).map((s) => (
                          <span key={s} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {task.status === 'assigned' ? (
                        <span className="badge-assigned text-[10px]">Assigned</span>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/match?taskId=${task.id}`);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Sparkles className="w-3 h-3" />
                          Match
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {activeTasks.length === 0 && (
                <div className="text-center py-8 text-sm text-slate-400">No active tasks</div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Map Preview */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Activity Map
            </h2>
            <MapView
              volunteers={volunteers}
              tasks={tasks.filter((t) => t.status !== 'completed')}
              height="220px"
            />
          </div>

          {/* Recent Volunteers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900">Recent Volunteers</h2>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/admin/volunteers')}
                className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </motion.button>
            </div>
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
              {volunteers.slice(0, 4).map((vol) => (
                <motion.div
                  key={vol.id}
                  variants={item}
                  className="flex items-center gap-3 p-3 card-hover"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {vol.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{vol.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{vol.skills?.slice(0, 2).join(', ')}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${vol.available ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </motion.div>
              ))}
              {volunteers.length === 0 && !loading.volunteers && (
                <div className="text-center py-6 text-sm text-slate-400">No volunteers yet</div>
              )}
            </motion.div>
          </div>

          {/* Quick Stats */}
          {stats && stats.highUrgency > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-semibold text-rose-700">Urgent Attention</span>
              </div>
              <p className="text-sm text-rose-600">
                <span className="font-bold">{stats.highUrgency}</span> high-priority task{stats.highUrgency > 1 ? 's' : ''} need{stats.highUrgency === 1 ? 's' : ''} matching
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
