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
        if (!selectedDeviceId && data[0]?.deviceId) {
          setSelectedDeviceId(data[0].deviceId);
        }
      },
      (err) => {
        console.error('subscribeToDevices error:', err);
        setError(err?.message ?? 'Unable to load devices.');
      },
    );
    return cleanup;
  }, []);

  const sortedDevices = useMemo(
    () => [...devices].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)),
    [devices],
  );

  const activeDeviceId = selectedDeviceId || sortedDevices[0]?.deviceId || '';

  return (
    <main className="dashboard">
      <header>
        <h1>Device Tracking Platform</h1>
        <p>Live GPS telemetry from authenticated mobile devices.</p>
      </header>

      {error ? <div className="error">{error}</div> : null}
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
