import React, { useState } from 'react';
import { Bus, Route, Stop, Driver } from '../types/transit';
import {
  Navigation,
  Play,
  Pause,
  AlertTriangle,
  Clock,
  MapPin,
  Compass,
  Phone,
  ShieldAlert,
  Flame,
  Layers,
  CheckCircle2,
  Plus,
  Minus
} from 'lucide-react';

interface LiveTrackerMapProps {
  buses: Bus[];
  routes: Route[];
  drivers: Driver[];
  selectedBusId: string | null;
  onSelectBus: (busId: string) => void;
  onTriggerSos: (busId: string) => void;
  onUpdatePassengers?: (busId: string, delta: number) => void;
}

export const LiveTrackerMap: React.FC<LiveTrackerMapProps> = ({
  buses,
  routes,
  drivers,
  selectedBusId,
  onSelectBus,
  onTriggerSos,
  onUpdatePassengers,
}) => {
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [isHeatmapActive, setIsHeatmapActive] = useState<boolean>(true);

  // Active bus details
  const activeBus = buses.find((b) => b.id === (selectedBusId || buses[0].id)) || buses[0];
  const activeDriver = drivers.find((d) => d.id === activeBus?.driverId);
  const activeRoute = routes.find((r) => r.id === activeBus?.routeId);

  // Filtered routes
  const displayedRoutes = selectedRouteFilter === 'all'
    ? routes
    : routes.filter((r) => r.id === selectedRouteFilter);

  // Helper: compute occupancy percentage and metrics for a route
  const getRouteOccupancy = (routeId: string) => {
    const routeBuses = buses.filter((b) => b.routeId === routeId && b.status !== 'depot');
    if (routeBuses.length === 0) {
      // Fallback to any bus associated with this route
      const anyBus = buses.find((b) => b.routeId === routeId);
      if (!anyBus) return { percent: 0, passengers: 0, capacity: 52 };
      const percent = Math.round((anyBus.passengersOnboard / anyBus.capacityTotal) * 100);
      return { percent, passengers: anyBus.passengersOnboard, capacity: anyBus.capacityTotal };
    }
    const totalPassengers = routeBuses.reduce((acc, b) => acc + b.passengersOnboard, 0);
    const totalCapacity = routeBuses.reduce((acc, b) => acc + b.capacityTotal, 0);
    const percent = totalCapacity > 0 ? Math.round((totalPassengers / totalCapacity) * 100) : 0;
    return { percent, passengers: totalPassengers, capacity: totalCapacity };
  };

  // Helper: density color mapping
  // Green for <50%, Yellow/Amber for 50-74%, Orange for 75-89%, Red for >=90%
  const getDensityDetails = (percent: number) => {
    if (percent < 50) {
      return {
        color: '#10B981', // Emerald / Green (<50%)
        glowColor: '#10B981',
        label: 'Low (<50%)',
        tierName: 'Low Density',
        textColor: 'text-emerald-700',
        badgeBg: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
      };
    } else if (percent < 75) {
      return {
        color: '#F59E0B', // Amber / Yellow (50-74%)
        glowColor: '#F59E0B',
        label: 'Moderate (50–74%)',
        tierName: 'Moderate Density',
        textColor: 'text-amber-700',
        badgeBg: 'bg-amber-50',
        borderColor: 'border-amber-200',
      };
    } else if (percent < 90) {
      return {
        color: '#F97316', // Orange (75–89%)
        glowColor: '#F97316',
        label: 'Heavy (75–89%)',
        tierName: 'High Density',
        textColor: 'text-orange-700',
        badgeBg: 'bg-orange-50',
        borderColor: 'border-orange-200',
      };
    } else {
      return {
        color: '#EF4444', // Red (>=90%)
        glowColor: '#EF4444',
        label: 'Critical (≥90%)',
        tierName: 'Over-Capacity Surge',
        textColor: 'text-red-700',
        badgeBg: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    }
  };

  const activeBusOccupancyPercent = Math.round(
    (activeBus.passengersOnboard / activeBus.capacityTotal) * 100
  );
  const activeBusDensity = getDensityDetails(activeBusOccupancyPercent);

  // Fleet density distribution summary
  const lowDensityCount = buses.filter(
    (b) => Math.round((b.passengersOnboard / b.capacityTotal) * 100) < 50
  ).length;
  const moderateDensityCount = buses.filter((b) => {
    const p = Math.round((b.passengersOnboard / b.capacityTotal) * 100);
    return p >= 50 && p < 75;
  }).length;
  const highDensityCount = buses.filter((b) => {
    const p = Math.round((b.passengersOnboard / b.capacityTotal) * 100);
    return p >= 75 && p < 90;
  }).length;
  const criticalDensityCount = buses.filter(
    (b) => Math.round((b.passengersOnboard / b.capacityTotal) * 100) >= 90
  ).length;

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Route filter selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Route View:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedRouteFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedRouteFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Routes ({routes.length})
              </button>
              {routes.map((route) => {
                const occ = getRouteOccupancy(route.id);
                const density = getDensityDetails(occ.percent);
                return (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRouteFilter(route.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                      selectedRouteFilter === route.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: isHeatmapActive ? density.color : route.color }}
                    />
                    <span>{route.code}</span>
                    {isHeatmapActive && (
                      <span className="text-[10px] opacity-75 font-mono">({occ.percent}%)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occupancy Heatmap Layer Toggle */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <button
              onClick={() => setIsHeatmapActive(!isHeatmapActive)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                isHeatmapActive
                  ? 'bg-gradient-to-r from-emerald-600 via-amber-600 to-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Real-Time Occupancy Density Heatmap Layer"
            >
              <Flame className={`w-3.5 h-3.5 ${isHeatmapActive ? 'fill-current animate-pulse' : ''}`} />
              <span>Occupancy Heatmap Layer</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${isHeatmapActive ? 'bg-black/30 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {isHeatmapActive ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        {/* Simulation Kinematics Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-md bg-white text-slate-800 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause Kinematics' : 'Resume Kinematics'}
              aria-label={isPlaying ? 'Pause Kinematics' : 'Resume Kinematics'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={() => setSimSpeed(1)}
              className={`px-2 py-1 text-xs font-medium rounded-md cursor-pointer ${
                simSpeed === 1 ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setSimSpeed(2)}
              className={`px-2 py-1 text-xs font-medium rounded-md cursor-pointer ${
                simSpeed === 2 ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              2x
            </button>
            <button
              onClick={() => setSimSpeed(5)}
              className={`px-2 py-1 text-xs font-medium rounded-md cursor-pointer ${
                simSpeed === 5 ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              5x
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono tabular-nums hidden sm:block">
            Telemetry Rate: 1000ms
          </div>
        </div>
      </div>

      {/* Main Grid: Map (Left/Center) + Telemetry HUD (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive SVG Map */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative shadow-sm min-h-[560px]">
          {/* Map Compass & Legend Header */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Compass className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-white">Campus Metropolitan Transit Grid</span>
            <span className="text-slate-500">·</span>
            <span className="font-mono tabular-nums text-emerald-400">GPS Lock: 12 Sats</span>
            {isHeatmapActive && (
              <>
                <span className="text-slate-500">·</span>
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>Occupancy Density Mode</span>
                </span>
              </>
            )}
          </div>

          {/* Heatmap Legend Overlay (Bottom Left) */}
          <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-lg max-w-sm">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80">
              <span className="font-semibold text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>{isHeatmapActive ? 'Occupancy Heatmap Shading' : 'Route Color Legend'}</span>
              </span>
              <button
                onClick={() => setIsHeatmapActive(!isHeatmapActive)}
                className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
              >
                {isHeatmapActive ? 'Switch to Standard' : 'Enable Heatmap'}
              </button>
            </div>

            {isHeatmapActive ? (
              <div className="space-y-1 text-[11px]">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
                    <span>&lt; 50% Green (Low Density)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs shadow-amber-500/50" />
                    <span>50–74% Amber (Moderate)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-orange-500 shadow-xs shadow-orange-500/50" />
                    <span>75–89% Orange (Heavy)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500 shadow-xs shadow-red-500/50" />
                    <span>&ge; 90% Red (Over-Capacity)</span>
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 flex items-center justify-between font-mono">
                  <span>Fleet Distribution:</span>
                  <span>{lowDensityCount} Low · {moderateDensityCount} Mod · {highDensityCount} Heavy · {criticalDensityCount} Crit</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>R-01 North</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>R-02 Silicon</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>R-03 Riverfront</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                  <span>R-04 Heritage</span>
                </span>
              </div>
            )}
          </div>

          {/* SVG Map Canvas */}
          <svg
            viewBox="0 0 1000 700"
            className="w-full h-full object-cover select-none"
            style={{ minHeight: '560px' }}
          >
            <defs>
              {/* Background grid pattern */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.8" />
              </pattern>

              {/* Glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Heat Corridor Glow filter */}
              <filter id="heatGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Radial Gradients for Heat Aura around Buses */}
              <radialGradient id="heatGreen" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatAmber" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatOrange" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#F97316" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatRed" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#EF4444" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Grid background */}
            <rect width="1000" height="700" fill="#0B132B" />
            <rect width="1000" height="700" fill="url(#grid)" opacity="0.6" />

            {/* City Geography: River / Waterway */}
            <path
              d="M 100 680 Q 300 620, 500 650 T 900 690"
              fill="none"
              stroke="#1E3A5F"
              strokeWidth="48"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M 100 680 Q 300 620, 500 650 T 900 690"
              fill="none"
              stroke="#2563EB"
              strokeWidth="24"
              strokeLinecap="round"
              opacity="0.3"
            />

            {/* Secondary roads / grid lines */}
            <g stroke="#1F2937" strokeWidth="6" opacity="0.4" strokeLinecap="round">
              <line x1="80" y1="200" x2="920" y2="200" />
              <line x1="80" y1="360" x2="920" y2="360" />
              <line x1="80" y1="520" x2="920" y2="520" />
              <line x1="250" y1="80" x2="250" y2="650" />
              <line x1="500" y1="80" x2="500" y2="650" />
              <line x1="750" y1="80" x2="750" y2="650" />
            </g>

            {/* Arterial Ring Highway */}
            <circle
              cx="540"
              cy="360"
              r="260"
              fill="none"
              stroke="#374151"
              strokeWidth="12"
              strokeDasharray="6 6"
              opacity="0.3"
            />

            {/* Campus Central Hub Zone */}
            <rect
              x="820"
              y="350"
              width="130"
              height="130"
              rx="16"
              fill="#1E293B"
              stroke="#3B82F6"
              strokeWidth="2"
              opacity="0.85"
            />
            <text x="885" y="390" fill="#93C5FD" fontSize="12" fontWeight="700" textAnchor="middle">
              MAIN CAMPUS
            </text>
            <text x="885" y="408" fill="#E2E8F0" fontSize="10" fontWeight="600" textAnchor="middle">
              GATE A & TERMINAL
            </text>
            <circle cx="885" cy="435" r="8" fill="#3B82F6" opacity="0.6" />
            <circle cx="885" cy="435" r="4" fill="#60A5FA" />

            {/* Render Route Paths with Heatmap Shading */}
            {displayedRoutes.map((route) => {
              const pathData = route.pathPoints.reduce((acc, pt, idx) => {
                return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
              }, '');

              const isHighlighted = activeBus?.routeId === route.id;
              const routeOcc = getRouteOccupancy(route.id);
              const density = getDensityDetails(routeOcc.percent);

              // Shading color: when heatmap is active, use the occupancy density color (Green <50%, Amber 50-74%, Orange 75-89%, Red >=90%)
              const effectiveColor = isHeatmapActive ? density.color : route.color;
              const midPoint = route.pathPoints[Math.floor(route.pathPoints.length / 2)];

              return (
                <g key={route.id}>
                  {/* Heatmap density thermal corridor aura */}
                  {isHeatmapActive && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke={effectiveColor}
                      strokeWidth={isHighlighted ? 22 : 16}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#heatGlow)"
                      opacity={routeOcc.percent >= 90 ? 0.6 : routeOcc.percent >= 75 ? 0.45 : 0.3}
                    />
                  )}

                  {/* Outer glow line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={effectiveColor}
                    strokeWidth={isHighlighted ? 10 : 5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={isHighlighted ? 0.5 : 0.25}
                  />

                  {/* Main Route line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={effectiveColor}
                    strokeWidth={isHighlighted ? 4.5 : 3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={isHighlighted ? 'none' : isHeatmapActive ? 'none' : '4 4'}
                    opacity={isHighlighted ? 1 : 0.85}
                  />

                  {/* Floating Route Density Indicator Chip along corridor */}
                  {isHeatmapActive && midPoint && (
                    <g transform={`translate(${midPoint.x - 36}, ${midPoint.y - 20})`}>
                      <rect
                        width="72"
                        height="18"
                        rx="5"
                        fill="#0F172A"
                        stroke={effectiveColor}
                        strokeWidth="1.2"
                        filter="url(#glow)"
                        opacity="0.9"
                      />
                      <text
                        x="36"
                        y="12"
                        fill={effectiveColor}
                        fontSize="9"
                        fontWeight="700"
                        textAnchor="middle"
                        className="font-mono tabular-nums"
                      >
                        {route.code} · {routeOcc.percent}%
                      </text>
                    </g>
                  )}

                  {/* Render Stops along this route */}
                  {route.stops.map((stop) => {
                    const isStopSelected = selectedStop?.id === stop.id;
                    const isCampusGate = stop.name.includes('Campus');

                    return (
                      <g
                        key={stop.id}
                        className="cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStop(stop);
                        }}
                      >
                        {/* Stop outer circle */}
                        <circle
                          cx={stop.coord.x}
                          cy={stop.coord.y}
                          r={isStopSelected ? 10 : isCampusGate ? 8 : 6}
                          fill="#0F172A"
                          stroke={effectiveColor}
                          strokeWidth={isStopSelected ? 3 : 2}
                        />
                        {/* Stop inner core */}
                        <circle
                          cx={stop.coord.x}
                          cy={stop.coord.y}
                          r={isStopSelected ? 5 : 3}
                          fill={isStopSelected ? '#FFFFFF' : effectiveColor}
                        />

                        {/* Stop label */}
                        <text
                          x={stop.coord.x}
                          y={stop.coord.y - 12}
                          fill="#F8FAFC"
                          fontSize="10"
                          fontWeight="500"
                          textAnchor="middle"
                          className="pointer-events-none drop-shadow-sm font-sans"
                        >
                          {stop.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Render Moving Buses with Occupancy Heatmap Glow */}
            {buses.map((bus) => {
              const busRoute = routes.find((r) => r.id === bus.routeId);
              const isSelected = bus.id === activeBus?.id;
              const hasDelay = bus.activeDelayMinutes > 3;
              const busOccupancyPercent = Math.round((bus.passengersOnboard / bus.capacityTotal) * 100);
              const busDensity = getDensityDetails(busOccupancyPercent);

              // Select heat gradient
              const gradientId =
                busOccupancyPercent < 50
                  ? 'heatGreen'
                  : busOccupancyPercent < 75
                  ? 'heatAmber'
                  : busOccupancyPercent < 90
                  ? 'heatOrange'
                  : 'heatRed';

              return (
                <g
                  key={bus.id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBus(bus.id);
                  }}
                >
                  {/* Heatmap Density Radial Aura beneath bus */}
                  {isHeatmapActive && (
                    <circle
                      cx={bus.currentCoord.x}
                      cy={bus.currentCoord.y}
                      r={busOccupancyPercent >= 90 ? 38 : busOccupancyPercent >= 75 ? 32 : 26}
                      fill={`url(#${gradientId})`}
                      opacity={busOccupancyPercent >= 90 ? 0.9 : 0.7}
                      className={busOccupancyPercent >= 90 ? 'animate-pulse' : ''}
                    />
                  )}

                  {/* Selected Bus Halo */}
                  {isSelected && (
                    <circle
                      cx={bus.currentCoord.x}
                      cy={bus.currentCoord.y}
                      r="22"
                      fill="none"
                      stroke="#60A5FA"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      className="animate-spin"
                      style={{ transformOrigin: `${bus.currentCoord.x}px ${bus.currentCoord.y}px`, animationDuration: '6s' }}
                    />
                  )}

                  {/* Delay Warning Pulse ring */}
                  {hasDelay && (
                    <circle
                      cx={bus.currentCoord.x}
                      cy={bus.currentCoord.y}
                      r="18"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2"
                      opacity="0.8"
                    />
                  )}

                  {/* SOS ring */}
                  {bus.sosTriggered && (
                    <circle
                      cx={bus.currentCoord.x}
                      cy={bus.currentCoord.y}
                      r="24"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="3"
                    />
                  )}

                  {/* Bus Body */}
                  <rect
                    x={bus.currentCoord.x - 14}
                    y={bus.currentCoord.y - 14}
                    width="28"
                    height="28"
                    rx="7"
                    fill={bus.sosTriggered ? '#DC2626' : isSelected ? '#2563EB' : '#1E293B'}
                    stroke={isHeatmapActive ? busDensity.color : hasDelay ? '#F59E0B' : '#94A3B8'}
                    strokeWidth={isHeatmapActive ? 2.5 : 2}
                    filter="url(#glow)"
                  />

                  {/* Bus Icon */}
                  <g transform={`translate(${bus.currentCoord.x - 7}, ${bus.currentCoord.y - 7})`}>
                    <path
                      d="M2 3h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M3 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2 M11 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="1.3"
                    />
                  </g>

                  {/* Floating Bus Tag with Occupancy Indicator */}
                  <rect
                    x={bus.currentCoord.x - 26}
                    y={bus.currentCoord.y + 18}
                    width="52"
                    height="16"
                    rx="4"
                    fill="#0F172A"
                    stroke={isHeatmapActive ? busDensity.color : isSelected ? '#3B82F6' : '#334155'}
                    strokeWidth="1"
                  />
                  <text
                    x={bus.currentCoord.x}
                    y={bus.currentCoord.y + 30}
                    fill={isHeatmapActive ? busDensity.color : isSelected ? '#93C5FD' : '#E2E8F0'}
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    className="font-mono tabular-nums"
                  >
                    {isHeatmapActive
                      ? `${busOccupancyPercent}% Load`
                      : `${bus.number.replace('Bus ', '')} · ${bus.currentSpeedKmh}k`}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Stop Info Box (when clicked) */}
          {selectedStop && (
            <div className="absolute top-4 right-4 z-20 w-72 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-700 text-white shadow-xl animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-blue-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Station Stop</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-0.5">{selectedStop.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedStop.landmark}</p>
                </div>
                <button
                  onClick={() => setSelectedStop(null)}
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">Morning Scheduled</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-200">
                    {selectedStop.scheduledTimeMorning}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Predicted Arrival</span>
                  <span className={`font-mono tabular-nums font-semibold ${selectedStop.delayMinutes > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {selectedStop.predictedTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Registered Students</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-200">
                    {selectedStop.studentsCount} Students
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status</span>
                  <span className="font-semibold text-blue-400">
                    {selectedStop.delayMinutes > 0 ? `+${selectedStop.delayMinutes}m delay` : 'On-Time'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Telemetry HUD Card (Right Column) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            {/* Header: Selected Bus */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Telemetry HUD</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <span>{activeBus.number}</span>
                  <span className="text-xs font-mono font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {activeBus.plateNumber}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned Route: <strong className="text-slate-700">{activeRoute?.code} - {activeRoute?.name}</strong>
                </p>
              </div>

              {/* Status Indicator */}
              <div className="text-right">
                <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md ${
                  activeBus.status === 'in_transit'
                    ? 'bg-blue-50 text-blue-700'
                    : activeBus.status === 'delayed'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {activeBus.status === 'in_transit' ? 'In Transit' : activeBus.status === 'delayed' ? 'Delayed' : 'At Stop'}
                </span>
                <span className="block text-[11px] text-slate-400 font-mono mt-1">
                  Updated {activeBus.lastUpdated}
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Velocity</span>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                  {activeBus.currentSpeedKmh} <span className="text-xs font-normal text-slate-500">km/h</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Max 50 km/h</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Occupancy</span>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                  {activeBus.passengersOnboard}<span className="text-xs font-normal text-slate-500">/{activeBus.capacityTotal}</span>
                </div>
                <span className={`text-[10px] font-bold block ${activeBusDensity.textColor}`}>
                  {activeBusOccupancyPercent}% Load
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Fuel / Batt</span>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                  {activeBus.fuelLevelPercent}%
                </div>
                <span className="text-[10px] text-slate-400 block">~180 km left</span>
              </div>
            </div>

            {/* Real-Time Occupancy Heatmap Density Gauge & Quick Simulator */}
            <div className={`p-3.5 rounded-xl border ${activeBusDensity.badgeBg} ${activeBusDensity.borderColor} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: activeBusDensity.color }}>
                  <Flame className="w-4 h-4 fill-current" />
                  <span>Heatmap Density: {activeBusDensity.tierName}</span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white shadow-xs" style={{ color: activeBusDensity.color }}>
                  {activeBusOccupancyPercent}% Capacity
                </span>
              </div>

              {/* Progress Bar with Color Coordinated Gradient */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, activeBusOccupancyPercent)}%`,
                    backgroundColor: activeBusDensity.color,
                  }}
                />
              </div>

              {/* Interactive Passenger Adjuster (allows testing heatmap colors immediately) */}
              {onUpdatePassengers && (
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 text-xs">
                  <span className="text-[11px] text-slate-600 font-medium">Test Heatmap Density:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdatePassengers(activeBus.id, -5)}
                      disabled={activeBus.passengersOnboard <= 0}
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded border border-slate-200 shadow-2xs transition-colors cursor-pointer disabled:opacity-40"
                      title="Simulate 5 passengers getting off"
                    >
                      <Minus className="w-3 h-3 inline" /> 5
                    </button>
                    <button
                      onClick={() => onUpdatePassengers(activeBus.id, 5)}
                      disabled={activeBus.passengersOnboard >= activeBus.capacityTotal}
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded border border-slate-200 shadow-2xs transition-colors cursor-pointer disabled:opacity-40"
                      title="Simulate 5 passengers boarding"
                    >
                      <Plus className="w-3 h-3 inline" /> 5
                    </button>
                    <button
                      onClick={() => {
                        const surgeCount = Math.round(activeBus.capacityTotal * 0.94);
                        onUpdatePassengers(activeBus.id, surgeCount - activeBus.passengersOnboard);
                      }}
                      className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-800 text-[10px] font-bold rounded border border-red-300 shadow-2xs transition-colors cursor-pointer"
                      title="Set to 94% surge capacity (Red Heatmap)"
                    >
                      &gt;90% Red
                    </button>
                    <button
                      onClick={() => {
                        const lowCount = Math.round(activeBus.capacityTotal * 0.40);
                        onUpdatePassengers(activeBus.id, lowCount - activeBus.passengersOnboard);
                      }}
                      className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded border border-emerald-300 shadow-2xs transition-colors cursor-pointer"
                      title="Set to 40% capacity (Green Heatmap)"
                    >
                      &lt;50% Green
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Next Stop Countdown */}
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Next Stop ETA</span>
                </span>
                <span className="text-xs font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded shadow-xs">
                  {activeBus.nextStopEtaMinutes} mins away
                </span>
              </div>
              <p className="text-xs text-blue-800 font-medium mt-1.5">
                {activeRoute?.stops[activeBus.currentStopIndex]?.name || 'Next Scheduled Terminal'}
              </p>
              <div className="w-full bg-blue-200/60 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(activeBus.progressBetweenStops * 100)}%` }}
                />
              </div>
            </div>

            {/* Driver Profile Summary */}
            {activeDriver && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={activeDriver.avatar}
                    alt={activeDriver.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-slate-500 block">Assigned Driver</span>
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{activeDriver.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-mono tabular-nums">⭐ {activeDriver.rating}</span>
                      <span>·</span>
                      <span>{activeDriver.experienceYears} yrs exp</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${activeDriver.phone}`}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-xs"
                    title="Call Driver"
                    aria-label="Call Driver"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Delay Warning or Nominal Status */}
            {activeBus.activeDelayMinutes > 0 ? (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Delay Advisory: +{activeBus.activeDelayMinutes} minutes</span>
                </div>
                <p className="mt-1 text-amber-700 leading-relaxed">
                  {activeBus.delayReason || 'Congestion on corridor. AI reroute option ready.'}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Operating with nominal speed & scheduled timetable on this corridor.</span>
              </div>
            )}

            {/* Emergency SOS Trigger */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onTriggerSos(activeBus.id)}
                className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeBus.sosTriggered
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>
                  {activeBus.sosTriggered ? 'SOS ACTIVE - PROTOCOL DISPATCHED' : 'TRIGGER EMERGENCY SOS PROTOCOL'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
