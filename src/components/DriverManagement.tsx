import React, { useState } from 'react';
import { Driver, Bus, Route } from '../types/transit';
import {
  Shield,
  Phone,
  Calendar,
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Car,
  Search,
  UserCheck
} from 'lucide-react';

interface DriverManagementProps {
  drivers: Driver[];
  buses: Bus[];
  routes: Route[];
  onSelectBus: (busId: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const DriverManagement: React.FC<DriverManagementProps> = ({
  drivers,
  buses,
  routes,
  onSelectBus,
  onNavigateToTab,
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>(drivers[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];
  const assignedBus = buses.find((b) => b.id === selectedDriver.assignedBusId);
  const assignedRoute = routes.find((r) => r.id === selectedDriver.assignedRouteId);

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Transport Driver Safety & Operations Registry</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified commercial credentials, health and blood records, shift adherence, and telematics safety records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search driver by name or license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Grid: Driver List (Left) + Detailed Driver Profile Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Driver Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredDrivers.map((driver) => {
            const isSelected = driver.id === selectedDriver.id;
            const bus = buses.find((b) => b.id === driver.assignedBusId);

            return (
              <div
                key={driver.id}
                onClick={() => setSelectedDriverId(driver.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={driver.avatar}
                    alt={driver.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">{driver.name}</h4>
                      <span className="text-xs font-mono tabular-nums font-semibold text-amber-600">
                        ⭐ {driver.rating}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{bus?.number || 'Standby'}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{driver.experienceYears} yrs experience</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                      <span className={driver.status === 'on_duty' ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                        {driver.status === 'on_duty' ? 'Active Shift' : 'On Break'}
                      </span>
                      <span>·</span>
                      <span>Speed Violations: {driver.speedViolationsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full Driver Dossier */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Driver Profile Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDriver.avatar}
                  alt={selectedDriver.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Commercial Driver Dossier
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedDriver.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-mono">{selectedDriver.phone}</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Fitness Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedDriver.phone}`}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver</span>
                </a>
              </div>
            </div>

            {/* Credential Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">CDL License Number</span>
                <span className="font-mono font-semibold text-slate-900 text-xs block mt-1">
                  {selectedDriver.licenseNumber}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Expires {selectedDriver.licenseExpiry}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Medical Blood Group</span>
                <span className="font-bold text-slate-900 text-xs block mt-1">
                  {selectedDriver.bloodGroup} (Rh Positive)
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">
                  Annual Physical Passed
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Emergency Contact</span>
                <span className="font-mono text-slate-900 text-xs block mt-1">
                  {selectedDriver.emergencyContact}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Verified Family Line
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Safety Performance</span>
                <span className="font-bold font-mono text-amber-600 text-xs block mt-1">
                  {selectedDriver.rating} / 5.0 Rating
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Zero At-Fault Incidents
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Shift Timing Today</span>
                <span className="font-mono text-slate-900 text-xs block mt-1">
                  Started at {selectedDriver.shiftStart}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Under 8hr fatigue limit
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Speed Compliance</span>
                <span className={`font-mono font-semibold text-xs block mt-1 ${selectedDriver.speedViolationsCount === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {selectedDriver.speedViolationsCount} Infractions
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Monitored via IoT HUD
                </span>
              </div>
            </div>

            {/* Current Assigned Bus & Route Details */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>Current Fleet Assignment</span>
                </span>
                <button
                  onClick={() => {
                    if (assignedBus) {
                      onSelectBus(assignedBus.id);
                      onNavigateToTab('live_tracker');
                    }
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Locate On Live Map →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Assigned Vehicle</span>
                  <span className="font-semibold text-slate-900">{assignedBus?.number} ({assignedBus?.plateNumber})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assigned Route</span>
                  <span className="font-semibold text-slate-900">{assignedRoute?.code} - {assignedRoute?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
