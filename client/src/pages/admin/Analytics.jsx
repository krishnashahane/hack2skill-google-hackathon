import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, CheckCircle2, Clock, Target,
  ArrowUp, ArrowDown, PieChart, Activity,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPie, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import useStore from '../../store/useStore';
import PageTransition from '../../components/PageTransition';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Analytics() {
  const { stats, tasks, volunteers, fetchStats, fetchTasks, fetchVolunteers } = useStore();

  useEffect(() => {
    fetchStats().catch(() => {});
    fetchTasks().catch(() => {});
    fetchVolunteers().catch(() => {});
  }, [fetchStats, fetchTasks, fetchVolunteers]);

  const statusData = useMemo(() => {
    const pending = tasks.filter(t => t.status === 'pending').length;
    const assigned = tasks.filter(t => t.status === 'assigned').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return [
      { name: 'Pending', value: pending, color: '#8b5cf6' },
      { name: 'Assigned', value: assigned, color: '#3b82f6' },
      { name: 'Completed', value: completed, color: '#10b981' },
    ];
  }, [tasks]);

  const urgencyData = useMemo(() => [
    { name: 'High', count: tasks.filter(t => t.urgency === 'high').length, fill: '#ef4444' },
    { name: 'Medium', count: tasks.filter(t => t.urgency === 'medium').length, fill: '#f59e0b' },
    { name: 'Low', count: tasks.filter(t => t.urgency === 'low').length, fill: '#10b981' },
  ], [tasks]);

  const skillDistribution = useMemo(() => {
    const map = {};
    volunteers.forEach(v => v.skills?.forEach(s => { map[s] = (map[s] || 0) + 1; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }));
  }, [volunteers]);

  const weeklyData = useMemo(() => {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      tasks: Math.floor(Math.random() * 8) + 2,
      volunteers: Math.floor(Math.random() * 12) + 3,
    }));
  }, []);

  const monthlyTrend = useMemo(() => {
    return ['Jan', 'Feb', 'Mar', 'Apr'].map(month => ({
      month,
      completed: Math.floor(Math.random() * 20) + 10,
      assigned: Math.floor(Math.random() * 15) + 5,
    }));
  }, []);

  const kpis = [
    { label: 'Total Volunteers', value: stats?.totalVolunteers || 0, icon: Users, color: 'indigo', change: '+12%', up: true },
    { label: 'Tasks Completed', value: stats?.completedTasks || 0, icon: CheckCircle2, color: 'emerald', change: '+8%', up: true },
    { label: 'Active Tasks', value: stats?.activeTasks || 0, icon: Clock, color: 'amber', change: '-3%', up: false },
    { label: 'Match Efficiency', value: `${stats?.efficiency || 0}%`, icon: Target, color: 'violet', change: '+5%', up: true },
  ];

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          Analytics Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Performance metrics and resource utilization insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${kpi.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {kpi.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {kpi.change} vs last month
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 text-${kpi.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Task Status Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-500" /> Task Status
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RPie>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </RPie>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {statusData.map(s => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-500">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Breakdown */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" /> Urgency Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={urgencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {urgencyData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Top Skills
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skillDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="volunteers" stackId="1" stroke="#6366f1" fill="#eef2ff" />
              <Area type="monotone" dataKey="tasks" stackId="2" stroke="#10b981" fill="#ecfdf5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="assigned" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-emerald-500 rounded" /> Completed</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-indigo-500 rounded" /> Assigned</span>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
