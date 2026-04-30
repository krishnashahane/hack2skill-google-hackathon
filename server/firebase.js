import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const useEmulator = !process.env.FIREBASE_PROJECT_ID || process.env.USE_MEMORY === 'true';

let db;

if (useEmulator) {
  // In-memory store for demo/development without Firebase
  console.log('⚡ Running with in-memory database (no Firebase required)');

  const collections = {};

  db = {
    collection: (name) => {
      if (!collections[name]) collections[name] = {};
      return {
        doc: (id) => ({
          get: async () => ({
            exists: !!collections[name][id],
            id,
            data: () => collections[name][id] || null,
          }),
          set: async (data) => {
            collections[name][id] = { ...data };
          },
          update: async (data) => {
            collections[name][id] = { ...collections[name][id], ...data };
          },
          delete: async () => {
            delete collections[name][id];
          },
        }),
        add: async (data) => {
          const id = 'doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
          collections[name][id] = { ...data };
          return { id };
        },
        get: async () => {
          const docs = Object.entries(collections[name] || {}).map(([id, data]) => ({
            id,
            data: () => data,
            exists: true,
          }));
          return { docs, empty: docs.length === 0 };
        },
        where: (field, op, value) => ({
          get: async () => {
            const docs = Object.entries(collections[name] || {})
              .filter(([, data]) => {
                if (op === '==') return data[field] === value;
                if (op === '!=') return data[field] !== value;
                return true;
              })
              .map(([id, data]) => ({
                id,
                data: () => data,
                exists: true,
              }));
            return { docs, empty: docs.length === 0 };
          },
        }),
      };
    },
    _collections: collections,
    _clear: () => {
      Object.keys(collections).forEach(k => delete collections[k]);
    },
  };
} else {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  db = admin.firestore();
}

export default db;
