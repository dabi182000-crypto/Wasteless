import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import StatsRow from './StatsRow.jsx';
import AddListingForm from './AddListingForm.jsx';
import ListingsTable from './ListingsTable.jsx';
import { useListings } from '../../hooks/useListings.js';
import { useReservations } from '../../context/ReservationsContext.jsx';
import { usingFirebase } from '../../lib/firebase.js';

export default function VendorView() {
  const { listings, repo } = useListings();
  const { count, totalSaved } = useReservations();

  const totalListings = listings.filter((l) => l.quantity > 0).length;

  const handleAdd = async (listing) => {
    if (repo) await repo.add(listing);
  };
  const handleDelete = async (id) => {
    if (repo) await repo.remove(id);
  };

  return (
    <div className="pt-10 sm:pt-14 pb-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Vendor dashboard</h1>
        <p className="mt-2 text-muted dark:text-muted-dark flex items-center gap-2">
          <Database className="w-4 h-4" />
          Live data ·{' '}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              usingFirebase
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'bg-accent/10 text-accent'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                usingFirebase ? 'bg-emerald-500' : 'bg-accent'
              } animate-pulse`}
            />
            {usingFirebase ? 'Firestore connected' : 'Demo mode (in-memory)'}
          </span>
        </p>
      </motion.div>

      <StatsRow
        totalListings={totalListings}
        rescuedToday={count}
        revenueSaved={totalSaved}
      />

      <AddListingForm onAdd={handleAdd} />

      <ListingsTable listings={listings} onDelete={handleDelete} />
    </div>
  );
}
