import { Activity, BarChart3, Brain, TrendingUp, Zap } from 'lucide-react';

const stats = [
  {
    label: 'Model Accuracy',
    value: '81.58%',
    sub: 'On 1.6M tweet dataset',
    icon: BarChart3,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    label: 'Training Samples',
    value: '1.6M',
    sub: 'Sentiment140 tweets',
    icon: Brain,
    color: 'indigo',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  {
    label: 'Algorithm',
    value: 'LR + TF-IDF',
    sub: '30,000 features',
    icon: Zap,
    color: 'violet',
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    label: 'Avg. Inference',
    value: '<50ms',
    sub: 'Real-time predictions',
    icon: Activity,
    color: 'sky',
    gradient: 'from-sky-500 to-sky-600',
  },
];

const colorMap = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   ring: 'ring-blue-100' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-100' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-100' },
  sky:    { bg: 'bg-sky-50',    text: 'text-sky-600',    ring: 'ring-sky-100' },
};

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, sub, icon: Icon, color, gradient }, i) => {
        const c = colorMap[color];
        return (
          <div key={i} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-sm`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-0.5">{value}</p>
            <p className="text-sm font-medium text-slate-700">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        );
      })}
    </div>
  );
}
