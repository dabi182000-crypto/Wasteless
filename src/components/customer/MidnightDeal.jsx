import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Moon,
  Sparkles,
  Star,
} from 'lucide-react';
import { useMidnight } from '../../hooks/useMidnight.js';
import { useI18n } from '../../context/I18nContext.jsx';

const MIDNIGHT_DEAL = {
  originalPrice: 100,
  discountedPrice: 25,
  totalSeats: 10,
  perks: [
    { Icon: Star, labelKey: 'midnight.perk.premium' },
    { Icon: Sparkles, labelKey: 'midnight.perk.mystery' },
    { Icon: Moon, labelKey: 'midnight.perk.delivery' },
  ],
};

const STORAGE_KEY = 'wasteless:midnight';

function readState() {
  if (typeof window === 'undefined') return { sessionKey: null, claimed: 0, mine: false };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { sessionKey: null, claimed: 0, mine: false };
  } catch {
    return { sessionKey: null, claimed: 0, mine: false };
  }
}

function writeState(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export default function MidnightDeal() {
  const { t } = useI18n();
  const [previewOverride, setPreviewOverride] = useState(false);
  const { isActive, isRealActive, countdownLabel, sessionKey } = useMidnight(previewOverride);
  const [state, setState] = useState(readState);

  // Reset the local seat counter when a new midnight session begins.
  useEffect(() => {
    if (state.sessionKey !== sessionKey) {
      const fresh = { sessionKey, claimed: 0, mine: false };
      setState(fresh);
      writeState(fresh);
    }
  }, [sessionKey, state.sessionKey]);

  const seatsLeft = Math.max(0, MIDNIGHT_DEAL.totalSeats - state.claimed);
  const soldOut = seatsLeft === 0;

  const handleReserve = () => {
    if (!isActive || soldOut || state.mine) return;
    const next = { sessionKey, claimed: state.claimed + 1, mine: true };
    setState(next);
    writeState(next);
  };

  const filledHearts = useMemo(
    () => Array.from({ length: MIDNIGHT_DEAL.totalSeats }, (_, i) => i < state.claimed),
    [state.claimed]
  );

  const saved = MIDNIGHT_DEAL.originalPrice - MIDNIGHT_DEAL.discountedPrice;

  return (
    <section
      aria-label="The Midnight Hour"
      className="relative rounded-2xl overflow-hidden border border-white/10"
      style={{
        background:
          'radial-gradient(1100px 280px at 20% -20%, rgba(230,57,70,0.35) 0%, rgba(230,57,70,0) 70%), radial-gradient(900px 320px at 110% 120%, rgba(99,102,241,0.32) 0%, rgba(99,102,241,0) 70%), linear-gradient(135deg, #0b0b18 0%, #110b22 60%, #0a0a0a 100%)',
      }}
    >
      {/* Star field */}
      <Stars />

      <div className="relative grid sm:grid-cols-[1.3fr_1fr] gap-0">
        <div className="p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase tracking-widest border border-white/15">
              <Moon className="w-3.5 h-3.5" /> {t('midnight.section')}
            </span>
            {isActive ? (
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 text-[11px] font-bold uppercase tracking-widest border border-emerald-400/30"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {previewOverride && !isRealActive ? t('midnight.preview') : t('midnight.live_badge')}
              </motion.span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 text-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-widest border border-white/10">
                <Lock className="w-3 h-3" />
                {t('midnight.closes')}
              </span>
            )}
          </div>

          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('midnight.title')}
          </h2>
          <p className="mt-1 text-white/70 text-sm">{t('midnight.vendor')}</p>
          <p className="mt-3 text-white/85 text-sm sm:text-base max-w-md">
            {t('midnight.desc')}
          </p>

          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {MIDNIGHT_DEAL.perks.map(({ Icon, labelKey }) => (
              <li
                key={labelKey}
                className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/85"
              >
                <Icon className="w-4 h-4 text-amber-300" />
                {t(labelKey)}
              </li>
            ))}
          </ul>

          {/* Seat tracker */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex gap-1">
              {filledHearts.map((filled, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    filled ? 'bg-accent shadow-glow' : 'bg-white/15'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-white/75 font-semibold">
              {soldOut
                ? t('midnight.all_claimed').replace('{n}', MIDNIGHT_DEAL.totalSeats)
                : `${seatsLeft} ${t('midnight.seats')}`}
            </span>
          </div>
        </div>

        {/* CTA panel */}
        <div className="relative p-6 sm:p-8 border-t sm:border-t-0 sm:border-l border-white/10 bg-black/25 backdrop-blur-sm flex flex-col justify-center">
          <p className="text-[11px] uppercase tracking-widest text-white/60">{t('midnight.tonight_only')}</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-white">
              {MIDNIGHT_DEAL.discountedPrice}
              <span className="text-base font-semibold ml-1 text-white/70">QAR</span>
            </span>
            <span className="text-sm text-white/50 line-through">
              {MIDNIGHT_DEAL.originalPrice} QAR
            </span>
          </div>
          <p className="text-xs text-emerald-300 font-semibold mt-1">{t('reserve.save').replace('{n}', saved)} · 75% off</p>

          <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-[11px] text-white/75 font-mono">
            {countdownLabel}
          </div>

          <AnimatePresence mode="wait">
            {state.mine ? (
              <motion.div
                key="claimed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-500/15 text-emerald-300 px-3 py-2 text-sm font-semibold border border-emerald-400/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                {t('midnight.youre_in')}
              </motion.div>
            ) : isActive ? (
              soldOut ? (
                <motion.div
                  key="soldout"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 flex items-center gap-2 rounded-2xl bg-white/5 text-white/70 px-3 py-2 text-sm font-semibold border border-white/10"
                >
                  <Lock className="w-4 h-4" />
                  {t('midnight.soldout')}
                </motion.div>
              ) : (
                <motion.button
                  key="reserve"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={handleReserve}
                  className="btn-primary w-full mt-4"
                >
                  {t('midnight.reserve')}
                </motion.button>
              )
            ) : (
              <motion.button
                key="remind"
                whileTap={{ scale: 0.96 }}
                disabled
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 bg-white/10 border border-white/15 text-white/80 font-semibold cursor-not-allowed"
              >
                <Bell className="w-4 h-4" />
                {t('midnight.opens')}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Demo affordance: preview the unlocked state */}
          {!isRealActive && (
            <button
              onClick={() => setPreviewOverride((v) => !v)}
              className="mt-3 inline-flex items-center justify-center gap-1.5 text-[11px] text-white/60 hover:text-white/90 transition-colors"
            >
              {previewOverride ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> {t('midnight.preview')}
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> {t('midnight.preview')}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function Stars() {
  // Deterministic positions so the field doesn't reshuffle on re-render.
  const stars = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        top: (i * 37) % 100,
        left: (i * 53) % 100,
        size: (i % 3) + 1,
        delay: (i % 7) * 0.4,
      })),
    []
  );
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: 0.4,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: s.delay }}
        />
      ))}
    </div>
  );
}
