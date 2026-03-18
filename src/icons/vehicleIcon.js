import L from 'leaflet';

export const vehicleIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="%231d4ed8"/><path d="M12 26h20l-2-8a3 3 0 0 0-2.9-2.2H16.9A3 3 0 0 0 14 18l-2 8Z" fill="white"/><circle cx="16.5" cy="28" r="2.5" fill="%230f172a"/><circle cx="27.5" cy="28" r="2.5" fill="%230f172a"/></svg>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -16],
});
