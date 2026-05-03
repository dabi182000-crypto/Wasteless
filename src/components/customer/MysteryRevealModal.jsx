import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Gift,
  Instagram,
  MessageCircle,
  Send,
  Share2,
  Sparkles,
  Twitter,
  X,
} from 'lucide-react';

const SHARE_URL = 'https://wasteless.qa';

function buildShareText(item, category) {
  return `I just rescued a ${item.emoji} ${item.title} from ${item.vendor} for ${item.discountedPrice} QAR (was ${item.originalPrice}!) on Wasteless — Qatar's food rescue app. ${category?.label ? `My pick: ${category.label}.` : ''} Don't waste it. Taste it. ${SHARE_URL}`;
}

export default function MysteryRevealModal({ reveal, onClose, onReroll = null }) {
  const [stage, setStage] = useState('opening');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reveal) {
      setStage('opening');
      setCopied(false);
      return;
    }
    setStage('opening');
    setCopied(false);
    const t = setTimeout(() => setStage('revealed'), 1500);
    return () => clearTimeout(t);
  }, [reveal]);

  useEffect(() => {
    if (!reveal) return;
    const onEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [reveal, onClose]);

  if (!reveal) return null;
  const { item, category } = reveal;
  const text = buildShareText(item, category);

  const onNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I rescued a Wasteless box!',
          text,
          url: SHARE_URL,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      onCopy();
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(text)}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(text)}`;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          key="dialog"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="card w-full max-w-md p-6 relative my-auto"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <AnimatePresence mode="wait">
            {stage === 'opening' ? (
              <motion.div
                key="opening"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-6 text-center"
              >
                <p className="text-xs uppercase tracking-widest text-muted dark:text-muted-dark font-semibold">
                  Unboxing your surprise…
                </p>
                <motion.div
                  animate={{ rotate: [0, -10, 10, -8, 8, -4, 4, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.4, ease: 'easeInOut' }}
                  className="mt-6 mx-auto w-32 h-32 rounded-3xl bg-gradient-to-br from-pink-400 via-amber-300 to-rose-500 shadow-2xl flex items-center justify-center relative"
                >
                  <Gift className="w-16 h-16 text-white" strokeWidth={2} />
                  <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 bg-white/30" />
                  <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 bg-white/30" />
                  {/* Sparkles */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-amber-200"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                      style={{
                        top: `${30 + (i * 13) % 50}%`,
                        left: `${20 + (i * 11) % 60}%`,
                      }}
                    >
                      ✨
                    </motion.span>
                  ))}
                </motion.div>
                <p className="mt-6 text-sm text-muted dark:text-muted-dark">
                  Curating something tasty for {category?.label.toLowerCase() || 'you'}…
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Confetti />
                <p className="text-xs uppercase tracking-widest text-accent font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  You got…
                </p>

                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 border ${category?.chip || ''}`}
                  >
                    {category?.label}
                  </span>
                </div>

                <h2 className="mt-2 text-2xl font-extrabold tracking-tight flex items-baseline gap-2">
                  <span className="text-3xl">{item.emoji}</span>
                  {item.title}
                </h2>
                <p className="text-sm text-muted dark:text-muted-dark">{item.vendor}</p>

                <div className="mt-3 rounded-2xl overflow-hidden aspect-[16/9] bg-bg-dark">
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="mt-3 text-sm text-muted dark:text-muted-dark">
                  {item.description}
                </p>

                <div className="mt-4 flex items-end justify-between rounded-2xl bg-bg dark:bg-bg-dark border border-border dark:border-border-dark p-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-muted dark:text-muted-dark">
                      Your price
                    </p>
                    <p className="text-2xl font-extrabold text-accent">
                      {item.discountedPrice}
                      <span className="text-sm font-semibold ml-1">QAR</span>
                    </p>
                  </div>
                  <p className="text-sm text-muted dark:text-muted-dark line-through">
                    {item.originalPrice} QAR
                  </p>
                </div>

                {/* Share */}
                <div className="mt-5">
                  <p className="label flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />
                    Share what you got
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <ShareTile
                      Icon={Instagram}
                      label="Instagram"
                      tint="from-fuchsia-500 to-orange-400"
                      onClick={onCopy}
                    />
                    <ShareTile
                      as="a"
                      href={whatsappHref}
                      target="_blank"
                      Icon={MessageCircle}
                      label="WhatsApp"
                      tint="from-emerald-400 to-emerald-600"
                    />
                    <ShareTile
                      as="a"
                      href={twitterHref}
                      target="_blank"
                      Icon={Twitter}
                      label="X / Twitter"
                      tint="from-slate-700 to-slate-900"
                    />
                    <ShareTile
                      as="a"
                      href={telegramHref}
                      target="_blank"
                      Icon={Send}
                      label="Telegram"
                      tint="from-sky-400 to-blue-600"
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={onCopy}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold bg-bg dark:bg-bg-dark border border-border dark:border-border-dark hover:border-accent/50 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy text
                        </>
                      )}
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={onNativeShare}
                      className="btn-primary inline-flex items-center justify-center gap-2 text-sm py-2.5"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </motion.button>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-muted dark:text-muted-dark hover:text-accent transition-colors py-2"
                >
                  Done · order another later
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ShareTile({ as = 'button', Icon, label, tint, ...rest }) {
  const Comp = as;
  return (
    <Comp
      {...rest}
      aria-label={`Share to ${label}`}
      className={`group rounded-2xl p-3 flex flex-col items-center gap-1 bg-gradient-to-br ${tint} text-white hover:scale-105 active:scale-95 transition-transform`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </Comp>
  );
}

function Confetti() {
  const colors = ['#e63946', '#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'];
  return (
    <div aria-hidden className="absolute inset-x-0 top-0 h-32 pointer-events-none overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${(i * 47) % 100}%`,
            width: 6,
            height: 10,
            background: colors[i % colors.length],
          }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{
            y: 140,
            opacity: [0, 1, 1, 0],
            rotate: [0, 180, 360],
            x: (i % 2 ? 1 : -1) * (10 + (i % 5) * 4),
          }}
          transition={{ duration: 1.6, delay: i * 0.04, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
