import React, { useState, useEffect } from 'react';
import { ViewTab, UserRole, Bus, Route, Driver, Student, DelayAlert, AttendanceNotification } from './types/transit';
import {
  INITIAL_BUSES,
  INITIAL_ROUTES,
  INITIAL_DRIVERS,
  INITIAL_STUDENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DELAY_ALERTS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LiveTrackerMap } from './components/LiveTrackerMap';
import { AdminDashboard } from './components/AdminDashboard';
import { DriverManagement } from './components/DriverManagement';
import { RouteManagement } from './components/RouteManagement';
import { AttendanceScanner } from './components/AttendanceScanner';
import { DelayManager } from './components/DelayManager';
import { AwardPromptStudio } from './components/AwardPromptStudio';
import { MobileAppFormat } from './components/MobileAppFormat';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('live_tracker');
  const [userRole, setUserRole] = useState<UserRole>('transport_admin');
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [notifications, setNotifications] = useState<AttendanceNotification[]>(INITIAL_NOTIFICATIONS);
  const [delayAlerts, setDelayAlerts] = useState<DelayAlert[]>(INITIAL_DELAY_ALERTS);
  const [selectedBusId, setSelectedBusId] = useState<string>('bus_1');

  // Real-time kinematic simulation loop for moving buses along route paths
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          if (bus.status === 'depot' || bus.status === 'maintenance') {
            return bus;
          }

          const route = routes.find((r) => r.id === bus.routeId);
          if (!route || route.pathPoints.length < 2) return bus;

          const points = route.pathPoints;
          const currentIdx = bus.currentStopIndex;
          const nextIdx = (currentIdx + 1) % points.length;

          const currentPt = points[currentIdx];
          const nextPt = points[nextIdx];

          // Increment progress between current point and next point
          let newProgress = bus.progressBetweenStops + 0.05;
          let newStopIndex = currentIdx;

          if (newProgress >= 1) {
            newProgress = 0;
            newStopIndex = (currentIdx + 1) % (points.length - 1);
          }

          // Linear interpolation for coordinate
          const newX = Math.round(currentPt.x + (nextPt.x - currentPt.x) * newProgress);
          const newY = Math.round(currentPt.y + (nextPt.y - currentPt.y) * newProgress);

          // Calculate ETA in minutes based on remaining path
          const remainingFraction = 1 - newProgress;
          const approxEta = Math.max(1, Math.round(remainingFraction * 5) + (bus.activeDelayMinutes || 0));

          return {
            ...bus,
            currentCoord: { x: newX, y: newY },
            progressBetweenStops: newProgress,
            currentStopIndex: newStopIndex,
            nextStopEtaMinutes: approxEta,
            lastUpdated: 'Just now',
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [routes]);

  // Handle emergency SOS trigger
  const handleTriggerSos = (busId: string) => {
    setBuses((prev) =>
      prev.map((b) => (b.id === busId ? { ...b, sosTriggered: !b.sosTriggered } : b))
    );

    const bus = buses.find((b) => b.id === busId);
    if (bus && !bus.sosTriggered) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newNotif: AttendanceNotification = {
        id: `sos_${Date.now()}`,
        studentId: 'all',
        studentName: `EMERGENCY ALERT: ${bus.number}`,
        parentPhone: 'CAMPUS-SECURITY-HOTLINE',
        type: 'delay_alert',
        message: `PRIORITY ALERT: Emergency SOS button engaged on ${bus.number} (${bus.plateNumber}). Campus rapid response team and emergency authorities dispatched to coordinate (${bus.currentCoord.x}, ${bus.currentCoord.y}).`,
        timestamp: now,
        status: 'delivered',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Student taps RFID pass
  const handleStudentTapBoard = (studentId: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newStatus = s.status === 'boarded' ? 'waiting' : 'boarded';
          return {
            ...s,
            status: newStatus,
            boardedTime: newStatus === 'boarded' ? now : undefined,
          };
        }
        return s;
      })
    );

    const targetStudent = students.find((s) => s.id === studentId);
    if (targetStudent) {
      const studentRoute = routes.find((r) => r.id === targetStudent.routeId);
      const studentStop = studentRoute?.stops.find((st) => st.id === targetStudent.stopId);
      const assignedBus = buses.find((b) => b.routeId === targetStudent.routeId) || buses[0];

      // Update bus passengers count
      setBuses((prev) =>
        prev.map((b) =>
          b.id === assignedBus.id
            ? { ...b, passengersOnboard: Math.min(b.capacityTotal, b.passengersOnboard + 1) }
            : b
        )
      );

      // Create new notification
      const newNotif: AttendanceNotification = {
        id: `notif_${Date.now()}`,
        studentId: targetStudent.id,
        studentName: targetStudent.name,
        parentPhone: targetStudent.parentPhone,
        type: 'boarded',
        message: `${targetStudent.name} tapped RFID pass and safely boarded ${assignedBus.number} at ${studentStop?.name || 'Assigned Stop'} at ${now}. Destination: Main Campus Gate A.`,
        timestamp: now,
        status: 'delivered',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Trigger simulated delay
  const handleTriggerSimulatedDelay = (busId: string, minutes: number, cause: string) => {
    const targetBus = buses.find((b) => b.id === busId);
    if (!targetBus) return;

    const route = routes.find((r) => r.id === targetBus.routeId);

    // Update bus state
    setBuses((prev) =>
      prev.map((b) =>
        b.id === busId
          ? {
              ...b,
              status: 'delayed',
              activeDelayMinutes: minutes,
              delayReason: cause,
              currentSpeedKmh: Math.max(12, b.currentSpeedKmh - 15),
            }
          : b
      )
    );

    // Update downstream stop times
    if (route) {
      setRoutes((prevRoutes) =>
        prevRoutes.map((r) => {
          if (r.id === route.id) {
            return {
              ...r,
              stops: r.stops.map((stop) => ({
                ...stop,
                delayMinutes: minutes,
                predictedTime: `${stop.scheduledTimeMorning} (+${minutes}m)`,
              })),
            };
          }
          return r;
        })
      );
    }

    // Add delay alert
    const newAlert: DelayAlert = {
      id: `dly_${Date.now()}`,
      busId: targetBus.id,
      busNumber: targetBus.number,
      routeCode: route?.code || 'R-01',
      delayMinutes: minutes,
      cause: cause as any,
      location: 'Transit Corridor Arterial',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resolutionStatus: 'investigating',
      aiRecommendation: `Gemini AI recommends dynamic reroute: Traffic speed dropped to 14 km/h. Diverting via secondary corridor will prevent ${Math.round(minutes * 0.7)} minutes of scheduled delay for upcoming ${route?.stops.length || 4} stops.`,
    };

    setDelayAlerts((prev) => [newAlert, ...prev]);
  };

  // Resolve delay
  const handleResolveDelay = (alertId: string) => {
    const alert = delayAlerts.find((a) => a.id === alertId);
    if (!alert) return;

    setDelayAlerts((prev) => prev.filter((a) => a.id !== alertId));

    setBuses((prev) =>
      prev.map((b) =>
        b.id === alert.busId
          ? { ...b, status: 'in_transit', activeDelayMinutes: 0, delayReason: undefined }
          : b
      )
    );
  };

  // Broadcast announcement
  const handleSendBroadcast = (message: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNotif: AttendanceNotification = {
      id: `broadcast_${Date.now()}`,
      studentId: 'all',
      studentName: 'Campus Transport Dispatch Broadcast',
      parentPhone: 'ALL-REGISTERED-PARENTS',
      type: 'delay_alert',
      message: message,
      timestamp: now,
      status: 'delivered',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Adjust passengers onboard (for occupancy heatmap real-time simulation)
  const handleUpdatePassengers = (busId: string, delta: number) => {
    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === busId) {
          const newCount = Math.max(0, Math.min(b.capacityTotal, b.passengersOnboard + delta));
          return { ...b, passengersOnboard: newCount };
        }
        return b;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Universal Top Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        userRole={userRole}
        onRoleChange={(role) => setUserRole(role)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'mobile_app' && (
          <MobileAppFormat
            buses={buses}
            routes={routes}
            drivers={drivers}
            students={students}
            notifications={notifications}
            delayAlerts={delayAlerts}
            onTriggerSos={handleTriggerSos}
            onStudentTapBoard={handleStudentTapBoard}
            onUpdatePassengers={handleUpdatePassengers}
            onSwitchToDesktop={() => setCurrentTab('live_tracker')}
          />
        )}

        {currentTab === 'live_tracker' && (
          <LiveTrackerMap
            buses={buses}
            routes={routes}
            drivers={drivers}
            selectedBusId={selectedBusId}
            onSelectBus={(id) => setSelectedBusId(id)}
            onTriggerSos={handleTriggerSos}
            onUpdatePassengers={handleUpdatePassengers}
          />
        )}

        {currentTab === 'admin_dashboard' && (
          <AdminDashboard
            buses={buses}
            routes={routes}
            drivers={drivers}
            delayAlerts={delayAlerts}
            notifications={notifications}
            onSelectBus={(id) => setSelectedBusId(id)}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onSendBroadcast={handleSendBroadcast}
          />
        )}

        {currentTab === 'routes' && (
          <RouteManagement
            routes={routes}
            onSimulateDisruption={(routeId) => {
              const bus = buses.find((b) => b.routeId === routeId) || buses[0];
              handleTriggerSimulatedDelay(bus.id, 10, 'Road Construction Bottleneck');
            }}
          />
        )}

        {currentTab === 'drivers' && (
          <DriverManagement
            drivers={drivers}
            buses={buses}
            routes={routes}
            onSelectBus={(id) => setSelectedBusId(id)}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'attendance' && (
          <AttendanceScanner
            students={students}
            notifications={notifications}
            buses={buses}
            routes={routes}
            onStudentTapBoard={handleStudentTapBoard}
          />
        )}

        {currentTab === 'delays' && (
          <DelayManager
            delayAlerts={delayAlerts}
            buses={buses}
            routes={routes}
            onTriggerSimulatedDelay={handleTriggerSimulatedDelay}
            onResolveDelay={handleResolveDelay}
            onBroadcastDelayNotice={handleSendBroadcast}
          />
        )}

        {currentTab === 'prompt_studio' && <AwardPromptStudio />}
      </main>

      {/* Clean quiet footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>Greenwich University Autonomous Transit System</span>
            <span className="mx-2">·</span>
            <span>Google AI Studio Architecture</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('prompt_studio')}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Export AI Studio Prompt (.md)
            </button>
            <span className="text-slate-300">|</span>
            <span>Version 2026.4 Production Build</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
