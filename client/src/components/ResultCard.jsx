import { Frown, Meh, Minus, Smile, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';

function ConfidenceBar({ label, value = 0, color, barGradient }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className={`text-xs font-bold ${color}`}>{pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barGradient}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultCard({ result }) {
  const cardRef = useRef(null);
  const sentiment = result.sentiment || 'Neutral';
  const isPositive = sentiment === 'Positive';
  const isNeutral = sentiment === 'Neutral';
  const isNegative = sentiment === 'Negative';

  const confidencePct = Math.round((result.confidence || 0) * 100);

  const posPct = Math.round((result.p_positive || 0) * 100);
  const neuPct = Math.round((result.p_neutral || 0) * 100);
  const negPct = Math.max(0, 100 - posPct - neuPct);

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [result]);

  const borderClass = isPositive
    ? 'border-t-emerald-500'
    : isNeutral
    ? 'border-t-sky-500'
    : 'border-t-red-500';

  const iconBg = isPositive
    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
    : isNeutral
    ? 'bg-gradient-to-br from-sky-400 to-blue-500'
    : 'bg-gradient-to-br from-red-400 to-red-600';

  const textColor = isPositive
    ? 'text-emerald-600'
    : isNeutral
    ? 'text-sky-600'
    : 'text-red-600';

  return (
    <div
      ref={cardRef}
      className={`card p-6 animate-fade-in-up border-t-4 ${borderClass}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${iconBg}`}>
            {isPositive && <Smile size={24} className="text-white" />}
            {isNeutral && <Meh size={24} className="text-white" />}
            {isNegative && <Frown size={24} className="text-white" />}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Sentiment</p>
            <p className={`text-2xl font-bold ${textColor}`}>
              {sentiment}
            </p>
          </div>
        </div>

        {/* Confidence gauge */}
        <div className="text-right">
          <p className="text-xs text-slate-400 font-medium mb-1">Confidence</p>
          <div className={`text-4xl font-black ${textColor}`}>
            {confidencePct}%
          </div>
          <div className="flex items-center gap-1 justify-end mt-0.5">
            {isPositive && <TrendingUp size={13} className="text-emerald-400" />}
            {isNeutral && <Minus size={13} className="text-sky-400" />}
            {isNegative && <TrendingDown size={13} className="text-red-400" />}
            <span className="text-xs text-slate-400">
              {isNeutral
                ? 'Balanced sentiment'
                : confidencePct >= 80
                ? 'High confidence'
                : confidencePct >= 60
                ? 'Moderate confidence'
                : 'Low confidence'}
            </span>
          </div>
        </div>
      </div>

      {/* Analyzed text */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-5">
        <p className="text-xs text-slate-400 font-medium mb-1">Analyzed Text</p>
        <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{result.text}</p>
      </div>

      {/* Probability Bars (Positive, Neutral, Negative) */}
      <div className="space-y-3 mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Probability Breakdown</p>
        <ConfidenceBar
          label="Positive"
          value={result.p_positive || 0}
          color="text-emerald-600"
          barGradient="bg-gradient-to-r from-emerald-400 to-emerald-500"
        />
        <ConfidenceBar
          label="Neutral"
          value={result.p_neutral || 0}
          color="text-sky-600"
          barGradient="bg-gradient-to-r from-sky-400 to-blue-500"
        />
        <ConfidenceBar
          label="Negative"
          value={result.p_negative || 0}
          color="text-red-500"
          barGradient="bg-gradient-to-r from-red-400 to-red-500"
        />
      </div>

      {/* 3-way Segmented distribution bar */}
      <div className="pt-4 border-t border-slate-100">
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex mb-3">
          <div
            className="h-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${posPct}%` }}
            title={`Positive: ${posPct}%`}
          />
          <div
            className="h-full bg-sky-500 transition-all duration-700"
            style={{ width: `${neuPct}%` }}
            title={`Neutral: ${neuPct}%`}
          />
          <div
            className="h-full bg-red-500 transition-all duration-700"
            style={{ width: `${negPct}%` }}
            title={`Negative: ${negPct}%`}
          />
        </div>

        <div className="grid grid-cols-3 text-center">
          <div>
            <p className="text-base font-bold text-emerald-600">{posPct}%</p>
            <p className="text-xs text-slate-400">Positive</p>
          </div>
          <div>
            <p className="text-base font-bold text-sky-600">{neuPct}%</p>
            <p className="text-xs text-slate-400">Neutral</p>
          </div>
          <div>
            <p className="text-base font-bold text-red-500">{negPct}%</p>
            <p className="text-xs text-slate-400">Negative</p>
          </div>
        </div>
      </div>
    </div>
  );
}
