const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return 'No data';
  }

  return new Date(timestamp).toLocaleString();
};

const DeviceTable = ({ devices, selectedDeviceId, onSelectDevice }) => {
  return (
    <section className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Driver</th>
            <th>Vehicle</th>
            <th>Status</th>
            <th>Last update</th>
            <th>Map</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.deviceId}>
              <td>{device.driverName ?? 'Unknown'}</td>
              <td>{device.vehicleName ?? 'Unknown'}</td>
              <td>
                <span className={`status ${device.online ? 'online' : 'offline'}`}>
                  {device.online ? 'Online' : 'Offline'}
                </span>
              </td>
              <td>{formatTimestamp(device.timestamp)}</td>
              <td>
                <button
                  type="button"
                  className="map-button"
                  onClick={() => onSelectDevice(device.deviceId)}
                  disabled={selectedDeviceId === device.deviceId}
                >
                  View map
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default DeviceTable;
