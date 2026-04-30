import { motion } from 'framer-motion';

export default function ScoreBar({ label, score, max, color = 'indigo', delay = 0 }) {
  const pct = max > 0 ? (score / max) * 100 : 0;

  const colorMap = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className="text-slate-700 font-semibold">{score}/{max}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay * 0.15 + 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`h-full rounded-full ${colorMap[color] || colorMap.indigo}`}
        />
      </div>
    </div>
  );
}
