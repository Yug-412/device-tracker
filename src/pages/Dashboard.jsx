import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebase";
import LiveMap from "../components/LiveMap";
import DeviceTable from "../components/DeviceTable";
import StatsPanel from "../components/StatsPanel";
function Dashboard() {

  const [devices,setDevices] = useState([]);
  const [selectedDeviceId,setSelectedDeviceId] = useState("");

  const parseOnline = (onlineValue) => {
    if (onlineValue === true || onlineValue === "true" || onlineValue === "1" || onlineValue === 1 || onlineValue === "online") {
      return true;
    }
    return false;
  };

  const getLastSeen = (device) => {
    const candidates = [
      device.lastSeen,
      device.updatedAt,
      device.timestamp,
      device.lastUpdated,
      device.last_time,
      device.time
    ];
    for (const cand of candidates) {
      if (cand == null) continue;
      const n = Number(cand);
      if (!Number.isNaN(n) && n > 0) return n;
      const parsed = Date.parse(String(cand));
      if (!Number.isNaN(parsed)) return parsed;
    }
    return null;
  };

  const isAlive = (lastSeen) => {
    if (!lastSeen) return false;
    const ageMs = Date.now() - lastSeen;
    // treat as offline after 6 minutes of no update
    return ageMs <= 6 * 60 * 1000;
  };

  useEffect(()=>{

    const devicesRef = ref(db,"devices");

    const unsubscribe = onValue(devicesRef,(snapshot)=>{

      const data = snapshot.val();

      if(!data){
        setDevices([]);
        return;
      }

      const list = Object.keys(data).map(id => {
        const raw = data[id] || {};
        const lastSeen = getLastSeen(raw);
        const statusFromOnline = parseOnline(raw.online);
        const online = statusFromOnline && isAlive(lastSeen);
        return {
          deviceId:id,
          ...raw,
          online,
          lastSeen,
        };
      });

      setDevices(list);

      if(!selectedDeviceId && list.length>0){
        setSelectedDeviceId(list[0].deviceId);
      }

    });

    return ()=>unsubscribe();

  },[]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      searchTerm.length === 0 ||
      (device.vehicleName && device.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      device.deviceId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "online" && device.online) ||
      (statusFilter === "offline" && !device.online);

    return matchesSearch && matchesStatus;
  });

  const selectedDevice = filteredDevices.find(
    (d) => d.deviceId === selectedDeviceId
  ) || filteredDevices[0] || null;

  const exportCsv = () => {
    const headers = ["Device ID", "Vehicle", "Driver", "Latitude", "Longitude", "Speed", "Online", "Last Seen"];
    const rows = filteredDevices.map((d) => [
      d.deviceId,
      d.vehicleName ?? "",
      d.driverName ?? "",
      d.latitude ?? "",
      d.longitude ?? "",
      d.speed ?? "",
      d.online ? "Online" : "Offline",
      d.lastSeen ? new Date(d.lastSeen).toLocaleString() : ""
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fleet_devices.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-header">
        <div>
          <div className="app-badge">Fleet</div>
          <h1>Vehicle Tracking Dashboard</h1>
          <p className="subtitle">Live location, statuses, and route history in real-time.</p>
        </div>
        <div className="dashboard-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search vehicle name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          <button className="action-btn primary" onClick={exportCsv}>
            ⬇️ Export CSV
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <DeviceTable
          devices={filteredDevices}
          selectedDeviceId={selectedDevice?.deviceId ?? ""}
          onSelect={setSelectedDeviceId}
        />

        <div className="dashboard-right">
          <StatsPanel devices={filteredDevices} />
          <div className="dashboard-map">
            <LiveMap
              devices={filteredDevices}
              selectedDeviceId={selectedDevice?.deviceId ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;