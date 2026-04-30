import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function StatCard({ icon: Icon, label, value, suffix = '', color = 'indigo', delay = 0 }) {
  const colorMap = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', ring: 'ring-indigo-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'ring-emerald-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', ring: 'ring-amber-100' },
    rose: { bg: 'bg-rose-50', icon: 'text-rose-600', ring: 'ring-rose-100' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', ring: 'ring-violet-100' },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      className="card p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1.5 tracking-tight">
            <AnimatedNumber value={value} />
            {suffix && <span className="text-lg text-slate-400 ml-0.5">{suffix}</span>}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>
    </motion.div>
  );
}
