import { motion } from 'framer-motion';
import { LayoutGrid, MapPin, ShoppingCart, UtensilsCrossed, Croissant } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.jsx';

export const FILTERS = [
  { id: 'all',         tKey: 'filter.all',          Icon: LayoutGrid },
  { id: 'restaurant',  tKey: 'filter.restaurants',  Icon: UtensilsCrossed },
  { id: 'bakery',      tKey: 'filter.bakeries',     Icon: Croissant },
  { id: 'supermarket', tKey: 'filter.supermarkets', Icon: ShoppingCart },
  { id: 'near',        tKey: 'filter.near',         Icon: MapPin },
];

export default function FilterChips({ active, onChange }) {
  const { t } = useI18n();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
      {FILTERS.map(({ id, tKey, Icon }) => {
        const isActive = active === id;
        return (
          <motion.button
            key={id}
            onClick={() => onChange(id)}
            whileTap={{ scale: 0.96 }}
            className={`chip whitespace-nowrap ${isActive ? 'chip-active' : 'chip-inactive'}`}
            aria-pressed={isActive}
          >
            <Icon className="w-4 h-4" />
            {t(tKey)}
          </motion.button>
        );
      })}
    </div>
  );
}
