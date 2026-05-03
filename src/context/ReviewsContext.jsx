import { createContext, useContext, useState, useCallback } from 'react';

const KEY = 'wasteless:reviews';

const SEED_REVIEWS = [
  {
    id: 'rev-seed-1',
    vendor: 'Leila Restaurant',
    title: 'Lebanese Surprise Bag',
    discountedPrice: 15,
    stars: 5,
    photo: '/packaging.png',
    caption: 'Got mezze, grilled chicken and fresh pita! Totally worth it for 15 QAR 🙌',
    createdAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: 'rev-seed-2',
    vendor: 'Paul Bakery',
    title: 'Pastry Bag',
    discountedPrice: 20,
    stars: 5,
    photo: '/packaging.png',
    caption: '4 croissants, 2 pain au chocolat and a brioche. Unreal deal for 20 QAR!',
    createdAt: Date.now() - 1000 * 60 * 90,
  },
  {
    id: 'rev-seed-3',
    vendor: 'Monoprix',
    title: 'Grocery Rescue Box',
    discountedPrice: 25,
    stars: 4,
    photo: '/packaging.png',
    caption: 'Great mix of fresh veggies, yoghurt and cheese. Everything perfectly fine.',
    createdAt: Date.now() - 1000 * 60 * 180,
  },
  {
    id: 'rev-seed-4',
    vendor: 'Megu Doha',
    title: 'Omakase Sushi Bag',
    discountedPrice: 28,
    stars: 5,
    photo: '/packaging.png',
    caption: 'Premium sushi for 28 QAR?! 10 nigiri + 2 rolls. Absolutely insane value 🔥',
    createdAt: Date.now() - 1000 * 60 * 210,
  },
];

const load = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    return stored && stored.length > 0 ? stored : SEED_REVIEWS;
  } catch {
    return SEED_REVIEWS;
  }
};

const Ctx = createContext(null);

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(load);

  const addReview = useCallback((r) => {
    const review = { id: `rev-${Date.now()}`, ...r, createdAt: Date.now() };
    setReviews(prev => {
      const next = [review, ...prev];
      localStorage.setItem(KEY, JSON.stringify(next.slice(0, 50)));
      return next.slice(0, 50);
    });
  }, []);

  return <Ctx.Provider value={{ reviews, addReview }}>{children}</Ctx.Provider>;
}

export const useReviews = () => useContext(Ctx);
