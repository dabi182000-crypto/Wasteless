import { useEffect, useState } from 'react';

// Resolves an HH:mm pickup-end time against today; if it's already passed,
// rolls forward by 24h so the demo countdown always shows a sensible value.
function resolveEndTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const end = new Date(now);
  end.setHours(h, m, 0, 0);
  if (end.getTime() <= now.getTime()) end.setDate(end.getDate() + 1);
  return end.getTime();
}

export function useCountdown(pickupEnd) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const endMs = resolveEndTime(pickupEnd);
  const diff = Math.max(0, endMs - now);

  const totalMinutes = Math.floor(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = Math.floor((diff % 60000) / 1000);

  let label;
  if (diff <= 0) label = 'Closed';
  else if (hours > 0) label = `${hours}h ${minutes}m left`;
  else if (minutes > 0) label = `${minutes}m ${seconds.toString().padStart(2, '0')}s left`;
  else label = `${seconds}s left`;

  return {
    label,
    isUrgent: diff > 0 && totalMinutes < 30,
    isExpired: diff <= 0,
  };
}
