import {
  BarChart3,
  Brain,
  ChevronRight,
  CircleCheck,
  History,
  LayoutDashboard,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Brain,           label: 'Analyze',   id: 'analyze' },
  { icon: History,         label: 'History',   id: 'history' },
  { icon: BarChart3,       label: 'Stats',     id: 'stats' },
];

export default function Sidebar({ active, onChange, modelReady }) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 min-h-screen px-4 py-6 gap-2 shadow-sm flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-lg leading-none">SentimentIQ</p>
          <p className="text-xs text-blue-500 font-medium">AI-Powered Analysis</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon
                size={18}
                className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}
              />
              {label}
              {isActive && (
                <ChevronRight size={14} className="ml-auto text-blue-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Model Status */}
      <div className={`mx-1 p-3 rounded-xl border ${modelReady ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
        <div className="flex items-center gap-2 mb-1">
          <CircleCheck size={14} className={modelReady ? 'text-emerald-600' : 'text-amber-500'} />
          <span className={`text-xs font-semibold ${modelReady ? 'text-emerald-700' : 'text-amber-700'}`}>
            {modelReady ? 'Model Ready' : 'Connecting…'}
          </span>
        </div>
        <p className="text-xs text-slate-500">TF-IDF · Logistic Regression</p>
        <p className="text-xs font-semibold text-blue-600">81.58% accuracy</p>
      </div>

      {/* Settings */}
      <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all mt-1">
        <Settings size={18} />
        Settings
      </button>
    </aside>
  );
}
