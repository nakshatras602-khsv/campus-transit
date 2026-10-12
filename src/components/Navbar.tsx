import React from 'react';
import { ViewTab, UserRole } from '../types/transit';
import { Bus, Sparkles, User, Smartphone, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  userRole,
  onRoleChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Bus className="w-5 h-5" />
            </div>
            <button
              onClick={() => onTabChange('live_tracker')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
                CampusTransit AI
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
            <button
              onClick={() => onTabChange('mobile_app')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'mobile_app' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <Smartphone className="w-4 h-4 text-blue-500" />
              <span>App Format</span>
            </button>
            <button
              onClick={() => onTabChange('live_tracker')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'live_tracker' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Live Tracker
            </button>
            <button
              onClick={() => onTabChange('admin_dashboard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'admin_dashboard' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Fleet Dashboard
            </button>
            <button
              onClick={() => onTabChange('routes')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'routes' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Routes & Stops
            </button>
            <button
              onClick={() => onTabChange('drivers')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'drivers' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Driver Profiles
            </button>
            <button
              onClick={() => onTabChange('attendance')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'attendance' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              RFID Attendance
            </button>
            <button
              onClick={() => onTabChange('delays')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'delays' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Delay Engine
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* App format toggle button */}
            <button
              onClick={() => onTabChange(currentTab === 'mobile_app' ? 'live_tracker' : 'mobile_app')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentTab === 'mobile_app'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentTab === 'mobile_app' ? 'Web Console' : 'App Format'}</span>
            </button>

            {/* Role indicator dropdown */}
            <div className="relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={userRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer pr-1"
                aria-label="Select user role"
              >
                <option value="transport_admin">Transport Admin</option>
                <option value="student_parent">Student / Parent</option>
                <option value="driver">Bus Driver</option>
              </select>
            </div>

            {/* Award-Winning Prompt Studio Button */}
            <button
              onClick={() => onTabChange('prompt_studio')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                currentTab === 'prompt_studio'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Studio</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
