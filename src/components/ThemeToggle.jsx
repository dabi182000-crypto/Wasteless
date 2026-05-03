import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative w-10 h-10 rounded-2xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-accent/50 transition-colors duration-200 flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-ink-dark" />
          ) : (
            <Sun className="w-5 h-5 text-accent" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
