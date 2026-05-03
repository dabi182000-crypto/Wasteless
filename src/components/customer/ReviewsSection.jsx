import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useReviews } from '../../context/ReviewsContext.jsx';
import { useI18n } from '../../context/I18nContext.jsx';
import AddReviewModal from './AddReviewModal.jsx';

const INTERVAL = 3500; // ms between auto-advances

function timeAgo(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function StarRow({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${
            n <= count ? 'fill-amber-400 text-amber-400' : 'text-muted dark:text-muted-dark'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="card overflow-hidden flex flex-col h-full select-none">
      {review.photo && (
        <div className="aspect-[4/3] overflow-hidden bg-bg-dark shrink-0">
          <img
            src={review.photo}
            alt={`${review.vendor} unboxing`}
            draggable={false}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted dark:text-muted-dark">
          {review.vendor}
        </p>
        {review.caption && (
          <p className="text-sm leading-relaxed flex-1">{review.caption}</p>
        )}
        <div className="flex items-center justify-between gap-2 flex-wrap mt-auto pt-2">
          <StarRow count={review.stars} />
          <span className="inline-flex items-center rounded-full bg-accent/10 text-accent text-[11px] font-bold px-2 py-0.5">
            {review.discountedPrice} QAR
          </span>
        </div>
        <p className="text-[11px] text-muted dark:text-muted-dark">{timeAgo(review.createdAt)}</p>
      </div>
    </div>
  );
}

export default function ReviewsSection({ openReviewWith = null, onReviewModalClose }) {
  const { reviews, addReview } = useReviews();
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const dragStartX = useRef(0);
  const timerRef = useRef(null);

  const count = reviews.length;

  // How many cards are visible at once (CSS handles the actual sizing, this is for index math)
  const getVisible = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const maxIndex = Math.max(0, count - getVisible());

  const goTo = useCallback((idx) => {
    setCurrent(Math.max(0, Math.min(idx, Math.max(0, count - getVisible()))));
  }, [count]);

  const goNext = useCallback(() => {
    setCurrent(prev => {
      const max = Math.max(0, count - getVisible());
      return prev >= max ? 0 : prev + 1;
    });
  }, [count]);

  const goPrev = useCallback(() => {
    setCurrent(prev => {
      const max = Math.max(0, count - getVisible());
      return prev <= 0 ? max : prev - 1;
    });
  }, [count]);

  // Auto-advance
  useEffect(() => {
    if (paused || count <= getVisible()) return;
    timerRef.current = setInterval(goNext, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [paused, goNext, count]);

  const applyOffset = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;
    const containerW = containerRef.current.offsetWidth;
    const visible = getVisible();
    const cardW = (containerW - (visible - 1) * 20) / visible;
    const offset = -(current * (cardW + 20));
    trackRef.current.style.transform = `translateX(${offset}px)`;
  }, [current]);

  // Animate track on index change
  useEffect(() => {
    applyOffset();
  }, [applyOffset]);

  // Re-apply on resize
  useEffect(() => {
    window.addEventListener('resize', applyOffset);
    return () => window.removeEventListener('resize', applyOffset);
  }, [applyOffset]);

  // Drag handlers
  const onDragStart = (e) => {
    dragStartX.current = e.type === 'touchstart'
      ? e.touches[0].clientX
      : e.clientX;
    setPaused(true);
    clearInterval(timerRef.current);
  };

  const onDragEnd = (e) => {
    const endX = e.type === 'touchend'
      ? e.changedTouches[0].clientX
      : e.clientX;
    const delta = dragStartX.current - endX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? goNext() : goPrev();
    }
    setPaused(false);
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => {
    setModalOpen(false);
    onReviewModalClose?.();
  };

  const dots = Array.from({ length: Math.max(0, count - getVisible()) + 1 });

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">{t('reviews.title')}</h2>
          <p className="text-sm text-muted dark:text-muted-dark mt-1">{t('reviews.subtitle')}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleOpen}
          className="btn-primary whitespace-nowrap self-start sm:self-auto"
        >
          📸 {t('reviews.add')}
        </motion.button>
      </div>

      {reviews.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Camera className="w-10 h-10 text-muted dark:text-muted-dark" />
          <h3 className="mt-3 font-bold">{t('reviews.empty')}</h3>
          <p className="mt-1 text-sm text-muted dark:text-muted-dark max-w-xs">
            {t('reviews.empty_sub')}
          </p>
        </div>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Arrow — prev */}
          {count > getVisible() && (
            <button
              onClick={goPrev}
              aria-label="Previous review"
              className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark shadow-md items-center justify-center hover:border-accent/50 hover:text-accent transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Track container */}
          <div
            ref={containerRef}
            className="overflow-hidden"
          >
            <div
              ref={trackRef}
              className="flex gap-5 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-grab active:cursor-grabbing"
              onMouseDown={onDragStart}
              onMouseUp={onDragEnd}
              onTouchStart={onDragStart}
              onTouchEnd={onDragEnd}
              style={{ willChange: 'transform' }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Arrow — next */}
          {count > getVisible() && (
            <button
              onClick={goNext}
              aria-label="Next review"
              className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark shadow-md items-center justify-center hover:border-accent/50 hover:text-accent transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Dots */}
          {dots.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {dots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? 20 : 6,
                    height: 6,
                    background: i === current
                      ? 'var(--color-accent, #e63946)'
                      : 'currentColor',
                    opacity: i === current ? 1 : 0.25,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <AddReviewModal
        open={modalOpen || !!openReviewWith}
        listing={openReviewWith}
        onClose={handleClose}
        onSubmit={addReview}
      />
    </section>
  );
}
