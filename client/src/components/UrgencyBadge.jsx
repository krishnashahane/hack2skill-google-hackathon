import { motion } from 'framer-motion';
import { URGENCY_CONFIG } from '../lib/constants';

export default function UrgencyBadge({ urgency }) {
  const config = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.low;

  return (
    <span className={`badge ${config.bg} ${config.text} ring-1 ${config.ring}`}>
      {urgency === 'high' && (
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`}
        />
      )}
      {config.label}
    </span>
  );
}
