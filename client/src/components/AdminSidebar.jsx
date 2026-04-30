import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, ClipboardList, Sparkles, Target, X,
  BarChart3, Bell, MessageSquare, Bot, Leaf,
} from 'lucide-react';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/volunteers', icon: Users, label: 'Volunteers' },
  { to: '/admin/tasks', icon: ClipboardList, label: 'Tasks' },
  { to: '/admin/match', icon: Sparkles, label: 'Matching' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
  { to: '/admin/ai', icon: Bot, label: 'AI Assistant' },
];

export default function AdminSidebar({ open = false, onClose = () => {} }) {
  const location = useLocation();

  return (
    <>
      {open && (
        <button type="button" aria-label="Close" onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden" />
      )}
      <motion.aside
        initial={false}
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] flex-shrink-0 flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:fixed`}
      >
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">NGO Hub</h1>
              <p className="text-[11px] text-slate-400 font-medium">Admin Panel</p>
            </div>
            <button type="button" onClick={onClose}
              className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
              aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => {
            const isActive = to === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(to);
            return (
              <NavLink key={to} to={to} onClick={onClose}>
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {isActive && (
                    <motion.div layoutId="adminTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-emerald-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                  <Icon className="w-[18px] h-[18px]" />
                  {label}
                  {label === 'Notifications' && (
                    <span className="ml-auto px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">3</span>
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400">System Active</span>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
