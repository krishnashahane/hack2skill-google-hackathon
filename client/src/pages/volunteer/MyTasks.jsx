import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle2, Clock, MapPin, MessageSquare, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../../store/useStore';
import useAuthStore from '../../store/useAuthStore';
import PageTransition from '../../components/PageTransition';
import UrgencyBadge from '../../components/UrgencyBadge';
import SlideOver from '../../components/SlideOver';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function MyTasks() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, completeTask, assignTaskToVolunteer } = useStore();
  const [filter, setFilter] = useState('all');
  const [showFeedback, setShowFeedback] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });

  useEffect(() => { fetchTasks().catch(() => {}); }, [fetchTasks]);

  const allTasks = tasks;
  const myTasks = allTasks.filter(t => t.assignedVolunteer === user?.id || t.assignedVolunteerName === user?.name);
  const pendingTasks = allTasks.filter(t => t.status === 'pending');

  const displayTasks = filter === 'assigned' ? myTasks.filter(t => t.status === 'assigned')
    : filter === 'completed' ? myTasks.filter(t => t.status === 'completed')
    : filter === 'available' ? pendingTasks
    : [...myTasks, ...pendingTasks.filter(t => !myTasks.find(m => m.id === t.id))];

  const handleAccept = async (taskId) => {
    try {
      await assignTaskToVolunteer(taskId, user.id);
      toast.success('Task accepted!');
    } catch { toast.error('Failed to accept task'); }
  };

  const handleComplete = async (taskId) => {
    try {
      await completeTask(taskId);
      toast.success('Task completed!');
    } catch { toast.error('Failed to complete task'); }
  };

  const handleFeedbackSubmit = () => {
    toast.success('Feedback submitted! Thank you.');
    setShowFeedback(null);
    setFeedback({ rating: 5, comment: '' });
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Tasks</h1>
          <p className="text-sm text-slate-500 mt-0.5">{myTasks.length} assigned, {pendingTasks.length} available</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'available', 'assigned', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`text-xs px-4 py-2 rounded-lg font-medium capitalize transition ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
            {f}
          </button>
        ))}
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {displayTasks.map(task => {
          const isMine = myTasks.find(t => t.id === task.id);
          return (
            <motion.div key={task.id} variants={item} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                    <UrgencyBadge urgency={task.urgency} />
                    {isMine && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {task.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{task.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-1">
                      {task.requiredSkills?.map(s => (
                        <span key={s} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{s}</span>
                      ))}
                    </div>
                    {task.location && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {task.location.lat.toFixed(3)}, {task.location.lng.toFixed(3)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!isMine && task.status === 'pending' && (
                    <button onClick={() => handleAccept(task.id)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg hover:bg-emerald-100 transition">
                      <CheckCircle2 className="w-3 h-3" /> Accept
                    </button>
                  )}
                  {isMine && task.status === 'assigned' && (
                    <>
                      <button onClick={() => handleComplete(task.id)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg hover:bg-emerald-100 transition">
                        <CheckCircle2 className="w-3 h-3" /> Complete
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-500 text-xs font-medium rounded-lg hover:bg-slate-100 transition">
                        <Clock className="w-3 h-3" /> Update
                      </button>
                    </>
                  )}
                  {isMine && task.status === 'completed' && (
                    <button onClick={() => setShowFeedback(task)} className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 text-xs font-medium rounded-lg hover:bg-amber-100 transition">
                      <MessageSquare className="w-3 h-3" /> Feedback
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {displayTasks.length === 0 && (
          <div className="text-center py-12 text-sm text-slate-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            No tasks found
          </div>
        )}
      </motion.div>

      {/* Feedback Modal */}
      <SlideOver open={!!showFeedback} onClose={() => setShowFeedback(null)} title="Submit Feedback">
        {showFeedback && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-700">Task: {showFeedback.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => setFeedback(f => ({ ...f, rating: s }))} className="p-1">
                    <Star className={`w-8 h-8 transition ${s <= feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Comments</label>
              <textarea
                value={feedback.comment}
                onChange={(e) => setFeedback(f => ({ ...f, comment: e.target.value }))}
                rows={4}
                className="input resize-none"
                placeholder="Share your experience..."
              />
            </div>
            <button onClick={handleFeedbackSubmit} className="btn-primary w-full">Submit Feedback</button>
          </div>
        )}
      </SlideOver>
    </PageTransition>
  );
}
