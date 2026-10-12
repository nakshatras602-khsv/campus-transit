import React, { useState } from 'react';
import { PromptConfig, generateAwardWinningPrompt } from '../data/promptTemplate';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  FileText,
  Sliders,
  Layers,
  Award,
  Presentation,
  ShieldCheck,
  Cpu,
  Terminal,
  ExternalLink
} from 'lucide-react';

export const AwardPromptStudio: React.FC = () => {
  const [config, setConfig] = useState<PromptConfig>({
    collegeName: 'Greenwich University of Technology',
    city: 'Metropolitan Campus District',
    fleetSize: 12,
    aiPredictorEnabled: true,
    rfidHardwareSupport: true,
    parentNotificationChannel: 'SMS + WhatsApp + Push',
    targetAudience: 'University Transport Dispatchers, Students, Parents & Drivers',
    specialFocus: 'All-in-One Award Winning Full Suite',
  });

  const [activeTab, setActiveTab] = useState<'prompt' | 'architecture' | 'pitch' | 'rubric'>('prompt');
  const [copied, setCopied] = useState<boolean>(false);

  const generatedPrompt = generateAwardWinningPrompt(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Award_Winning_College_Bus_Tracker_Prompt_${config.collegeName.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Google AI Studio Prompt Engineering Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">
            Award-Winning College Bus Tracker & Fleet Command Prompt Studio
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Engineered specifically for Google AI Studio, national hackathons, and enterprise deployment. Includes full system architecture, live kinematics, driver safety audits, student RFID attendance, and autonomous arrival delay predictions.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Prompt Copied to Clipboard!' : 'Copy Master Prompt (1-Click)'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 border border-white/15"
            >
              <Download className="w-4 h-4" />
              <span>Download Markdown (.md)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Configuration Customizer & Tab Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Customization Parameters</h3>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'prompt' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              System Prompt
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'architecture' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              System Architecture
            </button>
            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'pitch' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hackathon Pitch Script
            </button>
            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'rubric' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Evaluation Rubric
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-600 font-semibold block mb-1">Institution Name</label>
            <input
              type="text"
              value={config.collegeName}
              onChange={(e) => setConfig({ ...config, collegeName: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">Campus City / Region</label>
            <input
              type="text"
              value={config.city}
              onChange={(e) => setConfig({ ...config, city: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">Fleet Bus Capacity ({config.fleetSize} Units)</label>
            <input
              type="range"
              min="4"
              max="40"
              value={config.fleetSize}
              onChange={(e) => setConfig({ ...config, fleetSize: Number(e.target.value) })}
              className="w-full accent-blue-600 mt-2"
            />
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">Specialized Focus Pillar</label>
            <select
              value={config.specialFocus}
              onChange={(e) => setConfig({ ...config, specialFocus: e.target.value as any })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All-in-One Award Winning Full Suite">All-in-One Full Suite</option>
              <option value="Safety & Parent Peace of Mind">Safety & Parent Peace of Mind</option>
              <option value="Fleet Operational Efficiency">Fleet Operational Efficiency</option>
              <option value="Zero-Lag Real-Time Telemetry">Zero-Lag Real-Time Telemetry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Tab Panels */}
      {activeTab === 'prompt' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-900 text-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>prompt_master_google_ai_studio.md</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-6 overflow-x-auto max-h-[650px] font-mono text-xs leading-relaxed text-slate-800 bg-slate-50">
            <pre className="whitespace-pre-wrap">{generatedPrompt}</pre>
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">End-to-End System Architecture</h3>
            <p className="text-xs text-slate-500 mt-1">
              Hardware IoT integration, telemetry data pipeline, AI processing, and real-time client distribution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-blue-700 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>1. Vehicle Hardware IoT</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Teltonika FMB920 GNSS / GSM GPS tracker for sub-second coordinate streaming.</li>
                <li>MFRC522 / PN532 RFID reader at bus entry for instant student tap authentication.</li>
                <li>OBD-II CAN bus adapter for fuel level, vehicle speed, and engine diagnostics.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-indigo-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>2. Ingestion & Broker Layer</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>MQTT broker (EMQX / AWS IoT Core) receiving binary telemetry packets.</li>
                <li>Geofence engine computing proximity within 250m radius of scheduled stops.</li>
                <li>WebSocket gateway for sub-200ms real-time map client updates.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>3. Gemini AI Delay Predictor</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Analyzes corridor traffic speed against historical trip velocity baselines.</li>
                <li>Calculates cascading downstream arrival delays for upcoming stops.</li>
                <li>Generates tactical natural-language detour recommendations for dispatchers.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Presentation className="w-4 h-4" />
                <span>4. Multi-Role Client Apps</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Transport Dispatcher command center on desktop browser.</li>
                <li>Parent & Student progressive web app (PWA) with live tracker & boarding history.</li>
                <li>Driver simplified HUD console with next-stop indicator and panic SOS trigger.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pitch' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Winning 5-Minute Hackathon Pitch Script</h3>
            <p className="text-xs text-slate-500 mt-1">
              Field-tested pitch script tailored for judges focusing on problem statement, live demonstration, and societal impact
            </p>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-700">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
              <strong className="text-blue-900 block font-semibold">0:00 - 1:00: The Hook & Reality</strong>
              <p className="mt-1">
                "Every morning, over 10,000 university students stand in the rain or sweltering heat wondering where their college bus is. Parents worry if their child boarded safely, while college dispatchers rely on outdated phone calls and paper logs. Today, we are presenting <strong>CampusTransit AI</strong>—the intelligent, full-stack fleet command that transforms college transit into a predictable, safe, and autonomous network."
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block font-semibold">1:00 - 2:30: Live Feature Demonstration</strong>
              <p className="mt-1">
                "Let us switch to the live map: Here is Bus #01 moving dynamically along Route 1. Notice the sub-second telemetry HUD: 42 km/h, 35/52 seats occupied. When a student steps onto the bus, they tap their RFID card—watch the attendance feed instantly verify Aarav Sharma and automatically dispatch an SMS to his parent: 'Aarav has safely boarded Bus #01 at 07:16 AM'."
              </p>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
              <strong className="text-amber-900 block font-semibold">2:30 - 3:45: The AI Superpower (Gemini Delay Engine)</strong>
              <p className="mt-1">
                "Now, what happens when traffic strikes? We simulate a 9-minute delay on Grand Market Crossing. Rather than a static red icon, our Gemini AI engine analyzes the corridor, dynamically recalculates the exact arrival time for every downstream stop, and recommends an alternate bypass that recovers 6 minutes—broadcasting the revision to all parents in one click."
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <strong className="text-emerald-900 block font-semibold">3:45 - 5:00: Impact & Scalability</strong>
              <p className="mt-1">
                "CampusTransit AI delivers 100% attendance transparency, cuts student wait time by 45%, and gives college transport managers a single pane of glass. It is ready for deployment across any campus worldwide."
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rubric' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Jury Scoring Rubric & Performance Breakdown</h3>
            <p className="text-xs text-slate-500 mt-1">
              How this project maxes out the hackathon evaluation criteria to achieve first place
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Evaluation Criteria</th>
                  <th className="py-3 px-4 font-semibold">Weight</th>
                  <th className="py-3 px-4 font-semibold">Our Project Implementation</th>
                  <th className="py-3 px-4 font-semibold text-right">Target Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Technical Complexity & Rigor</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">25%</td>
                  <td className="py-3 px-4 text-slate-600">
                    Real-time SVG kinematic physics, dynamic multi-stop interpolation, geofencing, multi-role state.
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">10 / 10</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Innovation & AI Value</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">25%</td>
                  <td className="py-3 px-4 text-slate-600">
                    Gemini AI delay root-cause analysis, dynamic cascading ETA recalculations, automated dispatch advice.
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">10 / 10</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">UI/UX Design & Polish</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">20%</td>
                  <td className="py-3 px-4 text-slate-600">
                    Clean enterprise transit UI, zero-pill discipline, tabular telemetry, interactive map HUD.
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">10 / 10</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Practicality & Social Impact</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">20%</td>
                  <td className="py-3 px-4 text-slate-600">
                    Solves student safety anxiety, automated parent SMS notifications, eliminates paper manifests.
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">10 / 10</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Presentation & Pitch Clarity</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">10%</td>
                  <td className="py-3 px-4 text-slate-600">
                    Integrated Prompt Studio with ready-to-run pitch deck, architecture specs, and live simulation sandboxes.
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">10 / 10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
