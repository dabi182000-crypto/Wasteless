import { motion } from 'framer-motion';
import { Menu, LogIn } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useI18n } from '../context/I18nContext.jsx';

export default function TopNav({ mode, onMenuOpen, onLoginClick }) {
  const { user, isAuthed } = useAuth();
  const { lang, toggleLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-bg/70 dark:bg-bg-dark/70 border-b border-border dark:border-border-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        {/* Left — hamburger */}
        <button
          onClick={onMenuOpen}
          aria-label="Open menu"
          className="w-10 h-10 rounded-2xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-accent/50 transition-colors duration-200 flex items-center justify-center relative"
        >
          <Menu className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent shadow-glow" />
        </button>

        {/* Center — logo */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-2.5"
        >
          <Logo size={38} />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-extrabold tracking-tight text-lg">Wasteless</span>
            <span className="text-[10px] uppercase tracking-widest text-muted dark:text-muted-dark">
              {mode === 'vendor' ? t('nav.vendor_qatar') : t('nav.qatar')}
            </span>
          </div>
          <span className="sm:hidden font-extrabold tracking-tight text-lg">Wasteless</span>
        </motion.div>

        {/* Right — lang toggle + auth + theme */}
        <div className="flex items-center gap-2 justify-self-end">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            aria-label="Toggle language"
            className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-border dark:border-border-dark hover:border-accent/50 hover:text-accent text-xs font-bold transition-colors bg-surface dark:bg-surface-dark"
          >
            {t('lang.toggle')}
          </button>

          {isAuthed ? (
            <button
              onClick={onMenuOpen}
              aria-label={`Open menu — signed in as ${user.name}`}
              className="hidden sm:flex items-center gap-2 px-2 pr-3 py-1.5 rounded-2xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-accent/50 transition-colors"
            >
              <span className="w-7 h-7 rounded-xl bg-accent text-white text-xs font-bold flex items-center justify-center">
                {user.initials}
              </span>
              <span className="text-sm font-semibold max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-accent/50 hover:text-accent text-sm font-semibold transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
