import { useState, useCallback, useEffect } from 'react';

const KEY = 'wasteless:midnight-notify';

export function usePushNotification() {
  const [permission, setPermission] = useState(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [enabled, setEnabled] = useState(() => localStorage.getItem(KEY) === 'true');

  useEffect(() => {
    if (!enabled || permission !== 'granted') return;
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    if (midnight <= now) midnight.setDate(midnight.getDate() + 1);
    const delay = midnight.getTime() - now.getTime();
    const t = setTimeout(() => {
      try {
        new Notification('🌙 Midnight Surprise is live!', {
          body: 'Only 10 spots — grab your mystery bag before it sells out!',
          icon: '/favicon.png',
        });
      } catch {}
    }, Math.min(delay, 2_147_483_647));
    return () => clearTimeout(t);
  }, [enabled, permission]);

  const toggle = useCallback(async () => {
    if (enabled) {
      setEnabled(false);
      localStorage.setItem(KEY, 'false');
      return;
    }
    if (typeof Notification === 'undefined') {
      alert('Notifications not supported in this browser.');
      return;
    }
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm === 'granted') {
      setEnabled(true);
      localStorage.setItem(KEY, 'true');
    }
  }, [enabled]);

  return { permission, enabled, toggle };
}
