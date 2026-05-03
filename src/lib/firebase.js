// Listings repository.
//
// If a full set of VITE_FIREBASE_* env vars is provided, this module wires up
// Firestore with a live `onSnapshot` subscription and seeds the collection
// with the four Qatar demo listings on first run.
//
// Otherwise (no .env, or partial config), it falls back to an in-memory
// pub/sub store seeded with the same data — so the app demos live out of the
// box without needing Firebase credentials.

import { SEED_LISTINGS } from './seedData.js';

const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (v) => typeof v === 'string' && v.length > 0
);

// ---------- Local in-memory store (default fallback) ----------

function createLocalRepo() {
  let listings = SEED_LISTINGS.map((l) => ({ ...l }));
  const subscribers = new Set();

  const emit = () => {
    const snapshot = [...listings].sort((a, b) => b.createdAt - a.createdAt);
    subscribers.forEach((cb) => cb(snapshot));
  };

  return {
    backend: 'local',
    subscribe(cb) {
      subscribers.add(cb);
      // Emit initial state asynchronously so consumers can mount before receiving.
      Promise.resolve().then(() => cb([...listings].sort((a, b) => b.createdAt - a.createdAt)));
      return () => subscribers.delete(cb);
    },
    async add(listing) {
      const id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      listings = [...listings, { ...listing, id, createdAt: Date.now() }];
      emit();
      return id;
    },
    async update(id, patch) {
      listings = listings.map((l) => (l.id === id ? { ...l, ...patch } : l));
      emit();
    },
    async remove(id) {
      listings = listings.filter((l) => l.id !== id);
      emit();
    },
  };
}

// ---------- Firestore-backed store (used when config is present) ----------

async function createFirestoreRepo() {
  const { initializeApp } = await import('firebase/app');
  const {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    serverTimestamp,
    query,
    orderBy,
  } = await import('firebase/firestore');

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const col = collection(db, 'listings');

  // Seed if empty.
  const existing = await getDocs(col);
  if (existing.empty) {
    await Promise.all(
      SEED_LISTINGS.map(({ id, ...rest }) =>
        addDoc(col, { ...rest, createdAt: serverTimestamp() })
      )
    );
  }

  const q = query(col, orderBy('createdAt', 'desc'));

  return {
    backend: 'firestore',
    subscribe(cb) {
      return onSnapshot(q, (snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
          };
        });
        cb(list);
      });
    },
    async add(listing) {
      const ref = await addDoc(col, { ...listing, createdAt: serverTimestamp() });
      return ref.id;
    },
    async update(id, patch) {
      await updateDoc(doc(db, 'listings', id), patch);
    },
    async remove(id) {
      await deleteDoc(doc(db, 'listings', id));
    },
  };
}

// ---------- Singleton repo with lazy Firestore init ----------

let repoPromise = null;

export function getRepo() {
  if (!repoPromise) {
    if (hasFirebaseConfig) {
      repoPromise = createFirestoreRepo().catch((err) => {
        console.warn('[Wasteless] Firestore init failed, using local fallback.', err);
        return createLocalRepo();
      });
    } else {
      repoPromise = Promise.resolve(createLocalRepo());
    }
  }
  return repoPromise;
}

export const usingFirebase = hasFirebaseConfig;
