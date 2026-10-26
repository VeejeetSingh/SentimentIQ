import { Brain, Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', id: 'dashboard' },
  { label: 'Analyze',   id: 'analyze' },
  { label: 'History',   id: 'history' },
  { label: 'Stats',     id: 'stats' },
];

export default function Header({ active, onChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <Sparkles size={15} className="text-white" />
        </div>
        <span className="font-bold text-slate-900">SentimentIQ</span>
      </div>

      <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-500 p-1 rounded-lg hover:bg-slate-100">
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-lg py-2 px-4 flex flex-col gap-1 z-40">
          {navItems.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => { onChange(id); setMenuOpen(false); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium text-left ${active === id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
