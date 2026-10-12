export interface PromptConfig {
  collegeName: string;
  city: string;
  fleetSize: number;
  aiPredictorEnabled: boolean;
  rfidHardwareSupport: boolean;
  parentNotificationChannel: 'SMS + WhatsApp + Push' | 'Push & Email' | 'All Multi-channel';
  targetAudience: string;
  specialFocus: 'Safety & Parent Peace of Mind' | 'Fleet Operational Efficiency' | 'Zero-Lag Real-Time Telemetry' | 'All-in-One Award Winning Full Suite';
}

export function generateAwardWinningPrompt(config: PromptConfig): string {
  return `# Comprehensive System Architecture & Engineering Prompt: Next-Gen Autonomous College Bus Fleet Command & Real-Time Student Transit Tracking System (${config.collegeName})

## 1. System Identity & Mission Statement
You are a Principal Transit Systems Architect, IoT Telemetry Specialist, and Senior Full-Stack Engineer. Your mission is to build a mission-critical, enterprise-grade **Real-Time College Bus Tracking, Route Optimization, Student RFID Attendance, and Fleet Command System** designed for **${config.collegeName}** located in **${config.city}**.

The solution must operate across three primary stakeholders:
1. **College Transport Admin & Dispatchers**: High-level command center, delay analytics, safety dispatch, roster auditing, and fleet health diagnostics.
2. **Students & Parents**: Precision bus tracking with sub-second ETA updates, geofenced proximity alerts, digital boarding passes, and instant safety notifications.
3. **Bus Drivers**: Distraction-free route navigation HUD, student check-in validator, scheduled stop sequencer, and one-touch emergency SOS alert protocol.

Focus Directive: **${config.specialFocus}**. The interface and execution must meet top-tier hackathon and production procurement standards, exhibiting zero dead buttons, high-density data legibility, fluid animated map tracking, and predictive AI intelligence.

---

## 2. Core Functional Pillars & Required Modules

### Pillar A: Live Interactive GPS Tracking & Spatial Map Simulation
- **Interactive Map Canvas**: Render the geographical transport network spanning campus corridors, arterial ring roads, and community stops with distinct route coloration.
- **Dynamic Bus Kinematics**: Animate buses moving realistically along predefined route paths with accurate heading rotation, acceleration/deceleration between stops, and dwell time when boarding at stations.
- **Real-Time Occupancy Density Heatmap Layer**: Real-time thematic heatmap shading corridors based on live bus capacity:
  * Green for &lt;50% (Nominal / Low Density)
  * Amber for 50%–74% (Moderate Density)
  * Orange for 75%–89% (High Density)
  * Crimson Red for &ge;90% (Critical / Over-Capacity Surge)
  Includes glowing thermal corridor auras, dynamic bus radial heat gradients, floating corridor capacity percentage chips, and instant interactive passenger adjustment controls.
- **Real-Time Telemetry Overlay (HUD)**: Clicking any bus displays its live coordinate feed, current speed (km/h) against the strict 50 km/h campus speed limit, battery/fuel level, AC cabin status, and distance to the next upcoming stop.
- **Geofence Arrival Detection**: Automated trigger when a bus enters a 250m geofence around any registered bus stop, updating the stop status to "Arriving Now" and triggering student boarding readiness.

### Pillar B: Comprehensive Driver Profiling & Safety Compliance
- **Driver Verification Dossier**: Full profile cards for drivers including Photo, Government Commercial Driver's License (CDL), Expiry Date, Blood Group, Emergency Contact, and Total Years of Incident-Free Service.
- **Active Duty Status & Shift Clock**: Live status indicator (On Duty, Scheduled Break, Off Duty) and shift start tracking to prevent driver fatigue.
- **Safety Rating & Telemetry Audit**: 5-star passenger rating, real-time speed violation counter, harsh braking/acceleration flags, and direct Dispatch Call/SOS link.

### Pillar C: Dynamic Route & Schedule Management
- **Shift Dual-Mode**: Seamless toggle between **Morning Pickup Schedules** (suburban origins towards Campus Hub) and **Evening Drop Schedules** (Campus Hub departing outward).
- **Stop Sequencer & Distance Metrics**: Ordered itinerary table for each route displaying Stop Name, Landmark, Distance (km), Scheduled vs. Predicted Arrival Time, and Registered Student Count.
- **Route Disruption & Detour Modeler**: Ability for dispatchers to test road blocks (construction, waterlogging) and dynamically re-calculate downstream stop ETAs.

### Pillar D: Smart Student Attendance & RFID/NFC Pass System
- **Contactless Tap-to-Board Simulator**: Interactive RFID scanner component simulating students tapping their RFID identity card or scanning a dynamic QR code upon boarding.
- **Roster by Stop & Bus**: Live passenger manifest showing student name, department, roll number, boarding stop, parent emergency contact, and status (Boarded, Scheduled/Waiting, Missed, Excused).
- **Automated Parent Notification Dispatch Log**: Dispatch preview displaying automated outbound alerts (e.g., *"Aarav has safely boarded Bus #01 at Metro Terminal at 07:16 AM"*).
- Notification Channels: ${config.parentNotificationChannel}.

### Pillar E: Intelligent Delay & Arrival Time AI Management (Powered by Gemini)
- **Predictive Delay Engine**: Continuously compares scheduled timetables against real-time kinematics, traffic density, weather anomalies, and boarding dwell times.
- **Root-Cause Analysis**: Categorizes delay incidents into 'Heavy Traffic', 'Road Construction', 'Weather Delays', 'Mechanical Diagnostic', or 'Student Queue Overrun'.
- **AI Reroute & Dispatch Advisor**: Uses Gemini reasoning to generate actionable tactical suggestions for dispatchers (e.g., *"Recommend activating Ring Bypass to circumvent 12-minute bottleneck on Grand Market Arterial"*).
- **Proactive Mass Broadcast**: Dispatcher tool to push one-click multi-channel arrival delay alerts to affected student rosters.

### Pillar F: Bus Status, Diagnostics & Emergency SOS
- **Vehicle Health Telemetry**: Live gauges for Fuel/Battery level (%), Passenger Capacity Occupancy Bar (e.g. 38/52 seats), Cabin Climate Temperature (22°C), and Tire Pressure status.
- **Emergency Panic SOS Trigger**: Prominent emergency override triggering instant vehicle lockdown, campus security notification, emergency beacon broadcasting, and dispatch center audio-visual alarms.

### Pillar G: Transport Admin Fleet Command Dashboard
- **Executive KPIs**: Total Fleet Size (${config.fleetSize} buses), Buses On Route, Depot Standbys, On-Time Punctuality Rate (Target $\\ge 95\\%$), Total Students Transported Today, and Active Incident Alerts.
- **Fleet Filter & Search**: Search by Bus Plate Number, Driver Name, Student Roll Number, or Route Code with instant client-side filtering.

---

## 3. Technology Stack & Implementation Standards

- **Framework**: React 19 + TypeScript (strict typing, zero \`any\` types).
- **Bundler & Build**: Vite with full fast reload and tree-shaking.
- **Styling**: Tailwind CSS v4 using a clean, domain-authentic transit color system (Slate neutrals, Cobalt Blue, Forest Emerald, Alert Amber, Crimson SOS).
- **Icons**: Lucide React (semantic icons for all affordances).
- **Animations & Feedback**: Smooth micro-interactions, tab transitions, and animated bus route progression.
- **Zero-Pill & Anti-Slop Discipline**: No fake status tags, no decorative floating pills on static metadata; clean tabular numbers (\`font-mono tabular-nums\`), WCAG AA contrast compliance.
- **Hardware Integration Layer (IoT)**: Standardized data model compatible with GPS trackers (Teltonika FMB920 / Queclink) and RFID readers (MFRC522 / NFC PN532 over MQTT / WebSocket).

---

## 4. Evaluation Rubric for Award-Winning Presentation

| Criteria | Standard |
| :--- | :--- |
| **Technical Rigor** | Real-time state simulation with multi-perspective views (Admin, Parent/Student, Driver) with no mock broken links. |
| **Real-World Impact** | Solves student safety anxiety, cuts waiting time in bad weather, eliminates manual paper attendance registers. |
| **AI Value-Add** | Dynamic delay prediction and natural-language dispatch advisory generation rather than basic static arithmetic. |
| **Aesthetic Polish** | Cohesive transit control room UI, legible HUD telemetry, high visual hierarchy, mobile-responsive layout. |
`;
}
