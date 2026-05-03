import { createContext, useContext, useState, useCallback } from 'react';

const ReservationsContext = createContext(null);

const STREAK_KEY = 'wasteless:streak';

function loadStreak() {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY)) || {
      streakDays: 0,
      lastReservedDate: null,
      totalRescues: 0,
      thisMonthRescues: 0,
    };
  } catch {
    return { streakDays: 0, lastReservedDate: null, totalRescues: 0, thisMonthRescues: 0 };
  }
}

function toDateStr(ts) {
  return new Date(ts).toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function updateStreak(prev) {
  const today = toDateStr(Date.now());
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;

  let streakDays = prev.streakDays || 0;
  let thisMonthRescues = prev.thisMonthRescues || 0;

  // Check month rollover
  if (prev.lastReservedDate) {
    const lastDate = new Date(prev.lastReservedDate);
    const lastMonth = `${lastDate.getFullYear()}-${lastDate.getMonth()}`;
    if (lastMonth !== currentMonth) {
      thisMonthRescues = 0;
    }
  }

  // Update streak
  if (prev.lastReservedDate) {
    const last = new Date(prev.lastReservedDate);
    const lastStr = toDateStr(last.getTime());
    const yesterday = toDateStr(Date.now() - 86400000);

    if (lastStr === today) {
      // Same day — no streak change
    } else if (lastStr === yesterday) {
      streakDays += 1;
    } else {
      streakDays = 1;
    }
  } else {
    streakDays = 1;
  }

  const next = {
    streakDays,
    lastReservedDate: today,
    totalRescues: (prev.totalRescues || 0) + 1,
    thisMonthRescues: thisMonthRescues + 1,
  };

  localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return next;
}

export function ReservationsProvider({ children }) {
  const [reservations, setReservations] = useState([]);
  const [streak, setStreak] = useState(loadStreak);

  const addReservation = useCallback((listing) => {
    setReservations((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        listingId: listing.id,
        vendor: listing.vendor,
        title: listing.title,
        originalPrice: listing.originalPrice,
        discountedPrice: listing.discountedPrice,
        savedAt: Date.now(),
      },
    ]);
    setStreak(prev => updateStreak(prev));
  }, []);

  const totalSaved = reservations.reduce(
    (sum, r) => sum + (r.originalPrice - r.discountedPrice),
    0
  );

  return (
    <ReservationsContext.Provider
      value={{ reservations, addReservation, totalSaved, count: reservations.length, streak }}
    >
      {children}
    </ReservationsContext.Provider>
  );
}

export const useReservations = () => {
  const ctx = useContext(ReservationsContext);
  if (!ctx) throw new Error('useReservations must be used within ReservationsProvider');
  return ctx;
};
