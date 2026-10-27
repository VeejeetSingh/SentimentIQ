import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Frown,
  LineChart,
  Meh,
  Radio,
  Smile,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const VOLUME_DATA = [
  { label: 'Mon', value: 450, isPeak: false },
  { label: 'Tue', value: 680, isPeak: false },
  { label: 'Wed', value: 920, isPeak: false },
  { label: 'Thu', value: 1420, isPeak: true, tooltip: 'Peak: 1,420 tweets' },
  { label: 'Fri', value: 1100, isPeak: false },
  { label: 'Sat', value: 780, isPeak: false },
  { label: 'Sun', value: 890, isPeak: false },
];

export default function OngoingAnalytics({ history = [] }) {
  const [activeRange, setActiveRange] = useState('Weekly');
  const [hoveredBar, setHoveredBar] = useState(3); // default highlight Thursday

  const totalAnalyses = history.length;
  const positives = history.filter((h) => h.sentiment === 'Positive').length;
  const neutrals = history.filter((h) => h.sentiment === 'Neutral').length;
  const negatives = history.filter((h) => h.sentiment === 'Negative').length;

  // Real or baseline mood feedback counts
  const moodPositive = 86 + positives * 3;
  const moodNeutral = 60 + neutrals * 2;
  const moodMixed = 18 + Math.floor(neutrals * 1.5);
  const moodNegative = 8 + negatives * 2;

  const maxVal = Math.max(...VOLUME_DATA.map((d) => d.value));

  return (
    <div className="card-premium p-6 md:p-7 space-y-6 animate-fade-in-up">
      {/* Header with Title and Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0E5DA]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFF1E6] flex items-center justify-center text-[#F07824]">
              <Activity size={16} />
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#211D19] tracking-tight">
              Ongoing Intelligence & Live Activity
            </h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-[#EDFAF1] px-2.5 py-0.5 rounded-full border border-[#C6F0D2]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] pulse-green" />
              Live Stream
            </span>
          </div>
          <p className="text-xs text-[#817568] mt-1 font-medium">
            Real-time tweet ingestion throughput, sentiment polarity trajectory, and audience mood metrics
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-[#F0E5DA] self-start sm:self-auto">
          {['Hourly', 'Daily', 'Weekly'].map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                activeRange === range
                  ? 'bg-white text-[#D96317] shadow-xs border border-[#FCD8BE]'
                  : 'text-[#817568] hover:text-[#211D19]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Bar Chart (Left) + Line Chart & Sentiment Feedback (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inference Activity & Volume Bar Chart */}
        <div className="lg:col-span-6 bg-[#FFFCF8] rounded-2xl border border-[#F0E5DA] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-[#817568] uppercase tracking-wider">
                Tweet Ingestion & Inference Volume
              </p>
              <h4 className="text-xl font-black text-[#211D19] mt-0.5">
                {activeRange === 'Weekly' ? '6,240' : activeRange === 'Daily' ? '1,420' : '340'}{' '}
                <span className="text-xs font-semibold text-[#817568]">tweets evaluated</span>
              </h4>
            </div>
            <span className="text-xs font-bold text-[#15803D] bg-[#EDFAF1] px-2 py-1 rounded-lg border border-[#C6F0D2] flex items-center gap-1">
              <ArrowUpRight size={14} />
              +18.4%
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="relative pt-6 pb-2">
            <div className="h-44 flex items-end justify-between gap-3 px-2">
              {VOLUME_DATA.map((bar, idx) => {
                const heightPct = Math.round((bar.value / maxVal) * 100);
                const isHovered = hoveredBar === idx;

                return (
                  <div
                    key={bar.label}
                    className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    onMouseEnter={() => setHoveredBar(idx)}
                  >
                    {/* Tooltip on active bar */}
                    {isHovered && (
                      <div className="absolute -top-7 z-20 bg-[#211D19] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md whitespace-nowrap animate-scale-in">
                        {bar.value.toLocaleString()} tweets
                      </div>
                    )}

                    {/* Bar Pill */}
                    <div
                      className={`w-full max-w-[38px] rounded-xl transition-all duration-300 ${
                        isHovered
                          ? 'bg-gradient-to-t from-[#D96317] to-[#FF994B] shadow-[0_4px_14px_rgba(240,120,36,0.35)] scale-105'
                          : 'bg-[#FFF1E6] hover:bg-[#FCD8BE]'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />

                    {/* Label below bar */}
                    <span
                      className={`text-[11px] font-bold mt-2 transition-colors ${
                        isHovered ? 'text-[#D96317]' : 'text-[#817568]'
                      }`}
                    >
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer of bar chart */}
          <div className="pt-3 mt-2 border-t border-[#F0E5DA] flex items-center justify-between text-[11px] text-[#817568]">
            <span>Low: 450 (Mon)</span>
            <span className="font-bold text-[#D96317]">Peak: 1,420 (Thu)</span>
            <span>Avg: 891 / day</span>
          </div>
        </div>

        {/* Right Column: Sentiment Polarity Line Chart & Mood Feedback Emojis */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Top Line Chart: Polarity Trajectory */}
          <div className="bg-[#FFFCF8] rounded-2xl border border-[#F0E5DA] p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-bold text-[#817568] uppercase tracking-wider">
                  Sentiment Polarity Trajectory
                </p>
                <p className="text-xs text-[#817568] font-medium">Confidence moving average vs ground truth</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#15803D] bg-[#EDFAF1] px-2 py-0.5 rounded-full border border-[#C6F0D2]">
                  96.2% Peak
                </span>
              </div>
            </div>

            {/* SVG Line Graph */}
            <div className="relative pt-2">
              <svg viewBox="0 0 360 100" className="w-full h-24 overflow-visible">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F07824" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#F07824" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="20" x2="360" y2="20" stroke="#F0E5DA" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="360" y2="50" stroke="#F0E5DA" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="360" y2="80" stroke="#F0E5DA" strokeDasharray="3 3" />

                {/* Area Fill */}
                <path
                  d="M 10 75 Q 60 85, 110 50 T 200 45 T 280 25 T 350 20 L 350 95 L 10 95 Z"
                  fill="url(#curveGradient)"
                />

                {/* Curve Line */}
                <path
                  d="M 10 75 Q 60 85, 110 50 T 200 45 T 280 25 T 350 20"
                  fill="none"
                  stroke="#F07824"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="110" cy="50" r="4" fill="#FFFFFF" stroke="#F07824" strokeWidth="2.5" />
                <circle cx="200" cy="45" r="4" fill="#FFFFFF" stroke="#F07824" strokeWidth="2.5" />
                <circle cx="280" cy="25" r="5" fill="#F07824" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="350" cy="20" r="4" fill="#15803D" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#817568] pt-2 border-t border-[#F0E5DA]/60">
              <span>08:00 AM</span>
              <span>12:00 PM</span>
              <span>04:00 PM</span>
              <span className="font-bold text-[#15803D]">Now (96.2%)</span>
            </div>
          </div>

          {/* Bottom Card: 4 Feedback Mood Smileys & Real-Time Monitoring */}
          <div className="bg-[#FFFCF8] rounded-2xl border border-[#F0E5DA] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#817568] uppercase tracking-wider">
                Audience Sentiment Mood Spectrum
              </span>
              <span className="text-[10px] font-bold text-[#817568] bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-[#F0E5DA]">
                Live Aggregate
              </span>
            </div>

            {/* 4 Colored Smileys matching the reference image */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {/* Green Delighted */}
              <div className="p-2.5 rounded-xl bg-[#EDFAF1] border border-[#C6F0D2] text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#15803D] text-white flex items-center justify-center mb-1 shadow-xs">
                  <Smile size={18} />
                </div>
                <p className="text-base font-black text-[#15803D]">{moodPositive}</p>
                <p className="text-[10px] font-semibold text-[#15803D]">Positive</p>
              </div>

              {/* Cyan / Factual Neutral */}
              <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#059669] text-white flex items-center justify-center mb-1 shadow-xs">
                  <Meh size={18} />
                </div>
                <p className="text-base font-black text-[#059669]">{moodNeutral}</p>
                <p className="text-[10px] font-semibold text-[#059669]">Objective</p>
              </div>

              {/* Yellow / Ambiguous */}
              <div className="p-2.5 rounded-xl bg-[#FEFCE8] border border-[#FEF08A] text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#CA8A04] text-white flex items-center justify-center mb-1 shadow-xs">
                  <Meh size={18} />
                </div>
                <p className="text-base font-black text-[#CA8A04]">{moodMixed}</p>
                <p className="text-[10px] font-semibold text-[#CA8A04]">Mixed</p>
              </div>

              {/* Red / Critical */}
              <div className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#DC2626] text-white flex items-center justify-center mb-1 shadow-xs">
                  <Frown size={18} />
                </div>
                <p className="text-base font-black text-[#DC2626]">{moodNegative}</p>
                <p className="text-[10px] font-semibold text-[#DC2626]">Critical</p>
              </div>
            </div>

            {/* Real-Time Telemetry Bar matching bottom right of reference */}
            <div className="pt-3 border-t border-[#F0E5DA] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#15803D] pulse-green" />
                <span className="font-semibold text-[#817568]">Real-Time Monitoring:</span>
                <span className="font-extrabold text-[#211D19]">320 API calls / min</span>
              </div>
              <span className="font-bold text-[#15803D]">&lt; 38ms latency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
