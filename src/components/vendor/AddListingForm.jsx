import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus,
  CheckCircle2,
  Bike,
  ShoppingBag,
  Sparkles,
  Lock,
  Clock,
  Hourglass,
  MapPin,
  Package,
  Tag,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  ChevronDown,
  ImagePlus,
  X as XIcon,
} from 'lucide-react';
import { recommendPriceWithBreakdown } from '../../lib/pricingAi.js';
import { useI18n } from '../../context/I18nContext.jsx';

const CATEGORIES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'supermarket', label: 'Supermarket' },
];

const FACTOR_ICONS = {
  Clock,
  Hourglass,
  MapPin,
  Package,
  Tag,
  CalendarDays,
};

const initialState = {
  vendor: '',
  category: 'restaurant',
  title: 'Surprise Bag',
  description: '',
  originalPrice: '',
  breakevenPrice: '',
  discountedPrice: '',
  quantity: '5',
  pickupStart: '19:00',
  pickupEnd: '21:00',
  delivery: false,
  distanceKm: '1.5',
  image: '',
};

export default function AddListingForm({ onAdd }) {
  const { t } = useI18n();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [aiUsed, setAiUsed] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const imgRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => set('image', e.target.result);
    reader.readAsDataURL(file);
  };

  const aiResult = useMemo(
    () =>
      recommendPriceWithBreakdown({
        originalPrice: form.originalPrice,
        breakevenPrice: form.breakevenPrice,
        pickupStart: form.pickupStart,
        pickupEnd: form.pickupEnd,
        distanceKm: form.distanceKm,
        quantity: form.quantity,
        category: form.category,
      }),
    [
      form.originalPrice,
      form.breakevenPrice,
      form.pickupStart,
      form.pickupEnd,
      form.distanceKm,
      form.quantity,
      form.category,
    ]
  );
  const suggestion = aiResult ? aiResult.suggested : null;

  const applySuggestion = () => {
    if (suggestion == null) return;
    set('discountedPrice', String(suggestion));
    setAiUsed(true);
    setBreakdownOpen(true);
    setErrors((e) => ({ ...e, discountedPrice: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.vendor.trim()) e.vendor = 'Required';
    if (!form.title.trim()) e.title = 'Required';
    const op = Number(form.originalPrice);
    const be = Number(form.breakevenPrice);
    const dp = Number(form.discountedPrice);
    if (!op || op <= 0) e.originalPrice = 'Must be > 0';
    if (!be || be <= 0) e.breakevenPrice = 'Must be > 0';
    if (op && be && be >= op) e.breakevenPrice = 'Must be less than original';
    if (!dp || dp <= 0) e.discountedPrice = 'Must be > 0';
    if (op && dp && dp >= op) e.discountedPrice = 'Must be less than original';
    if (be && dp && dp < be) e.discountedPrice = `Must be ≥ breakeven (${be} QAR)`;
    if (!Number(form.quantity) || Number(form.quantity) <= 0) e.quantity = 'Must be > 0';
    if (form.pickupEnd <= form.pickupStart) e.pickupEnd = 'Must be after start';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    await onAdd({
      vendor: form.vendor.trim(),
      category: form.category,
      title: form.title.trim(),
      description: form.description.trim(),
      originalPrice: Number(form.originalPrice),
      breakevenPrice: Number(form.breakevenPrice),
      discountedPrice: Number(form.discountedPrice),
      quantity: Number(form.quantity),
      pickupStart: form.pickupStart,
      pickupEnd: form.pickupEnd,
      delivery: form.delivery,
      distanceKm: Number(form.distanceKm) || 1.5,
      image: form.image || '',
    });
    setForm(initialState);
    setAiUsed(false);
    setToast(t('vendor.toast'));
    setTimeout(() => setToast(null), 2800);
  };

  const op = Number(form.originalPrice);
  const dp = Number(form.discountedPrice);
  const discountPct = op > 0 && dp > 0 && dp < op ? Math.round(((op - dp) / op) * 100) : null;

  return (
    <form onSubmit={handleSubmit} className="card p-5 sm:p-6 relative">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
          <Plus className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">{t('vendor.add_title')}</h2>
          <p className="text-xs text-muted dark:text-muted-dark">
            {t('vendor.add_sub')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t('vendor.field.restaurant')} error={errors.vendor}>
          <input
            className="input"
            value={form.vendor}
            onChange={(e) => set('vendor', e.target.value)}
            placeholder="e.g. Leila Restaurant"
          />
        </Field>
        <Field label={t('vendor.field.category')}>
          <select
            className="input"
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>

        <Field label={t('vendor.field.deal')} className="sm:col-span-2" error={errors.title}>
          <input
            className="input"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Lebanese Surprise Bag"
          />
        </Field>

        <Field label={t('vendor.field.notes')} className="sm:col-span-2">
          <input
            className="input"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="What's typically inside?"
          />
        </Field>

        {/* Photo upload */}
        <div className="sm:col-span-2">
          <label className="label">{t('vendor.field.photo')}</label>
          <div
            onClick={() => imgRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); handleImageFile(e.dataTransfer.files[0]); }}
            onDragOver={(e) => e.preventDefault()}
            className="relative border-2 border-dashed border-border dark:border-border-dark rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-accent/50 transition-colors bg-bg dark:bg-bg-dark"
          >
            {form.image ? (
              <>
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{t('vendor.field.photo_ready')}</p>
                  <p className="text-xs text-muted dark:text-muted-dark mt-0.5">
                    {t('vendor.field.photo_replace')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); set('image', ''); }}
                  className="w-7 h-7 rounded-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-colors shrink-0"
                  aria-label="Remove photo"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark flex items-center justify-center shrink-0">
                  <ImagePlus className="w-5 h-5 text-muted dark:text-muted-dark" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t('vendor.field.photo_cta')}</p>
                  <p className="text-xs text-muted dark:text-muted-dark mt-0.5">
                    {t('vendor.field.photo_hint')}
                  </p>
                </div>
              </>
            )}
            <input
              ref={imgRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageFile(e.target.files[0])}
            />
          </div>
        </div>

        <Field label={t('vendor.field.original')} error={errors.originalPrice}>
          <input
            type="number"
            className="input"
            value={form.originalPrice}
            onChange={(e) => set('originalPrice', e.target.value)}
            placeholder="45"
            min={1}
          />
        </Field>
        <Field
          label={t('vendor.field.breakeven')}
          hint={t('vendor.field.breakeven_hint')}
          error={errors.breakevenPrice}
        >
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted dark:text-muted-dark pointer-events-none" />
            <input
              type="number"
              className="input pl-10"
              value={form.breakevenPrice}
              onChange={(e) => {
                set('breakevenPrice', e.target.value);
                setAiUsed(false);
              }}
              placeholder="10"
              min={1}
            />
          </div>
        </Field>

        <Field
          className="sm:col-span-2"
          label={
            <span className="flex items-center justify-between gap-2">
              <span>{t('vendor.field.discounted')}</span>
              {suggestion != null && (
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:text-accent-hover normal-case tracking-normal"
                >
                  <Sparkles className="w-3 h-3" />
                  Smart price: {suggestion} QAR
                </button>
              )}
            </span>
          }
          error={errors.discountedPrice}
        >
          <input
            type="number"
            className="input"
            value={form.discountedPrice}
            onChange={(e) => {
              set('discountedPrice', e.target.value);
              setAiUsed(false);
            }}
            placeholder="15"
            min={1}
          />
          <AnimatePresence>
            {aiUsed && aiResult && (
              <motion.div
                key="ai-breakdown"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2"
              >
                <button
                  type="button"
                  onClick={() => setBreakdownOpen((o) => !o)}
                  className="w-full inline-flex items-center justify-between gap-2 rounded-2xl px-3 py-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent/15 transition-colors"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI priced at {aiResult.suggested} QAR · {aiResult.discountPct}% off ·{' '}
                    <ConfidenceBadge level={aiResult.confidence} />
                  </span>
                  <motion.span
                    animate={{ rotate: breakdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {breakdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <PricingBreakdown result={aiResult} breakeven={form.breakevenPrice} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            {!aiUsed && discountPct && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-muted dark:text-muted-dark mt-1.5"
              >
                {discountPct}% off retail.
                {Number(form.breakevenPrice) > 0 && Number(form.discountedPrice) > 0 &&
                  ` Margin over breakeven: ${(Number(form.discountedPrice) - Number(form.breakevenPrice)).toFixed(0)} QAR.`}
              </motion.p>
            )}
          </AnimatePresence>
        </Field>

        <Field label={t('vendor.field.quantity')} error={errors.quantity}>
          <input
            type="number"
            className="input"
            value={form.quantity}
            onChange={(e) => set('quantity', e.target.value)}
            min={1}
          />
        </Field>
        <Field label={t('vendor.field.distance')}>
          <input
            type="number"
            step="0.1"
            className="input"
            value={form.distanceKm}
            onChange={(e) => set('distanceKm', e.target.value)}
            min={0}
          />
        </Field>

        <Field label={t('vendor.field.pickup_start')}>
          <input
            type="time"
            className="input"
            value={form.pickupStart}
            onChange={(e) => set('pickupStart', e.target.value)}
          />
        </Field>
        <Field label={t('vendor.field.pickup_end')} error={errors.pickupEnd}>
          <input
            type="time"
            className="input"
            value={form.pickupEnd}
            onChange={(e) => set('pickupEnd', e.target.value)}
          />
        </Field>

        <div className="sm:col-span-2">
          <span className="label">{t('vendor.field.fulfilment')}</span>
          <div className="grid grid-cols-2 gap-2">
            <ToggleOption
              active={!form.delivery}
              onClick={() => set('delivery', false)}
              Icon={ShoppingBag}
              label={t('vendor.pickup_only')}
            />
            <ToggleOption
              active={form.delivery}
              onClick={() => set('delivery', true)}
              Icon={Bike}
              label={t('vendor.delivery')}
            />
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.01 }}
        className="btn-primary w-full sm:w-auto sm:px-8 mt-6"
      >
        {t('vendor.publish')}
      </motion.button>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold rounded-2xl px-4 py-2.5 shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function Field({ label, hint, error, className = '', children }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-muted dark:text-muted-dark mt-1">{hint}</p>
      )}
      {error && <p className="text-xs text-accent mt-1">{error}</p>}
    </div>
  );
}

