import { useEffect, useMemo, useState } from 'react';
import DeviceTable from '../components/DeviceTable';
import LiveMap from '../components/LiveMap';
import StatsPanel from '../components/StatsPanel';
import { subscribeToDevices } from '../services/locationService';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  useEffect(() => subscribeToDevices(setDevices, console.error), []);

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
