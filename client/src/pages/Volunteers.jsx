import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, MapPin, Mail, Phone, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import PageTransition from '../components/PageTransition';
import SlideOver from '../components/SlideOver';
import EmptyState from '../components/EmptyState';
import MapView from '../components/MapView';
import { SkeletonList } from '../components/SkeletonLoader';
import { SKILLS, DEFAULT_CENTER } from '../lib/constants';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  skills: [],
  available: true,
  location: null,
};

export default function Volunteers() {
  const { volunteers, loading, fetchVolunteers, addVolunteer } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVolunteers().catch(() => {});
  }, [fetchVolunteers]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (form.skills.length === 0) errs.skills = 'Select at least one skill';
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
      await addVolunteer(form);
      toast.success(`${form.name} added successfully!`);
      setForm(emptyForm);
      setShowForm(false);
    } catch {
      toast.error('Failed to add volunteer');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSkill = (skill) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter((s) => s !== skill) : [...f.skills, skill],
    }));
  };

  const filtered = volunteers.filter(
    (v) =>
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Volunteers</h1>
          <p className="text-sm text-slate-500 mt-0.5">{volunteers.length} registered volunteers</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Volunteer
        </motion.button>
      </div>

      {/* Search */}
      {volunteers.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      )}

      {/* Grid */}
      {loading.volunteers && volunteers.length === 0 ? (
        <SkeletonList count={4} />
      ) : filtered.length === 0 && volunteers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No volunteers yet"
          description="Add your first volunteer to get started with smart matching."
          action={
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowForm(true)} className="btn-primary">
              Add Volunteer
            </motion.button>
          }
        />
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((vol) => (
            <motion.div
              key={vol.id}
              variants={item}
              whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
              className="card p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-indigo-200 flex-shrink-0">
                  {vol.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{vol.name}</h3>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${vol.available ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{vol.email}</span>
                  </div>
                </div>
              </div>

              {vol.phone && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                  <Phone className="w-3 h-3" />
                  {vol.phone}
                </div>
              )}

              {vol.location && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                  <MapPin className="w-3 h-3" />
                  {vol.location.lat.toFixed(4)}, {vol.location.lng.toFixed(4)}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {vol.skills?.map((skill) => (
                  <span key={skill} className="text-[10px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Volunteer Slide-Over */}
      <SlideOver open={showForm} onClose={() => setShowForm(false)} title="Add Volunteer">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g., Priya Sharma"
              className={`input ${errors.name ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500' : ''}`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="priya@example.com"
              className={`input ${errors.email ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500' : ''}`}
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone (optional)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+91 98765 43210"
              className="input"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <motion.button
                  key={skill}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSkill(skill)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
                    form.skills.includes(skill)
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {skill}
                </motion.button>
              ))}
            </div>
            {errors.skills && <p className="text-xs text-rose-500 mt-1">{errors.skills}</p>}
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-slate-700">Available for assignments</label>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setForm((f) => ({ ...f, available: !f.available }))}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                form.available ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <motion.div
                animate={{ x: form.available ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
              />
            </motion.button>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
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
              {submitting ? 'Adding...' : 'Add Volunteer'}
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
