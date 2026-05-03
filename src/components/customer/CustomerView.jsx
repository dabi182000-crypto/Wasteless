import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import Hero from './Hero.jsx';
import SearchBar from './SearchBar.jsx';
import FilterChips from './FilterChips.jsx';
import DealCard from './DealCard.jsx';
import ReserveModal from './ReserveModal.jsx';
import AnnouncementSlider from './AnnouncementSlider.jsx';
import MidnightDeal from './MidnightDeal.jsx';
import MysteryBox from './MysteryBox.jsx';
import ReviewsSection from './ReviewsSection.jsx';
import AddReviewModal from './AddReviewModal.jsx';
import { useListings } from '../../hooks/useListings.js';
import { useReservations } from '../../context/ReservationsContext.jsx';
import { useReviews } from '../../context/ReviewsContext.jsx';
import { useI18n } from '../../context/I18nContext.jsx';

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export default function CustomerView() {
  const { listings, repo, loading } = useListings();
  const { addReservation } = useReservations();
  const { addReview } = useReviews();
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [reservingListing, setReservingListing] = useState(null);
  const [reviewingListing, setReviewingListing] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listings.filter((l) => {
      if (filter === 'near' && l.distanceKm >= 2) return false;
      if (filter !== 'all' && filter !== 'near' && l.category !== filter) return false;
      if (!q) return true;
      return (
        l.vendor.toLowerCase().includes(q) ||
        l.title.toLowerCase().includes(q) ||
        (l.description || '').toLowerCase().includes(q)
      );
    });
  }, [listings, search, filter]);

  const handleConfirmReservation = async (listing) => {
    addReservation(listing);
    if (repo) {
      await repo.update(listing.id, { quantity: Math.max(0, listing.quantity - 1) });
    }
  };

  const handleReview = (listing) => {
    setReviewingListing(listing);
    setReservingListing(null);
  };

  return (
    <>
      <Hero />

      <section className="mt-2">
        <AnnouncementSlider />
      </section>

      <section className="space-y-4 mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">{t('tonight.title')}</h2>
            <p className="text-sm text-muted dark:text-muted-dark">
              {t('tonight.subtitle')}
            </p>
          </div>
        </div>
        <SearchBar value={search} onChange={setSearch} />
        <FilterChips active={filter} onChange={setFilter} />
      </section>

      <section className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-border dark:bg-border-dark" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-24 bg-border dark:bg-border-dark rounded" />
                  <div className="h-5 w-40 bg-border dark:bg-border-dark rounded" />
                  <div className="h-9 w-full bg-border dark:bg-border-dark rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <PackageOpen className="w-10 h-10 text-muted dark:text-muted-dark" />
            <h3 className="mt-3 font-bold">{t('tonight.empty')}</h3>
            <p className="mt-1 text-sm text-muted dark:text-muted-dark max-w-xs">
              {t('tonight.empty_sub')}
            </p>
          </div>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((l) => (
              <DealCard key={l.id} listing={l} onReserve={setReservingListing} />
            ))}
          </motion.div>
        )}
      </section>

      <section className="mt-12">
        <MidnightDeal />
      </section>

      <section className="mt-8">
        <MysteryBox />
      </section>

      <ReviewsSection />

      <AnimatePresence>
        {reservingListing && (
          <ReserveModal
            listing={reservingListing}
            onClose={() => setReservingListing(null)}
            onConfirm={handleConfirmReservation}
            onReview={handleReview}
          />
        )}
      </AnimatePresence>

      <AddReviewModal
        open={!!reviewingListing}
        listing={reviewingListing}
        onClose={() => setReviewingListing(null)}
        onSubmit={addReview}
      />
    </>
  );
}
