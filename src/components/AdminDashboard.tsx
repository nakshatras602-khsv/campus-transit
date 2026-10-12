import React, { useState } from 'react';
import { Bus, Route, Driver, DelayAlert, AttendanceNotification } from '../types/transit';
import {
  Bus as BusIcon,
  Users,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Send,
  CheckCircle,
  Search,
  Filter,
  ArrowUpRight,
  Gauge,
  MapPin,
  Calendar
} from 'lucide-react';

interface AdminDashboardProps {
  buses: Bus[];
  routes: Route[];
  drivers: Driver[];
  delayAlerts: DelayAlert[];
  notifications: AttendanceNotification[];
  onSelectBus: (busId: string) => void;
  onNavigateToTab: (tab: any) => void;
  onSendBroadcast: (message: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  buses,
  routes,
  drivers,
  delayAlerts,
  notifications,
  onSelectBus,
  onNavigateToTab,
  onSendBroadcast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [broadcastText, setBroadcastText] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Computed metrics
  const totalBuses = buses.length;
  const onRouteCount = buses.filter((b) => b.status === 'in_transit' || b.status === 'delayed').length;
  const standbyCount = buses.filter((b) => b.status === 'depot').length;
  const totalStudentsTransported = buses.reduce((acc, b) => acc + b.passengersOnboard, 0);
  const delayedBusesCount = buses.filter((b) => b.activeDelayMinutes > 3).length;
  const onTimePercentage = Math.round(((totalBuses - delayedBusesCount) / totalBuses) * 100);

  const filteredBuses = buses.filter((bus) => {
    const route = routes.find((r) => r.id === bus.routeId);
    const driver = drivers.find((d) => d.id === bus.driverId);
    const query = searchQuery.toLowerCase();
    return (
      bus.number.toLowerCase().includes(query) ||
      bus.plateNumber.toLowerCase().includes(query) ||
      route?.name.toLowerCase().includes(query) ||
      route?.code.toLowerCase().includes(query) ||
      driver?.name.toLowerCase().includes(query)
    );
  });

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    onSendBroadcast(broadcastText);
    setBroadcastText('');
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setShowBroadcastModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Operational Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Greenwich University Transit Command</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                Campus Fleet & Student Transit Operations
              </h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Centralized telemetry command providing sub-second GPS tracking, contactless RFID student attendance verification, driver safety auditing, and autonomous AI arrival delay management.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={() => onNavigateToTab('live_tracker')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Launch Live Tracking Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Parent Alert</span>
              </button>
              <button
                onClick={() => onNavigateToTab('prompt_studio')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                View System Prompt
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full bg-slate-900">
            <img
              src="/src/assets/images/college_campus_transit_bus_1791740899921.jpg"
              alt="College Transit Bus"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <div className="text-white text-xs">
                <span className="font-semibold block">Smart Electric Campus Fleet</span>
                <span className="text-slate-300 text-[11px]">Equipped with Teltonika FMB920 GPS + RC522 RFID</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Row (Strict anti-slop: clean tabular text, no pill sandwiches) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Fleet</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {totalBuses} <span className="text-xs font-normal text-slate-400 font-sans">Buses</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">4 Active Routes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Active On Route</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-blue-600 mt-1">
            {onRouteCount}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">{standbyCount} Standby at Depot</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">On-Time Performance</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 mt-1">
            {onTimePercentage}%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">Target ≥90% met</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Students Onboard</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {totalStudentsTransported}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Across 16 Stations</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Active Delay Alerts</span>
          <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${delayedBusesCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {delayedBusesCount}
          </div>
          <span className="text-[11px] text-amber-600 font-medium block mt-1">R-03 Arterial detour</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Parent SMS Dispatched</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {notifications.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">100% Delivery rate</span>
        </div>
      </div>

      {/* Fleet Overview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Fleet Operations Master Ledger</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status, driver assignments, occupancy, and telemetry</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search bus, driver, route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Bus Identification</th>
                <th className="py-3 px-4 font-semibold">Assigned Route</th>
                <th className="py-3 px-4 font-semibold">Driver & Contact</th>
                <th className="py-3 px-4 font-semibold text-right">Current Speed</th>
                <th className="py-3 px-4 font-semibold text-right">Passenger Load</th>
                <th className="py-3 px-4 font-semibold text-right">Battery / Fuel</th>
                <th className="py-3 px-4 font-semibold">Operating Status</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBuses.map((bus) => {
                const route = routes.find((r) => r.id === bus.routeId);
                const driver = drivers.find((d) => d.id === bus.driverId);

                return (
                  <tr key={bus.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{bus.number}</div>
                      <div className="font-mono text-[11px] text-slate-500">{bus.plateNumber}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: route?.color }} />
                        <span>{route?.code}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{route?.name}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{driver?.name}</div>
                      <div className="font-mono text-[11px] text-slate-500">{driver?.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <span className={`font-semibold ${bus.currentSpeedKmh > bus.maxSpeedLimit ? 'text-red-600' : 'text-slate-800'}`}>
                        {bus.currentSpeedKmh} km/h
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <span className="font-semibold text-slate-800">{bus.passengersOnboard}</span>
                      <span className="text-slate-400">/{bus.capacityTotal}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <span className="font-semibold text-slate-800">{bus.fuelLevelPercent}%</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {bus.status === 'in_transit' && (
                        <span className="text-blue-700 font-medium">On Route</span>
                      )}
                      {bus.status === 'delayed' && (
                        <span className="text-amber-700 font-medium">Delayed (+{bus.activeDelayMinutes}m)</span>
                      )}
                      {bus.status === 'at_stop' && (
                        <span className="text-emerald-700 font-medium">Station Boarding</span>
                      )}
                      {bus.status === 'depot' && (
                        <span className="text-slate-500 font-medium">Depot Standby</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectBus(bus.id);
                          onNavigateToTab('live_tracker');
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                      >
                        Track Map →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Broadcast Transit Advisory</h3>
            <p className="text-xs text-slate-500 mt-1">
              Sends automated multi-channel SMS & push notifications to all parents and students.
            </p>

            <form onSubmit={handleBroadcastSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Alert Message</label>
                <textarea
                  rows={4}
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  placeholder="e.g. Due to sudden road repairs near Grand Market, Bus #03 will be arriving approximately 10 minutes later than usual..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {broadcastSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Broadcast successfully dispatched to 342 parents!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Send Outbound Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
