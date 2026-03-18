const HOUR_MS = 60 * 60 * 1000;

export const filterPointsByWindow = (points, hoursBack) => {
  if (!hoursBack || hoursBack >= 24) {
    return points;
  }

  const cutoff = Date.now() - hoursBack * HOUR_MS;
  return points.filter((point) => point.timestamp >= cutoff);
};

export const exportHistoryCsv = (deviceName, points) => {
  const lines = [
    ['name', 'timestamp', 'iso_time', 'lat', 'lng'].join(','),
    ...points.map((point) =>
      [
        JSON.stringify(deviceName),
        point.timestamp,
        new Date(point.timestamp).toISOString(),
        point.lat,
        point.lng,
      ].join(','),
    ),
  ];

  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `route-${deviceName}-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
