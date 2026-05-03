import { useEffect, useState } from 'react';
import { getRepo } from '../lib/firebase.js';

export function useListings() {
  const [listings, setListings] = useState([]);
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => {};
    let active = true;

    getRepo().then((r) => {
      if (!active) return;
      setRepo(r);
      unsub = r.subscribe((items) => {
        setListings(items);
        setLoading(false);
      });
    });

    return () => {
      active = false;
      unsub();
    };
  }, []);

  return { listings, repo, loading };
}
