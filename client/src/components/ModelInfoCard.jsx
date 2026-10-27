import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  FileText,
  Filter,
  Gauge,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

const PIPELINE_STEPS = [
  {
    step: '01',
    name: 'Raw Input',
    desc: 'Tweet or text statement',
    icon: FileText,
  },
  {
    step: '02',
    name: 'Regex Cleaning',
    desc: 'URLs, handles, emojis parsed',
    icon: Filter,
  },
  {
    step: '03',
    name: 'TF-IDF Matrix',
    desc: '1.6M unigram & bigram features',
    icon: Layers,
  },
  {
    step: '04',
    name: 'Logistic Reg',
    desc: 'L2 calibrated classification',
    icon: Brain,
  },
  {
    step: '05',
    name: 'Verdict Output',
    desc: 'Calibrated Pos / Neu / Neg',
    icon: Sparkles,
  },
];

export default function ModelInfoCard() {
  return (
    <div className="card-premium p-6 md:p-7 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F0E5DA]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF1E6] border border-[#FCD8BE] flex items-center justify-center text-[#F07824] shadow-xs">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-[#211D19]">
              Machine Learning Architecture & Pipeline
            </h3>
            <p className="text-xs text-[#817568] font-medium">
              Sentiment140 Model Specifications & Decision Mechanics
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDFAF1] border border-[#C6F0D2] text-[#15803D] text-xs font-bold">
          <CheckCircle2 size={13} />
          <span>81.58% Test Accuracy</span>
        </div>
      </div>

      {/* 5-Step Visual Pipeline */}
      <div className="mb-6">
        <p className="text-xs font-bold text-[#817568] uppercase tracking-wider mb-3">
          End-to-End Prediction Pipeline
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PIPELINE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === PIPELINE_STEPS.length - 1;

            return (
              <div
                key={step.step}
                className={`relative p-3.5 rounded-2xl border transition-all ${
                  isLast
                    ? 'bg-[#FFF1E6] border-[#FCD8BE]'
                    : 'bg-[#FAF6F0] border-[#F0E5DA] hover:border-[#FCD8BE]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                      isLast
                        ? 'bg-[#F07824] text-white'
                        : 'bg-white text-[#817568] border border-[#F0E5DA]'
                    }`}
                  >
                    {step.step}
                  </span>
                  <Icon
                    size={15}
                    className={isLast ? 'text-[#D96317]' : 'text-[#F07824]'}
                  />
                </div>

                <p className="text-xs font-extrabold text-[#211D19] leading-tight">
                  {step.name}
                </p>
                <p className="text-[11px] text-[#817568] font-medium mt-1 leading-snug">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-[#F0E5DA]">
        <div className="p-3 rounded-xl bg-white border border-[#F0E5DA]">
          <span className="text-[10px] font-bold text-[#A89F95] uppercase">Algorithm</span>
          <p className="text-xs font-extrabold text-[#211D19] mt-0.5">Logistic Regression</p>
          <p className="text-[10px] text-[#817568]">L2 Regularization · Sublinear scaling</p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#F0E5DA]">
          <span className="text-[10px] font-bold text-[#A89F95] uppercase">Feature Extractor</span>
          <p className="text-xs font-extrabold text-[#211D19] mt-0.5">TF-IDF N-Grams</p>
          <p className="text-[10px] text-[#817568]">1.6M vocabulary · (1, 2) n-grams</p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#F0E5DA]">
          <span className="text-[10px] font-bold text-[#A89F95] uppercase">Training Corpus</span>
          <p className="text-xs font-extrabold text-[#211D19] mt-0.5">Sentiment140 Dataset</p>
          <p className="text-[10px] text-[#817568]">1,600,000 Stanford labeled tweets</p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#F0E5DA]">
          <span className="text-[10px] font-bold text-[#A89F95] uppercase">Inference Speed</span>
          <p className="text-xs font-extrabold text-[#15803D] mt-0.5">&lt; 50ms Average</p>
          <p className="text-[10px] text-[#817568]">Optimized Sparse CSR Matrix</p>
        </div>
      </div>
    </div>
  );
}
