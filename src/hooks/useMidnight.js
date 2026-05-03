import { useEffect, useState } from 'react';

// Midnight Hour active window. The user can override locally for demo testing.
// `previewOverride === true` forces the open state regardless of the clock.

export const MIDNIGHT_START_HOUR = 0;   // 00:00 inclusive
export const MIDNIGHT_END_HOUR = 3;     // 03:00 exclusive

function pad(n) {
  return n.toString().padStart(2, '0');
}

function getNextOpen(now) {
  const next = new Date(now);
  next.setHours(MIDNIGHT_START_HOUR, 0, 0, 0);
  if (now.getHours() >= MIDNIGHT_END_HOUR || now.getHours() >= MIDNIGHT_START_HOUR && now.getHours() < MIDNIGHT_END_HOUR) {
    // If we're past today's window (or already in it), the next opening is tomorrow midnight.
    next.setDate(next.getDate() + 1);
  }
  return next.getTime();
}

function getNextClose(now) {
  const close = new Date(now);
  close.setHours(MIDNIGHT_END_HOUR, 0, 0, 0);
  if (now.getTime() >= close.getTime()) close.setDate(close.getDate() + 1);
  return close.getTime();
}

// Date key for the current "midnight session" (used to reset reservation counts).
// A session is identified by the date that 00:00 belonged to.
export function getMidnightSessionKey(date = new Date()) {
  const d = new Date(date);
  // If we're between 00:00 and 03:00, the session "belongs to" today's date.
  // If we're after 03:00, the next session is tomorrow's date.
  if (d.getHours() < MIDNIGHT_END_HOUR) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function useMidnight(previewOverride = false) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = new Date(now);
  const hour = date.getHours();
  const realActive = hour >= MIDNIGHT_START_HOUR && hour < MIDNIGHT_END_HOUR;
  const isActive = realActive || previewOverride;

  let countdownLabel = '';
  if (isActive && !previewOverride) {
    const closeMs = getNextClose(date);
    const diff = Math.max(0, closeMs - now);
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    countdownLabel = `${pad(h)}:${pad(m)}:${pad(s)} until close`;
  } else if (!realActive) {
    const openMs = getNextOpen(date);
    const diff = Math.max(0, openMs - now);
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    countdownLabel = `${pad(h)}:${pad(m)}:${pad(s)} until open`;
  } else {
    countdownLabel = 'Preview';
  }

  return {
    isActive,
    isRealActive: realActive,
    countdownLabel,
    sessionKey: getMidnightSessionKey(date),
  };
}
