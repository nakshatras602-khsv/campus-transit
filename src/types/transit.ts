export interface Coordinate {
  x: number;
  y: number;
}

export interface Stop {
  id: string;
  name: string;
  coord: Coordinate;
  scheduledTimeMorning: string;
  scheduledTimeEvening: string;
  predictedTime: string;
  delayMinutes: number;
  studentsCount: number;
  landmark: string;
}

export interface Route {
  id: string;
  code: string;
  name: string;
  color: string;
  distanceKm: number;
  estimatedDurationMins: number;
  stops: Stop[];
  morningStartTime: string;
  eveningStartTime: string;
  pathPoints: Coordinate[];
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  emergencyContact: string;
  licenseNumber: string;
  licenseExpiry: string;
  experienceYears: number;
  rating: number;
  bloodGroup: string;
  status: 'on_duty' | 'break' | 'off_duty';
  assignedBusId: string;
  assignedRouteId: string;
  speedViolationsCount: number;
  shiftStart: string;
}

export interface Bus {
  id: string;
  number: string;
  plateNumber: string;
  routeId: string;
  driverId: string;
  status: 'in_transit' | 'at_stop' | 'delayed' | 'depot' | 'maintenance';
  currentSpeedKmh: number;
  maxSpeedLimit: number;
  fuelLevelPercent: number;
  capacityTotal: number;
  passengersOnboard: number;
  acStatus: boolean;
  cabinTempC: number;
  currentCoord: Coordinate;
  currentStopIndex: number;
  progressBetweenStops: number; // 0 to 1
  nextStopEtaMinutes: number;
  lastUpdated: string;
  activeDelayMinutes: number;
  delayReason?: string;
  sosTriggered: boolean;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  year: string;
  routeId: string;
  stopId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  rfidCardUid: string;
  avatar?: string;
  status: 'boarded' | 'waiting' | 'missed' | 'excused';
  boardedTime?: string;
}

export interface AttendanceNotification {
  id: string;
  studentId: string;
  studentName: string;
  parentPhone: string;
  type: 'boarded' | 'dropped' | 'delay_alert' | 'missed';
  message: string;
  timestamp: string;
  status: 'delivered' | 'sending';
}

export interface DelayAlert {
  id: string;
  busId: string;
  busNumber: string;
  routeCode: string;
  delayMinutes: number;
  cause: 'Heavy Traffic' | 'Road Construction' | 'Weather Delays' | 'Mechanical Check' | 'Student Boarding Queue';
  location: string;
  timestamp: string;
  resolutionStatus: 'investigating' | 'mitigated' | 'resolved';
  aiRecommendation: string;
}

export type ViewTab = 
  | 'prompt_studio' 
  | 'live_tracker' 
  | 'admin_dashboard' 
  | 'routes' 
  | 'drivers' 
  | 'attendance' 
  | 'delays' 
  | 'telemetry'
  | 'mobile_app';

export type UserRole = 'transport_admin' | 'student_parent' | 'driver';
