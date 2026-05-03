import { motion } from 'framer-motion';
import { ShoppingBag, Store } from 'lucide-react';

const MODES = [
  { id: 'customer', label: 'Customer', Icon: ShoppingBag },
  { id: 'vendor', label: 'Vendor', Icon: Store },
];

export default function ModeToggle({ mode, onChange }) {
  return (
    <div className="relative inline-flex items-center bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-1 shadow-card dark:shadow-card-dark">
      {MODES.map(({ id, label, Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`relative z-10 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-2xl text-sm font-semibold transition-colors duration-200 ${
              active
                ? 'text-white'
                : 'text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark'
            }`}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 -z-10 bg-accent rounded-2xl shadow-glow"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
