import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown.js';

export default function CountdownBadge({ pickupEnd }) {
  const { label, isUrgent, isExpired } = useCountdown(pickupEnd);

  const base =
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md';
  const tone = isExpired
    ? 'bg-black/40 text-white/70'
    : isUrgent
    ? 'bg-accent text-white shadow-glow'
    : 'bg-black/55 text-white';

  return (
    <motion.span
      className={`${base} ${tone}`}
      animate={isUrgent ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={isUrgent ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
    >
      <Clock className="w-3 h-3" />
      {label}
    </motion.span>
  );
}