function ConfidenceBadge({ level }) {
  const map = {
    high: { label: 'high confidence', cls: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
    medium: { label: 'medium confidence', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
    low: { label: 'low confidence', cls: 'bg-muted/15 text-muted dark:text-muted-dark border-muted/30' },
  };
  const { label, cls } = map[level] || map.low;
  return (
    <span className={`inline-flex items-center rounded-full text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 border ${cls}`}>
      {label}
    </span>
  );
}

function FactorRow({ factor }) {
  const Icon = FACTOR_ICONS[factor.icon] || Tag;
  const positive = factor.delta > 0;
  const negative = factor.delta < 0;
  const TrendIcon = positive ? TrendingUp : negative ? TrendingDown : Minus;
  const tone = positive
    ? 'text-emerald-600 dark:text-emerald-400'
    : negative
    ? 'text-accent'
    : 'text-muted dark:text-muted-dark';
  const sign = positive ? '+' : negative ? '' : '±';
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="w-3.5 h-3.5 text-muted dark:text-muted-dark shrink-0" />
        <span className="text-xs truncate">{factor.label}</span>
      </div>
      <div className={`inline-flex items-center gap-1 text-xs font-bold tabular-nums ${tone}`}>
        <TrendIcon className="w-3 h-3" />
        {sign}{factor.delta} QAR
      </div>
    </div>
  );
}

function PricingBreakdown({ result, breakeven }) {
  return (
    <div className="mt-2 rounded-2xl border border-border dark:border-border-dark bg-bg dark:bg-bg-dark p-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-border dark:border-border-dark">
        <span className="text-[11px] uppercase tracking-widest text-muted dark:text-muted-dark font-bold">
          Pricing breakdown
        </span>
        <span className="text-[11px] text-muted dark:text-muted-dark">Why this price</span>
      </div>

      <div className="flex items-center justify-between py-2 border-b border-border/60 dark:border-border-dark/60">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-muted dark:text-muted-dark shrink-0" />
          <span className="text-xs">Base · breakeven + 20% of spread</span>
        </div>
        <span className="text-xs font-bold tabular-nums">{result.base} QAR</span>
      </div>

      <div className="divide-y divide-border/60 dark:divide-border-dark/60">
        {result.factors.map((f) => (
          <FactorRow key={f.id} factor={f} />
        ))}
      </div>

      <div className="mt-2 pt-2 border-t border-border dark:border-border-dark flex items-center justify-between">
        <span className="text-xs font-bold">Suggested price</span>
        <span className="text-base font-extrabold text-accent tabular-nums">
          {result.suggested} QAR
        </span>
      </div>

      {result.clamped && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-1 text-[10px] font-bold">
          <Shield className="w-3 h-3" />
          Clamped to safe range (≥ {Math.ceil(Number(breakeven) * 1.05)}, &lt; {result.original})
        </div>
      )}
    </div>
  );
}

function ToggleOption({ active, onClick, Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-semibold border flex items-center justify-center gap-2 transition-colors ${
        active
          ? 'bg-accent text-white border-accent shadow-glow'
          : 'border-border dark:border-border-dark text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
