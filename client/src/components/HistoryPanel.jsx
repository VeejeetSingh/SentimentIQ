import { Clock, Frown, History, Meh, Smile, Trash2 } from 'lucide-react';

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryPanel({ history, onClear, onSelect }) {
  if (!history.length) {
    return (
      <div className="card p-8 text-center animate-fade-in-up">
        <History size={40} className="mx-auto text-slate-200 mb-3" />
        <p className="text-sm font-semibold text-slate-500">No analyses yet</p>
        <p className="text-xs text-slate-400 mt-1">Your recent analyses will appear here</p>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in-up">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History size={16} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-slate-800">Recent History</h3>
          <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={13} />
          Clear
        </button>
      </div>

      <div className="divide-y divide-slate-50 max-h-[460px] overflow-y-auto">
        {history.map((item, i) => {
          const isPositive = item.sentiment === 'Positive';
          const isNeutral = item.sentiment === 'Neutral';

          const iconBg = isPositive
            ? 'bg-emerald-50 text-emerald-600'
            : isNeutral
            ? 'bg-sky-50 text-sky-600'
            : 'bg-red-50 text-red-500';

          const textBadge = isPositive
            ? 'text-emerald-600'
            : isNeutral
            ? 'text-sky-600'
            : 'text-red-500';

          return (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left group"
            >
              <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${iconBg}`}>
                {isPositive && <Smile size={15} />}
                {isNeutral && <Meh size={15} />}
                {!isPositive && !isNeutral && <Frown size={15} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700 truncate font-medium">{item.text}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-semibold ${textBadge}`}>
                    {item.sentiment}
                  </span>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs text-slate-400">{Math.round(item.confidence * 100)}% confident</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-slate-300 flex-shrink-0">
                <Clock size={11} />
                <span className="text-xs">{formatTime(item.timestamp)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
