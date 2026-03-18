import React from "react";

const isOnline = (onlineValue) => {
  if (onlineValue === true || onlineValue === 1 || onlineValue === "1" || onlineValue === "true" || onlineValue === "online") {
    return true;
  }
  return false;
};

function StatsPanel({ devices }) {

  const total = devices.length;

  const online = devices.filter((d) => isOnline(d.online)).length;

  const offline = total - online;

  const activeNames = devices.filter((d) => isOnline(d.online)).map((d) => d.name ?? d.driverName ?? d.deviceId);


  return (
    <div className="stats-panel">
      <div className="stat-card">
        🚗 Total Vehicles: <strong>{total}</strong>
      </div>
      <div className="stat-card">
        🟢 Online: <strong>{online}</strong>
      </div>
      <div className="stat-card">
        🔴 Offline: <strong>{offline}</strong>
      </div>
    </div>
  );
}

export default StatsPanel;