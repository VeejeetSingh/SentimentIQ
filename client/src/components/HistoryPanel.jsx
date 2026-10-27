import {
  Clock,
  Copy,
  Download,
  Filter,
  Frown,
  History,
  Meh,
  Search,
  Smile,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

function formatTime(iso) {
  if (!iso) return 'Just now';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryPanel({
  history = [],
  onClear = () => {},
  onSelect = () => {},
  searchFilter = '',
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [confirmClear, setConfirmClear] = useState(false);

  const activeSearch = searchFilter || localSearch;

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      !activeSearch ||
      item.text?.toLowerCase().includes(activeSearch.toLowerCase()) ||
      item.sentiment?.toLowerCase().includes(activeSearch.toLowerCase());

    const matchesSentiment =
      sentimentFilter === 'All' || item.sentiment === sentimentFilter;

    return matchesSearch && matchesSentiment;
  });

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentimentiq-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!history.length) {
    return (
      <div className="card-premium p-10 md:p-14 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-3xl bg-[#FAF6F0] border border-[#F0E5DA] flex items-center justify-center mx-auto mb-4 text-[#A89F95] shadow-xs">
          <History size={32} />
        </div>
        <h3 className="text-base font-black text-[#211D19] mb-1">
          No Analysis History Yet
        </h3>
        <p className="text-xs text-[#817568] max-w-xs mx-auto font-medium leading-relaxed">
          Your analyzed tweets will be logged here with predictions, confidence distributions, and timestamps.
        </p>
      </div>
    );
  }

  return (
    <div className="card-premium animate-fade-in-up flex flex-col justify-between">
      {/* Header Row */}
      <div className="p-5 pb-4 border-b border-[#F0E5DA]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FFF1E6] flex items-center justify-center text-[#F07824]">
              <History size={16} />
            </div>
            <h3 className="text-sm sm:text-base font-black text-[#211D19]">
              Recent Predictions
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1E6] text-[#D96317] border border-[#FCD8BE]">
              {history.length}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="p-1.5 rounded-lg text-[#817568] hover:text-[#211D19] hover:bg-[#FAF6F0] border border-[#F0E5DA] transition-all text-xs flex items-center gap-1"
              title="Export as JSON"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>

            {confirmClear ? (
              <div className="flex items-center gap-1.5 animate-fade-in">
                <button
                  onClick={() => {
                    onClear();
                    setConfirmClear(false);
                  }}
                  className="px-2 py-1 rounded-lg bg-[#DC2626] text-white text-xs font-bold transition-all"
                >
                  Confirm Clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 rounded-lg bg-[#FAF6F0] text-[#817568] text-xs font-medium hover:bg-[#F0E5DA]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="p-1.5 rounded-lg text-[#817568] hover:text-[#DC2626] hover:bg-[#FEF2F2] border border-[#F0E5DA] transition-all text-xs flex items-center gap-1"
                title="Clear history"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89F95]"
            />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter by keyword…"
              className="w-full bg-[#FAF6F0] border border-[#F0E5DA] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#211D19] placeholder:text-[#A89F95] focus-orange font-medium"
            />
          </div>

          {/* Sentiment Filter Pills */}
          <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-[#F0E5DA] overflow-x-auto">
            {['All', 'Positive', 'Neutral', 'Negative'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSentimentFilter(cat)}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                  sentimentFilter === cat
                    ? 'bg-white text-[#211D19] shadow-xs'
                    : 'text-[#817568] hover:text-[#211D19]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="divide-y divide-[#FAF6F0] max-h-[460px] overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#817568]">
            No analyses match your search filter.
          </div>
        ) : (
          filteredHistory.map((item, idx) => {
            const isPos = item.sentiment === 'Positive';
            const isNeu = item.sentiment === 'Neutral';

            const badgeTheme = isPos
              ? {
                  bg: 'bg-[#EDFAF1]',
                  text: 'text-[#15803D]',
                  border: 'border-[#C6F0D2]',
                  icon: Smile,
                }
              : isNeu
              ? {
                  bg: 'bg-[#F5F5F4]',
                  text: 'text-[#78716C]',
                  border: 'border-[#E7E5E4]',
                  icon: Meh,
                }
              : {
                  bg: 'bg-[#FEF2F2]',
                  text: 'text-[#DC2626]',
                  border: 'border-[#FECACA]',
                  icon: Frown,
                };

            const Icon = badgeTheme.icon;

            return (
              <button
                key={idx}
                onClick={() => onSelect(item)}
                className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-[#FAF6F0] transition-colors text-left group cursor-pointer"
              >
                {/* Icon Badge */}
                <div
                  className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center border ${badgeTheme.bg} ${badgeTheme.border} ${badgeTheme.text}`}
                >
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#211D19] truncate group-hover:text-[#F07824] transition-colors">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className={`font-bold ${badgeTheme.text}`}>
                      {item.sentiment}
                    </span>
                    <span className="text-[#A89F95]">·</span>
                    <span className="font-semibold text-[#817568]">
                      {Math.round((item.confidence || 0) * 100)}% Conf
                    </span>
                    {item.word_count && (
                      <>
                        <span className="text-[#A89F95]">·</span>
                        <span className="text-[#A89F95]">{item.word_count} words</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-[11px] text-[#A89F95] flex-shrink-0 font-medium">
                  <Clock size={11} />
                  <span>{formatTime(item.timestamp)}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
