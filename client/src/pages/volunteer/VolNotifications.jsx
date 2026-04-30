import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, ClipboardList, Sparkles, Clock, X, Check, Award } from 'lucide-react';
import PageTransition from '../../components/PageTransition';

const DEMO = [
  { id: 1, icon: Sparkles, title: 'You\'ve been recommended for Emergency Medical Camp', time: '5 min ago', read: false, color: 'violet' },
  { id: 2, icon: CheckCircle2, title: 'Your task "Community Kitchen Setup" was marked complete', time: '1 hour ago', read: false, color: 'emerald' },
  { id: 3, icon: ClipboardList, title: 'New task available: School Tutoring Program', time: '3 hours ago', read: false, color: 'blue' },
  { id: 4, icon: Clock, title: 'Reminder: Shelter Repair Drive starts tomorrow 9 AM', time: '5 hours ago', read: true, color: 'amber' },
  { id: 5, icon: Award, title: 'You earned the "Team Player" badge!', time: '1 day ago', read: true, color: 'amber' },
  { id: 6, icon: CheckCircle2, title: 'Admin approved your profile update', time: '2 days ago', read: true, color: 'emerald' },
];

export default function VolNotifications() {
  const [notifications, setNotifications] = useState(DEMO);
  const [filter, setFilter] = useState('all');
  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : filter === 'read' ? notifications.filter(n => n.read) : notifications;

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" /> Notifications
            {unreadCount > 0 && <span className="px-2.5 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">{unreadCount}</span>}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Task updates and activity alerts</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => setNotifications(ns => ns.map(n => ({ ...n, read: true })))} className="text-sm text-indigo-600 font-medium flex items-center gap-1">
            <Check className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'unread', 'read'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`text-xs px-4 py-2 rounded-lg font-medium capitalize transition ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map(n => (
            <motion.div key={n.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className={`card p-4 flex items-center gap-4 ${!n.read ? 'bg-indigo-50/50 border-indigo-100' : ''}`}>
              <div className={`w-10 h-10 rounded-xl bg-${n.color}-50 flex items-center justify-center flex-shrink-0`}>
                <n.icon className={`w-5 h-5 text-${n.color}-500`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!n.read && (
                  <button onClick={() => setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))} className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-500"><Check className="w-4 h-4" /></button>
                )}
                <button onClick={() => setNotifications(ns => ns.filter(x => x.id !== n.id))} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">No notifications</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
