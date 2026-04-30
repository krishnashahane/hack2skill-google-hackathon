import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0 lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <div>
            <p className="text-sm font-bold text-slate-900">SmartAlloc</p>
            <p className="text-[11px] text-slate-500">Volunteer Coordination</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
