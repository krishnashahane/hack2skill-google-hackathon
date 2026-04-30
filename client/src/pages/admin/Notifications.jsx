import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle2, AlertTriangle, Users, ClipboardList, Sparkles,
  Clock, X, Check,
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';

const DEMO_NOTIFICATIONS = [
  { id: 1, type: 'assignment', icon: Users, title: 'Priya Sharma assigned to Emergency Medical Camp', time: '2 min ago', read: false, color: 'blue' },
  { id: 2, type: 'urgent', icon: AlertTriangle, title: 'New high-urgency task: Flood Relief Distribution', time: '15 min ago', read: false, color: 'rose' },
  { id: 3, type: 'completion', icon: CheckCircle2, title: 'Community Kitchen Setup marked complete', time: '1 hour ago', read: false, color: 'emerald' },
  { id: 4, type: 'match', icon: Sparkles, title: 'AI found 3 matches for School Tutoring Program', time: '2 hours ago', read: true, color: 'violet' },
  { id: 5, type: 'volunteer', icon: Users, title: 'New volunteer registered: Meera Joshi', time: '3 hours ago', read: true, color: 'indigo' },
  { id: 6, type: 'reminder', icon: Clock, title: 'Shelter Repair Drive starts tomorrow at 9 AM', time: '5 hours ago', read: true, color: 'amber' },
  { id: 7, type: 'task', icon: ClipboardList, title: 'Task "Water Purification Drive" needs volunteers', time: '1 day ago', read: true, color: 'cyan' },
  { id: 8, type: 'completion', icon: CheckCircle2, title: 'Rahul Patel submitted feedback for Medical Camp', time: '1 day ago', read: true, color: 'emerald' },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const markRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const dismiss = (id) => setNotifications(ns => ns.filter(n => n.id !== id));
  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.read);

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2.5 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">{unreadCount}</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Stay updated on task assignments and volunteer activity</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
            <Check className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'unread', 'read'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-4 py-2 rounded-lg font-medium capitalize transition ${
              filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {f} {f === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map(n => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              className={`card p-4 flex items-center gap-4 transition ${!n.read ? 'bg-indigo-50/50 border-indigo-100' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-${n.color}-50 flex items-center justify-center flex-shrink-0`}>
                <n.icon className={`w-5 h-5 text-${n.color}-500`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-500 transition" title="Mark read">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => dismiss(n.id)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition" title="Dismiss">
                  <X className="w-4 h-4" />
                </button>
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
