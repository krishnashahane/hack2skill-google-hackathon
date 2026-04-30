import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Trophy,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Users,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import PageTransition from '../components/PageTransition';
import ScoreBar from '../components/ScoreBar';
import UrgencyBadge from '../components/UrgencyBadge';
import MapView from '../components/MapView';
import EmptyState from '../components/EmptyState';

export default function MatchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const taskId = searchParams.get('taskId');
  const { matches, matchTask, tasks, loading, fetchMatches, fetchTasks, assignTaskToVolunteer, clearMatches } = useStore();
  const [assigning, setAssigning] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const [selectedTask, setSelectedTask] = useState(taskId || '');

  useEffect(() => {
    fetchTasks().catch(() => {});
    return () => clearMatches();
  }, [fetchTasks, clearMatches]);

  useEffect(() => {
    if (taskId) {
      setSelectedTask(taskId);
      fetchMatches(taskId).catch(() => {});
    }
  }, [taskId, fetchMatches]);

  const handleMatch = () => {
    if (!selectedTask) {
      toast.error('Select a task first');
      return;
    }
    navigate(`/admin/match?taskId=${selectedTask}`, { replace: true });
    fetchMatches(selectedTask).catch(() => toast.error('Failed to find matches'));
  };

  const handleAssign = async (volunteerId) => {
    if (!matchTask) return;
    setAssigning(true);
    try {
      await assignTaskToVolunteer(matchTask.id, volunteerId);
      setAssigned(true);
      toast.success('Volunteer assigned successfully!', { icon: '🎉' });
      setTimeout(() => navigate('/admin'), 2000);
    } catch {
      toast.error('Failed to assign volunteer');
    } finally {
      setAssigning(false);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending');

  // Prepare map data
  const connections =
    matches && matchTask
      ? matches.map((m) => ({
          from: matchTask.location,
          to: m.volunteerLocation,
          color: m.isBestMatch ? '#6366f1' : m.rank === 2 ? '#8b5cf6' : '#a78bfa',
        }))
      : [];

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Intelligent Matching</h1>
          <p className="text-sm text-slate-500 mt-0.5">AI-powered volunteer-task matching engine</p>
        </div>
      </div>

      {/* Task Selector (if no taskId) */}
      {!taskId && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Select a Task to Match</h2>
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-slate-400">No pending tasks available. Create a task first.</p>
          ) : (
            <div className="flex gap-3">
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="input flex-1"
              >
                <option value="">Choose a task...</option>
                {pendingTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.urgency} urgency)
                  </option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleMatch}
                disabled={!selectedTask}
                className="btn-primary flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Find Matches
              </motion.button>
            </div>
          )}
        </motion.div>
      )}

      {/* Loading */}
      {loading.matches && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          >
            <Loader2 className="w-8 h-8 text-indigo-600" />
          </motion.div>
          <p className="text-sm text-slate-500 mt-3">Running matching algorithm...</p>
        </motion.div>
      )}

      {/* Success Animation */}
      <AnimatePresence>
        {assigned && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-sm mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Successfully Assigned!</h2>
              <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {matches && matchTask && !loading.matches && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Task Info */}
          <div className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-semibold text-slate-900">{matchTask.title}</h2>
                  <UrgencyBadge urgency={matchTask.urgency} />
                </div>
                <p className="text-sm text-slate-400 mb-2">{matchTask.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {matchTask.requiredSkills?.map((s) => (
                    <span key={s} className="text-[10px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {matchTask.location && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {matchTask.location.lat.toFixed(3)}, {matchTask.location.lng.toFixed(3)}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <MapView
            tasks={[matchTask]}
            volunteers={matches}
            connections={connections}
            height="300px"
          />

          {/* Match Cards */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Top {matches.length} Matches
            </h2>

            {matches.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No matches found"
                description="No volunteers available for this task's requirements."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matches.map((match, index) => (
                  <motion.div
                    key={match.volunteerId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                    className={`card relative overflow-hidden ${
                      match.isBestMatch ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-100' : ''
                    }`}
                  >
                    {/* Best Match Badge */}
                    {match.isBestMatch && (
                      <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-400 to-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                        <Star className="w-3 h-3 inline mr-0.5 -mt-0.5" />
                        BEST MATCH
                      </div>
                    )}

                    <div className="p-5">
                      {/* Rank + Score */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm ${
                            match.isBestMatch
                              ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-200'
                              : 'bg-gradient-to-br from-indigo-500 to-violet-500 shadow-indigo-200'
                          }`}>
                            {match.volunteerName?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">{match.volunteerName}</h3>
                            <p className="text-[11px] text-slate-400">{match.volunteerEmail}</p>
                          </div>
                        </div>
                      </div>

                      {/* Overall Score */}
                      <div className="mb-4 p-3 rounded-xl bg-slate-50">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-xs font-medium text-slate-500">Match Score</span>
                          <span className="text-2xl font-bold text-slate-900">{match.totalScore}</span>
                        </div>
                        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${match.totalScore}%` }}
                            transition={{ delay: index * 0.15 + 0.3, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className={`h-full rounded-full ${
                              match.isBestMatch
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                : 'bg-gradient-to-r from-indigo-500 to-violet-500'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Breakdown */}
                      <div className="space-y-2.5 mb-4">
                        <ScoreBar label="Skill Match" score={match.breakdown.skill} max={50} color="indigo" delay={index} />
                        <ScoreBar label="Proximity" score={match.breakdown.proximity} max={30} color="emerald" delay={index} />
                        <ScoreBar label="Availability" score={match.breakdown.availability} max={20} color="amber" delay={index} />
                      </div>

                      {/* Matched Skills */}
                      <div className="mb-4">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">Matched Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {match.matchedSkills?.map((s) => (
                            <span key={s} className="text-[10px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
                              {s}
                            </span>
                          ))}
                          {match.matchedSkills?.length === 0 && (
                            <span className="text-[10px] text-slate-400">No skill overlap</span>
                          )}
                        </div>
                      </div>

                      {/* Distance */}
                      {match.distance !== null && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                          <MapPin className="w-3 h-3" />
                          {match.distance} km away
                        </div>
                      )}

                      {/* Availability */}
                      <div className="flex items-center gap-1.5 text-xs mb-4">
                        <div className={`w-2 h-2 rounded-full ${match.volunteerAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className={match.volunteerAvailable ? 'text-emerald-600' : 'text-slate-400'}>
                          {match.volunteerAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>

                      {/* Assign Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAssign(match.volunteerId)}
                        disabled={assigning || assigned}
                        className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          match.isBestMatch
                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-sm shadow-amber-200 hover:shadow-md hover:shadow-amber-200'
                            : 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700'
                        } disabled:opacity-50`}
                      >
                        {assigning ? 'Assigning...' : match.isBestMatch ? 'Assign Best Match' : 'Assign Volunteer'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* No Task Selected */}
      {!taskId && !matches && !loading.matches && (
        <EmptyState
          icon={Sparkles}
          title="Select a task to begin matching"
          description="Choose a pending task from the dropdown above to find the best available volunteers."
        />
      )}
    </PageTransition>
  );
}
