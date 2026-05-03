import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.jsx';

const SLIDE_META = [
  {
    id: 'iftar',
    labelKey: 'announce.1.label',
    titleKey: 'announce.1.title',
    subKey: 'announce.1.sub',
    ctaKey: 'announce.1.cta',
    image: 'https://images.unsplash.com/photo-1565299543923-37dd37887442?w=1400&auto=format&fit=crop',
    gradient: 'linear-gradient(110deg, rgba(230,57,70,0.92) 0%, rgba(230,57,70,0.55) 55%, rgba(0,0,0,0) 100%)',
  },
  {
    id: 'first',
    labelKey: 'announce.2.label',
    titleKey: 'announce.2.title',
    subKey: 'announce.2.sub',
    ctaKey: 'announce.2.cta',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&fit=crop',
    gradient: 'linear-gradient(110deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.55) 50%, rgba(0,0,0,0) 100%)',
  },
  {
    id: 'midnight',
    labelKey: 'announce.3.label',
    titleKey: 'announce.3.title',
    subKey: 'announce.3.sub',
    ctaKey: 'announce.3.cta',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&auto=format&fit=crop',
    gradient: 'linear-gradient(110deg, rgba(76,29,149,0.92) 0%, rgba(30,27,75,0.6) 55%, rgba(0,0,0,0.1) 100%)',
  },
  {
    id: 'lusail',
    labelKey: 'announce.4.label',
    titleKey: 'announce.4.title',
    subKey: 'announce.4.sub',
    ctaKey: 'announce.4.cta',
    image: 'https://images.unsplash.com/photo-1582653291997-079a1c1e1c9b?w=1400&auto=format&fit=crop',
    gradient: 'linear-gradient(110deg, rgba(2,132,199,0.92) 0%, rgba(2,132,199,0.55) 55%, rgba(0,0,0,0) 100%)',
  },
];

const AUTOPLAY_MS = 5000;

export default function AnnouncementSlider() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDE_META.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  const go = (delta) => setIndex((i) => (i + delta + SLIDE_META.length) % SLIDE_META.length);
  const slide = SLIDE_META[index];

  return (
    <section
      className="relative rounded-2xl overflow-hidden border border-border dark:border-border-dark shadow-card dark:shadow-card-dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Announcements"
    >
      <div className="relative aspect-[16/7] sm:aspect-[16/5] bg-bg-dark">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div
              className="absolute inset-0"
              style={{ background: slide.gradient }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative h-full flex items-end sm:items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="p-5 sm:p-10 max-w-2xl text-white"
            >
              <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-widest bg-white/15 backdrop-blur-md rounded-full px-3 py-1">
                {t(slide.labelKey)}
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {t(slide.titleKey)}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/85 max-w-md">
                {t(slide.subKey)}
              </p>
              <button className="mt-4 inline-flex items-center gap-2 bg-white text-ink rounded-2xl px-4 py-2 text-sm font-bold hover:bg-white/90 transition-colors">
                {t(slide.ctaKey)}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Arrows (desktop) */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-2xl bg-black/35 hover:bg-black/55 text-white items-center justify-center backdrop-blur-md transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next slide"
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-2xl bg-black/35 hover:bg-black/55 text-white items-center justify-center backdrop-blur-md transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 right-4 sm:right-6 flex gap-1.5">
          {SLIDE_META.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 22 : 8,
                background: i === index ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
