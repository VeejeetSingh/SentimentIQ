import {
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  HelpCircle,
  History,
  LayoutDashboard,
  Radio,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', badge: null },
  { icon: Sparkles,        label: 'Analyze',   id: 'analyze',   badge: 'Core' },
  { icon: History,         label: 'History',   id: 'history',   badge: null },
  { icon: BarChart3,       label: 'Analytics', id: 'stats',     badge: 'Live' },
];

export default function Sidebar({ active, onChange, modelReady, historyCount = 0 }) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#F0E5DA] min-h-screen px-4 py-6 flex-shrink-0 justify-between select-none shadow-[1px_0_10px_rgba(33,29,25,0.02)]">
      {/* Top Section */}
      <div className="flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F07824] via-[#FF994B] to-[#D96317] flex items-center justify-center shadow-[0_4px_14px_rgba(240,120,36,0.3)]">
            <Sparkles size={20} className="text-white animate-float-gentle" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#15803D] rounded-full border-2 border-white pulse-green" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[#211D19] text-lg tracking-tight">Sentiment</span>
              <span className="font-extrabold text-[#F07824] text-lg">IQ</span>
            </div>
            <p className="text-[11px] font-medium text-[#817568] tracking-wide">
              AI Tweet Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Group */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#A89F95] uppercase tracking-wider">
              Navigation
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {mainNavItems.map(({ icon: Icon, label, id, badge }) => {
              const isActive = active === id;
              const countBadge = id === 'history' && historyCount > 0 ? historyCount : null;

              return (
                <button
                  key={id}
                  onClick={() => onChange(id)}
                  className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-[#FFF1E6] text-[#D96317] shadow-[0_1px_4px_rgba(240,120,36,0.08)]'
                      : 'text-[#817568] hover:bg-[#FAF6F0] hover:text-[#211D19]'
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-[#F07824]' : 'text-[#A89F95] group-hover:text-[#F07824]'
                    }`}
                  />
                  <span className="flex-1">{label}</span>

                  {badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isActive
                          ? 'bg-[#F07824] text-white'
                          : 'bg-[#FFF1E6] text-[#D96317] group-hover:bg-[#FCD8BE]'
                      }`}
                    >
                      {badge}
                    </span>
                  )}

                  {countBadge !== null && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#817568] border border-[#F0E5DA]">
                      {countBadge}
                    </span>
                  )}

                  {isActive && (
                    <ChevronRight size={15} className="text-[#F07824] ml-0.5 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Model Status & Metadata */}
      <div className="flex flex-col gap-3">
        {/* Model Live Status Card */}
        <div className="bg-[#FAF6F0] border border-[#F0E5DA] rounded-2xl p-3.5 shadow-sm hover:border-[#FCD8BE] transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  modelReady ? 'bg-[#15803D] pulse-green' : 'bg-[#F07824] pulse-orange'
                }`}
              />
              <span className="text-xs font-bold text-[#211D19]">
                {modelReady ? 'ML Engine Online' : 'Connecting Engine…'}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#817568] bg-white px-2 py-0.5 rounded-md border border-[#F0E5DA]">
              81.58% Acc
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-[#817568]">
            <div className="flex justify-between">
              <span>Classifier:</span>
              <span className="font-semibold text-[#211D19]">Logistic Reg</span>
            </div>
            <div className="flex justify-between">
              <span>Vectorizer:</span>
              <span className="font-semibold text-[#211D19]">TF-IDF 1.6M</span>
            </div>
            <div className="flex justify-between">
              <span>Latency:</span>
              <span className="font-semibold text-[#15803D]">&lt; 50 ms</span>
            </div>
          </div>
        </div>

        {/* User Workspace Info */}
        <div className="flex items-center gap-3 px-2 py-1 text-xs text-[#817568]">
          <div className="w-7 h-7 rounded-lg bg-[#FFF1E6] flex items-center justify-center text-[#D96317] font-bold text-xs">
            SIQ
          </div>
          <div className="flex-1 truncate">
            <p className="font-semibold text-[#211D19] truncate leading-tight">SentimentIQ Lab</p>
            <p className="text-[11px] text-[#A89F95]">Production Mode</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
