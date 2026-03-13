const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseApp = {
  config: firebaseConfig,
  services: {
    realtimeDatabase: 'REST streaming endpoint',
    authentication: 'Identity Toolkit REST API',
  },
};

const toPathUrl = (path) => `${firebaseConfig.databaseURL}/${path}.json`;

export const streamDatabasePath = (path, onData, onError) => {
  if (!firebaseConfig.databaseURL) {
    onError?.(new Error('Missing VITE_FIREBASE_DATABASE_URL.'));
    return () => {};
  }

  const stream = new EventSource(toPathUrl(path));

  stream.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload?.data !== undefined) {
        onData(payload.data);
      }
    } catch (error) {
      onError?.(error);
    }
  };

  stream.onerror = (error) => onError?.(error);

  return () => stream.close();
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
