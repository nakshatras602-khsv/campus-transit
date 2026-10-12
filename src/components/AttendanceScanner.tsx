import React, { useState } from 'react';
import { Student, AttendanceNotification, Bus, Route } from '../types/transit';
import {
  QrCode,
  Radio,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Phone,
  Send,
  Search,
  Filter,
  UserCheck,
  Check,
  Bell
} from 'lucide-react';

interface AttendanceScannerProps {
  students: Student[];
  notifications: AttendanceNotification[];
  buses: Bus[];
  routes: Route[];
  onStudentTapBoard: (studentId: string) => void;
}

export const AttendanceScanner: React.FC<AttendanceScannerProps> = ({
  students,
  notifications,
  buses,
  routes,
  onStudentTapBoard,
}) => {
  const [selectedBusFilter, setSelectedBusFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const filteredStudents = students.filter((student) => {
    const matchesBus = selectedBusFilter === 'all' || student.routeId === selectedBusFilter;
    const matchesStatus = selectedStatusFilter === 'all' || student.status === selectedStatusFilter;
    const matchesQuery =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rfidCardUid.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBus && matchesStatus && matchesQuery;
  });

  const handleSimulateScan = (student: Student) => {
    onStudentTapBoard(student.id);
    setScanMessage(`RFID Verified: ${student.name} (${student.rfidCardUid}) - Boarding Logged! Parent SMS dispatched.`);
    setTimeout(() => {
      setScanMessage(null);
    }, 3500);
  };

  const boardedCount = students.filter((s) => s.status === 'boarded').length;
  const waitingCount = students.filter((s) => s.status === 'waiting').length;
  const missedCount = students.filter((s) => s.status === 'missed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student RFID Attendance & Boarding Verification</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Contactless smart card reader simulation, real-time stop manifest, and automated parent SMS dispatch
          </p>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            {boardedCount} Boarded
          </span>
          <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            {waitingCount} Waiting
          </span>
          <span className="text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
            {missedCount} Missed
          </span>
        </div>
      </div>

      {/* Tap-to-Board Simulator Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">NFC / RFID Boarding Gate Simulator (RC522)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate a student tapping their campus RFID card on the bus entrance terminal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const waitingStudent = students.find((s) => s.status === 'waiting') || students[0];
                handleSimulateScan(waitingStudent);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Simulate RFID Tap (Waiting Student)</span>
            </button>
          </div>
        </div>

        {scanMessage && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{scanMessage}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Student Roster (Left 8 cols) + Parent SMS Feed (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Student Roster Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student or RFID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
                />
              </div>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="boarded">Boarded</option>
                <option value="waiting">Waiting</option>
                <option value="missed">Missed</option>
              </select>
            </div>

            <span className="text-xs text-slate-500 font-mono tabular-nums">
              Showing {filteredStudents.length} Students
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Student Name & Roll</th>
                  <th className="py-3 px-4 font-semibold">Department & Year</th>
                  <th className="py-3 px-4 font-semibold">Boarding Station</th>
                  <th className="py-3 px-4 font-semibold">RFID Tag ID</th>
                  <th className="py-3 px-4 font-semibold">Boarding Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Tap Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const studentRoute = routes.find((r) => r.id === student.routeId);
                  const studentStop = studentRoute?.stops.find((s) => s.id === student.stopId);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="font-mono text-[11px] text-slate-500">{student.rollNumber}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800">{student.department}</div>
                        <div className="text-[11px] text-slate-500">{student.year}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{studentStop?.name}</div>
                        <div className="text-[11px] text-slate-500">{studentRoute?.code}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {student.rfidCardUid}
                      </td>

                      <td className="py-3.5 px-4">
                        {student.status === 'boarded' && (
                          <div>
                            <span className="font-semibold text-emerald-700">Boarded</span>
                            <span className="block text-[11px] text-slate-400 font-mono">{student.boardedTime}</span>
                          </div>
                        )}
                        {student.status === 'waiting' && (
                          <span className="text-blue-700 font-medium">Waiting at Stop</span>
                        )}
                        {student.status === 'missed' && (
                          <span className="text-red-700 font-medium">Missed Bus</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleSimulateScan(student)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors cursor-pointer"
                        >
                          Tap RFID
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outbound Parent Notifications Feed */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Parent Notification Gateway</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Live Dispatcher
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Real-time SMS and push notification dispatch records sent directly to guardians upon student boarding or arrival delays.
          </p>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold text-slate-900">{notif.studentName}</span>
                  <span className="font-mono text-[11px] text-slate-400">{notif.timestamp}</span>
                </div>

                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span className="font-mono">{notif.parentPhone}</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Delivered via SMS</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
