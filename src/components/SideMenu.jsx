import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  Bell,
  Bookmark,
  HelpCircle,
  Info,
  LogIn,
  LogOut,
  Settings,
  ShoppingBag,
  Store,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavourites } from '../context/FavouritesContext.jsx';
import { usePushNotification } from '../hooks/usePushNotification.js';
import { useReservations } from '../context/ReservationsContext.jsx';
import { useI18n } from '../context/I18nContext.jsx';

const drawerVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 320, damping: 32 } },
  exit: { x: '-100%', transition: { duration: 0.2, ease: 'easeIn' } },
};

const NAV_ITEM_IDS = [
  { id: 'customer', labelKey: 'menu.customer', subKey: 'menu.customer_sub', Icon: ShoppingBag },
  { id: 'vendor', labelKey: 'menu.vendor', subKey: 'menu.vendor_sub', Icon: Store },
];

function PillToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        enabled ? 'bg-accent' : 'bg-border dark:bg-border-dark'
      }`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function SideMenu({ open, onClose, mode, onModeChange, onLoginClick }) {
  const { user, signOut, isAuthed } = useAuth();
  const { count: favCount } = useFavourites();
  const { enabled: notifEnabled, toggle: toggleNotif } = usePushNotification();
  const { streak } = useReservations();
  const { lang, toggleLang, t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleModeSelect = (id) => {
    onModeChange(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 z-50 h-full w-[88%] max-w-sm bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <div className="flex items-center justify-between p-5 border-b border-border dark:border-border-dark">
              <span className="text-lg font-extrabold tracking-tight">{t('menu.title')}</span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-9 h-9 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 border-b border-border dark:border-border-dark">
              {isAuthed ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent text-white font-bold text-base flex items-center justify-center shadow-glow">
                    {user.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold truncate">{user.name}</p>
                    <p className="text-xs text-muted dark:text-muted-dark truncate">
                      {user.phone || 'Signed in'}
                    </p>
                  </div>
                  <button
                    onClick={() => { signOut(); }}
                    className="text-xs font-semibold text-muted dark:text-muted-dark hover:text-accent flex items-center gap-1 px-2 py-2 rounded-xl"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onLoginClick();
                    onClose();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 btn-primary"
                >
                  <LogIn className="w-4 h-4" />
                  {t('menu.signin')}
                </motion.button>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto py-3">
              <p className="px-5 pt-2 pb-1 label">{t('menu.mode')}</p>
              {NAV_ITEM_IDS.map(({ id, labelKey, subKey, Icon }) => {
                const active = mode === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleModeSelect(id)}
                    className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors ${
                      active
                        ? 'bg-accent/10 text-accent'
                        : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        active
                          ? 'bg-accent text-white shadow-glow'
                          : 'bg-bg dark:bg-bg-dark text-muted dark:text-muted-dark border border-border dark:border-border-dark'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{t(labelKey)}</p>
                      <p className="text-xs text-muted dark:text-muted-dark truncate">{t(subKey)}</p>
                    </div>
                    {active && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                        {t('menu.active')}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Streak card */}
              {streak.totalRescues > 0 && (
                <div className="mx-5 mt-4 rounded-2xl bg-accent/10 border border-accent/20 p-3.5 flex items-center gap-3">
                  <span className="text-2xl">🌱</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-accent uppercase tracking-widest">{t('menu.streak')}</p>
                    <p className="text-sm font-semibold mt-0.5">
                      {streak.streakDays} {streak.streakDays !== 1 ? t('menu.streak.days_pl') : t('menu.streak.days')} · {streak.thisMonthRescues} {t('menu.streak.month')}
                    </p>
                    <p className="text-xs text-muted dark:text-muted-dark">
                      {streak.totalRescues} {streak.totalRescues !== 1 ? t('menu.streak.total_pl') : t('menu.streak.total')}
                    </p>
                  </div>
                  {streak.streakDays >= 3 && (
                    <span className="text-xl">🔥</span>
                  )}
                </div>
              )}

              <p className="px-5 pt-5 pb-1 label">{t('menu.more')}</p>

              {/* Saved / Favourites */}
              <button
                onClick={onClose}
                className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-muted dark:text-muted-dark flex items-center justify-center">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{t('menu.saved')}</p>
                  <p className="text-xs text-muted dark:text-muted-dark truncate">{t('menu.saved_sub')}</p>
                </div>
                {favCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold">
                    {favCount}
                  </span>
                )}
              </button>

              {/* Notifications with toggle */}
              <div className="w-full px-5 py-3 flex items-center gap-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-muted dark:text-muted-dark flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{t('menu.notifications')}</p>
                  <p className="text-xs text-muted dark:text-muted-dark truncate">{t('menu.notifications_sub')}</p>
                </div>
                <PillToggle enabled={notifEnabled} onToggle={toggleNotif} />
              </div>

              {/* Help */}
              <button
                onClick={onClose}
                className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-muted dark:text-muted-dark flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{t('menu.help')}</p>
                  <p className="text-xs text-muted dark:text-muted-dark truncate">{t('menu.help_sub')}</p>
                </div>
              </button>

              {/* About */}
              <button
                onClick={onClose}
                className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-muted dark:text-muted-dark flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{t('menu.about')}</p>
                  <p className="text-xs text-muted dark:text-muted-dark truncate">{t('menu.about_sub')}</p>
                </div>
              </button>

              {/* Language toggle */}
              <div className="w-full px-5 py-3 flex items-center gap-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-muted dark:text-muted-dark flex items-center justify-center text-base font-bold">
                  {lang === 'en' ? '🇶🇦' : '🇬🇧'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{t('menu.language')}</p>
                  <p className="text-xs text-muted dark:text-muted-dark truncate">
                    {t('menu.language_sub')}
                  </p>
                </div>
                <button
                  onClick={toggleLang}
                  className="text-xs font-bold border border-border dark:border-border-dark rounded-full px-3 py-1.5 hover:border-accent/50 hover:text-accent transition-colors"
                >
                  {t('lang.toggle')}
                </button>
              </div>

              {/* Settings */}
              <button
                onClick={onClose}
                className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-bg dark:bg-bg-dark border border-border dark:border-border-dark text-muted dark:text-muted-dark flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{t('menu.settings')}</p>
                  <p className="text-xs text-muted dark:text-muted-dark truncate">{t('menu.settings_sub')}</p>
                </div>
              </button>
            </nav>

            <div className="p-5 border-t border-border dark:border-border-dark">
              <p className="text-[11px] text-muted dark:text-muted-dark text-center">
                {t('menu.footer')}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
