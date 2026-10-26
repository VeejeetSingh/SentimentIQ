import { BarChart3, Frown, Meh, Smile, TrendingUp } from 'lucide-react';

export default function StatsView({ history }) {
  const total = history.length;
  const positives = history.filter((h) => h.sentiment === 'Positive').length;
  const neutrals = history.filter((h) => h.sentiment === 'Neutral').length;
  const negatives = history.filter((h) => h.sentiment === 'Negative').length;
  const avgConf = total ? history.reduce((s, h) => s + (h.confidence || 0), 0) / total : 0;

  if (!total) {
    return (
      <div className="card p-10 text-center animate-fade-in-up">
        <BarChart3 size={44} className="mx-auto text-slate-200 mb-3" />
        <p className="text-sm font-semibold text-slate-500">No data yet</p>
        <p className="text-xs text-slate-400 mt-1">Analyze some text to see your statistics</p>
      </div>
    );
  }

  const posPct = Math.round((positives / total) * 100);
  const neuPct = Math.round((neutrals / total) * 100);
  const negPct = Math.max(0, 100 - posPct - neuPct);

  return (
    <div className="grid grid-cols-1 gap-4 animate-fade-in-up">
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-5 flex items-center gap-2">
          <BarChart3 size={16} className="text-blue-500" /> Your Session Stats
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3.5 bg-slate-50 rounded-xl">
            <p className="text-2xl font-black text-slate-800">{total}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Analyses</p>
          </div>
          <div className="text-center p-3.5 bg-emerald-50 rounded-xl">
            <p className="text-2xl font-black text-emerald-600">{positives}</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center justify-center gap-1">
              <Smile size={12} /> Positive
            </p>
          </div>
          <div className="text-center p-3.5 bg-sky-50 rounded-xl">
            <p className="text-2xl font-black text-sky-600">{neutrals}</p>
            <p className="text-xs text-sky-600 font-medium mt-0.5 flex items-center justify-center gap-1">
              <Meh size={12} /> Neutral
            </p>
          </div>
          <div className="text-center p-3.5 bg-red-50 rounded-xl">
            <p className="text-2xl font-black text-red-500">{negatives}</p>
            <p className="text-xs text-red-500 font-medium mt-0.5 flex items-center justify-center gap-1">
              <Frown size={12} /> Negative
            </p>
          </div>
        </div>

        {/* 3-way Sentiment Split Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <Smile size={13} /> {posPct}% Positive
            </span>
            <span className="flex items-center gap-1 text-sky-600 font-bold">
              <Meh size={13} /> {neuPct}% Neutral
            </span>
            <span className="flex items-center gap-1 text-red-500 font-bold">
              {negPct}% Negative <Frown size={13} />
            </span>
          </div>

          <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
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
        </div>

        {/* Avg confidence */}
        <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
          <TrendingUp size={20} className="text-blue-500" />
          <div>
            <p className="text-sm font-bold text-blue-700">
              {Math.round(avgConf * 100)}% avg. confidence
            </p>
            <p className="text-xs text-blue-400">Across all your analyses this session</p>
          </div>
        </div>
      </div>
    </div>
  );
}
