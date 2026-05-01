import { useCallback, useState } from 'react';
import { DEFAULT_CENTER } from '../lib/constants';

// Lightweight map component that works without Google Maps API key
// Uses a visual representation with positioned dots on a styled container
export default function MapView({
  volunteers = [],
  tasks = [],
  connections = [],
  onMapClick,
  selectedLocation,
  height = '400px',
}) {
  const [hoveredId, setHoveredId] = useState(null);

  // Calculate bounds
  const allPoints = [
    ...volunteers.map((v) => v.location || v.volunteerLocation),
    ...tasks.map((t) => t.location),
    selectedLocation,
  ].filter(Boolean);

  if (allPoints.length === 0 && !onMapClick) {
    allPoints.push(DEFAULT_CENTER);
  }

  const bounds = allPoints.reduce(
    (acc, p) => ({
      minLat: Math.min(acc.minLat, p.lat),
      maxLat: Math.max(acc.maxLat, p.lat),
      minLng: Math.min(acc.minLng, p.lng),
      maxLng: Math.max(acc.maxLng, p.lng),
    }),
    { minLat: 90, maxLat: -90, minLng: 180, maxLng: -180 }
  );

  // Add padding
  const latPad = Math.max((bounds.maxLat - bounds.minLat) * 0.2, 0.01);
  const lngPad = Math.max((bounds.maxLng - bounds.minLng) * 0.2, 0.01);

  const toPixel = (lat, lng) => {
    const x = ((lng - (bounds.minLng - lngPad)) / (bounds.maxLng - bounds.minLng + 2 * lngPad)) * 100;
    const y = (1 - (lat - (bounds.minLat - latPad)) / (bounds.maxLat - bounds.minLat + 2 * latPad)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const handleClick = useCallback(
    (e) => {
      if (!onMapClick) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      // Convert pixel back to lat/lng
      const lng = bounds.minLng - lngPad + x * (bounds.maxLng - bounds.minLng + 2 * lngPad);
      const lat = bounds.maxLat + latPad - y * (bounds.maxLat - bounds.minLat + 2 * latPad);
      onMapClick({ lat: Math.round(lat * 10000) / 10000, lng: Math.round(lng * 10000) / 10000 });
    },
    [onMapClick, bounds, latPad, lngPad]
  );

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-100 via-blue-50/30 to-emerald-50/20"
      style={{ height }}
      onClick={handleClick}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-20">
        {[20, 40, 60, 80].map((p) => (
          <div key={`h${p}`}>
            <div className="absolute w-full border-t border-slate-300/50" style={{ top: `${p}%` }} />
            <div className="absolute h-full border-l border-slate-300/50" style={{ left: `${p}%` }} />
          </div>
        ))}
      </div>

      {/* Connection lines (SVG overlay) */}
      {connections.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {connections.map((conn, i) => {
            const from = toPixel(conn.from.lat, conn.from.lng);
            const to = toPixel(conn.to.lat, conn.to.lng);
            return (
              <line
                key={i}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke={conn.color || '#6366f1'}
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.6"
              />
            );
          })}
        </svg>
      )}

      {/* Task markers (red) */}
      {tasks.filter((task) => task.location?.lat != null && task.location?.lng != null).map((task, i) => {
        const pos = toPixel(task.location.lat, task.location.lng);
        return (
          <div
            key={`task-${i}`}
            className="absolute z-10 group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseEnter={() => setHoveredId(`task-${i}`)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="w-5 h-5 rounded-full bg-rose-500 border-2 border-white shadow-lg shadow-rose-200 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            {hoveredId === `task-${i}` && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                {task.title}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            )}
          </div>
        );
      })}

      {/* Volunteer markers (blue) */}
      {volunteers.map((vol, i) => {
        const loc = vol.location || vol.volunteerLocation;
        if (!loc) return null;
        const pos = toPixel(loc.lat, loc.lng);
        const name = vol.name || vol.volunteerName;
        return (
          <div
            key={`vol-${i}`}
            className="absolute z-10 group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseEnter={() => setHoveredId(`vol-${i}`)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="w-5 h-5 rounded-full bg-indigo-500 border-2 border-white shadow-lg shadow-indigo-200 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            {hoveredId === `vol-${i}` && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                {name}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            )}
          </div>
        );
      })}

      {/* Selected location marker (green) */}
      {selectedLocation && (
        <div
          className="absolute z-20"
          style={{
            left: `${toPixel(selectedLocation.lat, selectedLocation.lng).x}%`,
            top: `${toPixel(selectedLocation.lat, selectedLocation.lng).y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg animate-bounce">
            <div className="w-full h-full rounded-full bg-emerald-400 animate-ping opacity-30" />
          </div>
        </div>
      )}

      {/* Click hint */}
      {onMapClick && !selectedLocation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm text-slate-400 bg-white/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
            Click to set location
          </span>
        </div>
      )}

      {/* Legend */}
      {(volunteers.length > 0 || tasks.length > 0) && (
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs space-y-1 shadow-sm border border-slate-200/60">
          {tasks.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-600">Tasks</span>
            </div>
          )}
          {volunteers.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-slate-600">Volunteers</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
