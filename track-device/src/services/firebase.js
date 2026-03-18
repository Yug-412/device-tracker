const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    'https://device-track-330b1-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'device-track-330b1',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'device-track-330b1.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const normalizeUrl = (url) => {
  if (!url) return '';
  return url.replace(/\/+$/, '');
};

const toPathUrl = (path) => {
  const base = normalizeUrl(firebaseConfig.databaseURL);
  return `${base}/${path}.json`;
};

const setByPath = (target, path, value) => {
  const segments = path.split('/').filter(Boolean);

  if (segments.length === 0) {
    return value ?? {};
  }

  const root = { ...(target ?? {}) };
  let cursor = root;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const key = segments[index];
    cursor[key] = { ...(cursor[key] ?? {}) };
    cursor = cursor[key];
  }

  const lastKey = segments[segments.length - 1];

  if (value === null) {
    delete cursor[lastKey];
  } else {
    cursor[lastKey] = value;
  }

  return root;
};

export const streamDatabasePath = (path, onData, onError) => {
  if (!firebaseConfig.databaseURL) {
    const error = new Error('Missing VITE_FIREBASE_DATABASE_URL.');
    onError?.(error);
    return () => {};
  }

  const url = toPathUrl(path);
  const stream = new EventSource(url);
  let cachedValue = {};

  stream.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload?.data === undefined) {
        return;
      }

      if (payload.path === '/') {
        cachedValue = payload.data ?? {};
      } else {
        cachedValue = setByPath(cachedValue, payload.path, payload.data);
      }

      onData(cachedValue);
    } catch (error) {
      onError?.(error);
    }
  };

  stream.onerror = (error) => {
    onError?.(error);
  };

  return () => {
    stream.close();
  };
};

export default firebaseConfig;
