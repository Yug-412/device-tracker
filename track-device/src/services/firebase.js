const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log('Firebase config loaded from VITE env:', firebaseConfig);

if (!import.meta.env.VITE_FIREBASE_DATABASE_URL) {
  console.warn('VITE_FIREBASE_DATABASE_URL is missing. Set it in your .env file.');
}


export const firebaseApp = {
  config: firebaseConfig,
  services: {
    realtimeDatabase: 'REST streaming endpoint',
    authentication: 'Identity Toolkit REST API',
  },
};

const normalizeUrl = (url) => {
  if (!url) return '';
  return url.replace(/\/+$/, '');
};

const toPathUrl = (path) => {
  const base = normalizeUrl(firebaseConfig.databaseURL);
  return `${base}/${path}.json`;
};

const applyPathUpdate = (currentValue, updatedPath, updatedValue) => {
  if (!updatedPath || updatedPath === '/') {
    return updatedValue;
  }

  const nextValue =
    currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue)
      ? { ...currentValue }
      : {};

  const segments = updatedPath.split('/').filter(Boolean);
  let pointer = nextValue;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    const existing = pointer[segment];
    pointer[segment] =
      existing && typeof existing === 'object' && !Array.isArray(existing) ? { ...existing } : {};
    pointer = pointer[segment];
  }

  const leafSegment = segments[segments.length - 1];
  if (updatedValue === null) {
    delete pointer[leafSegment];
  } else {
    pointer[leafSegment] = updatedValue;
  }

  return nextValue;
};

export const streamDatabasePath = (path, onData, onError) => {
  if (!firebaseConfig.databaseURL) {
    const error = new Error('Missing VITE_FIREBASE_DATABASE_URL.');
    console.error(error);
    onError?.(error);
    return () => {};
  }

  const url = toPathUrl(path);
  console.log('Opening Firebase stream:', path, url);
  const stream = new EventSource(url);
  let currentValue = null;

  stream.onopen = () => {
    console.log(`Firebase stream open: ${path}`);
  };

  stream.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload?.data !== undefined) {
        currentValue = applyPathUpdate(currentValue, payload.path, payload.data);
        onData(currentValue);
      }
    } catch (error) {
      console.error('Error parsing Firebase stream message:', error, event.data);
      onError?.(error);
    }
  };

  stream.onerror = (error) => {
    console.error(`Firebase stream error (${path}):`, error);
    onError?.(error);
  };

  return () => {
    console.log(`Closing stream: ${path}`);
    stream.close();
  };
};

export const signInWithEmailPassword = async (email, password) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );

  if (!response.ok) {
    throw new Error('Authentication failed.');
  }

  return response.json();
};

export default firebaseApp;
