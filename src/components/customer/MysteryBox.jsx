import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bike,
  Cake,
  CheckCircle2,
  Clock,
  CupSoda,
  Dices,
  Eye,
  Flame,
  Gift,
  PackageCheck,
  Salad,
  Sandwich,
  Sparkles,
  X,
} from 'lucide-react';
import { MYSTERY_CATEGORIES, pickMysteryItem } from '../../lib/mysteryBoxData.js';
import MysteryRevealModal from './MysteryRevealModal.jsx';
import { useI18n } from '../../context/I18nContext.jsx';

const ICONS = { CupSoda, Cake, Sandwich, Flame, Salad, Dices };

const STORAGE_KEY = 'wasteless:mystery:order';
const ETA_MINUTES = 25; // demo ETA window for the on-its-way state

function readOrder() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

function saveOrder(order) {
  if (order) localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  else localStorage.removeItem(STORAGE_KEY);
}

export default function MysteryBox() {
  const [selected, setSelected] = useState(null);
  const [order, setOrder] = useState(readOrder);
  const [revealOpen, setRevealOpen] = useState(false);

  const handleOrder = () => {
    if (!selected) return;
    const cat = MYSTERY_CATEGORIES.find((c) => c.id === selected);
    const item = pickMysteryItem(selected); // locked in NOW but hidden
    const newOrder = {
      category: cat,
      item,
      placedAt: Date.now(),
      status: 'pending',
    };
    setOrder(newOrder);
    saveOrder(newOrder);
    setSelected(null);
  };

  const handleCancel = () => {
    setOrder(null);
    saveOrder(null);
  };

  const handleReceived = () => {
    setRevealOpen(true);
  };

  const handleRevealClose = () => {
    setRevealOpen(false);
    // Clear the order — they've seen what they got, flow is complete.
    setOrder(null);
    saveOrder(null);
  };

  return (
    <section
      aria-label="Mystery Box"
      className="relative rounded-2xl overflow-hidden border border-white/10"
      style={{
        background:
          'radial-gradient(900px 280px at 0% 0%, rgba(244,114,182,0.30) 0%, rgba(244,114,182,0) 70%), radial-gradient(900px 320px at 100% 100%, rgba(251,191,36,0.30) 0%, rgba(251,191,36,0) 70%), linear-gradient(135deg, #1b0f1f 0%, #221225 50%, #14101e 100%)',
      }}
    >
      <FloatingDoodles />

      <AnimatePresence mode="wait">
        {order ? (
          <PendingOrder
            key="pending"
            order={order}
            onReceived={handleReceived}
            onCancel={handleCancel}
          />
        ) : (
          <Picker
            key="picker"
            selected={selected}
            onSelect={setSelected}
            onOrder={handleOrder}
          />
        )}
      </AnimatePresence>

      <MysteryRevealModal
        reveal={revealOpen ? order : null}
        onClose={handleRevealClose}
      />
    </section>
  );
}

/* ────────────── Picker (no order yet) ────────────── */

