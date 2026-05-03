import { createContext, useContext, useState, useCallback } from 'react';

const KEY = 'wasteless:favourites';
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};

const Ctx = createContext(null);

export function FavouritesProvider({ children }) {
  const [favIds, setFavIds] = useState(load);

  const toggle = useCallback((id) => {
    setFavIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFav = useCallback((id) => favIds.includes(id), [favIds]);

  return (
    <Ctx.Provider value={{ favIds, toggle, isFav, count: favIds.length }}>
      {children}
    </Ctx.Provider>
  );
}

export const useFavourites = () => useContext(Ctx);
