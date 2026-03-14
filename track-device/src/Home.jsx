import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';
import LiveMap from './LiveMap';

function Home() {
  const [devices, setDevices] = useState({});
  const [history, setHistory] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!db) {
      setError('Firebase DB is not initialized.');
      return;
    }

    const devicesRef = ref(db, 'devices');
    const historyRef = ref(db, 'history');

    const unDevices = onValue(
      devicesRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log('DEVICES:', data);
        setDevices(data ?? {});
      },
      (err) => {
        console.error('DEVICES listener error', err);
        setError('Failed to load devices');
      },
    );

    const unHistory = onValue(
      historyRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log('HISTORY:', data);
        setHistory(data ?? {});
      },
      (err) => {
        console.error('HISTORY listener error', err);
        setError('Failed to load history');
      },
    );

    return () => {
      unDevices();
      unHistory();
    };
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>📍 Device Tracking Platform</h1>
      <LiveMap devices={devices} history={history} />
    </div>
  );
}

export default Home;