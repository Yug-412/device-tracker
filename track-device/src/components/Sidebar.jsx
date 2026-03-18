const formatLastSeen = (timestamp) => {
  if (!timestamp) {
    return 'No updates';
  }

  return new Date(timestamp).toLocaleString();
};

const Sidebar = ({ devices, selectedUserId, onSelectUser }) => (
  <aside className="sidebar">
    {devices.map((device) => (
      <button
        key={device.userId}
        type="button"
        className={`sidebar-item ${selectedUserId === device.userId ? 'active' : ''}`}
        onClick={() => onSelectUser(device.userId)}
      >
        <div>
          <strong>{device.name}</strong>
          <p>{formatLastSeen(device.lastUpdated)}</p>
        </div>
        <span className={`status-pill ${device.online ? 'online' : 'offline'}`}>
          {device.online ? 'Online' : 'Offline'}
        </span>
      </button>
    ))}
  </aside>
);

export default Sidebar;
