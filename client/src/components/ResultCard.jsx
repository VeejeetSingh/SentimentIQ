import {
  Check,
  CheckCircle2,
  Copy,
  Frown,
  Info,
  Meh,
  Minus,
  Quote,
  Share2,
  Smile,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function ConfidenceBar({ label, value = 0, color, barColor, icon: Icon }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <span className="font-semibold text-[#817568] flex items-center gap-1.5">
          {Icon && <Icon size={13} className={color} />}
          {label}
        </span>
        <span className={`font-black ${color}`}>{pct}%</span>
      </div>
      <div className="h-2.5 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#F0E5DA]">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultCard({ result }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const sentiment = result?.sentiment || 'Neutral';
  const isPositive = sentiment === 'Positive';
  const isNeutral = sentiment === 'Neutral';
  const isNegative = sentiment === 'Negative';

  const confidencePct = Math.round((result?.confidence || 0) * 100);
  const posPct = Math.round((result?.p_positive || 0) * 100);
  const neuPct = Math.round((result?.p_neutral || 0) * 100);
  const negPct = Math.max(0, 100 - posPct - neuPct);

  useEffect(() => {
    // Only scroll if on mobile/stacked view where result is below
    if (window.innerWidth < 1280) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleCopyText = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Intelligent Contextual Explanation
  const getExplanation = () => {
    if (isPositive) {
      if (confidencePct >= 85) {
        return 'Strong positive sentiment detected. The text features distinct optimistic vocabulary, joyful phrasing, or favorable praise with high probability calibration.';
      }
      return 'Moderately positive tone. The overall sentiment leans favorable, with affirmative vocabulary outweighing negative markers.';
    }
    if (isNegative) {
      if (confidencePct >= 85) {
        return 'Strong negative sentiment detected. The text expresses clear dissatisfaction, frustration, disappointment, or critical sentiment.';
      }
      return 'Moderately negative tone. The vocabulary points to concern or dissatisfaction with subdued neutral modifiers.';
    }
    // Neutral
    return 'Balanced neutral sentiment. The statement is informational, factual, or contains balanced opposing viewpoints without significant emotional polarity.';
  };

  // Color tokens based on sentiment class
  const theme = isPositive
    ? {
        borderTop: 'border-t-[#15803D]',
        badgeBg: 'bg-[#EDFAF1]',
        badgeBorder: 'border-[#C6F0D2]',
        badgeText: 'text-[#15803D]',
        iconGradient: 'from-[#15803D] to-[#22C55E]',
        textColor: 'text-[#15803D]',
        confidenceColor: 'text-[#15803D]',
      }
    : isNegative
    ? {
        borderTop: 'border-t-[#DC2626]',
        badgeBg: 'bg-[#FEF2F2]',
        badgeBorder: 'border-[#FECACA]',
        badgeText: 'text-[#DC2626]',
        iconGradient: 'from-[#DC2626] to-[#EF4444]',
        textColor: 'text-[#DC2626]',
        confidenceColor: 'text-[#DC2626]',
      }
    : {
        borderTop: 'border-t-[#78716C]',
        badgeBg: 'bg-[#F5F5F4]',
        badgeBorder: 'border-[#E7E5E4]',
        badgeText: 'text-[#78716C]',
        iconGradient: 'from-[#78716C] to-[#A8A29E]',
        textColor: 'text-[#78716C]',
        confidenceColor: 'text-[#78716C]',
      };

  return (
    <div
      ref={cardRef}
      className={`card-premium p-6 md:p-7 border-t-4 ${theme.borderTop} scroll-mt-24 animate-scale-in`}
    >
      {/* Top Banner Verdict */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-5 border-b border-[#F0E5DA]">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${theme.iconGradient} flex items-center justify-center text-white shadow-md`}
          >
            {isPositive && <Smile size={28} className="animate-float-gentle" />}
            {isNeutral && <Meh size={28} className="animate-float-gentle" />}
            {isNegative && <Frown size={28} className="animate-float-gentle" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#817568] uppercase tracking-wider">
                Predicted Sentiment
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
              >
                Verified
              </span>
            </div>
            <p className={`text-2xl sm:text-3xl font-black ${theme.textColor} tracking-tight`}>
              {sentiment}
            </p>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="text-right">
          <p className="text-[11px] font-bold text-[#817568] uppercase tracking-wider mb-0.5">
            Model Confidence
          </p>
          <div className={`text-3xl sm:text-4xl font-black ${theme.confidenceColor} tracking-tight`}>
            {confidencePct}%
          </div>
          <div className="flex items-center gap-1 justify-end text-[11px] font-semibold text-[#817568] mt-0.5">
            {isPositive && <TrendingUp size={13} className="text-[#15803D]" />}
            {isNeutral && <Minus size={13} className="text-[#78716C]" />}
            {isNegative && <TrendingDown size={13} className="text-[#DC2626]" />}
            <span>
              {confidencePct >= 80
                ? 'High Confidence'
                : confidencePct >= 60
                ? 'Moderate Confidence'
                : 'Balanced Probability'}
            </span>
          </div>
        </div>
      </div>

      {/* Contextual Intelligent Explanation */}
      <div className="bg-[#FAF6F0] border border-[#F0E5DA] rounded-2xl p-4 mb-5">
        <div className="flex items-start gap-2.5">
          <Info size={16} className="text-[#F07824] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#211D19] mb-1">
              Analysis Breakdown
            </h4>
            <p className="text-xs text-[#817568] leading-relaxed font-medium">
              {getExplanation()}
            </p>
          </div>
        </div>
      </div>

      {/* Analyzed Tweet Quote */}
      <div className="bg-[#FFFFFF] border border-[#F0E5DA] rounded-2xl p-4 mb-5 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-[#A89F95] uppercase tracking-wider flex items-center gap-1">
            <Quote size={12} className="text-[#F07824]" />
            Analyzed Tweet
          </span>
          {result?.word_count && (
            <span className="text-[10px] font-semibold text-[#817568] bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-[#F0E5DA]">
              {result.word_count} tokens
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[#211D19] font-medium leading-relaxed italic">
          "{result?.text}"
        </p>

        {result?.cleaned_text && result.cleaned_text !== result.text && (
          <div className="mt-2 pt-2 border-t border-[#F0E5DA]/60 flex items-center gap-1.5 text-[11px] text-[#817568]">
            <span className="font-semibold text-[#A89F95]">Normalized:</span>
            <span className="truncate">{result.cleaned_text}</span>
          </div>
        )}
      </div>

      {/* Tri-Class Probability Breakdown Gauges */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#817568] uppercase tracking-wider">
            Probability Breakdown
          </span>
          <span className="text-[11px] text-[#A89F95] font-medium">
            Softmax Calibrated
          </span>
        </div>

        <ConfidenceBar
          label="Positive Sentiment"
          value={result?.p_positive || 0}
          color="text-[#15803D]"
          barColor="bg-[#15803D]"
          icon={Smile}
        />
        <ConfidenceBar
          label="Neutral Sentiment"
          value={result?.p_neutral || 0}
          color="text-[#78716C]"
          barColor="bg-[#78716C]"
          icon={Meh}
        />
        <ConfidenceBar
          label="Negative Sentiment"
          value={result?.p_negative || 0}
          color="text-[#DC2626]"
          barColor="bg-[#DC2626]"
          icon={Frown}
        />
      </div>

      {/* Segmented Distribution Bar */}
      <div className="pt-4 border-t border-[#F0E5DA]">
        <div className="h-3 bg-[#FAF6F0] rounded-full overflow-hidden flex mb-3 border border-[#F0E5DA]">
          <div
            className="h-full bg-[#15803D] transition-all duration-700"
            style={{ width: `${posPct}%` }}
            title={`Positive: ${posPct}%`}
          />
          <div
            className="h-full bg-[#78716C] transition-all duration-700"
            style={{ width: `${neuPct}%` }}
            title={`Neutral: ${neuPct}%`}
          />
          <div
            className="h-full bg-[#DC2626] transition-all duration-700"
            style={{ width: `${negPct}%` }}
            title={`Negative: ${negPct}%`}
          />
        </div>

        <div className="grid grid-cols-3 text-center gap-2">
          <div className="bg-[#EDFAF1] border border-[#C6F0D2] rounded-xl py-2">
            <p className="text-base font-black text-[#15803D]">{posPct}%</p>
            <p className="text-[10px] font-bold text-[#15803D] uppercase">Positive</p>
          </div>
          <div className="bg-[#F5F5F4] border border-[#E7E5E4] rounded-xl py-2">
            <p className="text-base font-black text-[#78716C]">{neuPct}%</p>
            <p className="text-[10px] font-bold text-[#78716C] uppercase">Neutral</p>
          </div>
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl py-2">
            <p className="text-base font-black text-[#DC2626]">{negPct}%</p>
            <p className="text-[10px] font-bold text-[#DC2626] uppercase">Negative</p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="mt-5 pt-4 border-t border-[#F0E5DA] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#FFF1E6] text-xs font-semibold text-[#817568] hover:text-[#D96317] border border-[#F0E5DA] hover:border-[#FCD8BE] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={13} className="text-[#15803D]" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#FFF1E6] text-xs font-semibold text-[#817568] hover:text-[#D96317] border border-[#F0E5DA] hover:border-[#FCD8BE] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedJson ? <Check size={13} className="text-[#15803D]" /> : <Zap size={13} />}
            <span>{copiedJson ? 'JSON Copied' : 'Copy JSON'}</span>
          </button>
        </div>

        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `SentimentIQ analyzed this tweet as ${sentiment} with ${confidencePct}% confidence! 🚀`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#FFF1E6] text-xs font-semibold text-[#817568] hover:text-[#D96317] border border-[#F0E5DA] hover:border-[#FCD8BE] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Share2 size={13} />
          <span>Share</span>
        </a>
      </div>
    </div>
  );
}
