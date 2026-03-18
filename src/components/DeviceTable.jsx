const isOnline = (onlineValue) => {
  return onlineValue === true || onlineValue === 1 || onlineValue === "1" || onlineValue === "true" || onlineValue === "online";
};

const isStale = (lastSeen) => {
  if (!lastSeen) return true;
  const age = Date.now() - Number(lastSeen);
  return age > 10 * 60 * 1000;
};

function DeviceTable({ devices, selectedDeviceId, onSelect }) {
  return (
    <aside className="device-table">
      <div className="device-table-header">
        <h3>Vehicles</h3>
      </div>

      <div className="device-list">
        {devices.length === 0 ? (
          <div className="device-empty">No vehicles yet.</div>
        ) : (
          devices.map((device) => (
            <button
              key={device.deviceId}
              onClick={() => onSelect(device.deviceId)}
              className={`device-item ${device.deviceId === selectedDeviceId ? 'active' : ''}`}
            >
              <div className="device-item-title">
                {device.name ?? device.vehicleName ?? device.deviceId}
              </div>
              <div className="device-item-status">
                Status: {isOnline(device.online) && !isStale(device.lastSeen) ? "🟢 Online" : "🔴 Offline"}
                {isStale(device.lastSeen) ? " · Stale" : ""}
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

export default DeviceTable