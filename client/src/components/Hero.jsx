import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Flame,
  ShieldCheck,
  Smile,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default function Hero({ onAnalyzeClick, onDemoClick }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-[#F0E5DA] p-6 md:p-8 hero-glow-bg shadow-[0_2px_12px_rgba(240,120,36,0.04)] animate-fade-in-up">
      {/* Decorative Warm Ambient Glow Circles */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-[#FF994B]/20 to-[#F07824]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-[#FFF1E6] to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Heading & Value Proposition */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E6] border border-[#FCD8BE] shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-[#F07824] pulse-orange" />
            <span className="text-xs font-bold text-[#D96317] tracking-wide">
              Sentiment140 Model Benchmark · 81.58% Accuracy
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#211D19] tracking-tight leading-[1.15]">
            Real-Time Tweet Sentiment <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#F07824] via-[#FF994B] to-[#D96317] bg-clip-text text-transparent">
              Intelligence & Analytics
            </span>
          </h2>

          <p className="text-sm text-[#817568] leading-relaxed max-w-xl font-medium">
            Evaluate text polarity in under 50ms. Powered by TF-IDF n-gram vectorization and calibrated Logistic Regression trained on 1.6 Million Stanford tweets.
          </p>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#F0E5DA] text-xs font-semibold text-[#211D19]">
              <Zap size={14} className="text-[#F07824]" />
              <span>&lt;50ms Latency</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#F0E5DA] text-xs font-semibold text-[#211D19]">
              <Cpu size={14} className="text-[#F07824]" />
              <span>TF-IDF + Logistic Reg</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#F0E5DA] text-xs font-semibold text-[#211D19]">
              <ShieldCheck size={14} className="text-[#15803D]" />
              <span>Tri-Class Calibrated</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onAnalyzeClick}
              className="btn-orange-primary px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Analyze Tweet Now</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={onDemoClick}
              className="btn-orange-soft px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <Zap size={15} className="text-[#F07824] animate-pulse" />
              <span>Instant Demo Prediction</span>
            </button>
          </div>
        </div>

        {/* Right: Floating Tweet Preview Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md animate-float-slow">
            {/* Ambient decorative back-glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F07824]/20 to-[#FF994B]/20 rounded-2xl blur-xl transform scale-95" />

            {/* Main Floating Card */}
            <div className="relative bg-white border border-[#F0E5DA] rounded-2xl p-5 shadow-[0_8px_24px_-4px_rgba(33,29,25,0.08),0_2px_6px_rgba(240,120,36,0.06)] hover:border-[#FCD8BE] transition-all">
              {/* Tweet Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F07824] to-[#FF994B] flex items-center justify-center text-white font-black text-xs shadow-xs">
                    X
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#211D19] leading-none">@tech_reviewer</p>
                    <p className="text-[10px] text-[#A89F95]">Verified Tweet Sample</p>
                  </div>
                </div>

                {/* Sentiment Pill */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EDFAF1] border border-[#C6F0D2] text-[#15803D] text-[11px] font-bold">
                  <Smile size={12} />
                  <span>96.4% Positive</span>
                </div>
              </div>

              {/* Tweet Text Content */}
              <p className="text-xs sm:text-sm text-[#211D19] font-medium leading-relaxed mb-4 bg-[#FAF6F0] p-3 rounded-xl border border-[#F0E5DA]/60">
                “SentimentIQ delivers instant, accurate tweet sentiment analysis. The calibrated tri-class probability breakdown is super clean! 🚀”
              </p>

              {/* Live Sentiment Probability Gauge */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#817568]">Model Confidence Distribution</span>
                  <span className="text-[#15803D]">High Confidence</span>
                </div>
                <div className="h-2 w-full bg-[#FAF6F0] rounded-full overflow-hidden flex border border-[#F0E5DA]">
                  <div className="bg-[#15803D] h-full" style={{ width: '96.4%' }} title="Positive: 96.4%" />
                  <div className="bg-[#78716C] h-full" style={{ width: '2.4%' }} title="Neutral: 2.4%" />
                  <div className="bg-[#DC2626] h-full" style={{ width: '1.2%' }} title="Negative: 1.2%" />
                </div>
                <div className="flex justify-between text-[10px] text-[#817568] pt-0.5">
                  <span className="text-[#15803D] font-semibold">96.4% Pos</span>
                  <span className="text-[#78716C]">2.4% Neu</span>
                  <span className="text-[#DC2626]">1.2% Neg</span>
                </div>
              </div>
            </div>

            {/* Small Floating Micro-Badge */}
            <div className="absolute -bottom-3 -right-2 bg-white border border-[#F0E5DA] shadow-lg rounded-xl px-3 py-1.5 flex items-center gap-2 animate-float-gentle">
              <span className="w-2 h-2 rounded-full bg-[#15803D] pulse-green" />
              <span className="text-[11px] font-bold text-[#211D19]">Inference: 38ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
