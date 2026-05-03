import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2, Phone, User, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useI18n } from '../context/I18nContext.jsx';

export default function LoginModal({ open, onClose }) {
  const { signIn } = useAuth();
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState('form');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setName('');
      setPhone('');
      setStage('form');
      setError('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length < 6) {
      setError('Enter a valid phone number');
      return;
    }
    signIn({ name, phone: cleanPhone });
    setStage('done');
    setTimeout(onClose, 1100);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="card w-full max-w-md p-6 relative"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 w-9 h-9 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {stage === 'form' ? (
              <form onSubmit={handleSubmit}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('login.title')}
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">{t('login.cta')}</h2>
                <p className="mt-1 text-sm text-muted dark:text-muted-dark">
                  {t('login.subtitle')}
                </p>

                <div className="mt-5 space-y-3">
                  <div>
                    <label className="label">{t('login.name')}</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-muted-dark pointer-events-none" />
                      <input
                        autoFocus
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('login.name_placeholder')}
                        className="input pl-11"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">{t('login.phone')}</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-muted-dark pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t('login.phone_placeholder')}
                        className="input pl-11"
                      />
                    </div>
                    {error && <p className="text-xs text-accent mt-1">{error}</p>}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.01 }}
                  className="btn-primary w-full mt-6"
                >
                  {t('login.cta')}
                </motion.button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost w-full mt-2 text-sm"
                >
                  {t('login.cancel')}
                </button>
              </form>
            ) : (
              <div className="text-center py-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-9 h-9 text-emerald-500" strokeWidth={2.2} />
                </motion.div>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight">
                  {t('login.success_title').replace('{name}', name ? name.split(' ')[0] : '')}
                </h2>
                <p className="mt-1 text-sm text-muted dark:text-muted-dark">{t('login.success_sub')}</p>
                <button
                  onClick={onClose}
                  className="btn-primary mt-4"
                >
                  {t('login.success_cta')}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
