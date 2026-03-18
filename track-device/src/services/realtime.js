const normalizeUrl = (url) => (url || '').replace(/\/+$/, '');

const databaseUrl = normalizeUrl(import.meta.env.VITE_FIREBASE_DATABASE_URL);

export const streamPath = (path, onData, onError) => {
  if (!databaseUrl) {
    onError?.(new Error('Missing VITE_FIREBASE_DATABASE_URL'));
    return () => {};
  }

  const stream = new EventSource(`${databaseUrl}/${path}.json`);

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

  stream.onerror = (error) => {
    onError?.(error);
  };

  return () => stream.close();
};
