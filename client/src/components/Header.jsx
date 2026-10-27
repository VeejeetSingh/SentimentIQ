import {
  Bell,
  CheckCircle2,
  Clock,
  Menu,
  Search,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const mobileNavItems = [
  { label: 'Dashboard', id: 'dashboard' },
  { label: 'Analyze Sentiment', id: 'analyze' },
  { label: 'Session History', id: 'history' },
  { label: 'Analytics & Distribution', id: 'stats' },
];

export default function Header({
  active,
  onChange,
  modelReady,
  searchQuery = '',
  onSearchChange = () => {},
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'ML Model Ready',
      desc: 'TF-IDF Vectorizer & Logistic Regression loaded with 81.58% accuracy.',
      time: 'Just now',
      unread: true,
    },
    {
      id: 2,
      title: 'Tri-Class Probability Calibration',
      desc: 'Softmax boundaries calibrated for Positive, Neutral, and Negative zones.',
      time: '5m ago',
      unread: false,
    },
    {
      id: 3,
      title: 'Sentiment140 Benchmark Active',
      desc: 'Evaluating on 1.6 Million Stanford tweet training corpus.',
      time: '1h ago',
      unread: false,
    },
  ];

  const getPageTitle = () => {
    switch (active) {
      case 'dashboard':
        return {
          title: 'Intelligence Dashboard',
          subtitle: 'Live tweet sentiment analysis powered by TF-IDF & Logistic Regression',
        };
      case 'analyze':
        return {
          title: 'Tweet Sentiment Classifier',
          subtitle: 'Predict polarity, probability distribution, and calibrated confidence',
        };
      case 'history':
        return {
          title: 'Analysis History',
          subtitle: 'Review recent predictions and filter past session analyses',
        };
      case 'stats':
        return {
          title: 'Sentiment Analytics',
          subtitle: 'Distribution metrics, sentiment breakdown, and session performance',
        };
      default:
        return {
          title: 'SentimentIQ Dashboard',
          subtitle: 'AI-Powered tweet sentiment intelligence',
        };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#F0E5DA] px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#817568] hover:text-[#211D19] hover:bg-[#FAF6F0] border border-[#F0E5DA] transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden sm:block">
            <h1 className="text-xl md:text-2xl font-black text-[#211D19] tracking-tight leading-none">
              {title}
            </h1>
            <p className="text-xs text-[#817568] mt-1 line-clamp-1 font-medium">
              {subtitle}
            </p>
          </div>

          <div className="sm:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F07824] to-[#D96317] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <Sparkles size={16} />
            </div>
            <span className="font-extrabold text-[#211D19] text-base">Sentiment<span className="text-[#F07824]">IQ</span></span>
          </div>
        </div>

        {/* Right: Search, Status, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89F95]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search analyses or tweets…"
              className="w-full bg-[#FAF6F0] border border-[#F0E5DA] rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-[#211D19] placeholder:text-[#A89F95] focus-orange transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A89F95] hover:text-[#211D19] p-0.5 rounded"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Model Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF1E6] border border-[#FCD8BE]">
            <span
              className={`w-2 h-2 rounded-full ${
                modelReady ? 'bg-[#15803D] pulse-green' : 'bg-[#F07824] pulse-orange'
              }`}
            />
            <span className="text-xs font-bold text-[#D96317]">
              {modelReady ? 'Live Inference' : 'Connecting…'}
            </span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-[#817568] hover:text-[#211D19] hover:bg-[#FAF6F0] border border-[#F0E5DA] transition-all"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F07824] rounded-full border border-white" />
            </button>

            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotifOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#F0E5DA] rounded-2xl shadow-xl z-50 p-4 animate-scale-in">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0E5DA]">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-[#F07824]" />
                      <h3 className="text-sm font-bold text-[#211D19]">System Activity</h3>
                    </div>
                    <span className="text-[10px] font-semibold text-[#15803D] bg-[#EDFAF1] px-2 py-0.5 rounded-full border border-[#C6F0D2]">
                      Active
                    </span>
                  </div>

                  <div className="divide-y divide-[#FAF6F0] mt-1 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-2.5 px-1 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#211D19] flex items-center gap-1.5">
                            {n.unread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F07824]" />
                            )}
                            {n.title}
                          </p>
                          <span className="text-[10px] text-[#A89F95]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#817568] leading-tight">{n.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#F0E5DA] text-center">
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-xs font-semibold text-[#D96317] hover:text-[#F07824]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Badge (Interactive AI Workspace Dropdown) */}
          <div className="relative pl-1">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFF1E6] via-[#FDE6D2] to-[#FCD8BE] border border-[#FCD8BE] flex items-center justify-center text-[#D96317] font-extrabold text-xs shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
              title="SentimentIQ AI Workspace"
              aria-label="AI Workspace Profile"
            >
              AI
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#15803D] rounded-full border-2 border-white pulse-green" />
            </button>

            {/* Profile & Engine Details Popover */}
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-84 bg-white border border-[#F0E5DA] rounded-2xl shadow-2xl z-50 p-5 animate-scale-in">
                  {/* Top info */}
                  <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#F0E5DA]">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F07824] to-[#D96317] flex items-center justify-center text-white font-black text-sm shadow-sm">
                      SIQ
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-black text-[#211D19] leading-tight truncate">
                          SentimentIQ Lab
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#EDFAF1] text-[#15803D] border border-[#C6F0D2]">
                          Pro
                        </span>
                      </div>
                      <p className="text-[11px] text-[#817568] font-medium truncate">
                        Production ML Environment · v1.4
                      </p>
                    </div>
                  </div>

                  {/* Engine Specs Grid */}
                  <div className="space-y-2 mb-4 bg-[#FAF6F0] p-3 rounded-xl border border-[#F0E5DA] text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#817568] font-medium">Model Engine:</span>
                      <span className="font-bold text-[#211D19]">Logistic Regression</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#817568] font-medium">Feature Matrix:</span>
                      <span className="font-bold text-[#211D19]">TF-IDF 1.6M N-grams</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#817568] font-medium">Accuracy Benchmark:</span>
                      <span className="font-bold text-[#15803D]">81.58% Verified</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#817568] font-medium">Avg. Latency:</span>
                      <span className="font-bold text-[#15803D]">&lt; 38 ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#817568] font-medium">Inference Endpoint:</span>
                      <span className="font-mono text-[10px] text-[#D96317] font-semibold">/api/analyze</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('http://localhost:3001/api/analyze');
                        alert('API Endpoint copied: http://localhost:3001/api/analyze');
                        setProfileOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#FFF1E6] hover:bg-[#FCD8BE] text-xs font-bold text-[#D96317] border border-[#FCD8BE] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap size={13} />
                      <span>Copy Ingestion Endpoint</span>
                    </button>

                    <button
                      onClick={() => {
                        window.location.reload();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#F0E5DA] text-xs font-semibold text-[#817568] hover:text-[#211D19] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Refresh Telemetry & Session</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#F0E5DA] animate-fade-in-up">
          <div className="flex flex-col gap-1.5">
            {mobileNavItems.map(({ label, id }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    onChange(id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-[#FFF1E6] text-[#D96317] border border-[#FCD8BE]'
                      : 'text-[#817568] hover:bg-[#FAF6F0]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Mobile search bar */}
          <div className="mt-3 pt-3 border-t border-[#F0E5DA]">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89F95]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search analyses or tweets…"
                className="w-full bg-[#FAF6F0] border border-[#F0E5DA] rounded-xl pl-8 pr-4 py-2 text-xs font-medium text-[#211D19] focus-orange"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
