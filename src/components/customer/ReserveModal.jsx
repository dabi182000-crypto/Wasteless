import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2, X, Clock, MapPin, Bike, ShoppingBag, Navigation } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.jsx';

function generatePickupCode() {
  const part = () => Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${part()}-${part()}`;
}

// Universal maps URL — iOS opens Apple Maps / Google Maps app, Android opens
// Google Maps app, desktop opens google.com/maps in a new tab.
function buildDirectionsUrl(vendor) {
  const dest = encodeURIComponent(`${vendor}, Doha, Qatar`);
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}

export default function ReserveModal({ listing, onClose, onConfirm, onReview }) {
  const { t } = useI18n();
  const [stage, setStage] = useState('confirm');
  const [code] = useState(generatePickupCode);

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  if (!listing) return null;

  const handleConfirm = async () => {
    await onConfirm(listing);
    setStage('done');
  };

  const saved = listing.originalPrice - listing.discountedPrice;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      >
        <motion.div
          key="dialog"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="card w-full max-w-md p-6 relative"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reserve-title"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-9 h-9 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {stage === 'confirm' ? (
            <>
              <p className="text-xs uppercase tracking-wide text-muted dark:text-muted-dark font-semibold">
                {listing.vendor}
              </p>
              <h2 id="reserve-title" className="mt-1 text-2xl font-extrabold tracking-tight">
                {listing.title}
              </h2>
              <p className="mt-2 text-sm text-muted dark:text-muted-dark">
                {listing.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-bg dark:bg-bg-dark border border-border dark:border-border-dark p-3">
                  <div className="flex items-center gap-1.5 text-muted dark:text-muted-dark text-xs">
                    <Clock className="w-3.5 h-3.5" /> {t('reserve.pickup_window')}
                  </div>
                  <p className="mt-1 font-semibold">
                    {listing.pickupStart}–{listing.pickupEnd}
                  </p>
                </div>
                <div className="rounded-2xl bg-bg dark:bg-bg-dark border border-border dark:border-border-dark p-3">
                  <div className="flex items-center gap-1.5 text-muted dark:text-muted-dark text-xs">
                    {listing.delivery ? <Bike className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                    {listing.delivery ? t('reserve.delivering') : t('reserve.pickup_only')}
                  </div>
                  <p className="mt-1 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.distanceKm.toFixed(1)} {t('reserve.km_away')}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted dark:text-muted-dark">{t('reserve.you_pay')}</p>
                  <p className="text-3xl font-extrabold text-accent">
                    {listing.discountedPrice} <span className="text-base font-semibold">QAR</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted dark:text-muted-dark line-through">
                    {listing.originalPrice} QAR
                  </p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {t('reserve.save').replace('{n}', saved)}
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleConfirm}
                className="btn-primary w-full mt-6"
              >
                {t('reserve.confirm')}
              </motion.button>
              <button onClick={onClose} className="btn-ghost w-full mt-2 text-sm">
                {t('reserve.cancel')}
              </button>
            </>
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
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight">{t('reserve.confirmed_title')}</h2>
              <p className="mt-1 text-sm text-muted dark:text-muted-dark">
                {t('reserve.show_code')} <span className="font-semibold text-ink dark:text-ink-dark">{listing.vendor}</span> {t('reserve.during')}
              </p>

              <div className="mt-5 rounded-2xl bg-bg dark:bg-bg-dark border border-border dark:border-border-dark p-5">
                <p className="text-xs uppercase tracking-widest text-muted dark:text-muted-dark">{t('reserve.pickup_code')}</p>
                <p className="mt-1 text-3xl font-extrabold tracking-[0.2em] text-accent font-mono">
                  {code}
                </p>
                <p className="mt-3 text-xs text-muted dark:text-muted-dark">
                  {t('reserve.window')} {listing.pickupStart}–{listing.pickupEnd}
                </p>
              </div>

              {!listing.delivery && (
                <motion.a
                  href={buildDirectionsUrl(listing.vendor)}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.01 }}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 bg-bg dark:bg-bg-dark border border-border dark:border-border-dark hover:border-accent/50 hover:text-accent text-sm font-bold transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  {t('reserve.directions')} {listing.vendor}
                </motion.a>
              )}

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="btn-primary w-full mt-3"
              >
                {t('reserve.done')}
              </motion.button>

              {onReview && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    onReview(listing);
                    onClose();
                  }}
                  className="btn-ghost w-full mt-2 text-sm"
                >
                  {t('reserve.leave_review')}
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
