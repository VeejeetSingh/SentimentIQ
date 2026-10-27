import {
  Award,
  CheckCircle2,
  Frown,
  MessageSquare,
  Smile,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';

function Sparkline({ data = [20, 35, 45, 30, 60, 50, 75], color = '#F07824', fill = 'rgba(240, 120, 36, 0.08)' }) {
  const width = 80;
  const height = 28;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polygon points={areaPoints} fill={fill} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function StatsCards({ history = [] }) {
  const total = history.length;
  const positives = history.filter((h) => h.sentiment === 'Positive').length;
  const negatives = history.filter((h) => h.sentiment === 'Negative').length;
  const neutrals = history.filter((h) => h.sentiment === 'Neutral').length;

  const posPct = total > 0 ? Math.round((positives / total) * 100) : 0;
  const negPct = total > 0 ? Math.round((negatives / total) * 100) : 0;

  const cards = [
    {
      id: 'total',
      label: 'Total Analyzed',
      value: total > 0 ? total.toLocaleString() : '0',
      tag: total > 0 ? `${total} session tweets` : 'Session Start',
      trend: total > 0 ? `+${total} live` : 'Ready',
      trendPositive: true,
      icon: MessageSquare,
      iconColor: 'text-[#F07824]',
      iconBg: 'bg-[#FFF1E6]',
      sparkColor: '#F07824',
      sparkFill: 'rgba(240, 120, 36, 0.08)',
      sparkData: total > 0 ? [2, 5, 8, 12, 15, 18, total * 5] : [5, 8, 12, 10, 15, 14, 20],
      isDemo: total === 0,
    },
    {
      id: 'positive',
      label: 'Positive Sentiment',
      value: total > 0 ? `${posPct}%` : '—',
      tag: total > 0 ? `${positives} positive tweets` : 'No data yet',
      trend: total > 0 ? `${positives}/${total}` : 'Pending',
      trendPositive: true,
      icon: Smile,
      iconColor: 'text-[#15803D]',
      iconBg: 'bg-[#EDFAF1]',
      sparkColor: '#15803D',
      sparkFill: 'rgba(21, 128, 61, 0.08)',
      sparkData: total > 0 ? [10, 15, 20, 35, 40, 60, posPct] : [20, 30, 25, 40, 50, 45, 60],
      isDemo: total === 0,
    },
    {
      id: 'negative',
      label: 'Negative Sentiment',
      value: total > 0 ? `${negPct}%` : '—',
      tag: total > 0 ? `${negatives} negative tweets` : 'No data yet',
      trend: total > 0 ? `${negatives}/${total}` : 'Pending',
      trendPositive: false,
      icon: Frown,
      iconColor: 'text-[#DC2626]',
      iconBg: 'bg-[#FEF2F2]',
      sparkColor: '#DC2626',
      sparkFill: 'rgba(220, 38, 38, 0.08)',
      sparkData: total > 0 ? [20, 18, 15, 25, 20, 18, negPct] : [40, 35, 30, 25, 20, 18, 15],
      isDemo: total === 0,
    },
    {
      id: 'accuracy',
      label: 'Model Benchmark',
      value: '81.58%',
      tag: 'Sentiment140 Corpus',
      trend: '1.6M Stanford',
      trendPositive: true,
      icon: Award,
      iconColor: 'text-[#D96317]',
      iconBg: 'bg-[#FFF1E6]',
      sparkColor: '#F07824',
      sparkFill: 'rgba(240, 120, 36, 0.08)',
      sparkData: [78, 79, 80, 80.5, 81.2, 81.5, 81.58],
      isDemo: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className={`card-premium p-5 flex flex-col justify-between animate-fade-in-up delay-${(idx + 1) * 50}`}
          >
            {/* Top row: Label, Icon, and Sparkline */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#817568] uppercase tracking-wider">
                  {c.label}
                </span>
                <div className={`w-8 h-8 rounded-xl ${c.iconBg} ${c.iconColor} flex items-center justify-center shadow-xs`}>
                  <Icon size={16} />
                </div>
              </div>

              {/* Value and sparkline */}
              <div className="flex items-baseline justify-between gap-2 mt-1">
                <div className="text-2xl sm:text-3xl font-black text-[#211D19] tracking-tight">
                  {c.value}
                </div>
                <div className="opacity-90">
                  <Sparkline data={c.sparkData} color={c.sparkColor} fill={c.sparkFill} />
                </div>
              </div>
            </div>

            {/* Bottom row: Subtitle/Trend */}
            <div className="pt-3 mt-3 border-t border-[#F0E5DA] flex items-center justify-between text-[11px]">
              <span className="text-[#817568] truncate font-medium">{c.tag}</span>
              <div className="flex items-center gap-1 font-bold">
                {c.trendPositive ? (
                  <TrendingUp size={12} className="text-[#15803D]" />
                ) : (
                  <TrendingDown size={12} className="text-[#DC2626]" />
                )}
                <span className={c.trendPositive ? 'text-[#15803D]' : 'text-[#DC2626]'}>
                  {c.trend}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
