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

console.log('Firebase config loaded:', {
  apiKey: Boolean(firebaseConfig.apiKey),
  authDomain: Boolean(firebaseConfig.authDomain),
  databaseURL: Boolean(firebaseConfig.databaseURL),
  projectId: Boolean(firebaseConfig.projectId),
});

if (!import.meta.env.VITE_FIREBASE_DATABASE_URL) {
  console.warn('VITE_FIREBASE_DATABASE_URL is missing. Using fallback database URL from static config. Add env var to avoid this warning.');
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

  stream.onopen = () => {
    console.log(`Firebase stream open: ${path}`);
  };

  stream.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload?.data !== undefined) {
        onData(payload.data);
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
