import {
  Activity,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Flame,
  Frown,
  Layers,
  Meh,
  PieChart,
  Smile,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

// Custom Interactive SVG Donut Chart
function DonutChart({ posPct = 0, neuPct = 0, negPct = 0, total = 0 }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const radius = 64;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dash offsets
  const posLength = (posPct / 100) * circumference;
  const neuLength = (neuPct / 100) * circumference;
  const negLength = (negPct / 100) * circumference;

  const posOffset = 0;
  const neuOffset = -posLength;
  const negOffset = -(posLength + neuLength);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 180 180" className="transform -rotate-90 overflow-visible">
        {/* Background track circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="transparent"
          stroke="#FAF6F0"
          strokeWidth={strokeWidth}
        />

        {/* Positive Arc */}
        {posPct > 0 && (
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="#15803D"
            strokeWidth={hoveredSlice === 'pos' ? strokeWidth + 4 : strokeWidth}
            strokeDasharray={`${posLength} ${circumference}`}
            strokeDashoffset={posOffset}
            strokeLinecap="butt"
            className="transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredSlice('pos')}
            onMouseLeave={() => setHoveredSlice(null)}
          />
        )}

        {/* Neutral Arc */}
        {neuPct > 0 && (
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="#78716C"
            strokeWidth={hoveredSlice === 'neu' ? strokeWidth + 4 : strokeWidth}
            strokeDasharray={`${neuLength} ${circumference}`}
            strokeDashoffset={neuOffset}
            strokeLinecap="butt"
            className="transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredSlice('neu')}
            onMouseLeave={() => setHoveredSlice(null)}
          />
        )}

        {/* Negative Arc */}
        {negPct > 0 && (
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="#DC2626"
            strokeWidth={hoveredSlice === 'neg' ? strokeWidth + 4 : strokeWidth}
            strokeDasharray={`${negLength} ${circumference}`}
            strokeDashoffset={negOffset}
            strokeLinecap="butt"
            className="transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredSlice('neg')}
            onMouseLeave={() => setHoveredSlice(null)}
          />
        )}
      </svg>

      {/* Center Statistic Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-2xl font-black text-[#211D19] leading-none">
          {hoveredSlice === 'pos'
            ? `${posPct}%`
            : hoveredSlice === 'neu'
            ? `${neuPct}%`
            : hoveredSlice === 'neg'
            ? `${negPct}%`
            : total}
        </span>
        <span className="text-[10px] font-bold text-[#817568] uppercase tracking-wider mt-0.5">
          {hoveredSlice === 'pos'
            ? 'Positive'
            : hoveredSlice === 'neu'
            ? 'Neutral'
            : hoveredSlice === 'neg'
            ? 'Negative'
            : 'Total Analyses'}
        </span>
      </div>
    </div>
  );
}

export default function StatsView({ history = [], onNavigateToAnalyze = () => {} }) {
  const total = history.length;
  const positives = history.filter((h) => h.sentiment === 'Positive').length;
  const neutrals = history.filter((h) => h.sentiment === 'Neutral').length;
  const negatives = history.filter((h) => h.sentiment === 'Negative').length;

  const avgConf =
    total > 0
      ? history.reduce((sum, item) => sum + (item.confidence || 0), 0) / total
      : 0;

  const highConfCount = history.filter((h) => (h.confidence || 0) >= 0.8).length;
  const modConfCount = history.filter(
    (h) => (h.confidence || 0) >= 0.6 && (h.confidence || 0) < 0.8
  ).length;
  const lowConfCount = history.filter((h) => (h.confidence || 0) < 0.6).length;

  if (total === 0) {
    return (
      <div className="card-premium p-10 md:p-14 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-3xl bg-[#FFF1E6] border border-[#FCD8BE] flex items-center justify-center mx-auto mb-4 text-[#F07824] shadow-sm">
          <PieChart size={30} />
        </div>
        <h3 className="text-lg font-black text-[#211D19] mb-1">
          No Session Data Yet
        </h3>
        <p className="text-xs text-[#817568] max-w-sm mx-auto mb-5 leading-relaxed font-medium">
          Start by analyzing a tweet or review to generate real-time sentiment distribution charts and metrics.
        </p>
        <button
          onClick={onNavigateToAnalyze}
          className="btn-orange-primary px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <Sparkles size={14} />
          <span>Go to Tweet Analyzer</span>
        </button>
      </div>
    );
  }

  const posPct = Math.round((positives / total) * 100);
  const neuPct = Math.round((neutrals / total) * 100);
  const negPct = Math.max(0, 100 - posPct - neuPct);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Grid: Donut Chart + Sentiment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Donut Chart */}
        <div className="lg:col-span-5 card-premium p-6 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between pb-3 border-b border-[#F0E5DA]">
            <div className="flex items-center gap-2">
              <PieChart size={16} className="text-[#F07824]" />
              <h3 className="text-sm font-bold text-[#211D19]">
                Sentiment Distribution
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#817568] bg-[#FAF6F0] px-2 py-0.5 rounded-full border border-[#F0E5DA]">
              {total} samples
            </span>
          </div>

          <div className="py-6">
            <DonutChart posPct={posPct} neuPct={neuPct} negPct={negPct} total={total} />
          </div>

          {/* Interactive Legend */}
          <div className="w-full grid grid-cols-3 gap-2 pt-4 border-t border-[#F0E5DA] text-center">
            <div className="p-2 rounded-xl bg-[#EDFAF1] border border-[#C6F0D2]">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                <span className="text-[10px] font-bold text-[#15803D] uppercase">Positive</span>
              </div>
              <p className="text-base font-black text-[#15803D]">{posPct}%</p>
              <p className="text-[10px] text-[#817568]">{positives} tweets</p>
            </div>

            <div className="p-2 rounded-xl bg-[#F5F5F4] border border-[#E7E5E4]">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#78716C]" />
                <span className="text-[10px] font-bold text-[#78716C] uppercase">Neutral</span>
              </div>
              <p className="text-base font-black text-[#78716C]">{neuPct}%</p>
              <p className="text-[10px] text-[#817568]">{neutrals} tweets</p>
            </div>

            <div className="p-2 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                <span className="text-[10px] font-bold text-[#DC2626] uppercase">Negative</span>
              </div>
              <p className="text-base font-black text-[#DC2626]">{negPct}%</p>
              <p className="text-[10px] text-[#817568]">{negatives} tweets</p>
            </div>
          </div>
        </div>

        {/* Right Card: Detailed Breakdown & Confidence Gauges */}
        <div className="lg:col-span-7 card-premium p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E5DA]">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[#F07824]" />
              <h3 className="text-sm font-bold text-[#211D19]">
                Session Analytics Overview
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#15803D] bg-[#EDFAF1] px-2.5 py-0.5 rounded-full border border-[#C6F0D2]">
              Live Feed
            </span>
          </div>

          {/* Quick Metrics 3-up */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#F0E5DA]">
              <p className="text-[11px] font-bold text-[#817568] uppercase">Average Confidence</p>
              <p className="text-2xl font-black text-[#211D19] mt-0.5">
                {Math.round(avgConf * 100)}%
              </p>
              <p className="text-[10px] text-[#15803D] font-semibold mt-1 flex items-center gap-1">
                <TrendingUp size={11} /> High Reliability
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#F0E5DA]">
              <p className="text-[11px] font-bold text-[#817568] uppercase">Dominant Class</p>
              <p className="text-2xl font-black text-[#F07824] mt-0.5">
                {positives >= negatives && positives >= neutrals
                  ? 'Positive'
                  : negatives >= neutrals
                  ? 'Negative'
                  : 'Neutral'}
              </p>
              <p className="text-[10px] text-[#817568] mt-1 font-medium">Session Majority</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#F0E5DA]">
              <p className="text-[11px] font-bold text-[#817568] uppercase">Model Acc Benchmark</p>
              <p className="text-2xl font-black text-[#D96317] mt-0.5">
                81.58%
              </p>
              <p className="text-[10px] text-[#817568] mt-1 font-medium">Sentiment140 Split</p>
            </div>
          </div>

          {/* Confidence Tier Breakdown */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-[#817568] uppercase tracking-wider">
              Confidence Stratification
            </p>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#211D19]">
                  High Confidence (≥ 80%)
                </span>
                <span className="font-bold text-[#15803D]">
                  {highConfCount} ({total > 0 ? Math.round((highConfCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="h-2 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#F0E5DA]">
                <div
                  className="h-full bg-[#15803D] rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (highConfCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#211D19]">
                  Moderate Confidence (60% – 79%)
                </span>
                <span className="font-bold text-[#F07824]">
                  {modConfCount} ({total > 0 ? Math.round((modConfCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="h-2 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#F0E5DA]">
                <div
                  className="h-full bg-[#F07824] rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (modConfCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#211D19]">
                  Balanced / Low Confidence (&lt; 60%)
                </span>
                <span className="font-bold text-[#78716C]">
                  {lowConfCount} ({total > 0 ? Math.round((lowConfCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="h-2 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#F0E5DA]">
                <div
                  className="h-full bg-[#78716C] rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (lowConfCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
