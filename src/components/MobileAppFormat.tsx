import React, { useState } from 'react';
import { Bus, Route, Stop, Driver, Student, AttendanceNotification, DelayAlert } from '../types/transit';
import {
  MapPin,
  Navigation,
  QrCode,
  Bell,
  Clock,
  Phone,
  ShieldAlert,
  Flame,
  CheckCircle2,
  AlertTriangle,
  User,
  Radio,
  Share2,
  Compass,
  Bus as BusIcon,
  ChevronRight,
  Wifi,
  Battery,
  Sparkles,
  ArrowRight,
  Volume2
} from 'lucide-react';

interface MobileAppFormatProps {
  buses: Bus[];
  routes: Route[];
  drivers: Driver[];
  students: Student[];
  notifications: AttendanceNotification[];
  delayAlerts: DelayAlert[];
  onTriggerSos: (busId: string) => void;
  onStudentTapBoard: (studentId: string) => void;
  onUpdatePassengers: (busId: string, delta: number) => void;
  onSwitchToDesktop: () => void;
}

export const MobileAppFormat: React.FC<MobileAppFormatProps> = ({
  buses,
  routes,
  drivers,
  students,
  notifications,
  delayAlerts,
  onTriggerSos,
  onStudentTapBoard,
  onUpdatePassengers,
  onSwitchToDesktop,
}) => {
  // Mobile app navigation tabs
  const [mobileTab, setMobileTab] = useState<'track' | 'pass' | 'route' | 'alerts' | 'driver_hud'>('track');
  const [deviceModel, setDeviceModel] = useState<'iphone' | 'pixel'>('iphone');
  const [isHeatmapOn, setIsHeatmapOn] = useState<boolean>(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'stu_1');
  const [appRole, setAppRole] = useState<'student' | 'driver'>('student');
  const [soundAnnounced, setSoundAnnounced] = useState<boolean>(false);

  // Selected student & assigned bus/route
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const assignedRoute = routes.find((r) => r.id === currentStudent?.routeId) || routes[0];
  const assignedBus = buses.find((b) => b.routeId === assignedRoute?.id) || buses[0];
  const assignedDriver = drivers.find((d) => d.id === assignedBus?.driverId) || drivers[0];
  const assignedStop = assignedRoute?.stops.find((s) => s.id === currentStudent?.stopId) || assignedRoute?.stops[0];

  // Bus occupancy percentage
  const busOccupancyPercent = Math.round(
    (assignedBus.passengersOnboard / assignedBus.capacityTotal) * 100
  );

  // Density colors
  const getDensityColor = (p: number) => {
    if (p < 50) return { color: '#10B981', label: 'Low (<50%)', bg: 'bg-emerald-500' };
    if (p < 75) return { color: '#F59E0B', label: 'Moderate (50-74%)', bg: 'bg-amber-500' };
    if (p < 90) return { color: '#F97316', label: 'Heavy (75-89%)', bg: 'bg-orange-500' };
    return { color: '#EF4444', label: 'Critical (≥90%)', bg: 'bg-red-500' };
  };

  const density = getDensityColor(busOccupancyPercent);

  const handleAnnounceNextStop = () => {
    setSoundAnnounced(true);
    setTimeout(() => setSoundAnnounced(false), 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Device Toolbar Controls */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Device Simulator:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setDeviceModel('iphone')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                deviceModel === 'iphone' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              iPhone 16 Pro
            </button>
            <button
              onClick={() => setDeviceModel('pixel')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                deviceModel === 'pixel' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Pixel 9 Pro
            </button>
          </div>
        </div>

        <button
          onClick={onSwitchToDesktop}
          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          Exit to Console →
        </button>
      </div>

      {/* Realistic Mobile Device Container Frame */}
      <div
        className={`relative w-[385px] h-[780px] bg-slate-950 p-3 shadow-2xl transition-all duration-300 border-4 border-slate-800 ${
          deviceModel === 'iphone' ? 'rounded-[52px]' : 'rounded-[44px]'
        }`}
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Hardware details: Side buttons simulation */}
        <div className="absolute -left-[7px] top-[140px] w-[3px] h-[36px] bg-slate-700 rounded-l" />
        <div className="absolute -left-[7px] top-[190px] w-[3px] h-[55px] bg-slate-700 rounded-l" />
        <div className="absolute -left-[7px] top-[260px] w-[3px] h-[55px] bg-slate-700 rounded-l" />
        <div className="absolute -right-[7px] top-[180px] w-[3px] h-[75px] bg-slate-700 rounded-r" />

        {/* Screen Display Area */}
        <div className="relative w-full h-full bg-slate-100 rounded-[40px] overflow-hidden flex flex-col select-none text-slate-900 border border-slate-900/40">
          {/* iOS Dynamic Island / Android Camera cutout */}
          <div className="absolute top-0 left-0 right-0 z-50 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-900 pointer-events-none">
            <span className="font-mono">09:41</span>

            {/* Dynamic Island Pill */}
            {deviceModel === 'iphone' ? (
              <div className="w-[110px] h-[26px] bg-black rounded-full flex items-center justify-between px-2.5 text-[9px] text-white">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{assignedBus.number}</span>
                </span>
                <span className="font-mono text-slate-300">{assignedBus.nextStopEtaMinutes}m ETA</span>
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full bg-black mx-auto" />
            )}

            <div className="flex items-center gap-1.5 text-slate-800">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* App Header Bar */}
          <div className="pt-10 px-4 pb-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <BusIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">CampusTransit</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Greenwich University</span>
              </div>
            </div>

            {/* Role switch toggle inside mobile app */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
              <button
                onClick={() => setAppRole('student')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                  appRole === 'student' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => {
                  setAppRole('driver');
                  setMobileTab('driver_hud');
                }}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                  appRole === 'driver' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Driver
              </button>
            </div>
          </div>

          {/* Main App Scrollable Viewport */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 relative">
            {/* TAB 1: LIVE TRACK VIEW */}
            {mobileTab === 'track' && (
              <div className="flex flex-col h-full">
                {/* Embedded Mini Interactive Map */}
                <div className="relative h-[280px] bg-slate-900 overflow-hidden shrink-0">
                  {/* Heatmap overlay tag */}
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white border border-slate-800">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isHeatmapOn ? density.color : assignedRoute.color }}
                    />
                    <span>{assignedRoute.code}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-amber-400">{busOccupancyPercent}% Load</span>
                  </div>

                  <button
                    onClick={() => setIsHeatmapOn(!isHeatmapOn)}
                    className="absolute top-2 right-2 z-10 p-1 bg-slate-950/85 text-white rounded-md text-[9px] border border-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>Heatmap: {isHeatmapOn ? 'ON' : 'OFF'}</span>
                  </button>

                  {/* SVG Route Visualization for Mobile */}
                  <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
                    <rect width="400" height="300" fill="#0B132B" />

                    {/* Secondary roads */}
                    <line x1="20" y1="90" x2="380" y2="90" stroke="#1E293B" strokeWidth="4" />
                    <line x1="20" y1="180" x2="380" y2="180" stroke="#1E293B" strokeWidth="4" />
                    <line x1="120" y1="20" x2="120" y2="280" stroke="#1E293B" strokeWidth="4" />
                    <line x1="260" y1="20" x2="260" y2="280" stroke="#1E293B" strokeWidth="4" />

                    {/* Route Line with Heatmap Shading */}
                    <path
                      d="M 50 240 Q 150 180, 240 120 T 350 70"
                      fill="none"
                      stroke={isHeatmapOn ? density.color : assignedRoute.color}
                      strokeWidth={isHeatmapOn ? "12" : "6"}
                      opacity={isHeatmapOn ? "0.4" : "0.3"}
                      strokeLinecap="round"
                    />
                    <path
                      d="M 50 240 Q 150 180, 240 120 T 350 70"
                      fill="none"
                      stroke={isHeatmapOn ? density.color : assignedRoute.color}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Stops along path */}
                    <circle cx="50" cy="240" r="5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="50" y="260" fill="#E2E8F0" fontSize="9" textAnchor="middle">{assignedRoute.stops[0]?.name || 'Origin'}</text>

                    <circle cx="200" cy="150" r="6" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="200" y="140" fill="#60A5FA" fontSize="9" fontWeight="bold" textAnchor="middle">{assignedStop?.name || 'My Stop'}</text>

                    <circle cx="350" cy="70" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="350" y="90" fill="#A7F3D0" fontSize="9" textAnchor="middle">Campus Gate A</text>

                    {/* Animated Moving Bus Marker with Heat Radial Aura */}
                    {isHeatmapOn && (
                      <circle cx="160" cy="175" r="24" fill={density.color} opacity="0.4" className="animate-pulse" />
                    )}
                    <rect x="148" y="163" width="24" height="24" rx="6" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
                    <g transform="translate(153, 168)">
                      <path d="M1 2h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
                    </g>
                    {/* Bus tag */}
                    <rect x="138" y="192" width="44" height="13" rx="3" fill="#0F172A" stroke="#3B82F6" strokeWidth="0.8" />
                    <text x="160" y="201" fill="#93C5FD" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {assignedBus.number.replace('Bus ', '')} · {assignedBus.currentSpeedKmh}k
                    </text>
                  </svg>

                  {/* Recenter / Geolocation floating button */}
                  <button
                    onClick={() => {}}
                    className="absolute bottom-2 right-2 p-1.5 bg-white text-slate-800 rounded-full shadow-md cursor-pointer"
                    title="Center on My Stop"
                  >
                    <Compass className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Floating Bottom Drawer / Transit Cards */}
                <div className="p-3 space-y-2.5">
                  {/* Next Bus Approaching Card */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block">
                          Approaching My Stop
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">{assignedBus.number}</h4>
                        <p className="text-[11px] text-slate-500">{assignedStop.name}</p>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-base font-bold text-blue-600 tabular-nums">
                          {assignedBus.nextStopEtaMinutes} <span className="text-[10px] font-normal">min</span>
                        </div>
                        <span className="text-[9px] text-emerald-600 font-semibold block">On Schedule</span>
                      </div>
                    </div>

                    {/* Occupancy Heatmap Bar */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-500 fill-current" />
                          <span>Bus Capacity</span>
                        </span>
                        <span className="font-mono font-bold" style={{ color: density.color }}>
                          {assignedBus.passengersOnboard}/{assignedBus.capacityTotal} ({busOccupancyPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${busOccupancyPercent}%`, backgroundColor: density.color }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Assigned Driver Card */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={assignedDriver.avatar}
                        alt={assignedDriver.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{assignedDriver.name}</h5>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span>⭐ {assignedDriver.rating}</span>
                          <span>·</span>
                          <span className="font-mono">{assignedBus.plateNumber}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${assignedDriver.phone}`}
                      className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                      title="Call Driver"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Emergency Panic SOS Button */}
                  <button
                    onClick={() => onTriggerSos(assignedBus.id)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      assignedBus.sosTriggered
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{assignedBus.sosTriggered ? 'SOS ACTIVE - HELP DISPATCHED' : 'ONE-TOUCH EMERGENCY SOS'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: DIGITAL RFID / QR BOARDING PASS */}
            {mobileTab === 'pass' && (
              <div className="p-4 space-y-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md space-y-4 text-center">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                        Digital Transit Card
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{currentStudent.name}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentStudent.status === 'boarded' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {currentStudent.status === 'boarded' ? 'Boarded Today' : 'Ready to Board'}
                    </span>
                  </div>

                  {/* QR Code Graphic Box */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block shadow-inner mx-auto">
                    <QrCode className="w-28 h-28 text-slate-900 mx-auto" />
                    <span className="font-mono text-[10px] text-slate-500 mt-2 block tracking-wider">
                      {currentStudent.rfidCardUid}
                    </span>
                  </div>

                  {/* Student Details */}
                  <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Roll Number</span>
                      <span className="font-mono font-semibold text-slate-800">{currentStudent.rollNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Department</span>
                      <span className="font-semibold text-slate-800 truncate block">{currentStudent.department}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Designated Bus</span>
                      <span className="font-semibold text-slate-800">{assignedBus.number}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pickup Stop</span>
                      <span className="font-semibold text-slate-800">{assignedStop.name}</span>
                    </div>
                  </div>

                  {/* Tap-to-Board Simulator Button */}
                  <button
                    onClick={() => onStudentTapBoard(currentStudent.id)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>
                      {currentStudent.status === 'boarded' ? 'Tap Again to Disembark' : 'Tap Phone / RFID Card to Board'}
                    </span>
                  </button>

                  <p className="text-[10px] text-slate-400 leading-tight">
                    Instant automated SMS alert dispatched to parent ({currentStudent.parentPhone}) upon tap.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: ROUTE & TIMETABLE */}
            {mobileTab === 'route' && (
              <div className="p-3 space-y-3">
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                        Assigned Corridor
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">{assignedRoute.name}</h4>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700">{assignedRoute.distanceKm} km</span>
                  </div>
                </div>

                {/* Vertical stop itinerary */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Morning Pickup Stations
                  </h5>

                  <div className="relative pl-3 border-l-2 border-blue-200 space-y-4">
                    {assignedRoute.stops.map((stop, idx) => {
                      const isMyStop = stop.id === currentStudent.stopId;
                      return (
                        <div key={stop.id} className="relative">
                          {/* Dot */}
                          <div
                            className={`absolute -left-[19px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                              isMyStop ? 'bg-blue-600 scale-125' : 'bg-slate-400'
                            }`}
                          />
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold ${isMyStop ? 'text-blue-600' : 'text-slate-800'}`}>
                                  {stop.name}
                                </span>
                                {isMyStop && (
                                  <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 rounded font-semibold">
                                    My Stop
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{stop.landmark}</span>
                            </div>

                            <div className="text-right font-mono text-[11px] tabular-nums">
                              <span className="font-bold text-slate-700">{stop.scheduledTimeMorning}</span>
                              <span className="text-[9px] text-slate-400 block">{stop.studentsCount} students</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: NOTIFICATIONS & ALERTS */}
            {mobileTab === 'alerts' && (
              <div className="p-3 space-y-2.5">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs font-bold text-slate-800">Parent & Student Notifications</h4>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Active Feed
                  </span>
                </div>

                {notifications.map((n) => (
                  <div key={n.id} className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{n.studentName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9px] text-slate-400 font-mono">
                      <span>SMS Sent</span>
                      <span className="text-emerald-600 font-semibold">Delivered</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: BUS DRIVER CONSOLE HUD */}
            {mobileTab === 'driver_hud' && (
              <div className="p-3 space-y-3">
                {/* Speedometer Card */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md text-center space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Telemetry Speedometer (Limit: 50 km/h)
                  </span>
                  <div className="text-4xl font-extrabold font-mono text-emerald-400 tabular-nums">
                    {assignedBus.currentSpeedKmh} <span className="text-sm font-normal text-slate-400">km/h</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Bus #{assignedBus.number.replace('Bus ', '')} · {assignedBus.plateNumber}
                  </span>
                </div>

                {/* Passenger Load & Controls */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Passenger Roster</span>
                    <span className="font-mono font-bold" style={{ color: density.color }}>
                      {assignedBus.passengersOnboard} / {assignedBus.capacityTotal} Seats
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${busOccupancyPercent}%`, backgroundColor: density.color }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500">Quick Adjust Count:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdatePassengers(assignedBus.id, -1)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => onUpdatePassengers(assignedBus.id, 1)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded"
                      >
                        +1
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stop Announcement Audio Button */}
                <button
                  onClick={handleAnnounceNextStop}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {soundAnnounced ? 'Stop Broadcast Dispatched!' : `Announce: Approaching ${assignedStop.name}`}
                  </span>
                </button>

                {/* Panic SOS Button */}
                <button
                  onClick={() => onTriggerSos(assignedBus.id)}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    assignedBus.sosTriggered
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>DRIVER EMERGENCY PANIC ALARM</span>
                </button>
              </div>
            )}
          </div>

          {/* Native Mobile Bottom Navigation Tab Bar */}
          <div className="h-14 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-2 text-slate-600 shrink-0">
            <button
              onClick={() => setMobileTab('track')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                mobileTab === 'track' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span className="text-[10px]">Track</span>
            </button>

            <button
              onClick={() => setMobileTab('pass')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                mobileTab === 'pass' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span className="text-[10px]">My Pass</span>
            </button>

            <button
              onClick={() => setMobileTab('route')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                mobileTab === 'route' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-[10px]">Route</span>
            </button>

            <button
              onClick={() => setMobileTab('alerts')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer relative ${
                mobileTab === 'alerts' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="text-[10px]">Alerts</span>
              {notifications.length > 0 && (
                <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {appRole === 'driver' && (
              <button
                onClick={() => setMobileTab('driver_hud')}
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                  mobileTab === 'driver_hud' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                <BusIcon className="w-4 h-4" />
                <span className="text-[10px]">HUD</span>
              </button>
            )}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="h-4 bg-white flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-900/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
