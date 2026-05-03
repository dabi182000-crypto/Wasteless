import { motion, AnimatePresence } from 'framer-motion';
import { Bike, ShoppingBag, Trash2 } from 'lucide-react';

export default function ListingsTable({ listings, onDelete }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-border dark:border-border-dark flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">Live listings</h2>
        <span className="text-xs font-semibold text-muted dark:text-muted-dark">
          {listings.length} active
        </span>
      </div>

      {listings.length === 0 ? (
        <div className="px-5 sm:px-6 py-10 text-center text-sm text-muted dark:text-muted-dark">
          No listings yet — add one above to start rescuing food.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted dark:text-muted-dark">
              <tr className="text-left border-b border-border dark:border-border-dark">
                <Th>Vendor</Th>
                <Th>Deal</Th>
                <Th className="text-right">Original</Th>
                <Th className="text-right">Breakeven</Th>
                <Th className="text-right">Discounted</Th>
                <Th className="text-right">Qty</Th>
                <Th>Pickup</Th>
                <Th>Type</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {listings.map((l) => (
                  <motion.tr
                    key={l.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="border-b border-border/60 dark:border-border-dark/60 last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  >
                    <Td>
                      <p className="font-semibold">{l.vendor}</p>
                      <p className="text-xs text-muted dark:text-muted-dark capitalize">{l.category}</p>
                    </Td>
                    <Td>{l.title}</Td>
                    <Td className="text-right tabular-nums text-muted dark:text-muted-dark line-through">
                      {l.originalPrice} QAR
                    </Td>
                    <Td className="text-right tabular-nums text-muted dark:text-muted-dark">
                      {l.breakevenPrice ? `${l.breakevenPrice} QAR` : '—'}
                    </Td>
                    <Td className="text-right tabular-nums font-bold text-accent">
                      {l.discountedPrice} QAR
                    </Td>
                    <Td className="text-right tabular-nums">{l.quantity}</Td>
                    <Td className="whitespace-nowrap">
                      {l.pickupStart}–{l.pickupEnd}
                    </Td>
                    <Td>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full text-[11px] font-semibold px-2 py-0.5 ${
                          l.delivery
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-black/5 dark:bg-white/10 text-muted dark:text-muted-dark'
                        }`}
                      >
                        {l.delivery ? <Bike className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                        {l.delivery ? 'Delivery' : 'Pickup'}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <button
                        onClick={() => onDelete(l.id)}
                        aria-label={`Delete ${l.title}`}
                        className="w-8 h-8 rounded-2xl hover:bg-accent/10 hover:text-accent text-muted dark:text-muted-dark flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children, className = '' }) {
  return <th className={`px-5 sm:px-6 py-3 font-semibold ${className}`}>{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`px-5 sm:px-6 py-3 align-middle ${className}`}>{children}</td>;
}