function Picker({ selected, onSelect, onOrder }) {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative grid lg:grid-cols-[1.2fr_1fr] gap-0"
    >
      <div className="p-6 sm:p-8 text-white">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          {t('mystery.section')}
        </div>

        <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-amber-200 to-pink-300">
            {t('mystery.section')}
          </span>
        </h2>
        <p className="mt-2 text-white/80 text-sm sm:text-base max-w-md">
          {t('mystery.subtitle')}
        </p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {MYSTERY_CATEGORIES.map((c) => {
            const Icon = ICONS[c.icon] || Gift;
            const active = selected === c.id;
            return (
              <motion.button
                key={c.id}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -2 }}
                onClick={() => onSelect(c.id)}
                aria-pressed={active}
                className={`relative text-left rounded-2xl p-3 border transition-all duration-200 ${
                  active
                    ? 'border-white/40 bg-white/10 shadow-glow'
                    : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${c.tint} flex items-center justify-center text-white shadow-lg`}
                >
                  <Icon className="w-4.5 h-4.5" strokeWidth={2.4} />
                </div>
                <p className="mt-2.5 font-bold text-sm text-white">{c.label}</p>
                <p className="text-[11px] text-white/65 leading-snug">{c.sub}</p>
                {active && (
                  <motion.span
                    layoutId="mystery-pick"
                    className="absolute inset-0 rounded-2xl ring-2 ring-white/50 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="relative p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-white/10 bg-black/30 backdrop-blur-sm flex flex-col justify-center">
        <motion.div
          animate={selected ? { rotate: [0, -8, 8, -6, 6, 0] } : { rotate: 0 }}
          transition={{ duration: 0.6 }}
          className="self-center"
        >
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-pink-400 via-amber-300 to-rose-500 shadow-2xl flex items-center justify-center">
            <Gift className="w-16 h-16 text-white" strokeWidth={2} />
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 bg-white/30 backdrop-blur-md" />
            <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 bg-white/30 backdrop-blur-md" />
          </div>
        </motion.div>

        <p className="mt-5 text-center text-xs uppercase tracking-widest text-white/60">
          {t('mystery.how_it_works')}
        </p>
        <ol className="mt-2 space-y-1.5 text-sm text-white/85">
          <Step n={1} text={t('mystery.step1')} done={!!selected} />
          <Step n={2} text={t('mystery.step2')} done={false} />
          <Step n={3} text={t('mystery.step3')} done={false} />
        </ol>

        <motion.button
          disabled={!selected}
          onClick={onOrder}
          whileTap={{ scale: selected ? 0.96 : 1 }}
          whileHover={{ scale: selected ? 1.02 : 1 }}
          className={`mt-5 w-full rounded-2xl px-5 py-2.5 font-bold text-sm transition-colors duration-200 inline-flex items-center justify-center gap-2 ${
            selected
              ? 'bg-white text-ink hover:bg-white/90'
              : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {selected ? t('mystery.order') : t('mystery.pick_first')}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ────────────── Pending order (placed, awaiting receipt) ────────────── */

function PendingOrder({ order, onReceived, onCancel }) {
  const { t } = useI18n();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsedMs = now - order.placedAt;
  const elapsedMin = Math.floor(elapsedMs / 60000);
  const elapsedSec = Math.floor((elapsedMs % 60000) / 1000);
  const elapsedLabel =
    elapsedMin > 0 ? `${elapsedMin} min ago` : elapsedSec < 10 ? 'just now' : `${elapsedSec}s ago`;
  const etaRemaining = Math.max(0, ETA_MINUTES - elapsedMin);
  const etaLabel = etaRemaining > 0 ? `~${etaRemaining} min` : t('mystery.arriving_soon');
  const progressPct = Math.min(100, Math.round((elapsedMs / (ETA_MINUTES * 60000)) * 100));

  const Icon = ICONS[order.category.icon] || Gift;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative p-6 sm:p-8 text-white"
    >
      <div className="flex items-start gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 text-[11px] font-bold uppercase tracking-widest border border-emerald-400/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {t('mystery.order_placed')}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 border ${order.category.chip}`}
        >
          <Icon className="w-3 h-3" />
          {order.category.label}
        </span>
      </div>

      <div className="mt-5 grid sm:grid-cols-[1.3fr_1fr] gap-6 sm:gap-8 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('mystery.pending.title')}
          </h2>
          <p className="mt-2 text-white/80 text-sm sm:text-base max-w-md">
            {t('mystery.pending.sub')}
          </p>

          {/* Progress bar */}
          <div className="mt-5 max-w-md">
            <div className="flex items-center justify-between text-[11px] text-white/70 font-semibold uppercase tracking-widest mb-1.5">
              <span>{t('mystery.pending.progress')}</span>
              <span>{t('mystery.on_the_way')}</span>
              <span>{t('mystery.arriving')}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-pink-400 via-amber-300 to-rose-500"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-white/75">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {t('mystery.pending.ordered')} {elapsedLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5" /> {t('mystery.pending.eta')} {etaLabel}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={onReceived}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 bg-white text-ink font-bold text-sm hover:bg-white/90 transition-colors"
            >
              <PackageCheck className="w-4 h-4" />
              {t('mystery.received')}
            </motion.button>
            <button
              onClick={onCancel}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm font-semibold transition-colors"
            >
              <X className="w-4 h-4" />
              {t('mystery.cancel')}
            </button>
          </div>

          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] text-white/70">
            <Eye className="w-3 h-3" />
            {t('mystery.received_sub')}
          </p>
        </div>

        {/* Animated scooter */}
        <ScooterTrack t={t} />
      </div>
    </motion.div>
  );
}

function ScooterTrack({ t }) {
  return (
    <div className="relative h-44 sm:h-52 rounded-3xl bg-black/30 border border-white/10 overflow-hidden">
      {/* Path dots */}
      <div className="absolute inset-x-0 bottom-12 h-px bg-white/15" />
      <div className="absolute inset-x-0 bottom-12 flex items-center justify-around">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="w-1 h-1 rounded-full bg-white/25" />
        ))}
      </div>

      {/* Scooter (Snoonu pink/red) */}
      <motion.div
        className="absolute bottom-12"
        animate={{ x: ['-15%', '110%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
          className="-translate-y-1/2 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 via-amber-300 to-rose-500 shadow-2xl"
        >
          <Bike className="w-7 h-7 text-white" strokeWidth={2.2} />
        </motion.div>
      </motion.div>

      {/* Destination */}
      <div className="absolute bottom-12 right-3 -translate-y-1/2 -translate-x-0">
        <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
          <Gift className="w-5 h-5 text-white/80" />
        </div>
      </div>

      <div className="absolute top-4 left-4 text-[11px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        {t('mystery.courier')}
      </div>
    </div>
  );
}

/* ────────────── shared bits ────────────── */

function Step({ n, text, done }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
          done ? 'bg-emerald-400 text-emerald-950' : 'bg-white/15 text-white/70'
        }`}
      >
        {n}
      </span>
      <span className={done ? 'text-white/95' : 'text-white/75'}>{text}</span>
    </li>
  );
}

function FloatingDoodles() {
  const items = ['🎁', '🍰', '🥐', '🌶️', '🥗', '☕', '🎀', '✨'];
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute opacity-20 text-3xl select-none"
          style={{
            top: `${(i * 53) % 90 + 5}%`,
            left: `${(i * 37) % 92 + 4}%`,
          }}
          animate={{ y: [0, -10, 0], rotate: [0, i % 2 ? 8 : -8, 0] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}
