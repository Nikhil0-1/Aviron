import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AvironUnit, Mission, Survivor, Waypoint } from '../../types';
import { Radio, Battery, Gauge, Navigation, LifeBuoy } from 'lucide-react';

interface LiveMapProps {
  unit: AvironUnit;
  mission: Mission | null;
  survivors: Survivor[];
  waypoints?: Waypoint[];
  autoFollow?: boolean;
}

// Custom Leaflet DivIcons using Tailwind SVG icons for clean vector rendering
const createAvironIcon = (heading: number, battery: number) => {
  return L.divIcon({
    className: 'custom-aviron-icon',
    html: `
      <div class="relative flex items-center justify-center w-11 h-11">
        <div class="absolute inset-0 rounded-full bg-cyan-500/20 animate-pulse-cyan"></div>
        <div class="relative flex items-center justify-center w-9 h-9 rounded-full bg-navy-900 border-2 border-cyan-400 text-cyan-400 shadow-md transform transition-transform duration-300" style="transform: rotate(${heading}deg);">
          <svg class="w-5 h-5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L19 21L12 17L5 21L12 2Z" />
          </svg>
        </div>
        <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-extrabold text-white shadow-xs">
          ${Math.round(battery)}%
        </span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

const createBaseIcon = () => {
  return L.divIcon({
    className: 'custom-base-icon',
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 text-white border-2 border-slate-400 shadow-md">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M9 14h6" />
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createSurvivorIcon = () => {
  return L.divIcon({
    className: 'custom-survivor-icon',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10">
        <div class="absolute inset-0 rounded-full bg-red-600/30 animate-pulse-red"></div>
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white border-2 border-white shadow-md font-bold text-xs">
          🆘
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const createWaypointIcon = (seq: number) => {
  return L.divIcon({
    className: 'custom-waypoint-icon',
    html: `
      <div class="flex items-center justify-center w-6 h-6 rounded-full bg-white text-navy-900 border-2 border-cyan-500 font-extrabold text-[10px] shadow-sm">
        ${seq}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Auto Recenter Hook
const MapAutoRecenter: React.FC<{ center: [number, number]; autoFollow?: boolean }> = ({
  center,
  autoFollow = true,
}) => {
  const map = useMap();
  useEffect(() => {
    if (autoFollow && center[0] && center[1]) {
      map.panTo(center, { animate: true, duration: 0.8 });
    }
  }, [center, autoFollow, map]);
  return null;
};

export const LiveMap: React.FC<LiveMapProps> = ({ unit, mission, survivors, autoFollow = true }) => {
  const unitPos: [number, number] = [unit.lat || 28.6139, unit.lng || 77.2090];
  const basePos: [number, number] = [28.6139, 77.2090];

  // Map route points
  const routePoints: [number, number][] = mission?.waypoints
    ? mission.waypoints.map((wp) => [wp.lat, wp.lng])
    : [
        basePos,
        [28.6145, 77.2105],
        [28.6148, 77.2112],
        [28.6152, 77.2120],
        [28.6158, 77.2132],
        basePos,
      ];

  // Geofence polygon area
  const geofenceCoords: [number, number][] = [
    [28.6120, 77.2050],
    [28.6180, 77.2050],
    [28.6180, 77.2180],
    [28.6120, 77.2180],
  ];

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-full rounded-2xl overflow-hidden border border-slate-200 shadow-card">
      {/* Live Map Overlay Badge */}
      <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-subtle flex items-center space-x-2 text-xs font-bold text-navy-950">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping"></span>
        <span>LIVE MAP TACTICAL DISPLAY</span>
        <span className="text-[10px] font-normal text-slate-500 border-l border-slate-200 pl-2">
          RTK Fix ±0.03m
        </span>
      </div>

      <MapContainer center={unitPos} zoom={15} scrollWheelZoom={true} className="w-full h-full">
        <MapAutoRecenter center={unitPos} autoFollow={autoFollow} />

        {/* Tile Layer (Clean CartoDB Positron / OSM Light) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Geofence Search Polygon */}
        <Polygon
          positions={geofenceCoords}
          pathOptions={{
            color: '#0284c7',
            dashArray: '6, 6',
            weight: 1.5,
            fillColor: '#38bdf8',
            fillOpacity: 0.06,
          }}
        />

        {/* Active Target Search Radius Circle */}
        <Circle
          center={[mission?.targetLat || 28.6155, mission?.targetLng || 77.2125]}
          radius={mission?.searchRadius || 400}
          pathOptions={{
            color: '#0d9488',
            weight: 2,
            fillColor: '#14b8a6',
            fillOpacity: 0.1,
          }}
        />

        {/* Mission Route Polyline */}
        <Polyline
          positions={routePoints}
          pathOptions={{
            color: '#0284c7',
            weight: 3.5,
            opacity: 0.8,
            dashArray: '8, 8',
          }}
        />

        {/* Base Station Marker */}
        <Marker position={basePos} icon={createBaseIcon()}>
          <Popup>
            <div className="p-1 font-sans text-xs">
              <div className="font-extrabold text-navy-950">AVIRON Base Station 01</div>
              <p className="text-[11px] text-slate-500">Launch Pad & Charging Dock</p>
            </div>
          </Popup>
        </Marker>

        {/* Waypoints */}
        {mission?.waypoints?.map((wp) => (
          <Marker key={wp.seq} position={[wp.lat, wp.lng]} icon={createWaypointIcon(wp.seq)}>
            <Popup>
              <div className="p-1 text-xs">
                <div className="font-bold text-navy-950">Waypoint #{wp.seq}</div>
                <div className="text-[10px] text-slate-500 uppercase">{wp.action}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Survivor Markers */}
        {survivors.map((surv) => (
          <Marker key={surv.id} position={[surv.lat, surv.lng]} icon={createSurvivorIcon()}>
            <Popup>
              <div className="p-1 text-xs space-y-1">
                <div className="font-extrabold text-red-700 flex items-center space-x-1">
                  <LifeBuoy className="w-4 h-4 inline" />
                  <span>{surv.code}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">{surv.notes || 'Survivor waiting for payload drop.'}</p>
                <div className="text-[10px] bg-red-50 text-red-800 p-1 rounded font-mono">
                  Vitals: HR {surv.heartRate} bpm | SpO2 {surv.spO2}%
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Moving AVIRON Unit Marker */}
        <Marker position={unitPos} icon={createAvironIcon(unit.heading, unit.battery)}>
          <Popup>
            <div className="p-2 w-52 font-sans">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                <span className="font-extrabold text-navy-950 text-sm">{unit.code}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {unit.status}
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Battery:</span>
                  <span className="font-bold text-navy-900">{unit.battery}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Speed:</span>
                  <span className="font-bold text-navy-900">{unit.speed} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Signal:</span>
                  <span className="font-bold text-teal-600">{unit.signalStrength}% Excellent</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-1 text-[11px]">
                  <span className="text-slate-400">Mission:</span>
                  <span className="font-mono text-cyan-600 font-bold">{mission?.code || 'AV-001'}</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
