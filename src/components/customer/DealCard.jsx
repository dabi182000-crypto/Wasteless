import { AnimatePresence, motion } from 'framer-motion';
import { Bike, MapPin, ShoppingBag, Heart } from 'lucide-react';
import CountdownBadge from './CountdownBadge.jsx';
import { useFavourites } from '../../context/FavouritesContext.jsx';
import { useI18n } from '../../context/I18nContext.jsx';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23262626"/><text x="50%25" y="50%25" font-family="Inter,sans-serif" font-size="22" fill="%23737373" text-anchor="middle" dominant-baseline="middle">Surprise Bag</text></svg>';

function QuantityCounter({ quantity, soldOut }) {
  const { t } = useI18n();

  const colorClass =
    soldOut || quantity <= 0
      ? 'text-muted dark:text-muted-dark'
      : quantity <= 3
      ? 'text-red-500 font-bold'
      : quantity <= 5
      ? 'text-amber-500 font-semibold'
      : 'text-muted dark:text-muted-dark';

  if (soldOut) {
    return <p className={`text-xs ${colorClass}`}>{t('card.soldout')}</p>;
  }

  return (
    <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
      {quantity <= 3 && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      )}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={quantity}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="tabular-nums"
        >
          {quantity <= 3 ? t('card.only_left').replace('{n}', quantity) : `${quantity} ${t('card.left')}`}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function DealCard({ listing, onReserve }) {
  const { toggle, isFav } = useFavourites();
  const { t } = useI18n();

  const {
    vendor,
    title,
    description,
    originalPrice,
    discountedPrice,
    quantity,
    pickupStart,
    pickupEnd,
    delivery,
    distanceKm,
    image,
  } = listing;

  const discountPct = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );
  const soldOut = quantity <= 0;
  const favourite = isFav(listing.id);

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="card overflow-hidden group flex flex-col hover:shadow-card-hover dark:hover:border-accent/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-dark">
        <img
          src={image || PLACEHOLDER}
          alt={`${vendor} — ${title}`}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0 pointer-events-none" />

        {/* Countdown badge — top-left */}
        <div className="absolute top-3 left-3">
          <CountdownBadge pickupEnd={pickupEnd} />
        </div>

        {/* Discount badge — top-right */}
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-accent text-white text-xs font-bold px-2.5 py-1 shadow-glow">
          -{discountPct}%
        </div>

        {/* Heart button — top-left below countdown (overlaid corner) */}
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={(e) => { e.stopPropagation(); toggle(listing.id); }}
          aria-label={favourite ? 'Remove from saved' : 'Save listing'}
          className="absolute top-11 left-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-black/60"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${favourite ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </motion.button>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full text-[11px] font-semibold px-2 py-1 backdrop-blur-md ${
              delivery
                ? 'bg-emerald-500/90 text-white'
                : 'bg-white/15 text-white'
            }`}
          >
            {delivery ? <Bike className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
            {delivery ? t('card.delivery') : t('card.pickup_only')}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 text-white text-[11px] font-semibold px-2 py-1 backdrop-blur-md">
            <MapPin className="w-3 h-3" />
            {distanceKm.toFixed(1)} km
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted dark:text-muted-dark font-semibold">
              {vendor}
            </p>
            <h3 className="mt-0.5 font-bold text-lg leading-tight truncate">{title}</h3>
          </div>
        </div>
        {description && (
          <p className="mt-2 text-sm text-muted dark:text-muted-dark line-clamp-2">{description}</p>
        )}

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted dark:text-muted-dark">
              {t('card.pickup_label')} {pickupStart}–{pickupEnd}
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-accent">
                {discountedPrice} <span className="text-sm font-semibold">QAR</span>
              </span>
              <span className="text-sm text-muted dark:text-muted-dark line-through">
                {originalPrice} QAR
              </span>
            </div>
          </div>
          <QuantityCounter quantity={quantity} soldOut={soldOut} />
        </div>

        <motion.button
          whileHover={{ scale: soldOut ? 1 : 1.02 }}
          whileTap={{ scale: soldOut ? 1 : 0.94 }}
          disabled={soldOut}
          onClick={() => onReserve(listing)}
          className="btn-primary w-full mt-4"
        >
          {soldOut ? t('card.soldout') : t('card.reserve')}
        </motion.button>
      </div>
    </motion.article>
  );
}
