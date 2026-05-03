import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.jsx';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative pt-8 sm:pt-12 pb-4 overflow-hidden">
      {/* Decorative gradient blob */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(closest-side, #e63946, transparent)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          {t('hero.badge')}
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
          {t('hero.tagline')}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted dark:text-muted-dark max-w-xl">
          {t('hero.subtitle')}
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="btn-primary mt-6"
        >
          {t('hero.cta')}
        </motion.button>
      </motion.div>
    </section>
  );
}
