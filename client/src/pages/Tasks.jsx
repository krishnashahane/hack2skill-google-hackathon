import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, MapPin, Sparkles, Search, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import PageTransition from '../components/PageTransition';
import SlideOver from '../components/SlideOver';
import EmptyState from '../components/EmptyState';
import UrgencyBadge from '../components/UrgencyBadge';
import MapView from '../components/MapView';
import { SkeletonList } from '../components/SkeletonLoader';
import { SKILLS, STATUS_CONFIG } from '../lib/constants';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const emptyForm = {
  title: '',
  description: '',
  requiredSkills: [],
  urgency: 'medium',
  location: null,
};

export default function Tasks() {
  const navigate = useNavigate();
  const { tasks, loading, fetchTasks, addTask, completeTask } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks().catch(() => {});
  }, [fetchTasks]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.requiredSkills.length === 0) errs.requiredSkills = 'Select at least one skill';
    if (!form.location) errs.location = 'Set location on map';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await addTask(form);
      toast.success(`Task "${form.title}" created!`);
      setForm(emptyForm);
      setShowForm(false);
    } catch {
      toast.error('Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSkill = (skill) => {
    setForm((f) => ({
      ...f,
      requiredSkills: f.requiredSkills.includes(skill)
        ? f.requiredSkills.filter((s) => s !== skill)
        : [...f.requiredSkills, skill],
    }));
  };

  const handleComplete = async (e, taskId) => {
    e.stopPropagation();
    try {
      await completeTask(taskId);
      toast.success('Task marked complete!');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const filtered = tasks
    .filter((t) => {
      if (filter === 'pending') return t.status === 'pending';
      if (filter === 'assigned') return t.status === 'assigned';
      if (filter === 'completed') return t.status === 'completed';
      return true;
    })
    .filter(
      (t) =>
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.requiredSkills?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tasks</h1>
          <p className="text-sm text-slate-500 mt-0.5">{tasks.length} total tasks</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </motion.button>
      </div>

      {/* Filters + Search */}
      {tasks.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'assigned', 'completed'].map((f) => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f)}
                className={`text-xs px-3.5 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Task List */}
      {loading.tasks && tasks.length === 0 ? (
        <SkeletonList count={4} />
      ) : filtered.length === 0 && tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks yet"
          description="Create your first task and find the best volunteers to handle it."
          action={
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowForm(true)} className="btn-primary">
              Create Task
            </motion.button>
          }
        />
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {filtered.map((task) => {
            const statusConf = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
            return (
              <motion.div
                key={task.id}
                variants={item}
                whileHover={{ x: 4 }}
                className="card-hover p-5 cursor-pointer"
                onClick={() => navigate(`/admin/match?taskId=${task.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                      <UrgencyBadge urgency={task.urgency} />
                      <span className={`badge ${statusConf.bg} ${statusConf.text} text-[10px]`}>{statusConf.label}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-wrap gap-1.5">
                        {task.requiredSkills?.map((s) => (
                          <span key={s} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                      {task.location && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 flex-shrink-0">
                          <MapPin className="w-3 h-3" />
                          {task.location.lat.toFixed(3)}, {task.location.lng.toFixed(3)}
                        </div>
                      )}
                    </div>
                    {task.assignedVolunteerName && (
                      <div className="mt-2 text-xs text-blue-600 font-medium">
                        Assigned to: {task.assignedVolunteerName}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {task.status === 'assigned' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleComplete(e, task.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Complete
                      </motion.button>
                    )}
                    {task.status === 'pending' && (
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
                        Find Match
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && tasks.length > 0 && (
            <div className="text-center py-8 text-sm text-slate-400">No tasks match your filters</div>
          )}
        </motion.div>
      )}

      {/* Create Task Slide-Over */}
      <SlideOver open={showForm} onClose={() => setShowForm(false)} title="Create Task">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g., Emergency Medical Camp"
              className={`input ${errors.title ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500' : ''}`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the task..."
              rows={3}
              className="input resize-none"
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Urgency Level</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((u) => (
                <motion.button
                  key={u}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setForm((f) => ({ ...f, urgency: u }))}
                  className={`flex-1 text-xs py-2.5 rounded-xl font-medium capitalize transition-all duration-200 ${
                    form.urgency === u
                      ? u === 'high'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : u === 'medium'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {u}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Required Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <motion.button
                  key={skill}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSkill(skill)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
                    form.requiredSkills.includes(skill)
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {skill}
                </motion.button>
              ))}
            </div>
            {errors.requiredSkills && <p className="text-xs text-rose-500 mt-1">{errors.requiredSkills}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Location</label>
            <MapView
              selectedLocation={form.location}
              onMapClick={(loc) => setForm((f) => ({ ...f, location: loc }))}
              height="200px"
            />
            {form.location && (
              <p className="text-xs text-slate-500 mt-1.5">
                Selected: {form.location.lat}, {form.location.lng}
              </p>
            )}
            {errors.location && <p className="text-xs text-rose-500 mt-1">{errors.location}</p>}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </SlideOver>
    </PageTransition>
  );
}
