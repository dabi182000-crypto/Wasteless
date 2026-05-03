import { motion } from 'framer-motion';
import { Package, Leaf, Wallet } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.jsx';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
};

function StatCard({ index, label, value, suffix, Icon, accent }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className="card p-5 flex items-center gap-4"
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          accent ? 'bg-accent/10 text-accent' : 'bg-emerald-500/10 text-emerald-500'
        }`}
      >
        <Icon className="w-5 h-5" strokeWidth={2.4} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted dark:text-muted-dark font-semibold">
          {label}
        </p>
        <p className="mt-0.5 text-2xl sm:text-3xl font-extrabold tracking-tight">
          {value}
          {suffix && <span className="text-base font-semibold ml-1 text-muted dark:text-muted-dark">{suffix}</span>}
        </p>
      </div>
    </motion.div>
  );
}

export default function StatsRow({ totalListings, rescuedToday, revenueSaved }) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard index={0} label={t('stats.total')} value={totalListings} Icon={Package} accent />
      <StatCard index={1} label={t('stats.rescued')} value={rescuedToday} Icon={Leaf} />
      <StatCard
        index={2}
        label={t('stats.saved')}
        value={revenueSaved}
        suffix="QAR"
        Icon={Wallet}
        accent
      />
    </div>
  );
}
