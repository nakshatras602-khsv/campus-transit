import React, { useState } from 'react';
import { Route, Stop } from '../types/transit';
import {
  MapPin,
  Clock,
  Users,
  Navigation,
  Compass,
  ArrowRight,
  Sun,
  Moon,
  AlertTriangle,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface RouteManagementProps {
  routes: Route[];
  onSimulateDisruption?: (routeId: string) => void;
}

export const RouteManagement: React.FC<RouteManagementProps> = ({ routes, onSimulateDisruption }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0].id);
  const [scheduleType, setScheduleType] = useState<'morning' | 'evening'>('morning');

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="space-y-6">
      {/* Header & Shift Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Transit Corridors & Stop Itinerary Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Geofenced bus stops, morning pickup itineraries, evening drop schedules, and landmark coordinates
          </p>
        </div>

        {/* Morning vs Evening Shift Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setScheduleType('morning')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              scheduleType === 'morning'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Morning Inbound (Pickup)</span>
          </button>
          <button
            onClick={() => setScheduleType('evening')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              scheduleType === 'evening'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Evening Outbound (Drop)</span>
          </button>
        </div>
      </div>

      {/* Route Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {routes.map((route) => {
          const isSelected = route.id === selectedRoute.id;
          return (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${route.color}15`, color: route.color }}
                >
                  {route.code}
                </span>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  {route.distanceKm} km
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-900 mt-2 truncate">
                {route.name}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {route.stops.length} Station Stops · {route.estimatedDurationMins} min run
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Route Detail Card & Stop Itinerary */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" />
              <span>Corridor Details</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {selectedRoute.code}: {selectedRoute.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Shift Departure:{' '}
              <strong className="text-slate-700">
                {scheduleType === 'morning' ? selectedRoute.morningStartTime : selectedRoute.eveningStartTime}
              </strong>{' '}
              · Total Transit Length: <strong className="text-slate-700">{selectedRoute.distanceKm} km</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              Geofence Trigger: 250m Radius
            </span>
          </div>
        </div>

        {/* Ordered Itinerary Timeline */}
        <div className="p-6">
          <div className="relative">
            {/* Vertical connector line */}
            <div
              className="absolute left-4 top-4 bottom-4 w-0.5"
              style={{ backgroundColor: `${selectedRoute.color}40` }}
            />

            <div className="space-y-6">
              {selectedRoute.stops.map((stop, index) => {
                const isFirst = index === 0;
                const isLast = index === selectedRoute.stops.length - 1;
                const scheduledTime = scheduleType === 'morning' ? stop.scheduledTimeMorning : stop.scheduledTimeEvening;

                return (
                  <div key={stop.id} className="relative flex items-start gap-4 pl-1">
                    {/* Circle Node */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white z-10 shrink-0 shadow-xs"
                      style={{ backgroundColor: selectedRoute.color }}
                    >
                      {index + 1}
                    </div>

                    {/* Stop Content Card */}
                    <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200/80 hover:bg-slate-50/90 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-slate-900">{stop.name}</h4>
                            {isFirst && (
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                                Origin Terminal
                              </span>
                            )}
                            {isLast && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                Campus Hub
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>Landmark: {stop.landmark}</span>
                          </p>
                        </div>

                        {/* Timing and student metrics */}
                        <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 block font-sans">Scheduled</span>
                            <span className="font-semibold text-slate-800">{scheduledTime}</span>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 block font-sans">Predicted ETA</span>
                            <span className={`font-semibold ${stop.delayMinutes > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {stop.predictedTime}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 block font-sans">Boarding</span>
                            <span className="font-semibold text-slate-800">{stop.studentsCount} Students</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
