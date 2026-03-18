import { useMemo, useState } from 'react';

import LiveMap from '../components/LiveMap';
import Sidebar from '../components/Sidebar';
import StatsPanel from '../components/StatsPanel';
import { useDeviceHistory } from '../hooks/useDeviceHistory';
import { useDevices } from '../hooks/useDevices';
import { exportHistoryCsv, filterPointsByWindow } from '../utils/history';

const Dashboard = () => {
  const devices = useDevices();
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [hoursBack, setHoursBack] = useState(24);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOnline = onlineOnly ? device.online : true;
      return matchesSearch && matchesOnline;
    });
  }, [devices, onlineOnly, searchTerm]);

  const activeUserId = selectedUserId || filteredDevices[0]?.userId || '';
  const selectedDevice = useMemo(
    () => filteredDevices.find((device) => device.userId === activeUserId),
    [activeUserId, filteredDevices],
  );

  const history = useDeviceHistory(activeUserId);
  const routePoints = useMemo(() => filterPointsByWindow(history, hoursBack), [history, hoursBack]);

  return (
    <main className="dashboard">
      <header className="header">
        <h1>Real-time GPS Tracking Dashboard</h1>
        <p>Live status, 24-hour history, and route playback for all registered devices.</p>
      </header>

      <StatsPanel devices={filteredDevices} />

      <section className="toolbar">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search users"
        />
        <label>
          <input
            type="checkbox"
            checked={onlineOnly}
            onChange={(event) => setOnlineOnly(event.target.checked)}
          />
          Online only
        </label>
        <button
          type="button"
          onClick={() => selectedDevice && exportHistoryCsv(selectedDevice.name, routePoints)}
          disabled={!selectedDevice || routePoints.length === 0}
        >
          Export CSV
        </button>
      </section>

      <section className="layout">
        <Sidebar
          devices={filteredDevices}
          selectedUserId={activeUserId}
          onSelectUser={setSelectedUserId}
        />

        <section className="map-column">
          <div className="time-filter">
            <label htmlFor="hoursBack">Route window: last {hoursBack} hour(s)</label>
            <input
              id="hoursBack"
              type="range"
              min="1"
              max="24"
              value={hoursBack}
              onChange={(event) => setHoursBack(Number(event.target.value))}
            />
          </div>
          <LiveMap devices={filteredDevices} selectedDevice={selectedDevice} routePoints={routePoints} />
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
