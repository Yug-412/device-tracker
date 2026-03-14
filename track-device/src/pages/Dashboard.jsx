import { useEffect, useMemo, useState } from 'react';
import DeviceTable from '../components/DeviceTable';
import LiveMap from '../components/LiveMap';
import StatsPanel from '../components/StatsPanel';
import { subscribeToDevices } from '../services/locationService';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const cleanup = subscribeToDevices(
      (data) => {
        console.log('Dashboard devices event:', data);
        setDevices(data);
        setSelectedDeviceId((curr) => curr || data[0]?.deviceId || '');
      },
      (err) => {
        console.error('subscribeToDevices error:', err);
        setError(err?.message ?? 'Unable to load devices.');
      },
    );
    return cleanup;
  }, []);

  const sortedDevices = useMemo(() => {
    const sorted = [...devices].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
    console.log('sortedDevices', sorted);
    return sorted;
  }, [devices]);

  const activeDeviceId = selectedDeviceId || sortedDevices[0]?.deviceId || '';

  return (
    <main className="dashboard">
      <header>
        <h1>Device Tracking Platform</h1>
        <p>Live GPS telemetry from authenticated mobile devices.</p>
      </header>

      {error ? <div className="error">{error}</div> : null}

      <section style={{ marginBottom: '12px', background: '#f3f4f6', padding: '10px', borderRadius: '8px' }}>
        <strong>DEBUG:</strong> devices={sortedDevices.length} activeDeviceId={activeDeviceId} selectedDeviceId={selectedDeviceId}
      </section>

      <StatsPanel devices={sortedDevices} />
      <LiveMap devices={sortedDevices} selectedDeviceId={activeDeviceId} />
      <DeviceTable
        devices={sortedDevices}
        selectedDeviceId={activeDeviceId}
        onSelectDevice={setSelectedDeviceId}
      />
    </main>
  );
};

export default Dashboard;