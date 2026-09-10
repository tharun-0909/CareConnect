import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { providerApi } from '../services/api.js';

const homeIcon = L.divIcon({ className: 'home-marker', html: '<svg viewBox="0 0 24 24" width="30" height="30" aria-label="Customer home"><path d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3z" fill="#46a6ff" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/></svg>', iconSize: [30, 30], iconAnchor: [15, 15] });
const providerIcon = L.divIcon({ className: 'provider-marker', html: '<svg viewBox="0 0 24 24" width="34" height="34" aria-label="Service provider"><circle cx="12" cy="12" r="12" fill="#1677d2" stroke="#ffffff" stroke-width="1.6"/><g fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.2" r="2.6"/><path d="M6.4 19c.3-3 2.4-4.8 5.6-4.8s5.3 1.8 5.6 4.8"/></g></svg>', iconSize: [34, 34], iconAnchor: [17, 17] });
const bikeIcon = L.divIcon({ className: 'bike-marker', html: '<span aria-label="Provider en route">&#128692;</span>', iconSize: [40, 40], iconAnchor: [20, 20] });

function FitMap({ points }) { const map = useMap(); useEffect(() => { if (points.length > 1) map.fitBounds(points, { padding: [28, 28] }); }, [map, points]); return null; }

export default function ServiceMap({ request, providerView = false }) {
  const destination = request.customerLocation;
  const provider = request.provider?.locationCoordinates;
  const [route, setRoute] = useState([]);
  const [bikePosition, setBikePosition] = useState(null);
  const [mapError, setMapError] = useState('');
  const points = provider && destination ? [[provider.lat, provider.lng], [destination.lat, destination.lng]] : provider ? [[provider.lat, provider.lng]] : destination ? [[destination.lat, destination.lng]] : [];
  useEffect(() => { let cancelled = false; if (!provider || !destination) { setRoute([]); setBikePosition(null); return undefined; } fetch(`https://router.project-osrm.org/route/v1/driving/${provider.lng},${provider.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`).then(response => { if (!response.ok) throw new Error('Route unavailable'); return response.json(); }).then(data => { if (!cancelled) setRoute(data.routes?.[0]?.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]) || []); }).catch(() => { if (!cancelled) setMapError('Route is unavailable, but both locations are shown.'); }); return () => { cancelled = true; }; }, [provider?.lat, provider?.lng, destination?.lat, destination?.lng]);
  useEffect(() => { if (route.length < 2) { setBikePosition(null); return undefined; } let frame; const startedAt = performance.now(); const animate = now => { const progress = Math.min((now - startedAt) / 5000, 1); const index = Math.min(Math.floor(progress * (route.length - 1)), route.length - 1); setBikePosition(route[index]); if (progress < 1) frame = requestAnimationFrame(animate); }; frame = requestAnimationFrame(animate); return () => cancelAnimationFrame(frame); }, [route]);
  useEffect(() => { if (!providerView || !request.provider?._id || !navigator.geolocation) return undefined; const watchId = navigator.geolocation.watchPosition(position => { providerApi.updateLocation(position.coords.latitude, position.coords.longitude).catch(() => {}); }, () => {}, { enableHighAccuracy: true, maximumAge: 10000 }); return () => navigator.geolocation.clearWatch(watchId); }, [providerView, request.provider?._id]);
  if (!points.length) return <div className="service-map empty-map">Location sharing is not available for this booking yet.</div>;
  const center = points[0];
  return <div className="service-map-wrap"><MapContainer center={center} zoom={13} scrollWheelZoom={false}><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{provider && <Marker position={[provider.lat, provider.lng]} icon={providerIcon} />}{bikePosition && <Marker position={bikePosition} icon={bikeIcon} />}<Marker position={[destination.lat, destination.lng]} icon={homeIcon} />{route.length > 1 && <Polyline positions={route} pathOptions={{ color: '#46a6ff', weight: 5 }} />}<FitMap points={points} /></MapContainer><div className="map-caption">{providerView ? 'Provider route animation: 5 seconds' : 'Live provider location and route'}{mapError && <span>{mapError}</span>}</div></div>;
}
