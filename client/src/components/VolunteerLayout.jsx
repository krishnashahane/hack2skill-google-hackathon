import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import VolunteerSidebar from './VolunteerSidebar';
import useAuthStore from '../store/useAuthStore';

export default function VolunteerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => { if (!user) navigate('/login', { replace: true }); }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <VolunteerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0 lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-slate-900">Volunteer Portal</p>
              <p className="text-[11px] text-slate-500">Your impact dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-[11px] text-slate-400">Volunteer</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'V'}
            </div>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
