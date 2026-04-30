import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, Shield, Award, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';
import PageTransition from '../../components/PageTransition';
import MapView from '../../components/MapView';
import { SKILLS } from '../../lib/constants';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    skills: user?.skills || [],
    location: user?.location || { lat: 19.076, lng: 72.8777 },
    bio: user?.bio || '',
    age: user?.age || '',
    gender: user?.gender || '',
    medicalNotes: user?.medicalNotes || '',
    certifications: user?.certifications || [],
  });
  const [saving, setSaving] = useState(false);

  const toggleSkill = (skill) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateProfile(form);
    toast.success('Profile updated!');
    setSaving(false);
  };

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your volunteer profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card p-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-indigo-200">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'V'}
          </div>
          <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="badge bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
              <Shield className="w-3 h-3 mr-1" /> Verified
            </span>
            <span className="badge bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200">
              <Award className="w-3 h-3 mr-1" /> Active
            </span>
          </div>
          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" /> Joined April 2026
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Award className="w-4 h-4" /> Reliability: 94%
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="w-4 h-4" /> Mumbai, India
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Age</label>
                <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} className="input" placeholder="25" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Gender</label>
                <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className="input">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Medical Notes</label>
                <input type="text" value={form.medicalNotes} onChange={e => setForm(f => ({ ...f, medicalNotes: e.target.value }))} className="input" placeholder="Allergies, conditions..." />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-500 mb-1">Bio</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="input resize-none" placeholder="Tell us about yourself..." />
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Skills & Certifications</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {SKILLS.map(skill => (
                <motion.button
                  key={skill}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSkill(skill)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                    form.skills.includes(skill) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {skill}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Location</h3>
            <MapView
              selectedLocation={form.location}
              onMapClick={(loc) => setForm(f => ({ ...f, location: loc }))}
              height="200px"
            />
            {form.location && (
              <p className="text-xs text-slate-500 mt-2">
                <MapPin className="w-3 h-3 inline mr-1" />
                {form.location.lat.toFixed(4)}, {form.location.lng.toFixed(4)}
              </p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile'}
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
}
