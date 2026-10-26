import { AlertCircle, Loader2, Send, Sparkles, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { analyzeText } from '../api';

const EXAMPLES = [
  "I absolutely love this product! It's amazing 🎉",
  "The package was delivered today at 2 PM.",
  "This is the worst experience I've ever had.",
  "The meeting has been scheduled for Wednesday morning.",
  "Just had the most incredible dinner with my family ❤️",
  "I am reading a history textbook for my class.",
  "Can't believe they cancelled my flight again. Terrible.",
];

const MAX_CHARS = 500;

export default function AnalyzePanel({ onResult }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await analyzeText(text.trim());
      onResult({ ...result, text: text.trim(), timestamp: new Date().toISOString() });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect. Make sure all servers are running.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze();
  };

  const remaining = MAX_CHARS - text.length;

  return (
    <div className="card p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Analyze Sentiment</h2>
          <p className="text-xs text-slate-400">Powered by TF-IDF + Logistic Regression</p>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative mb-4">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder="Type or paste a tweet, review, or any text here…"
          rows={5}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {text && (
          <button
            onClick={() => { setText(''); setError(''); textareaRef.current.focus(); }}
            className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs ${remaining < 50 ? 'text-amber-500 font-semibold' : 'text-slate-400'}`}>
          {remaining} characters left
        </span>
        <span className="text-xs text-slate-400">Ctrl+Enter to analyze</span>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 animate-fade-in-up">
          <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold rounded-xl py-3 px-6 transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Analyzing…
          </>
        ) : (
          <>
            <Send size={17} />
            Analyze Sentiment
          </>
        )}
      </button>

      {/* Example chips */}
      <div className="mt-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Quick Examples
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => { setText(ex); setError(''); }}
              className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors font-medium truncate max-w-[200px]"
              title={ex}
            >
              {ex.length > 38 ? ex.slice(0, 38) + '…' : ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
